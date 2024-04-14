import datetime
from logging import getLogger

from api.auth.dependencies import AuthDatabaseConnection
from api.common.dependencies import DateTimeWrapper
from database.database_connection import ConnectionManager

_logger = getLogger("main.api.auth.tasks")


_auth_db_connection = AuthDatabaseConnection(ConnectionManager(), DateTimeWrapper())


def cleanup_state_strings(db_connection: AuthDatabaseConnection = None):
    if db_connection is None:
        db_connection = _auth_db_connection
    _logger.info("Cleaning up expired state strings")
    db_connection.delete_expired_states(datetime.timedelta(minutes=15))
