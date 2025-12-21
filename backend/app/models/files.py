"""
File storage model
"""

from datetime import datetime

from sqlalchemy import BigInteger, Boolean, Column, DateTime, Integer, String

from app.db.session import Base


class File(Base):
    """File storage model for uploaded files"""

    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)  # путь к файлу на диске/S3
    file_size = Column(BigInteger, nullable=False)  # размер в байтах
    mime_type = Column(String(100), nullable=False)
    file_hash = Column(String(64), nullable=True, index=True)  # SHA-256 hash для дедупликации
    is_public = Column(Boolean, default=False, nullable=False)
    uploaded_by = Column(Integer, nullable=True)  # user_id who uploaded
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<File(id={self.id}, filename='{self.filename}', size={self.file_size})>"
