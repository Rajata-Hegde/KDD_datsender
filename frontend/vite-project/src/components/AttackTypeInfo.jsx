import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function AttackTypeInfo() {
  const [attacks, setAttacks] = useState([]);

  useEffect(() => {
    socket.on("network_logs", (data) => {
      if (data.is_attack) {
        setAttacks((prev) => [data, ...prev].slice(0, 20)); // Keep last 20 attacks
      }
    });

    return () => socket.off("network_logs");
  }, []);

  const getAttackColor = (attackType) => {
    const colors = {
      normal: "text-green-400",
      neptune: "text-yellow-400",
      mscan: "text-orange-400",
      httptunnel: "text-red-500",
      smurf: "text-pink-400",
      ipsweep: "text-purple-400",
    };
    return colors[attackType] || "text-red-400";
  };

  const getAttackEmoji = (category) => {
    const emojis = {
      DoS: "🌊",
      Probe: "🔍",
      R2L: "🚪",
      U2R: "👑",
      Unknown: "❓",
      normal: "✓",
    };
    return emojis[category] || "⚠️";
  };

  return (
    <div className="rounded-2xl border border-red-500/30 bg-black/40 backdrop-blur-xl p-4 overflow-y-auto shadow-[0_0_25px_rgba(255,0,0,0.15)] h-full">
      <h2 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
        <span className="animate-pulse text-red-500">●</span>
        Detected Attacks
      </h2>

      <div className="space-y-2">
        {attacks.length === 0 ? (
          <div className="text-gray-400 text-xs italic text-center py-4">
            No attacks detected yet...
          </div>
        ) : (
          attacks.map((attack, idx) => (
            <div
              key={idx}
              className="bg-red-500/5 border-l-4 border-red-500 p-3 rounded text-xs hover:bg-red-500/10 transition"
            >
              {/* Header with emoji and attack type */}
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold flex items-center gap-2">
                  <span className="text-lg">
                    {getAttackEmoji(attack.attack_category)}
                  </span>
                  <span className={getAttackColor(attack.attack_type)}>
                    {attack.attack_type.toUpperCase()}
                  </span>
                </span>
                <span className="text-red-300 font-bold">
                  {attack.confidence}%
                </span>
              </div>

              {/* IP addresses and protocol */}
              <div className="text-gray-300 text-xs mb-1">
                <div className="truncate">
                  🔗 {attack.src_ip} → {attack.dst_ip}
                </div>
                <div className="text-gray-400">
                  📡 {attack.protocol} | {attack.length} bytes
                </div>
              </div>

              {/* Timestamp */}
              <div className="text-gray-500 text-xs">
                🕐 {new Date(attack.timestamp).toLocaleTimeString()}
              </div>

              {/* Category badge */}
              <div className="mt-2">
                <span className="inline-block bg-red-900/40 text-red-200 px-2 py-1 rounded text-xs border border-red-700/30">
                  {attack.attack_category}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
