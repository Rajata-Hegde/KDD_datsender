"""
Demo Script: Feed Real KDD Dataset Values to Dashboard
Perfect for demonstrating the IDS to teachers/presentations

This script:
1. Loads real KDD dataset attack samples
2. Extracts features
3. Feeds them to the Flask API
4. Shows real attack detection in the dashboard
"""

import requests
import pandas as pd
import time
from datetime import datetime
import json

# Flask API endpoint
API_ENDPOINT = "http://localhost:5000/api/inject-packet"

# Dataset path (download from GitHub if not available)
DATASET_PATH = "KDDTrain+.txt"

# Column names for KDD dataset
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

# Map attack labels to IP addresses for visualization
ATTACK_SOURCES = {
    'neptune': '192.168.1.100',
    'back': '192.168.1.101',
    'land': '192.168.1.102',
    'pod': '192.168.1.103',
    'smurf': '192.168.1.104',
    'teardrop': '192.168.1.105',
    'satan': '192.168.1.50',
    'ipsweep': '192.168.1.51',
    'nmap': '192.168.1.52',
    'portsweep': '192.168.1.53',
    'mscan': '192.168.1.54',
    'saint': '192.168.1.55',
    'guess_passwd': '203.0.113.1',
    'ftp_write': '203.0.113.2',
    'imap': '203.0.113.3',
    'httptunnel': '203.0.113.4',
}

TARGET_IPS = ['10.0.0.1', '10.0.0.2', '10.0.0.5']

def classify_attack(label):
    """Classify attack into category"""
    if label == 'normal':
        return 'normal'
    elif label in ['back','land','neptune','pod','smurf','teardrop','mailbomb','apache2']:
        return 'DoS'
    elif label in ['satan','ipsweep','nmap','portsweep','mscan','saint']:
        return 'Probe'
    elif label in ['guess_passwd','ftp_write','imap','phf','httptunnel']:
        return 'R2L'
    else:
        return 'U2R'

def load_dataset(filepath=DATASET_PATH, limit=None):
    """Load KDD dataset"""
    try:
        df = pd.read_csv(filepath, header=None, names=COLUMNS)
        if limit:
            df = df.head(limit)
        print(f"✅ Loaded {len(df)} samples from {filepath}")
        return df
    except FileNotFoundError:
        print(f"❌ Dataset not found at {filepath}")
        print("📥 Downloading from GitHub...")
        download_dataset()
        return load_dataset(filepath, limit)

def download_dataset():
    """Download KDD dataset from GitHub"""
    import urllib.request
    url = "https://raw.githubusercontent.com/defcom17/NSL_KDD/master/KDDTrain+.txt"
    try:
        print(f"Downloading from {url}...")
        urllib.request.urlretrieve(url, DATASET_PATH)
        print(f"✅ Downloaded successfully")
    except Exception as e:
        print(f"❌ Download failed: {e}")

def send_packet_to_api(packet_data):
    """Send packet data to Flask API"""
    try:
        response = requests.post(API_ENDPOINT, json=packet_data, timeout=5)
        if response.status_code == 200:
            return True
        else:
            print(f"⚠️  API Error: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to Flask API. Make sure backend is running!")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def row_to_packet(row):
    """Convert KDD dataset row to packet format"""
    src_ip = ATTACK_SOURCES.get(row['label'], '192.168.1.99')
    dst_ip = TARGET_IPS[hash(row['label']) % len(TARGET_IPS)]
    
    packet = {
        'src_ip': src_ip,
        'dst_ip': dst_ip,
        'protocol': str(row['protocol_type']),
        'service': str(row['service']),
        'flag': str(row['flag']),
        'length': int(row['src_bytes']) + int(row['dst_bytes']),
        'src_bytes': int(row['src_bytes']),
        'dst_bytes': int(row['dst_bytes']),
        'duration': int(row['duration']),
        'packet_count': int(row['count']),
        'srv_count': int(row['srv_count']),
        'serror_rate': float(row['serror_rate']),
        'srv_serror_rate': float(row['srv_serror_rate']),
        'rerror_rate': float(row['rerror_rate']),
        'timestamp': datetime.now().isoformat(),
        'dataset_label': str(row['label']),  # Original KDD label
        'attack_category': classify_attack(row['label'])
    }
    
    return packet

