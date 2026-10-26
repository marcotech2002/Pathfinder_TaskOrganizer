from flask import Blueprint


task_bp = Blueprint("task_bp", __name__, url_prefix='/task')


@task_bp.route("/", methods=['GET'])
def hello_world():
    return "<p>Hello, World!</p>"
