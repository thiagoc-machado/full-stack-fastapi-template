from app.domain.affirmation.models import UserPreferences, Affirmation
from typing import List

def select_personalized_affirmation(
    user_preferences: UserPreferences, affirmations: List[Affirmation]
) -> List[Affirmation]:
    '''Selecciona afirmaciones según las preferencias del usuario'''
    return [a for a in affirmations if a.type == user_preferences.affirmation_type]
