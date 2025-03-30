from flask import Blueprint, request, jsonify, current_app
import os
from werkzeug.utils import secure_filename
from models.problem import Problem, Submission
from models.user import User
from extensions import db
import subprocess
import json
import random

# Import your state graph and compiled graph from your model file.
# For example, if your model code is in a file called model_pipeline.py:
from .ocr import graph  # graph is the compiled StateGraph from your model code

problem_routes = Blueprint('problem_routes', __name__)



# Create a directory for uploads if it doesn't exist
UPLOAD_FOLDER = 'uploads/solutions'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# Debugging: Print the upload folder path
print(f"Upload folder set to: {os.path.abspath(UPLOAD_FOLDER)}")

@problem_routes.route('/problems', methods=['GET'])
def get_problems():
    try:
        problems = Problem.query.all()
        result = [{
            'problem_id': problem.problem_id,
            'title': problem.title,
            'content': problem.content,
            'difficulty': problem.difficulty,
            'topic': problem.topic
        } for problem in problems]
        
        print(f"Found {len(result)} problems")
        return jsonify(result), 200
    except Exception as e:
        print(f"Error in get_problems: {str(e)}")
        return jsonify({'error': str(e)}), 500

@problem_routes.route('/problems/<int:problem_id>', methods=['GET'])
def get_problem(problem_id):
    try:
        problem = Problem.query.get_or_404(problem_id)
        return jsonify({
            'problem_id': problem.problem_id,
            'title': problem.title,
            'content': problem.content,
            'difficulty': problem.difficulty,
            'topic': problem.topic
        }), 200
    except Exception as e:
        print(f"Error fetching problem {problem_id}: {str(e)}")
        return jsonify({'error': str(e)}), 500


def get_system_answer(problem_id):
    """Fetches the system answer from a JSON file using problem_id."""
    try:
        with open("C:/Users/Lakshay/OneDrive/Desktop/Math Tutor/my-project/questions.json", 'r', encoding='utf-8') as file:
            data = json.load(file)
        # print("problem id: ",problem_id)
        for problem in data:
            # print("test: ",str(problem.get('Question ID')), str(problem_id))
            if str(problem.get('Question ID')) == str(problem_id):  # Ensure proper type comparison
                return problem.get('Solution')

        return None  # Return None if no matching problem_id is found
    except Exception as e:
        print(f"Error reading JSON file: {str(e)}")
        return None

@problem_routes.route('/problems/<int:problem_id>/submit', methods=['POST'])
def submit_solution(problem_id):
    print("Received file upload request")
    print("Files in request:", list(request.files.keys()))
    print("Form data:", list(request.form.keys()))
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    user_id = request.form.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    try:
        # Create user directory if it doesn't exist
        user_folder = os.path.join(UPLOAD_FOLDER, str(user_id))
        os.makedirs(user_folder, exist_ok=True)
        
        # Save file with secure filename
        filename = secure_filename(file.filename)
        file_path = os.path.join(user_folder, filename)
        absolute_path = os.path.abspath(file_path)
        
        print(f"Saving file to: {absolute_path}")
        file.save(absolute_path)
        
        # Fetch system answer from JSON file
        changed_problem_id = "question-"+str(problem_id)  # Ensure problem_id is a string for JSON lookup
        system_ans = get_system_answer(changed_problem_id)
        
        if system_ans is None:
            return jsonify({'error': f'No system answer found for problem_id {problem_id}'}), 404

        # Prepare the initial state for your model pipeline.
        state = {
            "img_path": absolute_path,  # Image path for OCR node
            "system_ans": system_ans,   # Fetched from JSON
        }
        
        # Run the state graph to process the uploaded file.
        try:
            final_state = graph.invoke(state)
        except Exception as e:
            print(f"Error running model pipeline: {str(e)}")
            return jsonify({'error': f'Model processing error: {str(e)}'}), 500
        
        # Save submission in database with the model output.
        # In your submit_solution function, update line ~120-126:

# Save submission in database with the model output.
        submission = Submission(
            problem_id=changed_problem_id,  # Use the full question ID string instead of just problem_id
            user_id=user_id,
            image_path=file_path,
            model_output=json.dumps(final_state)  # Uncomment this line to store the model output
        )
        db.session.add(submission)
        db.session.commit()
        
        return jsonify({
            'message': 'Solution submitted and processed successfully',
            'submission_id': submission.submission_id,
            'image_path': file_path,
            'model_output': final_state
        }), 201
    except Exception as e:
        print(f"Error saving file: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500
    
@problem_routes.route('/upload', methods=['POST'])
def upload_file():
    print("Received generic file upload request")
    print("Files in request:", list(request.files.keys()))
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    try:
        # Save file with secure filename in the uploads folder
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        absolute_path = os.path.abspath(file_path)
        
        print(f"Saving file to: {absolute_path}")
        file.save(absolute_path)
        
        return jsonify({
            'message': 'File uploaded successfully',
            'file_path': file_path
        }), 200
    except Exception as e:
        print(f"Error saving file: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@problem_routes.route('/seed-problems', methods=['POST'])
def seed_problems():
    try:
        sample_problems = [
            {
                'title': 'Quadratic Equation',
                'content': 'Solve the equation: x² + 5x + 6 = 0',
                'difficulty': 1,
                'topic': 'algebra'
            },
            {
                'title': 'Integration Problem',
                'content': 'Find the integral of f(x) = x² + 3x - 2',
                'difficulty': 3,
                'topic': 'calculus'
            },
            {
                'title': 'Triangle Properties',
                'content': 'Calculate the area of a triangle with sides of length 3, 4, and 5',
                'difficulty': 2,
                'topic': 'geometry'
            }
        ]
        
        for data in sample_problems:
            problem = Problem(**data)
            db.session.add(problem)
        
        db.session.commit()
        return jsonify({'message': f'Added {len(sample_problems)} sample problems'}), 201
    except Exception as e:
        print(f"Error seeding problems: {str(e)}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
@problem_routes.route('/api/get-questions', methods=['GET'])
def get_questions():
    try:
        level = int(request.args.get('level', 3))  # Default to 3 questions
        with open('C:/Users/Lakshay/OneDrive/Desktop/Math Tutor/my-project/questions.json', 'r', encoding='utf-8') as file:
            data = json.load(file)
        filtered_questions = [q for q in data if q.get('Level') == f'Level {level}']  # Filter by level
        random_questions = random.sample(filtered_questions, min(3, len(filtered_questions)))
        return jsonify(random_questions), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@problem_routes.route('/api/upload', methods=['POST'])
def api_upload_file():
    print("Received file upload request via /api/upload")
    print("Files in request:", list(request.files.keys()))
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    question_id = request.form.get('question_id', 'unknown')
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    try:
        # Create uploads/solutions directory if it doesn't exist
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        
        # Save file with secure filename - add timestamp to avoid name conflicts
        from datetime import datetime
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        filename = secure_filename(f"{timestamp}_{file.filename}")
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        absolute_path = os.path.abspath(file_path)
        
        print(f"Saving file to: {absolute_path}")
        file.save(absolute_path)
        
        return jsonify({
            'message': 'File uploaded successfully',
            'file_path': file_path,
            'question_id': question_id
        }), 200
    except Exception as e:
        print(f"Error saving file: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500
