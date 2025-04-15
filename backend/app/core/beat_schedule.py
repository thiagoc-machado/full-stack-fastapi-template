from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    'send-daily-affirmations': {
        'task': 'app.tasks.affirmation.send_daily_affirmations',
        'schedule': crontab(hour=9, minute=0),  # 09:00 AM todos os dias
    },
}
