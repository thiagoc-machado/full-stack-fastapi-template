from app.domain.affirmation.logic import select_personalized_affirmation
from app.domain.affirmation.models import UserPreferences, Affirmation
from app.infrastructure.db.session import SessionLocal
from app.models import User

def send_daily_affirmations():
    '''Envía afirmaciones diarias a cada usuario según sus preferencias'''
    db = SessionLocal()
    users = db.query(User).all()
    for user in users:
        prefs = db.query(UserPreferences).filter_by(user_id=user.id).first()
        affirmations = db.query(Affirmation).filter_by(user_id=user.id).all()
        selecionadas = select_personalized_affirmation(prefs, affirmations)
        for af in selecionadas:
            # Aquí iría el envío (correo, notificación, etc.)
            print(f'Enviando afirmación a {user.email}: {af.text}')
    db.close()
