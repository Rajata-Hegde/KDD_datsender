"""
KDD Dataset MQTT Sender
Reads KDD test data and sends via MQTT
For running on multiple client computers
"""
import paho.mqtt.client as mqtt
import pandas as pd
import json
import time
import argparse
import random
import socket  # Added to detect real IP
from datetime import datetime

# MQTT Config
MQTT_BROKER = "broker.hivemq.com"
MQTT_PORT = 1883
MQTT_TOPIC = "nids/unique123/live_packets"

# KDD Dataset columns
COLUMNS = [
    'duration','protocol_type','service','flag','src_bytes','dst_bytes','land',
    'wrong_fragment','urgent','hot','num_failed_logins','logged_in',
    'num_compromised','root_shell','su_attempted','num_root',
    'num_file_creations','num_shells','num_access_files','num_outbound_cmds',
    'is_host_login','is_guest_login','count','srv_count','serror_rate',
    'srv_serror_rate','rerror_rate','srv_rerror_rate','same_srv_rate',
    'diff_srv_rate','srv_diff_host_rate','dst_host_count','dst_host_srv_count',
    'dst_host_same_srv_rate','dst_host_diff_srv_rate',
    'dst_host_same_src_port_rate','dst_host_srv_diff_host_rate',
    'dst_host_serror_rate','dst_host_srv_serror_rate',
    'dst_host_rerror_rate','dst_host_srv_rerror_rate','label','difficulty'
]

def get_local_ip():
    """Finds the local IP address of this machine"""
    try:
        # This doesn't actually connect to the internet, but finds the local interface
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except Exception:
        return "127.0.0.1"

class KDDMQTTSender:
    def __init__(self, broker=MQTT_BROKER, client_name="Client-1", target_ip=None):
        self.broker = broker
        self.client_name = client_name
        self.my_real_ip = get_local_ip()  # Detect sender's real IP
        # Use provided target IP (IP of website system) or default to localhost
        self.target_ip = target_ip if target_ip else "127.0.0.1" 
        self.client = mqtt.Client(client_name)
        self.connected = False
        
        self.client.on_connect = self._on_connect
        self.client.on_disconnect = self._on_disconnect
    
    def _on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            self.connected = True
            print(f"✅ Connected to MQTT broker: {self.broker}")
        else:
            print(f"❌ Failed to connect (code {rc})")
    
    def _on_disconnect(self, client, userdata, rc):
        self.connected = False
        if rc != 0:
            print(f"⚠️  Unexpected disconnection")
    
    def connect(self):
        try:
            print(f"🔗 Connecting to MQTT broker: {self.broker}:{MQTT_PORT}...")
            self.client.connect(self.broker, MQTT_PORT, 60)
            self.client.loop_start()
            time.sleep(3)
            
            if not self.connected:
                print(f"⏳ Still connecting, waiting...")
                time.sleep(2)
            
            if self.connected:
                print(f"✅ Connected successfully!")
            
            return self.connected
        except Exception as e:
            print(f"❌ Connection error: {e}")
            return False
    
    def disconnect(self):
        if self.client:
            self.client.disconnect()
            self.client.loop_stop()
    
    def send_kdd_dataset(self, filepath, limit=None, interval=0.1):
        """Send KDD dataset via MQTT with real IP addresses"""
        try:
            print(f"📂 Loading dataset: {filepath}")
            df = pd.read_csv(filepath, header=None, names=COLUMNS)
            
            if limit:
                df = df.head(limit)
            
            print(f"📊 Loaded {len(df)} samples")
            print(f"🚀 Sender IP: {self.my_real_ip} | Target IP: {self.target_ip}")
            print(f"🚀 Sending via MQTT...\n")
            
            sent_count = 0
            attack_count = 0
            
            for idx, row in df.iterrows():
                packet = {
                    "src_ip": self.my_real_ip,  # Actual IP of this computer
                    "dst_ip": self.target_ip,   # IP of the system running the website
                    "protocol": row['protocol_type'],
                    "service": row['service'],
                    "flag": row['flag'],
                    "src_bytes": float(row['src_bytes']),
                    "dst_bytes": float(row['dst_bytes']),
                    "length": float(row['src_bytes']) + float(row['dst_bytes']),
                    "count": float(row['count']),
                    "srv_count": float(row['srv_count']),
                    "serror_rate": float(row['serror_rate']),
                    "srv_serror_rate": float(row['srv_serror_rate']),
                    "rerror_rate": float(row['rerror_rate']),
                    "same_srv_rate": float(row['same_srv_rate']),
                    "diff_srv_rate": float(row['diff_srv_rate']),
                    "dst_host_count": float(row['dst_host_count']),
                    "dst_host_srv_count": float(row['dst_host_srv_count']),
                    "dst_host_same_srv_rate": float(row['dst_host_same_srv_rate']),
                    "dst_host_diff_srv_rate": float(row['dst_host_diff_srv_rate']),
                    "dst_host_same_src_port_rate": float(row['dst_host_same_src_port_rate']),
                    "dst_host_srv_diff_host_rate": float(row['dst_host_srv_diff_host_rate']),
                    "dst_host_serror_rate": float(row['dst_host_serror_rate']),
                    "dst_host_srv_serror_rate": float(row['dst_host_srv_serror_rate']),
                    "dst_host_rerror_rate": float(row['dst_host_rerror_rate']),
                    "client": self.client_name,
                    "timestamp": datetime.now().isoformat()
                }
                
                self.client.publish(MQTT_TOPIC, json.dumps(packet))
                sent_count += 1
                
                if row['label'] != 'normal':
                    attack_count += 1
                
                if sent_count % 10 == 0:
                    print(f"[{self.client_name}] Sent {sent_count} packets ({attack_count} attacks)")
                
                time.sleep(interval)
            
            print(f"\n✅ Complete! Sent {sent_count} packets ({attack_count} attacks)")
        
        except FileNotFoundError:
            print(f"❌ File not found: {filepath}")
        except Exception as e:
            print(f"❌ Error: {e}")

