"""
Malicious Traffic Simulator for IDS Testing
Simulates different types of network attacks (DoS, Probe, R2L, U2R)
"""
import json
import paho.mqtt.client as mqtt
import time
import random
from datetime import datetime
import argparse
import requests

# MQTT Configuration
MQTT_BROKER = "broker.hivemq.com"
MQTT_PORT = 1883
MQTT_TOPIC = "nids/live_packets"

# Backend API Configuration
BACKEND_URL = "http://localhost:5000/api/inject-packet"

# Device identifier for simulation
SIMULATOR_DEVICE = "Attacker-Simulator"

# Predefined attack scenarios
ATTACK_SCENARIOS = {
    "dos_neptune": {
        "name": "DoS - Neptune (SYN Flood)",
        "attack_type": "neptune",
        "src_ips": ["192.168.1.100", "192.168.1.101", "192.168.1.102"],
        "dst_ips": ["10.0.0.1", "10.0.0.2"],
        "protocol": "TCP",
        "packet_count": (10, 50),  # packets per burst
        "srv_count": (15, 40),
        "serror_rate": (0.6, 0.95),
        "src_bytes": (0, 50),
        "dst_bytes": (100, 500),
    },
    "probe_mscan": {
        "name": "Probe - Mscan (Port Scan)",
        "attack_type": "mscan",
        "src_ips": ["192.168.1.50"],
        "dst_ips": ["10.0.0.0", "10.0.0.1", "10.0.0.2", "10.0.0.3", "10.0.0.4"],
        "protocol": "TCP",
        "packet_count": (1, 5),
        "srv_count": (20, 50),
        "serror_rate": (0.3, 0.6),
        "src_bytes": (10, 100),
        "dst_bytes": (50, 300),
    },
    "r2l_httptunnel": {
        "name": "R2L - HTTP Tunnel (Unauthorized Access)",
        "attack_type": "httptunnel",
        "src_ips": ["203.0.113.0", "203.0.113.1"],
        "dst_ips": ["10.0.0.1"],
        "protocol": "TCP",
        "packet_count": (2, 8),
        "srv_count": (1, 3),
        "serror_rate": (0.1, 0.3),
        "src_bytes": (100, 500),
        "dst_bytes": (1000, 5000),
    },
    "probe_ipsweep": {
        "name": "Probe - IP Sweep",
        "attack_type": "ipsweep",
        "src_ips": ["192.168.1.99"],
        "dst_ips": ["10.0.0.1", "10.0.0.2", "10.0.0.3"],
        "protocol": "ICMP",
        "packet_count": (1, 3),
        "srv_count": (5, 15),
        "serror_rate": (0.2, 0.5),
        "src_bytes": (0, 100),
        "dst_bytes": (0, 100),
    },
    "normal": {
        "name": "Normal Traffic",
        "attack_type": "normal",
        "src_ips": ["192.168.1.10", "192.168.1.11", "192.168.1.12"],
        "dst_ips": ["10.0.0.1", "8.8.8.8"],
        "protocol": "TCP",
        "packet_count": (1, 3),
        "srv_count": (1, 5),
        "serror_rate": (0.0, 0.05),
        "src_bytes": (100, 500),
        "dst_bytes": (500, 2000),
    },
}

