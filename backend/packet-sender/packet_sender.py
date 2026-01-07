from scapy.all import sniff, IP, TCP, UDP
import json
import paho.mqtt.client as mqtt
import socket
import time

client = mqtt.Client()
client.connect("broker.hivemq.com", 1883, 60)

device = socket.gethostname()

def send_packet(packet):
    if IP in packet:
        data = {
            "device": device,
            "src_ip": packet[IP].src,
            "dst_ip": packet[IP].dst,
            "protocol": "TCP" if TCP in packet else "UDP" if UDP in packet else "OTHER",
            "length": len(packet),
            "timestamp": time.time()
        }
        client.publish("nids/live_packets", json.dumps(data))

sniff(prn=send_packet, store=False)
