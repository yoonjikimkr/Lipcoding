from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User, UserRole
from routers.auth import get_current_user_from_token
import filetype

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get('/profile')
def get_profile(db: Session = Depends(get_db), user: User = Depends(get_current_user_from_token)):
    if user.profile_image:
        image_url = f"/api/profile/image/{user.id}"
    else:
        image_url = (
            "https://placehold.co/500x500.jpg?text=MENTOR" if user.role == UserRole.mentor
            else "https://placehold.co/500x500.jpg?text=MENTEE"
        )
    return {
        'id': user.id,
        'email': user.email,
        'role': user.role,
        'name': user.name,
        'bio': user.bio,
        'skillsets': user.skillsets,
        'image_url': image_url,
    }

@router.get('/profile/image/{user_id}')
def get_profile_image(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.profile_image:
        raise HTTPException(status_code=404, detail="Image not found")
    from fastapi.responses import Response
    return Response(user.profile_image, media_type=f"image/{user.profile_image_type}")

@router.put('/profile')
def update_profile(
    body: dict,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user_from_token)
):
    name = body.get('name')
    bio = body.get('bio')
    skills = body.get('skills')
    if name:
        user.name = name
    if bio:
        user.bio = bio
    if user.role == UserRole.mentor and skills is not None:
        user.skillsets = ','.join(skills) if isinstance(skills, list) else skills
    db.commit()
    return {"success": True}
