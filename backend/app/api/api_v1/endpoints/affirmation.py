from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
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
def update_affirmation(affirmation_id: str, text: str, db: Session = Depends(get_db)):
    affirmation = db.query(Affirmation).get(affirmation_id)
    if affirmation:
        affirmation.text = text
        db.commit()
        db.refresh(affirmation)
    return affirmation

@router.delete('/affirmations/{affirmation_id}')
def delete_affirmation(affirmation_id: str, db: Session = Depends(get_db)):
    affirmation = db.query(Affirmation).get(affirmation_id)
    if affirmation:
        db.delete(affirmation)
        db.commit()
    return {'ok': True}