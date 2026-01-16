
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

**Key Features:**
- ✅ Generates packets with realistic values
- ✅ Can send via MQTT or local HTTP
- ✅ Configurable packet rate and duration
- ✅ Good for testing ML model on synthetic data

---



**Recommendation:** Use `demo_dataset_runner.py` for teacher demos. Use `traffic_simulator.py` for development testing.

---

## 🤖 How The ML Model Works

### Training Data:
- **41,093 network samples** from KDD dataset
- **20 selected features** (flow patterns, error rates, timing)
- **Real attacks** labeled with attack types

### The Model:
- **Algorithm**: Random Forest (200 trees)
- **Accuracy**: ~94% on test data
- **Trains on**: DoS, Probe, R2L, U2R, Normal traffic
- **Output**: Attack type + confidence score

### Features Used:
```
src_bytes, dst_bytes, duration, protocol_type, service, flag,
count, srv_count, serror_rate, srv_serror_rate, rerror_rate,
same_srv_rate, diff_srv_rate, dst_host_count, dst_host_serror_rate,
dst_host_same_srv_rate, dst_host_diff_srv_rate, ...
```

---

## 🚀 How to Run

### Prerequisites:
- Python 3.8+ installed
- Node.js 16+ (for frontend)
- pip package manager

### Step 1: Install Dependencies

**Backend:**
```powershell
cd backend
pip install -r requirements.txt
```

**Frontend:**
```powershell
cd frontend\vite-project
npm install
```

---

### Step 2: Start Backend (Flask API)

**Terminal 1:**
```powershell
cd backend
python app.py
```

**You should see:**
```
✅ Loaded pipeline model from: random_forest_intrusion_model.pkl
✅ Loaded label encoder
✅ Loaded selected features
✅ ML MODEL LOADED SUCCESSFULLY!
 * Running on http://0.0.0.0:5000
```

✅ **Backend is ready!**

---

### Step 3: Start Frontend (React Dashboard)

**Terminal 2:**
```powershell
cd frontend\vite-project
npm run dev
```

**You should see:**
```
VITE v... ready in ... ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

✅ **Open browser to:** `http://localhost:5173`

---

### Step 4: Feed Real Attack Data (Demo)

**Terminal 3:**
```powershell
cd backend
python demo_dataset_runner.py
```

**This will:**
1. Load real KDD dataset samples
2. Send them through the trained ML model
3. Show predictions on dashboard
4. Display confidence scores

**Select option 1** for diverse attacks, or specific attack type.

---

## 📊 What You'll See

### Dashboard Shows:
✅ **Real-time statistics:**
- Total packets analyzed
- Attack count
- Attack distribution (DoS, Probe, R2L, U2R)
- Packets per second

✅ **Attack types detected:**
- **DoS** (neptune, back, land, smurf, teardrop)
- **Probe** (nmap, ipsweep, portsweep, mscan)
- **R2L** (httptunnel, ftp_write, imap, guess_passwd)
- **U2R** (buffer_overflow, rootkit, shellcode)
- **Normal** traffic

✅ **For each attack:**
- Attack type (from trained model)
- Confidence score (85-98%)
- Source/Destination IPs
- Timestamp

✅ **Network Logs (Click any entry):**
- Shows all **20 ML features** used for classification
- Detailed packet information
- ML analysis breakdown

✅ **ML Features Page (Sidebar):**
- Explains all 20 features the model uses
- How each feature detects attacks
- Model accuracy & training info

---


## 📚 Understanding Attack Types

### 🔴 **DoS (Denial of Service)**
- Attacks that crash/overload servers
- Examples: neptune, smurf, back
- **ML detects:** High error rates + many connections

### 🟠 **Probe (Scanning)**
- Attackers scan network for vulnerabilities
- Examples: nmap, ipsweep, portsweep
- **ML detects:** Multiple connections from same source

### 🟡 **R2L (Remote-to-Local)**
- Attacker gains access to normal user account
- Examples: httptunnel, ftp_write, imap
- **ML detects:** Unusual traffic patterns

### 🟢 **U2R (User-to-Root)**
- Normal user becomes system administrator
- Examples: buffer_overflow, rootkit, shellcode
- **ML detects:** Suspicious system calls

---

## 🧠 ML Model Training

To retrain the model with new data:

```powershell
cd backend
python retrain_model.py
```

This:
1. Loads KDD dataset (41k samples)
2. Trains Random Forest
3. Saves new `.pkl` files
4. Takes 2-5 minutes

---


---

## 🏗️ Architecture

```
KDD Dataset → Trained Random Forest Model → Classification
    ↓
Features (20) → OneHot Encode (categorical) → Scale/Normalize
    ↓
Prediction: Attack Type + Confidence Score
    ↓
Flask API → WebSocket → React Dashboard → Real-time Visualization
```

---




## 💡 For Teachers/Presentations

### Quick Demo (5 minutes):
1. Start backend (Terminal 1): `python app.py`
2. Start frontend (Terminal 2): `npm run dev`
3. Run demo (Terminal 3): `python demo_dataset_runner.py` → Select option 1
4. Show real attacks being detected with ML confidence





## 📦 Dependencies

**Backend:**
- Flask - Web server
- Flask-SocketIO - Real-time communication
- scikit-learn - ML model training/inference
- pandas - Data processing
- paho-mqtt - MQTT protocol
- joblib - Model serialization

**Frontend:**
- React - UI framework
- Vite - Build tool
- Tailwind CSS - Styling
- Socket.IO - Real-time updates

---


