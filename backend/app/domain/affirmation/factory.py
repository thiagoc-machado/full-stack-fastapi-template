import uuid
from datetime import datetime

from app.domain.affirmation.models import Affirmation

def create_affirmation(text: str, user_id: uuid.UUID, tipo: str = 'daily') -> Affirmation:
    '''Crea una nueva afirmación como entidad agregada'''
    return Affirmation(
        id=uuid.uuid4(),
        text=text,
        type=tipo,
        user_id=user_id,
        created_at=datetime.utcnow().isoformat()
    )
