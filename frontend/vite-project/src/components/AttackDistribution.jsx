import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function AttackDistribution() {
  const [distribution, setDistribution] = useState({});
  const [totalAttacks, setTotalAttacks] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial stats
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/stats");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log("Stats fetched:", data); // Debug log
        setDistribution(data.attack_distribution || {});
        setTotalAttacks(data.attack_count || 0);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setLoading(false);
      }
    };

    fetchStats();

    // Listen for real-time updates
    socket.on("stats_update", (data) => {
      console.log("Stats update received:", data); // Debug log
      setDistribution(data.attack_distribution || {});
      setTotalAttacks(data.attack_count || 0);
    });

    return () => socket.off("stats_update");
  }, []);

  // Color palette for different attack types
  const colors = {
    neptune: "#FFD700", // Gold - DoS
    mscan: "#FF8C00", // Dark Orange - Probe
    httptunnel: "#FF4444", // Red - R2L
    smurf: "#FF69B4", // Hot Pink - DoS
    ipsweep: "#9370DB", // Medium Purple - Probe
    normal: "#00FF00", // Green
    default: "#FF0000", // Red for unknown
  };

  const getColor = (attackType) => colors[attackType] || colors.default;

  // Calculate SVG pie chart
  const entries = Object.entries(distribution).filter(([_, count]) => count > 0);
  const total = Object.values(distribution).reduce((a, b) => a + b, 0) || 1;

  let currentAngle = 0;
  const slices = entries.map(([type, count]) => {
    const sliceAngle = (count / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;

    // Convert to radians
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    // Calculate path
    const radius = 80;
    const x1 = 100 + radius * Math.cos(startRad);
    const y1 = 100 + radius * Math.sin(startRad);
    const x2 = 100 + radius * Math.cos(endRad);
    const y2 = 100 + radius * Math.sin(endRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;
    const path = `M 100 100 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    currentAngle = endAngle;

    return { type, count, path, color: getColor(type), percentage: ((count / total) * 100).toFixed(1) };
  });

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-lg h-full flex flex-col">
      <h3 className="text-sm mb-4 text-cyan-300 font-semibold">🎯 Attack Distribution</h3>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-xs">
          Loading...
        </div>
      ) : entries.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-xs">
          No attacks yet - run simulator to see data
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4">
          {/* Pie Chart */}
          <div className="flex justify-center">
            <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-lg">
              {slices.map((slice, idx) => (
                <path
                  key={idx}
                  d={slice.path}
                  fill={slice.color}
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth="1"
                  className="hover:opacity-80 transition"
                />
              ))}
            </svg>
          </div>

          {/* Legend */}
          <div className="space-y-2 text-xs max-h-32 overflow-y-auto">
            {slices.map((slice, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: slice.color }}
                  ></div>
                  <span className="text-gray-300 truncate">{slice.type}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="font-mono text-cyan-300">{slice.count}</span>
                  <span className="text-gray-500">({slice.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>

          {/* Total Count */}
          <div className="border-t border-gray-700 pt-2 mt-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Total Attacks:</span>
              <span className="text-red-400 font-bold">{totalAttacks}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