def main():
    parser = argparse.ArgumentParser(
        description="Send KDD Dataset via MQTT to Central Backend"
    )
    parser.add_argument("--file", type=str, default="..\\KDDTest-21.txt", 
                       help="KDD dataset file path")
    parser.add_argument("--limit", type=int, default=None, 
                       help="Limit number of packets to send")
    parser.add_argument("--interval", type=float, default=0.1, 
                       help="Interval between packets (seconds)")
    parser.add_argument("--name", type=str, default="Client-1", 
                       help="Client name for identification")
    parser.add_argument("--broker", type=str, default=MQTT_BROKER, 
                       help="MQTT broker address")
    # Added target IP argument
    parser.add_argument("--target", type=str, default="127.0.0.1", 
                       help="IP address of the system running the website dashboard")
    
    args = parser.parse_args()
    
    # Pass target IP to the sender
    sender = KDDMQTTSender(broker=args.broker, client_name=args.name, target_ip=args.target)
    
    if not sender.connect():
        print("Failed to connect to MQTT broker")
        return
    
    try:
        sender.send_kdd_dataset(
            filepath=args.file,
            limit=args.limit,
            interval=args.interval
        )
    except KeyboardInterrupt:
        print("\n\nInterrupted by user")
    finally:
        sender.disconnect()

if __name__ == "__main__":
    main()


# """
# KDD Dataset MQTT Sender
# Reads KDD test data and sends via MQTT
# For running on multiple client computers
# """
# import paho.mqtt.client as mqtt
# import pandas as pd
# import json
# import time
# import argparse
# import random
# from datetime import datetime

# # MQTT Config
# MQTT_BROKER = "broker.hivemq.com"
# MQTT_PORT = 1883
# MQTT_TOPIC = "nids/unique123/live_packets"

# # KDD Dataset columns
# COLUMNS = [
#     'duration','protocol_type','service','flag','src_bytes','dst_bytes','land',
#     'wrong_fragment','urgent','hot','num_failed_logins','logged_in',
#     'num_compromised','root_shell','su_attempted','num_root',
#     'num_file_creations','num_shells','num_access_files','num_outbound_cmds',
#     'is_host_login','is_guest_login','count','srv_count','serror_rate',
#     'srv_serror_rate','rerror_rate','srv_rerror_rate','same_srv_rate',
#     'diff_srv_rate','srv_diff_host_rate','dst_host_count','dst_host_srv_count',
#     'dst_host_same_srv_rate','dst_host_diff_srv_rate',
#     'dst_host_same_src_port_rate','dst_host_srv_diff_host_rate',
#     'dst_host_serror_rate','dst_host_srv_serror_rate',
#     'dst_host_rerror_rate','dst_host_srv_rerror_rate','label','difficulty'
# ]

# # Fake IPs for visualization
# FAKE_IPS = [
#     "192.168.1.10", "192.168.1.50", "192.168.1.100", "203.0.113.1"
# ]
# TARGET_IPS = ["10.0.0.1", "10.0.0.2", "10.0.0.5"]

# class KDDMQTTSender:
#     def __init__(self, broker=MQTT_BROKER, client_name="Client-1"):
#         self.broker = broker
#         self.client_name = client_name
#         self.client = mqtt.Client(client_name)
#         self.connected = False
        
#         self.client.on_connect = self._on_connect
#         self.client.on_disconnect = self._on_disconnect
    
#     def _on_connect(self, client, userdata, flags, rc):
#         if rc == 0:
#             self.connected = True
#             print(f"✅ Connected to MQTT broker: {self.broker}")
#         else:
#             print(f"❌ Failed to connect (code {rc})")
    
#     def _on_disconnect(self, client, userdata, rc):
#         self.connected = False
#         if rc != 0:
#             print(f"⚠️  Unexpected disconnection")
    
