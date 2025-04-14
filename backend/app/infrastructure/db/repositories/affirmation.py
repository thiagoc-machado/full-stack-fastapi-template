from sqlalchemy.orm import Session
from app.domain.affirmation.models import Affirmation

def get_affirmations_by_user(db: Session, user_id):
    '''Devuelve todas las afirmaciones de un usuario'''
    return db.query(Affirmation).filter_by(user_id=user_id).all()
