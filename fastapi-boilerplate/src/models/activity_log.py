from sqlalchemy import Column, String, DateTime, ForeignKey, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from . import Base

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    action = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    request_id = Column(UUID(as_uuid=True), ForeignKey("transport_requests.id"))
    meta = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow) 