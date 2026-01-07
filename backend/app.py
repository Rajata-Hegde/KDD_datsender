from flask import Flask
from flask_socketio import SocketIO
from mqtt.mqtt_subscriber import start_mqtt

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

start_mqtt(socketio)

if __name__ == "__main__":
    socketio.run(app, port=5000)
