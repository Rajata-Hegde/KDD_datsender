import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function NetworkLogs() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("all"); // all, attack, normal
  const [selectedLog, setSelectedLog] = useState(null); // For detailed view

  useEffect(() => {
    socket.on("network_logs", (data) => {
      setLogs((prev) => [data, ...prev].slice(0, 100));
    });

    return () => socket.off("network_logs");
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (filter === "all") return true;
    if (filter === "attack") return log.is_attack;
    if (filter === "normal") return !log.is_attack;
    return true;
  });

  const getRowColor = (log) => {
    if (!log.is_attack) return "bg-transparent hover:bg-green-500/5 border-green-500/20";
    return "bg-red-500/5 hover:bg-red-500/10 border-red-500/30";
  };

  const getTextColor = (log) => {
    if (!log.is_attack) return "text-green-400";
    return "text-red-400";
  };

  return (
    <div className="bg-[#050d10] text-[#00ffc8] p-6 rounded-2xl border border-cyan-500/30 shadow-[0_0_30px_rgba(0,255,255,0.15)]">
      {selectedLog ? (
        // Detailed View
        <DetailedLogView log={selectedLog} onBack={() => setSelectedLog(null)} />
      ) : (
        // List View
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Live Network Logs</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded text-xs font-semibold transition ${
                  filter === "all"
                    ? "bg-cyan-500/30 text-cyan-300"
                    : "bg-gray-700/30 text-gray-400 hover:bg-gray-600/30"
                }`}
              >
                All ({logs.length})
              </button>
              <button
                onClick={() => setFilter("attack")}
                className={`px-3 py-1 rounded text-xs font-semibold transition ${
                  filter === "attack"
                    ? "bg-red-500/30 text-red-300"
                    : "bg-gray-700/30 text-gray-400 hover:bg-gray-600/30"
                }`}
              >
                Attacks ({logs.filter((l) => l.is_attack).length})
              </button>
              <button
                onClick={() => setFilter("normal")}
                className={`px-3 py-1 rounded text-xs font-semibold transition ${
                  filter === "normal"
                    ? "bg-green-500/30 text-green-300"
                    : "bg-gray-700/30 text-gray-400 hover:bg-gray-600/30"
                }`}
              >
                Normal ({logs.filter((l) => !l.is_attack).length})
              </button>
            </div>
          </div>

          {/* Header Row */}
          <div className="grid grid-cols-12 gap-2 mb-2 text-xs font-semibold text-gray-400 border-b border-gray-700 pb-2">
            <div className="col-span-2">Time</div>
            <div className="col-span-2">Source IP</div>
            <div className="col-span-2">Dest IP</div>
            <div className="col-span-1">Protocol</div>
            <div className="col-span-1">Length</div>
            <div className="col-span-2">Attack Type</div>
            <div className="col-span-2">Confidence</div>
          </div>

          {/* Logs */}
          <div className="max-h-96 overflow-y-auto space-y-1">
            {filteredLogs.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-4">
                No logs to display
              </div>
            ) : (
              filteredLogs.map((log, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedLog(log)}
                  className={`grid grid-cols-12 gap-2 p-2 rounded border text-xs transition cursor-pointer ${getRowColor(
                    log
                  )}`}
                >
                  <div className="col-span-2 text-gray-400">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="col-span-2 font-mono text-xs truncate text-cyan-300">
                    {log.src_ip}
                  </div>
                  <div className="col-span-2 font-mono text-xs truncate text-cyan-300">
                    {log.dst_ip}
                  </div>
                  <div className="col-span-1 uppercase text-blue-300 font-semibold">
                    {log.protocol}
                  </div>
                  <div className="col-span-1 text-gray-300">{log.length}B</div>
                  <div className={`col-span-2 font-semibold ${getTextColor(log)}`}>
                    {log.is_attack ? log.attack_type.toUpperCase() : "NORMAL"}
                  </div>
                  <div className="col-span-2 flex items-center gap-1">
                    {log.is_attack ? (
                      <>
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-red-400 font-semibold">{log.confidence}%</span>
                      </>
                    ) : (
                      <>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        <span className="text-green-400 text-xs">Trusted</span>
                      </>
                    )}
                  </div>
                  <div className="col-span-12 text-right text-xs text-gray-500">
                    Click for details...
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Helper functions
function getRowColor(log) {
  if (!log.is_attack) return "bg-transparent hover:bg-green-500/5 border-green-500/20";
  return "bg-red-500/5 hover:bg-red-500/10 border-red-500/30";
}

function getTextColor(log) {
  if (!log.is_attack) return "text-green-400";
  return "text-red-400";
}

// Detailed Log View Component
function DetailedLogView({ log, onBack }) {
  const mlFeatures = log.ml_features || {};

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
      <button
        onClick={onBack}
        className="px-4 py-2 rounded text-sm font-semibold bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition"
      >
        ← Back to List
      </button>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-cyan-500/30 rounded p-4">
          <p className="text-gray-400 text-xs mb-1">Source IP</p>
          <p className="text-cyan-300 font-mono text-lg">{log.src_ip}</p>
        </div>
        <div className="border border-cyan-500/30 rounded p-4">
          <p className="text-gray-400 text-xs mb-1">Destination IP</p>
          <p className="text-cyan-300 font-mono text-lg">{log.dst_ip}</p>
        </div>
        <div className="border border-cyan-500/30 rounded p-4">
          <p className="text-gray-400 text-xs mb-1">Attack Type</p>
          <p className={`font-bold text-lg ${log.is_attack ? "text-red-400" : "text-green-400"}`}>
            {log.is_attack ? log.attack_type.toUpperCase() : "NORMAL"}
          </p>
        </div>
        <div className="border border-cyan-500/30 rounded p-4">
          <p className="text-gray-400 text-xs mb-1">ML Confidence</p>
          <p className={`font-bold text-lg ${log.is_attack ? "text-red-400" : "text-green-400"}`}>
            {log.confidence}%
          </p>
        </div>
      </div>

      {/* All 20 ML Features Used */}
      <div className="border border-purple-500/30 rounded p-4 bg-purple-500/5">
        <h3 className="text-purple-300 font-semibold mb-4 flex items-center gap-2">
          <span>🤖</span> ML Classification Features (20 features analyzed)
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(mlFeatures).length === 0 ? (
            <p className="text-gray-400 col-span-full">No ML features available</p>
          ) : (
            Object.entries(mlFeatures).map(([key, value], idx) => (
              <div key={idx} className="bg-black/60 border border-purple-700/50 rounded p-3 hover:border-purple-500/80 transition">
                <p className="text-gray-400 text-xs font-semibold mb-1 truncate">{key}</p>
                <p className="text-purple-300 font-mono text-sm font-bold">
                  {typeof value === "number" ? (value < 1 ? value.toFixed(4) : value.toFixed(2)) : value}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Additional Details */}
      <div className="border border-cyan-500/30 rounded p-4">
        <h3 className="text-cyan-300 font-semibold mb-3">Additional Information</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-400">Timestamp</p>
            <p className="text-cyan-300 font-mono">
              {new Date(log.timestamp).toLocaleTimeString()}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Protocol</p>
            <p className="text-cyan-300">{log.protocol}</p>
          </div>
          <div>
            <p className="text-gray-400">Packet Size</p>
            <p className="text-cyan-300">{log.length} bytes</p>
          </div>
          <div>
            <p className="text-gray-400">Service</p>
            <p className="text-cyan-300">{log.service || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-400">Attack Category</p>
            <p className="text-cyan-300">{log.attack_category || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-400">Detection Status</p>
            <p className={log.is_attack ? "text-red-400 font-bold" : "text-green-400"}>
              {log.is_attack ? "🔴 ATTACK" : "🟢 NORMAL"}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onBack}
        className="w-full px-4 py-2 rounded text-sm font-semibold bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition"
      >
        ← Back to List
      </button>
    </div>
  );
}
