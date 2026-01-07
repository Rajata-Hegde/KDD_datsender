import json
import paho.mqtt.client as mqtt

def start_mqtt(socketio):
    def on_message(client, userdata, msg):
        data = json.loads(msg.payload.decode())
        socketio.emit("network_logs", data)

    client = mqtt.Client()
    client.connect("broker.hivemq.com", 1883, 60)
    client.subscribe("nids/live_packets")
    client.on_message = on_message
    client.loop_start()
