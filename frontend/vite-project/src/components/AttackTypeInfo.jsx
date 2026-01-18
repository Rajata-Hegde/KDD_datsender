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
      DoS: "",
      Probe: "",
      R2L: "",
      U2R: "",
      Unknown: "",
      normal: "",
    };
    return emojis[category] || "";
  };

  return (
    <div 
      className="rounded-2xl border border-red-500/30 bg-black/40 backdrop-blur-xl p-4 shadow-[0_0_25px_rgba(255,0,0,0.15)]"
      style={{ 
        height: '100%',      // Fill the grid cell
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative', // Necessary for the absolute inner container
        minHeight: '400px'    // Adjust this to match your Pie Chart's height
      }}
    >
      <style>{`
        .scroll-area {
          position: absolute;
          top: 60px;          /* Space for the header */
          left: 16px;         /* Match parent padding */
          right: 16px;        /* Match parent padding */
          bottom: 16px;       /* Match parent padding */
          overflow-y: auto;   /* FORCES THE SCROLLBAR */
          overflow-x: hidden;
        }
        .scroll-area::-webkit-scrollbar {
          width: 6px;
        }
        .scroll-area::-webkit-scrollbar-track {
          background: rgba(255, 0, 0, 0.05);
        }
        .scroll-area::-webkit-scrollbar-thumb {
          background: rgba(255, 0, 0, 0.4);
          border-radius: 10px;
        }
      `}</style>
      
      <h2 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
        <span className="animate-pulse text-red-500">●</span>
        Detected Attacks
      </h2>

      {/* This container is locked to the edges of the card */}
      <div className="scroll-area">
        <div className="flex flex-col gap-2">
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
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-bold ${getAttackColor(attack.attack_type)}`}>
                    {attack.attack_type.toUpperCase()}
                  </span>
                  <span className="text-gray-500 text-[10px]">
                    {new Date(attack.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-gray-300 font-mono text-[11px]">
                  {attack.src_ip} → {attack.dst_ip}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-400 text-[10px]">
                    {attack.protocol} | {attack.length} B
                  </span>
                  <span className="bg-red-900/40 text-red-200 px-2 py-0.5 rounded text-[9px] border border-red-700/30">
                    {attack.attack_category}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

