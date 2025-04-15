from app.models import User, Affirmation
from sqlmodel import Session, select
from app.core.db import engine

def send_affirmations_to_all_users():
    '''Envia uma afirmação para cada usuário'''
    with Session(engine) as session:
        users = session.exec(select(User)).all()
        for user in users:
            affirmation = session.exec(select(Affirmation).order_by(Affirmation.created_at.desc())).first()
            if affirmation:
                print(f'Enviando afirmação para {user.email}: {affirmation.text}')
                # Aqui pode ser substituído por envio real: email, push, etc.
