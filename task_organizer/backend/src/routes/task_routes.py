from flask import Blueprint, request, jsonify
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from src import db_session
from src.models.task import Task
from src.schemas.task_schemas import (
    TaskCreateRequest, TaskResponse, TaskUpdateRequest
)

task_bp = Blueprint("task_bp", __name__, url_prefix='/tasks')


@task_bp.route("/", methods=['GET'])
def get_tasks():
    try:
        # Test
        user_id = 1

        stmt = select(Task).filter_by(user_id=user_id)
        tasks = db_session.scalars(stmt).all()

        result = [
            TaskResponse.model_validate(task).model_dump(mode='json')
            for task in tasks
        ]

        return jsonify(result), 200

    except SQLAlchemyError as e:
        db_session.rollback()
        return jsonify({
            "error": "Error during database access.",
            "details": str(e)
        }), 500

    except Exception as e:
        db_session.rollback()
        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500


@task_bp.route("/<int:task_id>", methods=['GET'])
def get_task_by_id(task_id):
    try:
        # Test
        user_id = 1

        stmt = select(Task).filter_by(id=task_id, user_id=user_id)
        task = db_session.scalars(stmt).first()

        if not task:
            return jsonify({
                "error": "Task not found."
            }), 404

        result = TaskResponse.model_validate(task).model_dump(mode='json')

        return jsonify(result), 200

    except SQLAlchemyError as e:
        db_session.rollback()
        return jsonify({
            "error": "Error during database access.",
            "details": str(e)
        }), 500

    except Exception as e:
        db_session.rollback()
        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500


@task_bp.route("/", methods=['POST'])
def create_task():
    try:
        # Test
        user_id = 1

        payload = request.get_json() or {}
        task_dto = TaskCreateRequest.model_validate(payload)
        task_model = Task(**task_dto.model_dump())

        task_model.user_id = user_id

        db_session.add(task_model)
        db_session.commit()
        db_session.refresh(task_model)

        return jsonify(task_model), 201

    except ValidationError as e:
        return jsonify({
            "error": "Validation error",
            "details": e.errors()
        }), 400

    except SQLAlchemyError as e:
        db_session.rollback()
        return jsonify({
            "error": "Error during database access.",
            "details": str(e)
        }), 500

    except Exception as e:
        db_session.rollback()
        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500


@task_bp.route("/<int:task_id>", methods=['PATCH'])
def update_task(task_id):
    try:
        # Test
        user_id = 1

        stmt = select(Task).filter_by(id=task_id, user_id=user_id)
        task_model = db_session.scalars(stmt).first()

        if not task_model:
            return jsonify({"error": "Task not found."}), 404

        payload = request.get_json() or {}
        task_dto = TaskUpdateRequest.model_validate(payload)

        update_data = task_dto.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(task_model, key, value)

        db_session.commit()
        db_session.refresh(task_model)

        return jsonify(task_model), 200

    except ValidationError as e:
        return jsonify({
            "error": "Validation error",
            "details": e.errors()
        }), 400

    except SQLAlchemyError as e:
        db_session.rollback()
        return jsonify({
            "error": "Error during database access.",
            "details": str(e)
        }), 500

    except Exception as e:
        db_session.rollback()
        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500


@task_bp.route("/<int:task_id>", methods=['DELETE'])
def delete_task(task_id):
    try:
        # Test
        user_id = 1

        stmt = select(Task).filter_by(id=task_id, user_id=user_id)
        task = db_session.scalars(stmt).first()

        if not task:
            return jsonify({
                "error": "Task not found."
            }), 404

        db_session.delete(task)
        db_session.commit()
        return jsonify({"message": "Task deleted successfully!"}), 200

    except SQLAlchemyError as e:
        db_session.rollback()
        return jsonify({
            "error": "Error during database access.",
            "details": str(e)
        }), 500

    except Exception as e:
        db_session.rollback()
        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500
