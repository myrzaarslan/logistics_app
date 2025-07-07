from src.repositories.base_repository import BaseRepository
from src.models.user import User

from dao.sqlalchemy_dao import SQLAlchemyDAO

class UserRepository(BaseRepository[User]):
    model = User
    dao_class = SQLAlchemyDAO