class MaliciousTrafficSimulator:
    def __init__(self, broker=MQTT_BROKER, port=MQTT_PORT, local_mode=False):
        self.broker = broker
        self.port = port
        self.connected = False
        self.local_mode = local_mode  # Offline mode without MQTT
        
        if not local_mode:
            self.client = mqtt.Client()
            # Set callbacks
            self.client.on_connect = self._on_connect
            self.client.on_disconnect = self._on_disconnect
        else:
            self.client = None
            print(f"[{self._timestamp()}] 🔧 Local mode enabled (no MQTT needed)")
        
    def _on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            self.connected = True
            print(f"[{self._timestamp()}] ✓ Connected to MQTT broker: {self.broker}")
        else:
            print(f"[{self._timestamp()}] ✗ Failed to connect (code {rc})")
    
    def _on_disconnect(self, client, userdata, rc):
        self.connected = False
        if rc != 0:
            print(f"[{self._timestamp()}] ✗ Unexpected disconnection")
    
    def connect(self, timeout=5):
        """Connect to MQTT broker with timeout"""
        if self.local_mode:
            self.connected = True
            return True
        
        try:
            print(f"[{self._timestamp()}] Connecting to MQTT broker: {self.broker}:{self.port}...")
            self.client.connect(self.broker, self.port, timeout)
            self.client.loop_start()
            time.sleep(1)  # Give it time to connect
            return self.connected
        except Exception as e:
            print(f"[{self._timestamp()}] ✗ Connection error: {e}")
            print(f"[{self._timestamp()}] 💡 Tip: Run with --local flag to simulate without MQTT:")
            print(f"       python traffic_simulator.py --attack dos_neptune --local")
            return False
    
    def disconnect(self):
        """Disconnect from MQTT broker"""
        if not self.local_mode and self.client:
            self.client.disconnect()
            self.client.loop_stop()
    
    def simulate_attack(self, scenario_type, duration=10, packet_interval=0.5):
        """Simulate an attack scenario"""
        if scenario_type not in ATTACK_SCENARIOS:
            print(f"Unknown scenario: {scenario_type}")
            return
        
        scenario = ATTACK_SCENARIOS[scenario_type]
        print(f"\n{'='*80}")
        print(f"🔴 Simulating: {scenario['name']}")
        print(f"Duration: {duration}s | Packet interval: {packet_interval}s")
        print(f"{'='*80}\n")
        
        start_time = time.time()
        packet_num = 0
        
        try:
            while time.time() - start_time < duration:
                # Generate packet
                packet_data = self._generate_attack_packet(scenario)
                
                # Publish to MQTT or HTTP (local mode)
                if self.connected or self.local_mode:
                    if self.local_mode:
                        # Send via HTTP to backend
                        self._send_via_http(packet_data)
                    else:
                        # Send via MQTT
                        self.client.publish(MQTT_TOPIC, json.dumps(packet_data))
                    packet_num += 1
                    
                    # Print packet info
                    attack_type = scenario['attack_type'].upper()
                    mode = "(Local)" if self.local_mode else ""
                    print(f"[{packet_data['timestamp'].split('T')[1][:8]}] "
                          f"Sent: {packet_data['src_ip']:15} → {packet_data['dst_ip']:15} | "
                          f"{attack_type:15} | {packet_data['length']} bytes {mode}")
                else:
                    print("[WARNING] Not connected to MQTT broker")
                    break
                
                time.sleep(packet_interval)
        
        except KeyboardInterrupt:
            print("\n\nSimulation interrupted by user")
        
        print(f"\n✓ Simulation complete! Sent {packet_num} packets")
    
    def simulate_mixed_traffic(self, duration=60, attacks_per_minute=5):
        """Simulate mixed traffic with some attacks"""
        print(f"\n{'='*80}")
        print(f"🎯 Simulating Mixed Network Traffic")
        print(f"Duration: {duration}s | Attacks per minute: {attacks_per_minute}")
        print(f"{'='*80}\n")
        
        start_time = time.time()
        packet_num = 0
        attack_scenario_types = [k for k in ATTACK_SCENARIOS.keys() if k != "normal"]
        
        try:
            while time.time() - start_time < duration:
                # Decide if this should be attack or normal
                random_val = random.random()
                if random_val < (attacks_per_minute / 60):  # Probability of attack
                    scenario_type = random.choice(attack_scenario_types)
                else:
                    scenario_type = "normal"
                
                scenario = ATTACK_SCENARIOS[scenario_type]
                packet_data = self._generate_attack_packet(scenario)
                
                if self.connected or self.local_mode:
                    if self.local_mode:
                        # Send via HTTP to backend
                        self._send_via_http(packet_data)
                    else:
                        # Send via MQTT
                        self.client.publish(MQTT_TOPIC, json.dumps(packet_data))
                    packet_num += 1
                    
                    mode = "(Local)" if self.local_mode else ""
                    status = "🔴 ATTACK" if scenario_type != "normal" else "🟢 NORMAL"
                    print(f"[{packet_data['timestamp'].split('T')[1][:8]}] {status} | "
                          f"{packet_data['src_ip']:15} → {packet_data['dst_ip']:15} | "
                          f"{scenario['attack_type']:12} {mode}")
                
                time.sleep(random.uniform(0.1, 0.5))
        
        except KeyboardInterrupt:
            print("\n\nSimulation interrupted by user")
        
        print(f"\n✓ Simulation complete! Sent {packet_num} packets")
    
    def _send_via_http(self, packet_data):
        """Send packet data to backend via HTTP"""
        try:
            response = requests.post(BACKEND_URL, json=packet_data, timeout=5)
            if response.status_code != 200:
                print(f"Warning: Backend returned {response.status_code}")
        except requests.exceptions.ConnectionError:
            print(f"Error: Cannot connect to backend at {BACKEND_URL}")
            print(f"Make sure backend is running: python app.py")
        except Exception as e:
            print(f"Error sending via HTTP: {e}")
    
    def _generate_attack_packet(self, scenario):
        """Generate a single attack packet from scenario"""
        return {
            "device": SIMULATOR_DEVICE,
            "src_ip": random.choice(scenario["src_ips"]),
            "dst_ip": random.choice(scenario["dst_ips"]),
            "protocol": scenario["protocol"],
            "length": random.randint(scenario["src_bytes"][0], scenario["src_bytes"][1]) + 
                     random.randint(scenario["dst_bytes"][0], scenario["dst_bytes"][1]),
            "src_bytes": random.randint(scenario["src_bytes"][0], scenario["src_bytes"][1]),
            "dst_bytes": random.randint(scenario["dst_bytes"][0], scenario["dst_bytes"][1]),
            "packet_count": random.randint(scenario["packet_count"][0], scenario["packet_count"][1]),
            "srv_count": random.randint(scenario["srv_count"][0], scenario["srv_count"][1]),
            "serror_rate": random.uniform(scenario["serror_rate"][0], scenario["serror_rate"][1]),
            "timestamp": datetime.now().isoformat()
        }
    
    @staticmethod
    def _timestamp():
        return datetime.now().strftime("%H:%M:%S")

