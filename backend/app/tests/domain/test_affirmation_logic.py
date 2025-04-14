import uuid
from app.domain.affirmation.logic import select_personalized_affirmation
from app.domain.affirmation.models import Affirmation, UserPreferences

def test_select_personalized_affirmation():
    user_id = uuid.uuid4()
    afirmaciones = [
        Affirmation(text='A', type='daily', user_id=user_id),
        Affirmation(text='B', type='weekly', user_id=user_id)
    ]
    preferencias = UserPreferences(affirmation_type='daily', affirmation_time='08:00', user_id=user_id)
    
    resultado = select_personalized_affirmation(preferencias, afirmaciones)
    
    assert len(resultado) == 1
    assert resultado[0].text == 'A'
