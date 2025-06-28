from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User, UserRole, MatchRequest, RequestStatus
from routers.auth import get_current_user_from_token

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post('/match-requests')
def send_match_request(
    body: dict,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user_from_token)
):
    if user.role != UserRole.mentee:
        raise HTTPException(status_code=403, detail="Only mentees can send requests")
    mentor_id = body.get('mentorId')
    message = body.get('message')
    # Only one pending request at a time
    existing = db.query(MatchRequest).filter(
        MatchRequest.mentee_id == user.id,
        MatchRequest.status == RequestStatus.pending
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You already have a pending request")
    # Only one request per mentor
    if db.query(MatchRequest).filter(
        MatchRequest.mentee_id == user.id,
        MatchRequest.mentor_id == mentor_id
    ).first():
        raise HTTPException(status_code=400, detail="Already requested this mentor")
    req = MatchRequest(mentee_id=user.id, mentor_id=mentor_id, message=message)
    db.add(req)
    db.commit()
    db.refresh(req)
    return {
        "id": req.id,
        "mentorId": req.mentor_id,
        "menteeId": req.mentee_id,
        "message": req.message,
        "status": req.status.value
    }

@router.get('/requests')
def list_requests(db: Session = Depends(get_db), user: User = Depends(get_current_user_from_token)):
    if user.role == UserRole.mentee:
        reqs = db.query(MatchRequest).filter(MatchRequest.mentee_id == user.id).all()
    else:
        reqs = db.query(MatchRequest).filter(MatchRequest.mentor_id == user.id).all()
    return [
        {
            'id': r.id,
            'mentee_id': r.mentee_id,
            'mentor_id': r.mentor_id,
            'message': r.message,
            'status': r.status
        } for r in reqs
    ]

@router.put('/match-requests/{request_id}/accept')
def accept_match_request(request_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user_from_token)):
    req = db.query(MatchRequest).filter(MatchRequest.id == request_id).first()
    if not req or req.mentor_id != user.id:
        raise HTTPException(status_code=404, detail="Request not found")
    if user.role != UserRole.mentor:
        raise HTTPException(status_code=403, detail="Only mentors can accept requests")
    # Only one accepted request at a time
    accepted = db.query(MatchRequest).filter(
        MatchRequest.mentor_id == user.id,
        MatchRequest.status == RequestStatus.accepted
    ).first()
    if accepted:
        raise HTTPException(status_code=400, detail="You already accepted a request")
    req.status = RequestStatus.accepted
    # Reject all other pending requests for this mentor
    db.query(MatchRequest).filter(
        MatchRequest.mentor_id == user.id,
        MatchRequest.status == RequestStatus.pending,
        MatchRequest.id != request_id
    ).update({MatchRequest.status: RequestStatus.rejected})
    db.commit()
    db.refresh(req)
    return {
        "id": req.id,
        "mentorId": req.mentor_id,
        "menteeId": req.mentee_id,
        "message": req.message,
        "status": req.status.value
    }

@router.put('/match-requests/{request_id}/reject')
def reject_match_request(request_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user_from_token)):
    req = db.query(MatchRequest).filter(MatchRequest.id == request_id).first()
    if not req or req.mentor_id != user.id:
        raise HTTPException(status_code=404, detail="Request not found")
    if user.role != UserRole.mentor:
        raise HTTPException(status_code=403, detail="Only mentors can reject requests")
    req.status = RequestStatus.rejected
    db.commit()
    db.refresh(req)
    return {
        "id": req.id,
        "mentorId": req.mentor_id,
        "menteeId": req.mentee_id,
        "message": req.message,
        "status": req.status.value
    }

@router.delete('/match-requests/{request_id}')
def cancel_match_request(request_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user_from_token)):
    req = db.query(MatchRequest).filter(MatchRequest.id == request_id).first()
    if not req or req.mentee_id != user.id:
        raise HTTPException(status_code=404, detail="Request not found")
    req.status = RequestStatus.cancelled
    db.commit()
    db.refresh(req)
    return {
        "id": req.id,
        "mentorId": req.mentor_id,
        "menteeId": req.mentee_id,
        "message": req.message,
        "status": req.status.value
    }

@router.get('/match-requests/incoming')
def incoming_requests(db: Session = Depends(get_db), user: User = Depends(get_current_user_from_token)):
    if user.role != UserRole.mentor:
        raise HTTPException(status_code=403, detail="Only mentors can view incoming requests")
    reqs = db.query(MatchRequest).filter(MatchRequest.mentor_id == user.id).all()
    return [
        {
            "id": r.id,
            "mentorId": r.mentor_id,
            "menteeId": r.mentee_id,
            "message": r.message,
            "status": r.status.value
        } for r in reqs
    ]

@router.get('/match-requests/outgoing')
def outgoing_requests(db: Session = Depends(get_db), user: User = Depends(get_current_user_from_token)):
    if user.role != UserRole.mentee:
        raise HTTPException(status_code=403, detail="Only mentees can view outgoing requests")
    reqs = db.query(MatchRequest).filter(MatchRequest.mentee_id == user.id).all()
    return [
        {
            "id": r.id,
            "mentorId": r.mentor_id,
            "menteeId": r.mentee_id,
            "status": r.status.value
        } for r in reqs
    ]
