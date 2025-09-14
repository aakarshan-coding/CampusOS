from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class NoteBase(BaseModel):
    """Base model for Note data"""
    filename: str
    content: Optional[str] = None

class NoteCreate(NoteBase):
    """Model for creating a new Note"""
    pass

class NoteResponse(NoteBase):
    """Model for Note response"""
    id: str
    created_at: datetime
    converted: bool = False
    exported_to_notion: bool = False

class NotionExportRequest(BaseModel):
    """Model for Notion export request"""
    note_id: str
    notion_page_id: Optional[str] = None

class NotionExportResponse(BaseModel):
    """Model for Notion export response"""
    note_id: str
    notion_url: Optional[str] = None
    success: bool
    message: str