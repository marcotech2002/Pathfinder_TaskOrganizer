from flask import Blueprint, request, jsonify
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from src import db_session
from task_organizer.backend.src.models.user import User
from task_organizer.backend.src.schemas.user_schemas import LoginRequest


user_bp = Blueprint("user_bp", __name__)


@user_bp.route("/login", methods=['POST'])
def login():
    try:
        payload = request.get_json() or {}
        login_dto = LoginRequest.model_validate(payload)

        user_model = db_session.scalar(
            select(User).filter_by(username=login_dto.username))

        if not user_model:
            return jsonify({"error": "User not found."}), 404

        if login_dto.password == user_model.password:
            return jsonify({'message': "Login successful!"}), 200

        return jsonify({"error": "Invalid credencials."}), 401

    except SQLAlchemyError as e:
        db_session.rollback()
        return jsonify({
            "error": "Error during database access.",
            "details": str(e)
        }), 500

    except Exception as e:
        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500