def main():
    parser = argparse.ArgumentParser(
        description="Malicious Traffic Simulator for IDS Testing",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Simulate DoS attack for 30 seconds
  python traffic_simulator.py --attack dos_neptune --duration 30
  
  # Simulate port scan attack
  python traffic_simulator.py --attack probe_mscan --duration 10
  
  # Simulate mixed traffic with 10 attacks per minute for 60 seconds
  python traffic_simulator.py --mixed --duration 60 --attacks 10
  
  # Simulate without MQTT (local mode) - no broker needed!
  python traffic_simulator.py --attack dos_neptune --duration 30 --local
  python traffic_simulator.py --mixed --duration 60 --local
  
  # List available attacks
  python traffic_simulator.py --list
        """
    )
    
    parser.add_argument("--list", action="store_true", help="List available attack scenarios")
    parser.add_argument("--attack", type=str, help="Attack scenario to simulate")
    parser.add_argument("--mixed", action="store_true", help="Simulate mixed traffic with random attacks")
    parser.add_argument("--duration", type=int, default=30, help="Duration of simulation in seconds")
    parser.add_argument("--interval", type=float, default=0.5, help="Packet interval in seconds (for single attack)")
    parser.add_argument("--attacks", type=int, default=5, help="Attacks per minute (for mixed traffic)")
    parser.add_argument("--broker", type=str, default=MQTT_BROKER, help="MQTT broker address")
    parser.add_argument("--local", action="store_true", help="Use local mode (no MQTT needed)")
    
    args = parser.parse_args()
    
    # Create simulator
    simulator = MaliciousTrafficSimulator(broker=args.broker, local_mode=args.local)
    
    # List attacks if requested
    if args.list:
        print("\n📋 Available Attack Scenarios:\n")
        for key, scenario in ATTACK_SCENARIOS.items():
            print(f"  {key:20} → {scenario['name']}")
        print()
        return
    
    # Connect to broker
    if not simulator.connect():
        print("Failed to connect to MQTT broker. Exiting.")
        return
    
    try:
        # Run simulation
        if args.mixed:
            simulator.simulate_mixed_traffic(duration=args.duration, attacks_per_minute=args.attacks)
        elif args.attack:
            simulator.simulate_attack(args.attack, duration=args.duration, packet_interval=args.interval)
        else:
            print("Please specify --attack or --mixed. Use --help for more info.")
    finally:
        simulator.disconnect()

if __name__ == "__main__":
    main()
