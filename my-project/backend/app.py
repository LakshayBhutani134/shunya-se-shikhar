from flask import Flask
from flask_cors import CORS
from extensions import db
from config import Config

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.config.from_object(Config)
db.init_app(app)

# Import routes after app and db are created
from routes.user_routes import user_routes
from routes.problem_routes import problem_routes  # Add this line

# Import models to register them with SQLAlchemy
from models.user import User
from models.rating_history import RatingHistory
from models.problem import Problem, Submission  # Add this line

# Create all database tables
with app.app_context():
    try:
        db.create_all()
        print("Database tables created successfully")
    except Exception as e:
        print(f"Error creating database tables: {str(e)}")

# Register the blueprints
app.register_blueprint(user_routes)
app.register_blueprint(problem_routes)  # Add this line

if __name__ == '__main__':
    app.run(debug=True)