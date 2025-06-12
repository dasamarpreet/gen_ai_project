from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import timezone, datetime

Base = declarative_base()

class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False)
    email = Column(String(200), unique=True, nullable=False)
    hashed_password = Column(String(200), nullable=False)
    mobile = Column(String(15), unique=True, default=None)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    # relationship to access chat threads related to the user
    chat_threads = relationship("ChatThreads", back_populates="user")

    def __repr__(self):
        return f"User email={self.email}, active={self.is_verified}"


class ChatThreads(Base):
    __tablename__ = "chat_threads"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    user = relationship("Users", back_populates="chat_threads")  # Relationship to Users table
    history = relationship("ChatHistory", back_populates="thread")  # Relationship to history table

    def __repr__(self):
        return f"ChatThread id={self.id}, user_id={self.user_id}"


class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    thread_id = Column(Integer, ForeignKey("chat_threads.id"), nullable=False)
    query = Column(Text, nullable=True)
    response = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    thread = relationship("ChatThreads", back_populates="history")  # Relationship to ChatThreads table

    def __repr__(self):
        return f"ChatHistory id={self.id}, thread_id={self.thread_id}"
