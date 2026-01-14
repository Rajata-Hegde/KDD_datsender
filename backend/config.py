"""
Configuration file for IDS System
"""

# MQTT Configuration
MQTT_BROKER = "broker.hivemq.com"  # Change to your MQTT broker
MQTT_PORT = 1883
MQTT_TOPIC = "nids/live_packets"

# Flask Server Configuration
FLASK_HOST = "0.0.0.0"
FLASK_PORT = 5000
FLASK_DEBUG = False

# Frontend Configuration
FRONTEND_URL = "http://localhost:5173"
FRONTEND_API_URL = "http://localhost:5000"

# Logging Configuration
LOG_LEVEL = "INFO"
LOG_FORMAT = "[%(asctime)s] %(levelname)s - %(name)s - %(message)s"

# Statistics Configuration
MAX_RECENT_ATTACKS = 100  # Keep last N attacks in memory
PACKETS_PER_SEC_WINDOW = 1  # Calculate packets/sec every N seconds
ACTIVE_SESSION_TIMEOUT = 300  # Consider session inactive after N seconds

# ML Model Configuration
MODEL_PATH = "models/ids_model.pkl"
SCALER_PATH = "models/scaler.pkl"
USE_HEURISTIC_FALLBACK = True  # Use heuristic classification if model not available

# Attack Types
ATTACK_CATEGORIES = {
    "DoS": ["back", "land", "neptune", "pod", "smurf", "teardrop", "mailbomb", "apache2"],
    "Probe": ["satan", "ipsweep", "nmap", "portsweep", "mscan", "saint"],
    "R2L": ["guess_passwd", "ftp_write", "imap", "phf", "multihop", "warezmaster", "httptunnel"],
    "U2R": ["shellcode", "loadmodule", "perl", "rootkit", "buffer_overflow", "xterm", "ps"],
}

# Confidence Threshold
MIN_CONFIDENCE_THRESHOLD = 50  # Only report attacks above this confidence
