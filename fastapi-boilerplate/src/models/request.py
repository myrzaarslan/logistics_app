from sqlalchemy import Column, String, Boolean, DateTime, Numeric, Integer, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from . import Base

class Request(Base):
    __tablename__ = "transport_requests"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    request_number = Column(String(50), unique=True, nullable=False)
    status = Column(String(50), nullable=False)
    route_from = Column(String(255), nullable=False)
    route_to = Column(String(255), nullable=False)
    waypoints = Column(JSON)
    loading_date = Column(DateTime, nullable=False)
    unloading_date = Column(DateTime, nullable=False)
    driver_name = Column(String(255), nullable=False)
    driver_iin = Column(String(12), nullable=False)
    vehicle_state_number = Column(String(20), nullable=False)
    vehicle_type = Column(String(100), nullable=False)
    has_tractor = Column(Boolean, default=False)
    has_trailer = Column(Boolean, default=False)
    cargo_name = Column(String(255), nullable=False)
    cargo_weight = Column(Numeric(10,2), nullable=False)
    pallet_count = Column(Integer)
    temperature_mode = Column(String(50))
    cost_to_driver = Column(Numeric(12,2), nullable=False)
    price_from_customer = Column(Numeric(12,2), nullable=False)
    advance = Column(Numeric(12,2))
    total_margin = Column(Numeric(12,2))
    issued_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) 