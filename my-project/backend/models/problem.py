from extensions import db
from datetime import datetime

class Problem(db.Model):
    __tablename__ = 'problems'
    
    problem_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    difficulty = db.Column(db.Integer, nullable=False)  # 1-5
    topic = db.Column(db.String(50), nullable=False)    # algebra, calculus, etc.
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Problem {self.title}, ID: {self.problem_id}>'

# class Submission(db.Model):
#     __tablename__ = 'submissions'
    
#     submission_id = db.Column(db.Integer, primary_key=True)
#     problem_id = db.Column(db.Integer, db.ForeignKey('problems.problem_id'), nullable=False)
#     user_id = db.Column(db.Integer, db.ForeignKey('users.userid'), nullable=False)
#     image_path = db.Column(db.String(255), nullable=True)
#     # submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    
#     def __repr__(self):
#         return f'<Submission {self.submission_id} for Problem {self.problem_id}>'

# Modify the Submission class

class Submission(db.Model):
    __tablename__ = 'submissions'
    
    submission_id = db.Column(db.Integer, primary_key=True)
    problem_id = db.Column(db.String(50), nullable=False)  # Change to String instead of Foreign Key
    user_id = db.Column(db.Integer, nullable=True)
    image_path = db.Column(db.String(255), nullable=True)
    model_output = db.Column(db.Text, nullable=True)  # Add this line to store the model output
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Submission {self.submission_id} for Problem {self.problem_id}>'