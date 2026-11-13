from flask import Blueprint, request, jsonify
from pydantic import ValidationError
from sqlalchemy import select, func
from sqlalchemy.exc import SQLAlchemyError
from src import db_session
from src.models.category import Category
from src.models.task import Task
from src.schemas.category_schemas import (
    CategoryCreateRequest, CategoryResponse, CategoryUpdateRequest
)


category_bp = Blueprint('category_bp', __name__, url_prefix='/api/categories')


@category_bp.route('/', methods=['GET'])
def get_categories():
    try:
        # Test
        user_id = 1

        stmt = (
            select(Category, func.count(Task.id).label("tasks_count"))
            .outerjoin(Task, Task.category_id == Category.id)
            .group_by(Category.id)
            .filter(Category.user_id == user_id)
        )

        results = db_session.execute(stmt).all()

        response = []
        for category, tasks_count in results:
            category_data = {
                "id": category.id,
                "name": category.name,
                "color": category.color,
                "user_id": category.user_id,
                "tasks_count": tasks_count,
            }

            category_response = CategoryResponse.model_validate(category_data)
            response.append(category_response.model_dump(mode="json"))

        return jsonify(response), 200

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


@category_bp.route('/<int:category_id>', methods=['GET'])
def get_category_by_id(category_id):
    try:
        stmt = (
            select(Category, func.count(Task.id).label("tasks_count"))
            .outerjoin(Task, Task.category_id == Category.id)
            .group_by(Category.id)
            # Test user_id is hardcoded to 1 for now
            .filter(Category.id == category_id, Category.user_id == 1)
        )

        result = db_session.execute(stmt).first()

        if not result:
            return jsonify({"error": "Category not found."}), 404

        category_data = {
            "id": result[0].id,
            "name": result[0].name,
            "color": result[0].color,
            "user_id": result[0].user_id,
            "tasks_count": result[1]
        }

        response = CategoryResponse.model_validate(category_data)

        return jsonify(response), 200

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


@category_bp.route('/', methods=['POST'])
def create_category():
    try:
        user_id = 1  # Test user_id is hardcoded to 1 for now

        payload = request.get_json() or {}
        category_dto = CategoryCreateRequest.model_validate(payload)
        category_model = Category(**category_dto.model_dump())

        category_model.user_id = user_id

        db_session.add(category_model)
        db_session.commit()
        db_session.refresh(category_model)

        category_data = {
            "id": category_model.id,
            "name": category_model.name,
            "color": category_model.color,
            "user_id": category_model.user_id,
            "tasks_count": 0,
        }

        response = CategoryResponse.model_validate(category_data)
        return jsonify(response.model_dump(mode='json')), 201

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


@category_bp.route('/<int:category_id>', methods=['PATCH'])
def update_category(category_id):
    try:
        user_id = 1  # Test user_id is hardcoded to 1 for now

        category_model = db_session.scalars(
            select(Category).filter_by(id=category_id, user_id=user_id)
        ).first()

        if not category_model:
            return jsonify({"error": "Category not found."}), 404

        payload = request.get_json() or {}
        category_dto = CategoryUpdateRequest.model_validate(payload)

        update_data = category_dto.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(category_model, key, value)

        db_session.commit()
        db_session.refresh(category_model)

        category_data = {
            "id": category_model.id,
            "name": category_model.name,
            "color": category_model.color,
            "user_id": category_model.user_id,
            "tasks_count": 0,
        }

        response = CategoryResponse.model_validate(
            category_data).model_dump(mode='json')

        return jsonify(response), 200

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


@category_bp.route('/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    try:
        category = db_session.scalars(
            select(Category).filter_by(id=category_id, user_id=1)
        ).first()

        if not category:
            return jsonify({"error": "Category not found."}), 404

        db_session.delete(category)
        db_session.commit()
        return jsonify({"message": "Category deleted successfully!"}), 200

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
