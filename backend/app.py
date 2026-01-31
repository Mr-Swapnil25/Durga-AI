from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import os

# Initialize Flask App
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'durga_secret_key')
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# In-memory storage for active alerts (database would be used in prod)
active_alerts = {}

@app.route('/')
def index():
    return jsonify({"status": "DURGA Guardian System Online", "version": "1.0.0"})

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    emit('system_status', {'status': 'online'})

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('trigger_sos')
def handle_sos(data):
    """
    Handle incoming SOS trigger from the frontend.
    Expected data: { 'user_id': str, 'location': { 'lat': float, 'lng': float } }
    """
    user_id = data.get('user_id')
    location = data.get('location')
    
    print(f"SOS TRIGGERED by User: {user_id} at {location}")
    
    alert_id = f"alert_{user_id}_{len(active_alerts) + 1}"
    
    alert_data = {
        'alert_id': alert_id,
        'user_id': user_id,
        'location': location,
        'timestamp': 'now', # Use datetime in real app
        'status': 'ACTIVE'
    }
    
    active_alerts[alert_id] = alert_data
    
    # Broadcast to all connected clients (Guardians/Dashboards)
    emit('sos_broadcast', alert_data, broadcast=True)
    
    return {'status': 'success', 'alert_id': alert_id}

@socketio.on('cancel_sos')
def handle_cancel(data):
    alert_id = data.get('alert_id')
    if alert_id in active_alerts:
        del active_alerts[alert_id]
        emit('sos_cancelled', {'alert_id': alert_id}, broadcast=True)
        print(f"Alert {alert_id} cancelled")

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)
