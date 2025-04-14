from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.domain.affirmation.factory import create_affirmation

router = APIRouter()

@router.post('/affirmations/')
def create_affirmation_endpoint(text: str, user_id: str, db: Session = Depends(get_db)):
    afirmacion = create_affirmation(text=text, user_id=user_id)
    db.add(afirmacion)
    db.commit()
    db.refresh(afirmacion)
    return afirmacion
