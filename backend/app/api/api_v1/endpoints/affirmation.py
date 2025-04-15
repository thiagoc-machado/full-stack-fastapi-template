from fastapi import APIRouter, Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.api.deps import get_db
from app.domain.affirmation.factory import create_affirmation
from app.models import Affirmation

router = APIRouter()

@router.post('/affirmations/')
def create_affirmation_endpoint(text: str, user_id: str, db: Session = Depends(get_db)):
    afirmacion = create_affirmation(text=text, user_id=user_id)
    db.add(afirmacion)
    db.commit()
    db.refresh(afirmacion)
    return afirmacion

@router.get('/affirmations/')
def read_affirmations(db: Session = Depends(get_db)):
    return db.query(Affirmation).all()

@router.get('/affirmations/{affirmation_id}')
def read_affirmation(affirmation_id: str, db: Session = Depends(get_db)):
    return db.query(Affirmation).get(affirmation_id)

@router.put('/affirmations/{affirmation_id}')
def update_affirmation(affirmation_id: UUID, text: str, db: Session = Depends(get_db)):
    affirmation = db.query(Affirmation).filter(Affirmation.id == affirmation_id).first()
    if affirmation:
        affirmation.text = text
        db.commit()
        db.refresh(affirmation)
        return affirmation
    raise HTTPException(status_code=404, detail='Affirmation not found')

@router.delete('/affirmations/{affirmation_id}')
def delete_affirmation(affirmation_id: UUID, db: Session = Depends(get_db)):
    affirmation = db.query(Affirmation).filter(Affirmation.id == affirmation_id).first()
    if affirmation:
        db.delete(affirmation)
        db.commit()
        return {str(affirmation_id): 'Deleted'}
    raise HTTPException(status_code=404, detail='Affirmation not found')