from flask import Flask
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from .models.core import BaseModel


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

    db_session = scoped_session(sessionmaker(
        autocommit=False, autoflush=False))
    db_session.configure(bind=engine)

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        db_session.remove()

    with app.app_context():
        from .models.user import User
        from .models.category import Category
        from .models.task import Task

        BaseModel.metadata.create_all(bind=engine)

    from .routes.task import task_bp
    app.register_blueprint(task_bp)

    return app
