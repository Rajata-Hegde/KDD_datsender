# 🛡️ Network Intrusion Detection System (IDS) - ML Edition

**An intelligent network security system using trained Machine Learning (Random Forest) to detect cyber attacks in real-time.**

---

## 📋 Project Overview

This is a **complete Intrusion Detection System** with:

### ✅ What It Does:
- **Detects network attacks** using a trained Random Forest ML model (94% accuracy)
- **Real-time monitoring** of network traffic with live dashboard
- **Interactive dashboard** showing attack statistics and distributions
- **4 attack categories**: DoS, Probe, R2L (Remote-to-Local), U2R (User-to-Root)
- **ML-powered classification** using 20 network features → confidence scores
- **Detailed logs** showing all 20 ML features used for each classification
- **ML Features page** explaining what the model analyzes

### ✅ What It Contains:

```
el-sem5/
├── backend/
│   ├── app.py                          # Flask API server
│   ├── config.py                       # Configuration
│   ├── demo_dataset_runner.py         # Demo script (feeds real KDD data)
│   ├── KDDTrain+.txt                  # Real attack dataset (41k samples)
│   ├── retrain_model.py               # Script to retrain ML model
│   ├── requirements.txt                # Python dependencies
│   ├── models/
│   │   ├── classifier.py              # ML classifier class
│   │   ├── random_forest_intrusion_model.pkl    # Trained model
│   │   ├── label_encoder.pkl          # Attack type encoder
│   │   ├── selected_features.pkl      # Feature list
│   │   └── *.ipynb                    # Training notebooks
│   ├── mqtt/
│   │   └── mqtt_subscriber.py         # MQTT listener
│   └── packet-sender/
│       └── traffic_simulator.py       # Simulates attacks (DoS, Probe, R2L, U2R)
├── frontend/
│   └── vite-project/
│       ├── package.json
│       ├── src/
│       │   ├── App.jsx                # Main React component
│       │   ├── components/
│       │   │   ├── Dashboard.jsx      # Main dashboard
│       │   │   ├── AttackDistribution.jsx
│       │   │   ├── MLFeaturesInfo.jsx  # ML features display
│       │   │   └── ...
│       │   └── pages/
│       │       ├── Dashboard.jsx      # Main page
│       │       ├── NetworkLogs.jsx    # Shows all 20 ML features
│       │       ├── MLFeatures.jsx     # ML explanation page
│       │       └── ...
│       └── tailwind.config.cjs
└── README.md                           # This file
```

---

## 🔧 Traffic Simulator vs Demo Runner

You have **2 ways** to test the system:

### Option 1: **demo_dataset_runner.py** (RECOMMENDED) ✅
```powershell
python demo_dataset_runner.py
```
- Feeds **real KDD dataset** (41,093 actual network samples)
- Shows **real attack patterns** with real data
- Better for demonstrations
- Perfect accuracy representation

### Option 2: **traffic_simulator.py** (Synthetic)
```powershell
python ..\packet-sender\traffic_simulator.py --attack dos_neptune --local
```
- **Generates synthetic** attack packets
- Useful for testing specific attack types
- Can control attack parameters
- Good for development/testing

#### What traffic_simulator.py Does:

**Simulates 5 types of attacks:**
1. **DoS Neptune** (SYN Flood) - Many connections, high error rates
2. **Probe Mscan** (Port Scan) - Scans multiple ports on target
3. **Probe IP Sweep** - Scans multiple targets
4. **R2L HTTPTunnel** - Unauthorized remote access
5. **Normal Traffic** - Legitimate connections

**Usage Examples:**

```powershell
# Simulate DoS attack for 20 seconds
python ..\packet-sender\traffic_simulator.py --attack dos_neptune --duration 20 --local

# Simulate port scan
python ..\packet-sender\traffic_simulator.py --attack probe_mscan --duration 30 --local

# Simulate mixed traffic (attacks + normal)
python ..\packet-sender\traffic_simulator.py --mixed --duration 60 --local

# All available attacks
python ..\packet-sender\traffic_simulator.py --list
```

**Examples:**

Send 100 packets:
```bash
python kdd_mqtt_sender.py --name "Office-1" --limit 100
```

Send 500 packets with slower speed:
```bash
python kdd_mqtt_sender.py --name "Branch-Office-A" --limit 500 --interval 0.5
```

Send all available data:
```bash
python kdd_mqtt_sender.py --name "Headquarters" --limit 22544
```

### Step 4: View Results

Open in your browser:
```
http://BACKEND_IP:5173
```



### "Failed to connect to MQTT broker"

**Solution 1:** Check internet connection
```bash
ping broker.hivemq.com
```

**Solution 2:** Try a different broker or interval
```bash
python kdd_mqtt_sender.py --name "Test" --limit 50 --interval 0.5
```







