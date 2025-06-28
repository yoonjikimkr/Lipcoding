from sqlalchemy import create_engine, Column, Integer, String, Enum, ForeignKey, LargeBinary, Text
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.orm import declarative_base
import enum

Base = declarative_base()

class UserRole(str, enum.Enum):
    mentor = 'mentor'
    mentee = 'mentee'

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    name = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    skillsets = Column(String, nullable=True)  # Only for mentors
    profile_image = Column(LargeBinary, nullable=True)
    profile_image_type = Column(String, nullable=True)  # 'jpg' or 'png'

class RequestStatus(str, enum.Enum):
    pending = 'pending'
    accepted = 'accepted'
    rejected = 'rejected'

class MatchRequest(Base):
    __tablename__ = 'match_requests'
    id = Column(Integer, primary_key=True, index=True)
    mentee_id = Column(Integer, nullable=False)
    mentor_id = Column(Integer, nullable=False)
    message = Column(Text, nullable=True)
    status = Column(Enum(RequestStatus), default=RequestStatus.pending)
