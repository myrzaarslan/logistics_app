from pydantic import BaseModel, Field
from typing import Optional, Any
from uuid import UUID
from datetime import datetime

class ActivityLogBase(BaseModel):
    user_id: UUID
    action: str
    description: str
    request_id: Optional[UUID]
    meta: Optional[Any]
    created_at: Optional[datetime]

class ActivityLogCreate(ActivityLogBase):
    pass

class ActivityLogInDB(ActivityLogBase):
    id: UUID

    class Config:
        orm_mode = True 