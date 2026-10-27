from flask import Blueprint, request, jsonify
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from src import db_session
from src.models.user import User
from src.schemas.user_schemas import LoginRequest, UserCreateRequest


user_bp = Blueprint("user_bp", __name__)


@user_bp.route("/login", methods=['POST'])
def login():
    try:
        payload = request.get_json() or {}
        login_dto = LoginRequest.model_validate(payload)

        user_model = db_session.scalar(
            select(User).filter_by(username=login_dto.username))

        if not user_model or not user_model.verify_password(login_dto.password):
            return jsonify({"error": "Invalid username or password."}), 401

        return jsonify({'message': "Login successful!"}), 200

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


@user_bp.route('/users', methods=['POST'])
def create_user():
    try:
        payload = request.get_json() or {}
        user_dto = UserCreateRequest.model_validate(payload)
        user_model = User(
            name=user_dto.name,
            username=user_dto.username,
            password=user_dto.password
        )

        db_session.add(user_model)
        db_session.commit()
        db_session.refresh(user_model)

        return jsonify({
            "message": "User created successfully!",
            "user_id": user_model.id
        }), 201

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
