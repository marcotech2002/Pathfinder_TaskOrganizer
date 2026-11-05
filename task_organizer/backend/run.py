from src import create_app
from flask_cors import CORS


app = create_app()

CORS(
    app,
    resources={r"/api/*": {"origins": ['http://localhost:4200']}},
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PATCH", "PUT", "DELETE"],
)

if __name__ == '__main__':
    app.run(debug=True)
