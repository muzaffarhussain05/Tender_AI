from datetime import datetime
from pydantic import BaseModel


class NewChatResponse(BaseModel):
    session_id: int
    title: str
    created_at: datetime

    class Config:
        from_attributes = True
class ChatRequest(BaseModel):
    session_id: int | None = None
    message: str


class ChatMessageResponse(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class ChatResponse(BaseModel):
    session_id: int
    title: str
    answer: str
    messages: list[ChatMessageResponse]


class ChatSessionResponse(BaseModel):
    id: int
    title: str
    updated_at: datetime

    class Config:
        from_attributes = True


class ChatHistoryResponse(BaseModel):
    total: int
    items: list[ChatSessionResponse]


class RenameChatRequest(BaseModel):
    title: str

from datetime import datetime
from pydantic import BaseModel


class ConversationMessage(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

class MessageItem(BaseModel):
    role: str
    content: str
    created_at: datetime
    
class ConversationResponse(BaseModel):
    session_id: int
    title: str
    messages: list[MessageItem]    