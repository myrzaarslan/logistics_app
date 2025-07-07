from sqlalchemy.orm import declarative_base

Base = declarative_base()

from .user import User
from .request import Request
from .activity_log import ActivityLog
# from .request import Request  # Uncomment or add when implemented
# from .activity_log import ActivityLog  # Uncomment or add when implemented
