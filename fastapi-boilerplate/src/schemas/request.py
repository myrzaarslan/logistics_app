from pydantic import BaseModel, Field
from typing import Optional, List, Any
from uuid import UUID
from datetime import datetime

class RequestBase(BaseModel):
    request_number: str
    status: str
    route_from: str
    route_to: str
    waypoints: Optional[List[Any]]
    loading_date: datetime
    unloading_date: datetime
    driver_name: str
    driver_iin: str
    vehicle_state_number: str
    vehicle_type: str
    has_tractor: Optional[bool] = False
    has_trailer: Optional[bool] = False
    cargo_name: str
    cargo_weight: float
    pallet_count: Optional[int]
    temperature_mode: Optional[str]
    cost_to_driver: float
    price_from_customer: float
    advance: Optional[float]
    total_margin: Optional[float]
    issued_by: Optional[UUID]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

class RequestCreate(RequestBase):
    pass

class RequestUpdate(RequestBase):
    pass

class RequestInDB(RequestBase):
    id: UUID

    class Config:
        orm_mode = True 