from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize SQLAlchemy
db = SQLAlchemy()

def configure_db(app):
    """Configure the database for the Flask app"""
    # Configure database based on environment variables
    database_type = os.getenv('DATABASE_TYPE', 'sqlite')

    if database_type == 'postgres':
        # PostgreSQL configuration
        postgres_user = os.getenv('POSTGRES_USER', 'postgres')
        postgres_password = os.getenv('POSTGRES_PASSWORD', 'password')
        postgres_host = os.getenv('POSTGRES_HOST', 'localhost')
        postgres_port = os.getenv('POSTGRES_PORT', '5432')
        postgres_db = os.getenv('POSTGRES_DB', 'capability_tracker')
        
        app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{postgres_user}:{postgres_password}@{postgres_host}:{postgres_port}/{postgres_db}'
    else:
        # SQLite configuration (default)
        sqlite_uri = os.getenv('SQLITE_DATABASE_URI', 'sqlite:///capability_tracker.db')
        app.config['SQLALCHEMY_DATABASE_URI'] = sqlite_uri

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize the app with the database
    db.init_app(app)
    
    return db