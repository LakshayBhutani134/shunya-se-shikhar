from flask import Flask
from flask_cors import CORS  # Add this import
from extensions import db
from config import Config

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.config.from_object(Config)
db.init_app(app)

# Import routes after app and db are created
from routes.user_routes import user_routes

# Register the blueprint with the correct name
app.register_blueprint(user_routes)

if __name__ == '__main__':
    app.run(debug=True)