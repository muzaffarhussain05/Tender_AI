from datetime import datetime
from pydantic import BaseModel


class SavedTenderItem(BaseModel):
    id: int
    tender_id: int
    title: str
    organization: str
    category: str
    location: str
    publish_date: datetime
    closing_date: datetime
    status: str
    saved_at: datetime


class SavedTenderListResponse(BaseModel):
    total: int
    items: list[SavedTenderItem]


class SaveTenderResponse(BaseModel):
    message: str


class DeleteSavedTenderResponse(BaseModel):
    message: str