from app.core.celery_app import celery_app
from app.services.affirmation_service import send_affirmations_to_all_users

@celery_app.task(name='app.tasks.affirmation.send_daily_affirmations')
def send_daily_affirmations():
    '''Tarea que envía afirmaciones diarias a todos los usuarios'''
    send_affirmations_to_all_users()
