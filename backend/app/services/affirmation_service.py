from app.models import User, Affirmation
from sqlmodel import Session, select
from app.core.db import engine

def send_affirmations_to_all_users():
    '''Send daily affirmations to all users'''
    with Session(engine) as session:
        users = session.exec(select(User)).all()
        for user in users:
            affirmation = session.exec(select(Affirmation).order_by(Affirmation.created_at.desc())).first()
            if affirmation:
                print(f'Sending affirmation to {user.email}: {affirmation.text}')

