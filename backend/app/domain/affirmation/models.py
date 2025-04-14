import uuid
from datetime import datetime
from typing import Optional, TYPE_CHECKING

from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from app.models import User

class UserPreferences(SQLModel, table=True):
    affirmation_type: str = Field(default='daily')
    affirmation_time: str = Field(default='08:00')
    user_id: uuid.UUID = Field(foreign_key='user.id', primary_key=True)

class Affirmation(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    text: str = Field(max_length=255)
    type: str = Field(default='daily')
    user_id: uuid.UUID = Field(foreign_key='user.id')
    user: Optional['User'] = Relationship(back_populates='affirmations')
    read: bool = Field(default=False)
    created_at: Optional[str] = Field(default=None, nullable=True)
    rating: Optional[int] = Field(default=0, nullable=True)
    read_at: Optional[str] = Field(default=None, nullable=True)
