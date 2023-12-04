from flask import Flask,request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)

# Database credentials
db_password = "NiGod"
db_name = "babytracker"

# Configuring SQLAlchemy URI
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://postgres:{db_password}@localhost/{db_name}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f'Event: {self.description}'

    def __init__(self, description):
        self.description = description

# Define routes and application logic inside the app context
with app.app_context():
    # Ensure tables are created within the application context
    db.create_all()

    def format_event(event):
        return{
            "description" : event.description,
            "id" : event.id,
            "created_at": event.created_at
        }

    @app.route('/')
    def hello():
        return 'Hey'
    #create event
    @app.route('/event', methods=["POST"])
    def create_event():
        description= request.json['description']
        event = Event(description)
        db.session.add(event)
        db.session.commit()
        return format_event(event)
    
    #get events
    @app.route('/event', methods=['GET'])
    def get_event():
        events = Event.query.order_by(Event.id.asc()).all()
        event_list = []
        for event in events:
            event_list.append(format_event(event))
        return {'events': event_list} 
    
    #get a single event 
    @app.route('/event/<id>', methods=['GET'])
    def get_single_event(id):
        event = Event.query.filter_by(id=id).one()
        formatted_event = format_event(event)
        return {'event': formatted_event}
    
    #delete an event
    @app.route('/event/<id>', methods=['DELETE'])
    def delete_event(id):
    

if __name__ == '__main__':
    app.run()
