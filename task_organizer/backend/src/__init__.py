from flask import Flask
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from .models.core import BaseModel


db_session = None


def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")

    database_uri = app.config['SQLALCHEMY_DATABASE_URI']
    engine = create_engine(
        database_uri,
        connect_args=(
            {"check_same_thread": False}
            if "sqlite" in database_uri else {}
        ),
    )

    global db_session
    db_session = scoped_session(sessionmaker(
        autocommit=False, autoflush=False))
    db_session.configure(bind=engine)

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        assert db_session is not None
        db_session.remove()

    with app.app_context():
        from .models.user import User
        from .models.category import Category
        from .models.task import Task

        BaseModel.metadata.create_all(bind=engine)

    from .routes.task_routes import task_bp
    from .routes.user_routes import user_bp
    app.register_blueprint(task_bp)
    app.register_blueprint(user_bp)

    return app
