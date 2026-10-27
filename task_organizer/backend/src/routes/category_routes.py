from flask import Blueprint, request, jsonify
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from src import db_session
from src.models.category import Category
from src.schemas.category_schemas import (
    CategoryCreateRequest, CategoryResponse, CategoryUpdateRequest
)


category_bp = Blueprint('category_bp', __name__, url_prefix='/categories')


@category_bp.route('/', methods=['GET'])
def get_categories():
    try:
        categories = db_session.scalars(select(Category)).all()

        result = [
            CategoryResponse.model_validate(category)
            for category in categories
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


@category_bp.route('/<int:category_id>', methods=['GET'])
def get_category_by_id(category_id):
    try:
        category = db_session.scalars(
            select(Category).filter_by(id=category_id)).first()

        if not category:
            return jsonify({"error": "Category not found."}), 404

        result = CategoryResponse.model_validate(category)

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


@category_bp.route('/', methods=['POST'])
def create_category():
    try:
        payload = request.get_json() or {}
        category_dto = CategoryCreateRequest.model_validate(payload)
        category_model = Category(**category_dto.model_dump())

        db_session.add(category_model)
        db_session.commit()
        db_session.refresh(category_model)

        return jsonify({
            "message": "Category created successfully!",
            "category_id": category_model.id
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


@category_bp.route('/<int:category_id>', methods=['PATCH'])
def update_category(category_id):
    try:
        category_model = db_session.scalars(
            select(Category).filter_by(id=category_id)
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

        result = CategoryResponse.model_validate(
            category_model).model_dump(mode='json')

        return jsonify({
            "message": "Category updated successfully!",
            "category": result
        }), 200

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
def delete_category(category_id):
    try:
        category = db_session.scalars(
            select(Category).filter_by(id=category_id)).first()

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
