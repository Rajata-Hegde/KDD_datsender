from flask import Flask, jsonify, request
from flask_socketio import SocketIO
from mqtt.mqtt_subscriber import start_mqtt, get_stats, reset_stats, process_packet_data
from models.classifier import get_classifier

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize classifier (loads ML model)
print("\n" + "="*60)
print("🤖 INITIALIZING ML MODEL")
print("="*60)
classifier = get_classifier()
if classifier.model:
    print("✅ ML MODEL LOADED SUCCESSFULLY!")
else:
    print("⚠️  ML MODEL NOT LOADED - USING HEURISTICS")
print("="*60 + "\n")

start_mqtt(socketio)

# REST API Endpoints
@app.route('/api/stats', methods=['GET'])
def stats():
    """Get current network statistics"""
    return jsonify(get_stats())

@app.route('/api/stats/reset', methods=['POST'])
def reset():
    """Reset statistics"""
    reset_stats()
    return jsonify({'message': 'Statistics reset'})

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'service': 'IDS Backend'})

@app.route('/api/inject-packet', methods=['POST'])
def inject_packet():
    """Inject packet data directly (for local mode simulator)"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Process the packet through the classifier
        process_packet_data(data, socketio)
        
        return jsonify({'status': 'success', 'message': 'Packet injected'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=5000, debug=False)
