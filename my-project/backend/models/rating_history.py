from extensions import db
from datetime import datetime

class RatingHistory(db.Model):
    __tablename__ = 'rating_history'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.userid'), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f'<RatingHistory {self.id} User: {self.user_id}, Rating: {self.rating}>'