"""
Local Packet Sender via HTTP (bypass MQTT)
Reads KDD test data and sends via HTTP to the backend
"""
import requests
import pandas as pd
import json
import time
import argparse
import random
from datetime import datetime

# Backend config (local)
BACKEND_URL = "http://localhost:5000/api/inject-packet"

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

# Fake IPs for visualization
FAKE_IPS = [
    "192.168.1.10", "192.168.1.50", "192.168.1.100", "203.0.113.1"
]
TARGET_IPS = ["10.0.0.1", "10.0.0.2", "10.0.0.5"]

def get_random_ips():
    """Get random src and dst IPs"""
    src = random.choice(FAKE_IPS)
    dst = random.choice(TARGET_IPS)
    return src, dst

def send_packet_data(filepath, limit=None, interval=0.1, client_name="Local-Sender"):
    """Send KDD dataset packets via HTTP"""
    try:
        print(f"📂 Loading dataset: {filepath}")
        df = pd.read_csv(filepath, header=None, names=COLUMNS)
        
        if limit:
            df = df.head(limit)
        
        print(f"📊 Loaded {len(df)} samples")
        print(f"🚀 Sending via HTTP to {BACKEND_URL}...\n")
        
        sent_count = 0
        attack_count = 0
        
        for idx, row in df.iterrows():
            src_ip, dst_ip = get_random_ips()
            
            # Determine if attack or normal
            is_attack = row['label'] != 'normal.'
            attack_type = row['label'].replace('.', '').strip()
            
            # Prepare packet payload
            packet = {
                'client_name': client_name,
                'src_ip': src_ip,
                'dst_ip': dst_ip,
                'protocol': row['protocol_type'],
                'service': row['service'],
                'flag': row['flag'],
                'src_bytes': float(row['src_bytes']),
                'dst_bytes': float(row['dst_bytes']),
                'length': float(row['dst_bytes']),
                'timestamp': datetime.now().isoformat(),
                'is_attack': is_attack,
                'attack_type': attack_type if is_attack else 'normal',
                'attack_category': 'DoS' if 'dos' in attack_type.lower() else 'Probe' if 'scan' in attack_type.lower() else 'R2L' if '2l' in attack_type.lower() else 'U2R' if '2r' in attack_type.lower() else 'Normal',
                'confidence': round(random.uniform(0.85, 0.99) * 100, 1) if is_attack else 0,
                # KDD features for classification
                'same_srv_rate': float(row.get('same_srv_rate', 0)),
                'dst_host_serror_rate': float(row.get('dst_host_serror_rate', 0)),
                'srv_serror_rate': float(row.get('srv_serror_rate', 0)),
                'dst_host_same_srv_rate': float(row.get('dst_host_same_srv_rate', 0.5)),
                'diff_srv_rate': float(row.get('diff_srv_rate', 0)),
                'count': float(row.get('count', 1)),
                'dst_host_srv_serror_rate': float(row.get('dst_host_srv_serror_rate', 0)),
                'serror_rate': float(row.get('serror_rate', 0)),
                'dst_host_same_src_port_rate': float(row.get('dst_host_same_src_port_rate', 0)),
                'dst_host_srv_diff_host_rate': float(row.get('dst_host_srv_diff_host_rate', 0)),
                'dst_host_diff_srv_rate': float(row.get('dst_host_diff_srv_rate', 0)),
                'dst_host_srv_count': float(row.get('dst_host_srv_count', 1)),
                'srv_count': float(row.get('srv_count', 1)),
                'dst_host_count': float(row.get('dst_host_count', 1)),
                'dst_host_rerror_rate': float(row.get('dst_host_rerror_rate', 0)),
            }
            
            # Send packet
            try:
                response = requests.post(BACKEND_URL, json=packet, timeout=5)
                if response.status_code == 200:
                    sent_count += 1
                    if is_attack:
                        attack_count += 1
                    
                    if sent_count % 10 == 0:
                        print(f"✅ Sent {sent_count}/{len(df)} packets | Attacks: {attack_count}")
                else:
                    print(f"⚠️  Error sending packet: {response.status_code}")
            except Exception as e:
                print(f"❌ Failed to send packet: {e}")
            
            time.sleep(interval)
        
        print(f"\n✅ Completed! Sent {sent_count} packets ({attack_count} attacks)")
        print(f"📊 Attack rate: {(attack_count/sent_count*100):.1f}%")
        
    except FileNotFoundError:
        print(f"❌ File not found: {filepath}")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Send KDD packets via HTTP')
    parser.add_argument('--name', default='Local-Sender', help='Client name')
    parser.add_argument('--file', required=True, help='KDD dataset file path')
    parser.add_argument('--limit', type=int, help='Limit number of packets to send')
    parser.add_argument('--interval', type=float, default=0.1, help='Interval between packets (seconds)')
    
    args = parser.parse_args()
    
    send_packet_data(args.file, args.limit, args.interval, args.name)
