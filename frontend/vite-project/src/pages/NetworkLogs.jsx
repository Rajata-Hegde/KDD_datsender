import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function NetworkLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    socket.on("network_logs", data => {
      setLogs(prev => [data, ...prev].slice(0, 100));
    });
  }, []);

  return (
    <div className="bg-[#050d10] text-[#00ffc8] p-4 rounded-lg">
      <h2 className="text-xl mb-4">Live Network Logs</h2>

      {logs.map((log, i) => (
        <div key={i} className="text-sm border-b border-gray-700 py-1">
          [{log.device}] {log.src_ip} → {log.dst_ip}
          ({log.protocol}) | {log.length} bytes
        </div>
      ))}
    </div>
  );
}
