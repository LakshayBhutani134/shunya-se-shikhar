from extensions import db

class User(db.Model):
    __tablename__ = 'users'

    userid = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(256), nullable=False)
    rating_score = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f'<User {self.username}, ID: {self.userid}, Rating: {self.rating_score}>'