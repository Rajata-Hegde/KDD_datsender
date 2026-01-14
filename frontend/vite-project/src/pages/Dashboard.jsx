import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import ChatbotWidget from "../components/ChatbotWidget";
import AttackDistribution from "../components/AttackDistribution";
import AttackTypeInfo from "../components/AttackTypeInfo";
import MLFeaturesInfo from "../components/MLFeaturesInfo";

const socket = io("http://localhost:5000");

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    packets_per_sec: 0,
    active_sessions: 0,
    attack_count: 0,
    total_packets: 0,
  });

  useEffect(() => {
    // Fetch initial stats
    fetch("http://localhost:5000/api/stats")
      .then((res) => res.json())
      .then((data) => {
        setMetrics({
          packets_per_sec: data.packets_per_sec,
          active_sessions: data.active_sessions,
          attack_count: data.attack_count,
          total_packets: data.total_packets,
        });
      })
      .catch((err) => console.error("Error fetching stats:", err));

    // Listen for real-time stats updates
    socket.on("stats_update", (data) => {
      setMetrics({
        packets_per_sec: data.packets_per_sec,
        active_sessions: data.active_sessions,
        attack_count: data.attack_count,
        total_packets: data.total_packets,
      });
    });

    return () => socket.off("stats_update");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white p-6">
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-widest text-cyan-400">
          AI-BASED NETWORK INTRUSION MONITOR
        </h1>
        <span className="flex items-center gap-2 text-sm text-green-400">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-ping"></span>
          LIVE
        </span>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-12 gap-4 h-[85vh]">
        {/* LEFT - STATS & CHARTS */}
        <div className="col-span-3 flex flex-col gap-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-2">
            <LiveMetric
              label="Packets/sec"
              value={metrics.packets_per_sec}
            />
            <LiveMetric
              label="Total Packets"
              value={metrics.total_packets}
            />
            <LiveMetric
              label="Active Sessions"
              value={metrics.active_sessions}
            />
            <LiveMetric
              label="Attacks"
              value={metrics.attack_count}
              alert
            />
          </div>

          {/* Attack Distribution Pie Chart */}
          <AttackDistribution />
        </div>

        {/* CENTER - LIVE DATA */}
        <div className="col-span-6 flex flex-col gap-4">
          <div className="flex-1 rounded-2xl border border-cyan-500/30 bg-white/5 backdrop-blur-xl p-6 shadow-[0_0_30px_rgba(0,255,255,0.15)]">
            <h2 className="text-xl font-semibold text-cyan-300 mb-4">
              📊 Network Statistics
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <StatCard
                title="Detection Rate"
                value={
                  metrics.total_packets > 0
                    ? (
                        ((metrics.attack_count / metrics.total_packets) * 100).toFixed(
                          2
                        )
                      )
                    : "0"
                }
                unit="%"
                color="text-red-400"
              />
              <StatCard
                title="System Status"
                value="OPERATIONAL"
                unit=""
                color="text-green-400"
              />
            </div>

            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-sm text-gray-400 mb-3">Recent Activity</h3>
              <div className="space-y-2 text-xs text-gray-300">
                <div className="flex justify-between">
                  <span>Last Update:</span>
                  <span className="text-cyan-300">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Attack Categories Detected:</span>
                  <span className="text-yellow-300">DoS, Probe, R2L</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Confidence:</span>
                  <span className="text-green-300">85.3%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT - ATTACK LOGS */}
        <div className="col-span-3">
          <AttackTypeInfo />
        </div>

        <ChatbotWidget />
      </div>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

const LiveMetric = ({ label, value, alert }) => (
  <div
    className={`rounded-xl p-3 border ${
      alert
        ? "border-red-500/40 bg-red-500/10 text-red-400"
        : "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
    }`}
  >
    <p className="text-xs text-gray-400">{label}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

const StatCard = ({ title, value, unit, color }) => (
  <div className="rounded-lg border border-gray-700/50 bg-gray-800/20 p-4">
    <p className="text-xs text-gray-400 mb-2">{title}</p>
    <p className={`text-3xl font-bold ${color}`}>
      {value}
      <span className="text-lg">{unit}</span>
    </p>
  </div>
);