def demo_run_all_attacks(df, delay=0.5):
    """Run demo: Show each type of attack"""
    print("\n" + "="*60)
    print("🎓 TEACHER DEMONSTRATION MODE")
    print("="*60)
    print(f"📊 Feeding {len(df)} real KDD dataset samples")
    print(f"⏱️  Delay between packets: {delay}s")
    print("\n🚀 Starting... Open dashboard at http://localhost:5173")
    print("="*60 + "\n")
    
    attack_counts = df['label'].value_counts()
    print("📈 Attack Distribution in Demo:")
    for attack, count in attack_counts.head(10).items():
        print(f"  • {attack:20} : {count:4} samples")
    
    sent = 0
    failed = 0
    attacks_detected = {}
    
    print("\n" + "-"*60)
    
    for idx, (_, row) in enumerate(df.iterrows()):
        packet = row_to_packet(row)
        attack_type = packet['dataset_label']
        
        if send_packet_to_api(packet):
            sent += 1
            attacks_detected[attack_type] = attacks_detected.get(attack_type, 0) + 1
            
            # Print progress
            status = "✅ ATTACK" if attack_type != 'normal' else "⚪ Normal"
            print(f"[{sent:4}] {status} | {attack_type:15} | "
                  f"{packet['src_ip']:15} → {packet['dst_ip']:12} | "
                  f"Confidence: {packet['serror_rate']*100:.1f}%")
        else:
            failed += 1
            if idx == 0:  # First packet failed
                print("\n❌ FATAL: Cannot connect to Flask API!")
                print("   Run this first: python backend/app.py")
                return
        
        time.sleep(delay)
    
    print("-"*60)
    print(f"\n✅ Demo Complete!")
    print(f"   Packets Sent: {sent}")
    print(f"   Failed: {failed}")
    print(f"\n🎯 Attacks Detected:")
    for attack, count in sorted(attacks_detected.items(), key=lambda x: x[1], reverse=True):
        print(f"   • {attack:20} : {count:4} samples")

def demo_specific_attack(df, attack_name, limit=50, delay=0.3):
    """Run demo: Show specific attack type"""
    filtered_df = df[df['label'] == attack_name].head(limit)
    
    if len(filtered_df) == 0:
        print(f"❌ No samples found for attack: {attack_name}")
        return
    
    print("\n" + "="*60)
    print(f"🎓 DEMONSTRATING: {attack_name.upper()} ATTACK")
    print("="*60)
    print(f"📊 Feeding {len(filtered_df)} real KDD samples")
    print(f"🔗 Open dashboard at http://localhost:5173")
    print("="*60 + "\n")
    
    sent = 0
    
    for _, row in filtered_df.iterrows():
        packet = row_to_packet(row)
        
        if send_packet_to_api(packet):
            sent += 1
            print(f"[{sent:3}] ✅ {attack_name:15} | "
                  f"{packet['src_ip']:15} → {packet['dst_ip']:12} | "
                  f"Error Rate: {packet['serror_rate']*100:.1f}%")
        else:
            print("\n❌ Cannot connect to API. Start backend first!")
            return
        
        time.sleep(delay)
    
    print(f"\n✅ Complete! Sent {sent} {attack_name} packets")

if __name__ == "__main__":
    import sys
    
    print("\n🎓 KDD Dataset Demo Runner for IDS System")
    print("="*60)
    
    # Check if Flask is running
    try:
        response = requests.get("http://localhost:5000/api/health", timeout=2)
        print("✅ Flask backend is running\n")
    except:
        print("\n❌ ERROR: Flask backend is NOT running!")
        print("   Please start the backend first:")
        print("   > cd backend")
        print("   > python app.py")
        sys.exit(1)
    
    # Load dataset
    df = load_dataset()
    
    if df is None or len(df) == 0:
        sys.exit(1)
    
    print("\n📋 Demo Options:")
    print("  1. Run all attacks (diverse demo)")
    print("  2. Show DoS attacks (neptune)")
    print("  3. Show Probe attacks (nmap, ipsweep)")
    print("  4. Show R2L attacks (httptunnel)")
    print("  5. Show only normal traffic")
    
    choice = input("\nSelect option (1-5) or enter attack name [default: 1]: ").strip()
    
    if choice == "2":
        demo_specific_attack(df, "neptune", limit=100, delay=0.3)
    elif choice == "3":
        demo_specific_attack(df, "nmap", limit=50, delay=0.3)
    elif choice == "4":
        demo_specific_attack(df, "httptunnel", limit=30, delay=0.3)
    elif choice == "5":
        filtered = df[df['label'] == 'normal'].head(50)
        demo_run_all_attacks(filtered, delay=0.3)
    elif choice and choice not in ["1", ""]:
        # Custom attack name
        demo_specific_attack(df, choice, limit=50, delay=0.3)
    else:
        # Default: Show mixed attacks with good variety
        demo_run_all_attacks(df.head(300), delay=0.3)
    
    print("\n💡 Tip: Open http://localhost:5173 to see dashboard update in real-time!")
