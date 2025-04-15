from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, delete

from app.core.config import settings
from app.core.db import engine, init_db
from app.main import app
from app.models import Item, User, Affirmation
from app.tests.utils.user import authentication_token_from_email
from app.tests.utils.utils import get_superuser_token_headers


@pytest.fixture(scope="session", autouse=True)
def db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        init_db(session)

        existing_user_ids = {user.id for user in session.query(User).all()}
        existing_item_ids = {item.id for item in session.query(Item).all()}
        existing_affirmation_ids = {a.id for a in session.query(Affirmation).all()}
        yield session

        session.query(Affirmation).filter(Affirmation.id.notin_(existing_affirmation_ids)).delete(synchronize_session=False)
        session.query(Item).filter(Item.id.notin_(existing_item_ids)).delete(synchronize_session=False)
        session.query(User).filter(User.id.notin_(existing_user_ids)).delete(synchronize_session=False)
        session.commit()


@pytest.fixture(scope="module")
def client() -> Generator[TestClient, None, None]:
    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="module")
def superuser_token_headers(client: TestClient) -> dict[str, str]:
    return get_superuser_token_headers(client)


@pytest.fixture(scope="module")
def normal_user_token_headers(client: TestClient, db: Session) -> dict[str, str]:
    return authentication_token_from_email(
        client=client, email=settings.EMAIL_TEST_USER, db=db
    )
