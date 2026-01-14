import React from "react";

export default function MLFeaturesInfo() {
  const features = [
    { name: "src_bytes", description: "Source bytes sent", category: "Traffic" },
    { name: "dst_bytes", description: "Destination bytes received", category: "Traffic" },
    { name: "protocol_type", description: "Network protocol (TCP/UDP/ICMP)", category: "Network" },
    { name: "service", description: "Service type (http, ftp, etc)", category: "Network" },
    { name: "flag", description: "Connection flags (S0, S1, SF, etc)", category: "Network" },
    { name: "count", description: "Number of connections to host", category: "Flow" },
    { name: "srv_count", description: "Connections to same service", category: "Flow" },
    { name: "serror_rate", description: "Error rate of connections", category: "Error" },
    { name: "srv_serror_rate", description: "Error rate same service", category: "Error" },
    { name: "rerror_rate", description: "Rejected connection rate", category: "Error" },
    { name: "same_srv_rate", description: "Percentage of connections to same service", category: "Rate" },
    { name: "diff_srv_rate", description: "Percentage of connections to different services", category: "Rate" },
    { name: "dst_host_count", description: "Connections to destination host", category: "Destination" },
    { name: "dst_host_serror_rate", description: "Destination error rate", category: "Destination" },
    { name: "dst_host_same_srv_rate", description: "Destination same service rate", category: "Destination" },
    { name: "dst_host_diff_srv_rate", description: "Destination different service rate", category: "Destination" },
    { name: "dst_host_same_src_port_rate", description: "Destination same source port rate", category: "Destination" },
    { name: "dst_host_srv_count", description: "Connections to destination service", category: "Destination" },
    { name: "dst_host_rerror_rate", description: "Destination rejected connection rate", category: "Destination" },
    { name: "duration", description: "Length of connection in seconds", category: "Time" },
  ];

  const categories = [
    { name: "Traffic", color: "bg-blue-500/20 border-blue-500/50 text-blue-300", emoji: "📊" },
    { name: "Network", color: "bg-purple-500/20 border-purple-500/50 text-purple-300", emoji: "🔗" },
    { name: "Flow", color: "bg-cyan-500/20 border-cyan-500/50 text-cyan-300", emoji: "💫" },
    { name: "Error", color: "bg-red-500/20 border-red-500/50 text-red-300", emoji: "⚠️" },
    { name: "Rate", color: "bg-yellow-500/20 border-yellow-500/50 text-yellow-300", emoji: "📈" },
    { name: "Destination", color: "bg-green-500/20 border-green-500/50 text-green-300", emoji: "🎯" },
    { name: "Time", color: "bg-pink-500/20 border-pink-500/50 text-pink-300", emoji: "⏱️" },
  ];

  const getCategoryStyle = (cat) => {
    return categories.find((c) => c.name === cat) || categories[0];
  };

  const getCategoryEmoji = (cat) => {
    return getCategoryStyle(cat).emoji;
  };

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-white/5 backdrop-blur-xl p-6 shadow-[0_0_30px_rgba(0,255,255,0.15)]">
      <h2 className="text-2xl font-bold text-cyan-300 mb-2 flex items-center gap-2">
        <span>🤖</span> ML Classification Features
      </h2>
      <p className="text-gray-400 text-sm mb-6">
        The trained Random Forest model analyzes these <strong>20 features</strong> to detect attacks
      </p>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {features.map((feature, idx) => {
          const categoryStyle = getCategoryStyle(feature.category);
          return (
            <div
              key={idx}
              className={`border rounded-lg p-3 transition hover:scale-105 ${categoryStyle.color} border-opacity-50`}
            >
              <div className="flex items-start justify-between mb-1">
                <span className="font-semibold text-sm">{feature.name}</span>
                <span className="text-lg">{getCategoryEmoji(feature.category)}</span>
              </div>
              <p className="text-xs text-gray-300">{feature.description}</p>
              <div className="mt-2">
                <span className="inline-block text-xs px-2 py-1 rounded bg-black/30 text-gray-300">
                  {feature.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="border-t border-gray-700 pt-4 mt-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">📂 Feature Categories:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {categories.map((cat, idx) => (
            <div key={idx} className={`border rounded p-2 text-xs ${cat.color}`}>
              <span>{cat.emoji} {cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="border-t border-gray-700 pt-4 mt-4">
        <h3 className="text-sm font-semibold text-cyan-300 mb-2">🧠 How Classification Works:</h3>
        <ol className="text-xs text-gray-300 space-y-1">
          <li><strong>1. Extract Features:</strong> 20 network metrics from captured packets</li>
          <li><strong>2. ML Processing:</strong> Random Forest analyzes patterns in features</li>
          <li><strong>3. Predict:</strong> Identifies attack type (DoS, Probe, R2L, U2R, Normal)</li>
          <li><strong>4. Confidence:</strong> Returns confidence score (85-98%)</li>
          <li><strong>5. Display:</strong> Shows results on dashboard in real-time</li>
        </ol>
      </div>

      {/* Model Info */}
      <div className="border-t border-gray-700 pt-4 mt-4">
        <h3 className="text-sm font-semibold text-cyan-300 mb-2">📊 Model Details:</h3>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
          <div>
            <span className="text-gray-400">Training Samples:</span>
            <div className="text-cyan-300 font-bold">41,093</div>
          </div>
          <div>
            <span className="text-gray-400">Accuracy:</span>
            <div className="text-cyan-300 font-bold">~94%</div>
          </div>
          <div>
            <span className="text-gray-400">Algorithm:</span>
            <div className="text-cyan-300 font-bold">Random Forest</div>
          </div>
          <div>
            <span className="text-gray-400">Trees:</span>
            <div className="text-cyan-300 font-bold">200</div>
          </div>
        </div>
      </div>
    </div>
  );
}