#     def connect(self):
#         try:
#             print(f"🔗 Connecting to MQTT broker: {self.broker}:{MQTT_PORT}...")
#             self.client.connect(self.broker, MQTT_PORT, 60)
#             self.client.loop_start()
#             time.sleep(3)  # Give more time for connection
            
#             if not self.connected:
#                 print(f"⏳ Still connecting, waiting...")
#                 time.sleep(2)
            
#             if self.connected:
#                 print(f"✅ Connected successfully!")
            
#             return self.connected
#         except Exception as e:
#             print(f"❌ Connection error: {e}")
#             return False
    
#     def disconnect(self):
#         if self.client:
#             self.client.disconnect()
#             self.client.loop_stop()
    
#     def send_kdd_dataset(self, filepath, limit=None, interval=0.1):
#         """Send KDD dataset via MQTT"""
#         try:
#             print(f"📂 Loading dataset: {filepath}")
#             df = pd.read_csv(filepath, header=None, names=COLUMNS)
            
#             if limit:
#                 df = df.head(limit)
            
#             print(f"📊 Loaded {len(df)} samples")
#             print(f"🚀 Sending via MQTT...\n")
            
#             sent_count = 0
#             attack_count = 0
            
#             for idx, row in df.iterrows():
#                 # Create packet from KDD row
#                 packet = {
#                     "src_ip": random.choice(FAKE_IPS),
#                     "dst_ip": random.choice(TARGET_IPS),
#                     "protocol": row['protocol_type'],
#                     "service": row['service'],
#                     "flag": row['flag'],
#                     "src_bytes": float(row['src_bytes']),
#                     "dst_bytes": float(row['dst_bytes']),
#                     "length": float(row['src_bytes']) + float(row['dst_bytes']),
#                     "count": float(row['count']),
#                     "srv_count": float(row['srv_count']),
#                     "serror_rate": float(row['serror_rate']),
#                     "srv_serror_rate": float(row['srv_serror_rate']),
#                     "rerror_rate": float(row['rerror_rate']),
#                     "same_srv_rate": float(row['same_srv_rate']),
#                     "diff_srv_rate": float(row['diff_srv_rate']),
#                     "dst_host_count": float(row['dst_host_count']),
#                     "dst_host_srv_count": float(row['dst_host_srv_count']),
#                     "dst_host_same_srv_rate": float(row['dst_host_same_srv_rate']),
#                     "dst_host_diff_srv_rate": float(row['dst_host_diff_srv_rate']),
#                     "dst_host_same_src_port_rate": float(row['dst_host_same_src_port_rate']),
#                     "dst_host_srv_diff_host_rate": float(row['dst_host_srv_diff_host_rate']),
#                     "dst_host_serror_rate": float(row['dst_host_serror_rate']),
#                     "dst_host_srv_serror_rate": float(row['dst_host_srv_serror_rate']),
#                     "dst_host_rerror_rate": float(row['dst_host_rerror_rate']),
#                     "client": self.client_name,
#                     "timestamp": datetime.now().isoformat()
#                 }
                
#                 # Publish to MQTT
#                 self.client.publish(MQTT_TOPIC, json.dumps(packet))
#                 sent_count += 1
                
#                 # Track attacks
#                 if row['label'] != 'normal':
#                     attack_count += 1
                
#                 # Show progress every 10 packets
#                 if sent_count % 10 == 0:
#                     print(f"[{self.client_name}] Sent {sent_count} packets ({attack_count} attacks)")
                
#                 time.sleep(interval)
            
#             print(f"\n✅ Complete! Sent {sent_count} packets ({attack_count} attacks)")
        
#         except FileNotFoundError:
#             print(f"❌ File not found: {filepath}")
#         except Exception as e:
#             print(f"❌ Error: {e}")

# def main():
#     parser = argparse.ArgumentParser(
#         description="Send KDD Dataset via MQTT to Central Backend"
#     )
#     parser.add_argument("--file", type=str, default="..\\KDDTest-21.txt", 
#                        help="KDD dataset file path")
#     parser.add_argument("--limit", type=int, default=None, 
#                        help="Limit number of packets to send")
#     parser.add_argument("--interval", type=float, default=0.1, 
#                        help="Interval between packets (seconds)")
#     parser.add_argument("--name", type=str, default="Client-1", 
#                        help="Client name for identification")
#     parser.add_argument("--broker", type=str, default=MQTT_BROKER, 
#                        help="MQTT broker address")
    
#     args = parser.parse_args()
    
#     sender = KDDMQTTSender(broker=args.broker, client_name=args.name)
    
#     if not sender.connect():
#         print("Failed to connect to MQTT broker")
#         return
    
#     try:
#         sender.send_kdd_dataset(
#             filepath=args.file,
#             limit=args.limit,
#             interval=args.interval
#         )
#     except KeyboardInterrupt:
#         print("\n\nInterrupted by user")
#     finally:
#         sender.disconnect()

# if __name__ == "__main__":
#     main()
