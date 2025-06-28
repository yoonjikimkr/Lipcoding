from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User, UserRole
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import uuid
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt as jose_jwt
from fastapi import Request

SECRET_KEY = "your-secret-key"  # Change this in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_access_token(data: dict):
    to_encode = data.copy()
    now = datetime.utcnow()
    expire = now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({
        "iss": "mentor-mentee-app",
        "sub": str(data["user_id"]),
        "aud": "mentor-mentee-app-users",
        "exp": expire,
        "nbf": now,
        "iat": now,
        "jti": str(uuid.uuid4()),
    })
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post('/signup')
def signup(body: dict, db: Session = Depends(get_db)):
    email = body.get('email')
    password = body.get('password')
    name = body.get('name')
    role = body.get('role')
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if role not in (UserRole.mentor, UserRole.mentee):
        raise HTTPException(status_code=400, detail="Invalid role")
    hashed_password = pwd_context.hash(password)
    user = User(email=email, hashed_password=hashed_password, name=name, role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"success": True}

@router.post('/login')
def login(body: dict, db: Session = Depends(get_db)):
    email = body.get('email')
    password = body.get('password')
    user = db.query(User).filter(User.email == email).first()
    if not user or not pwd_context.verify(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({
        "user_id": user.id,
        "name": user.name or "",
        "email": user.email,
        "role": user.role.value,
    })
    return {"access_token": token}  # CHANGED HERE

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

def get_current_user_from_token(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jose_jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], audience="mentor-mentee-app-users")
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    return user

@router.get('/me')
def get_me(db: Session = Depends(get_db), user: User = Depends(get_current_user_from_token)):
    profile = {
        "name": user.name,
        "bio": user.bio,
        "imageUrl": f"/images/{user.role.value}/{user.id}" if user.profile_image else None,
    }
    if user.role == UserRole.mentor:
        profile["skills"] = user.skillsets.split(",") if user.skillsets else []
    return {
        "id": user.id,
        "email": user.email,
        "role": user.role.value,
        "profile": profile
    }
