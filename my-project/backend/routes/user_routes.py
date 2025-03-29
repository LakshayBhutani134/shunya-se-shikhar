from flask import Blueprint, request, jsonify, session
from models.user import User
from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

user_routes = Blueprint('user_routes', __name__)

@user_routes.route('/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    print(f"Signup attempt for: {data['username']}")
    print(f"Request data keys: {data.keys()}")
    
    # Check if user already exists
    existing_user = User.query.filter_by(username=data['username']).first()
    if existing_user:
        return jsonify({'message': 'Username already exists'}), 409
    
    # Create new user with hashed password - use consistent method
    hashed_pw = generate_password_hash(data['password'], method='pbkdf2:sha256')
    print(f"Generated hash: {hashed_pw[:20]}...")
    
    new_user = User(
        username=data['username'],
        password=hashed_pw,
        rating_score=0  # Default starting score
    )
    
    db.session.add(new_user)
    db.session.commit()
    print(f"User created with ID: {new_user.userid}")
    
    # Verify the hash was actually stored
    saved_user = User.query.get(new_user.userid)
    print(f"Saved password hash: {saved_user.password[:20]}...")
    
    return jsonify({'message': 'User created successfully', 'userid': new_user.userid}), 201

@user_routes.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    user = User.query.filter_by(username=data['username']).first()
    
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    # Return user info (without password)
    return jsonify({
        'message': 'Login successful',
        'user': {
            'userid': user.userid,
            'username': user.username,
            'rating_score': user.rating_score
        }
    }), 200

# Keep existing routes for CRUD operations
@user_routes.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    
    # Make sure we're handling password properly
    password = data.get('password', 'changeme')  # Use a default if none provided
    
    new_user = User(
        username=data['username'], 
        password=generate_password_hash(password, method='pbkdf2:sha256'),
        rating_score=data['rating_score']
    )
    
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201

@user_routes.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{'username': user.username, 'userid': user.userid, 'rating_score': user.rating_score} for user in users]), 200

@user_routes.route('/users/<int:userid>', methods=['GET'])
def get_user(userid):
    user = User.query.get_or_404(userid)
    return jsonify({'username': user.username, 'userid': user.userid, 'rating_score': user.rating_score}), 200

@user_routes.route('/users/<int:userid>', methods=['PUT'])
def update_user(userid):
    data = request.get_json()
    user = User.query.get_or_404(userid)
    user.username = data['username']
    user.rating_score = data['rating_score']
    db.session.commit()
    return jsonify({'message': 'User updated successfully'}), 200

@user_routes.route('/users/<int:userid>', methods=['DELETE'])
def delete_user(userid):
    user = User.query.get_or_404(userid)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'}), 200

@user_routes.route('/debug-login', methods=['POST'])
def debug_login():
    data = request.get_json()
    
    user = User.query.filter_by(username=data['username']).first()
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    # Print details for debugging
    print(f"Username: {user.username}")
    print(f"Stored password hash: {user.password}")
    print(f"Provided password: {data['password']}")
    
    # Check if we can verify the password
    try:
        result = check_password_hash(user.password, data['password'])
        print(f"Password verification result: {result}")
    except Exception as e:
        print(f"Error during verification: {str(e)}")
        return jsonify({'message': f'Verification error: {str(e)}'}), 500
    
    if result:
        return jsonify({
            'message': 'Password would verify successfully',
            'username': user.username
        }), 200
    else:
        return jsonify({'message': 'Password would fail verification'}), 401
    
@user_routes.route('/util/reset-password/<username>', methods=['POST'])
def reset_user_password(username):
    data = request.get_json()
    
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    # Reset password with proper hashing
    new_password = data.get('password', 'password123')
    user.password = generate_password_hash(new_password, method='pbkdf2:sha256')
    db.session.commit()
    
    # Verify it's stored correctly
    updated_user = User.query.get(user.userid)
    
    return jsonify({
        'message': 'Password reset successfully',
        'username': username,
        'hash_preview': updated_user.password[:30] + '...'
    }), 200
    
@user_routes.route('/util/check-users', methods=['GET'])
def check_users():
    users = User.query.all()
    result = []
    
    for user in users:
        # Check if password looks like a hash
        is_hashed = (
            user.password.startswith('pbkdf2:') or 
            user.password.startswith('scrypt:') or
            user.password.startswith('bcrypt:')
        )
        
        result.append({
            'userid': user.userid,
            'username': user.username,
            'has_hashed_password': is_hashed,
            'password_preview': user.password[:15] + '...' if len(user.password) > 15 else user.password
        })
    
    return jsonify(result), 200

@user_routes.route('/auth/reset-password', methods=['POST'])
def auth_reset_password():
    data = request.get_json()
    
    if 'username' not in data or 'password' not in data:
        return jsonify({'message': 'Username and password are required'}), 400
    
    # Find the user
    user = User.query.filter_by(username=data['username']).first()
    if not user:
        # For security reasons, don't reveal if the username exists or not
        return jsonify({'message': 'If the username exists, the password has been reset'}), 200
    
    # Reset the password
    user.password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    db.session.commit()
    
    # Verify the new password hash was saved
    updated_user = User.query.get(user.userid)
    if not check_password_hash(updated_user.password, data['password']):
        return jsonify({'message': 'Password reset failed'}), 500
    
    return jsonify({'message': 'Password reset successful'}), 200