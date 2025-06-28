from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User, UserRole

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get('/mentors')
def list_mentors(
    db: Session = Depends(get_db),
    skill: str = Query(None, description="Search by skillset"),
    order_by: str = Query('id', description="Sort by 'skill' or 'name'")
):
    query = db.query(User).filter(User.role == UserRole.mentor)
    if order_by == 'name':
        query = query.order_by(User.name)
    elif order_by == 'skill':
        query = query.order_by(User.skillsets)
    else:
        query = query.order_by(User.id)
    mentors = query.all()
    result = []
    for m in mentors:
        skills_list = m.skillsets.split(",") if m.skillsets else []
        # Enhanced skill filtering: only include mentors with exact skill match
        if skill and skill not in [s.strip() for s in skills_list]:
            continue
        profile = {
            "name": m.name,
            "bio": m.bio,
            "imageUrl": f"/images/mentor/{m.id}" if m.profile_image else None,
            "skills": [s.strip() for s in skills_list]
        }
        result.append({
            "id": m.id,
            "email": m.email,
            "role": m.role.value,
            "profile": profile
        })
    return result
