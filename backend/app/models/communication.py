"""
Communication models: Chat, Message
"""
import typing as tp
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship

from app.db.session import Base


class Chat(Base):
    """Chat for classroom"""
    __tablename__ = "chats"
    
    id = Column(Integer, primary_key=True, index=True)
    classroom_id = Column(Integer, ForeignKey("classrooms.id", ondelete="CASCADE"), unique=True, nullable=False)
    name = Column(String(255), nullable=True)  # опционально, можно автоматически генерировать
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    classroom = relationship("Classroom", back_populates="chat")
    messages = relationship("Message", back_populates="chat", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<Chat(id={self.id}, classroom_id={self.classroom_id})>"


class Message(Base):
    """Message in chat"""
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(Integer, ForeignKey("chats.id", ondelete="CASCADE"), nullable=False, index=True)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    is_edited = Column(Boolean, default=False, nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    chat = relationship("Chat", back_populates="messages")
    sender = relationship("User")
    
    def __repr__(self) -> str:
        return f"<Message(id={self.id}, chat_id={self.chat_id}, sender_id={self.sender_id})>"

