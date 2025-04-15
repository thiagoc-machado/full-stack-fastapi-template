from celery import Celery
from app.core.config import settings
from app.core.beat_schedule import CELERY_BEAT_SCHEDULE

celery_app = Celery(
    'worker',
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
)

celery_app.autodiscover_tasks(['app.tasks'])

celery_app.conf.beat_schedule = CELERY_BEAT_SCHEDULE
