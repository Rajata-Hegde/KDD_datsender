# IDS Client Setup - For Data Senders

## Quick Start (For Other Computers)

You need to send network intrusion detection data to the central IDS system.

### Prerequisites

- Python 3.7+ installed
- Internet connection (to reach MQTT broker)

### Step 1: Install Required Packages

```bash
pip install paho-mqtt pandas
```

### Step 2: Get the Files

Copy these files to your computer:
- `kdd_mqtt_sender.py` - The sender script
- `KDDTest-21.txt` - Test dataset

### Step 3: Run the Sender

**Basic usage:**
```bash
python kdd_mqtt_sender.py --name "YourComputerName"
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







