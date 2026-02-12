from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Transcript(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ActionItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    transcript_id = db.Column(db.Integer, db.ForeignKey('transcript.id'))
    task = db.Column(db.String(500), nullable=False)
    owner = db.Column(db.String(100))
    due_date = db.Column(db.String(100))
    tags = db.Column(db.String(200))
    done = db.Column(db.Boolean, default=False)
