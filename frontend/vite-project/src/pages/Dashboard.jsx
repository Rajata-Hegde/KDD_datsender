import ChatbotWidget from "../components/ChatbotWidget";

export default function Dashboard() {
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

        {/* LEFT - GRAPHS */}
        <div className="col-span-3 flex flex-col gap-4">
          <GlassCard title="Traffic Rate">
            <GraphPlaceholder />
          </GlassCard>

          <GlassCard title="Attack Distribution">
            <GraphPlaceholder />
          </GlassCard>

          <GlassCard title="Protocol Usage">
            <GraphPlaceholder />
          </GlassCard>
        </div>

        {/* CENTER - LIVE DATA */}
        <div className="col-span-6">
          <div className="h-full rounded-2xl border border-cyan-500/30 bg-white/5 backdrop-blur-xl p-6 shadow-[0_0_30px_rgba(0,255,255,0.15)]">
            <h2 className="text-xl font-semibold text-cyan-300 mb-4">
              Live Network Stream
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <LiveMetric label="Packets/sec" value="1245" />
              <LiveMetric label="Active Sessions" value="87" />
              <LiveMetric label="Detected Attacks" value="3" alert />
              <LiveMetric label="Latency (ms)" value="42" />
            </div>

            <div className="mt-6 h-[45%] rounded-xl border border-dashed border-cyan-400/40 flex items-center justify-center text-cyan-400">
              🔴 Real-time visualization canvas
            </div>
          </div>
        </div>

        {/* RIGHT - LOGS */}
        <div className="col-span-3">
          <div className="h-full rounded-2xl border border-red-500/30 bg-black/40 backdrop-blur-xl p-4 overflow-y-auto shadow-[0_0_25px_rgba(255,0,0,0.15)]">
            <h2 className="text-lg font-semibold text-red-400 mb-3">
              Intrusion Logs
            </h2>

            <Log message="Normal traffic detected" />
            <Log message="Port scan attempt detected" alert />
            <Log message="SYN flood anomaly flagged" alert />
            <Log message="Session normalized" />
            <Log message="Zero-day pattern suspected" alert />
          </div>
        </div>
 <ChatbotWidget/>
      </div>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

const GlassCard = ({ title, children }) => (
  <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 shadow-lg">
    <h3 className="text-sm mb-2 text-cyan-300">{title}</h3>
    {children}
  </div>
);

const GraphPlaceholder = () => (
  <div className="h-28 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/10 animate-pulse flex items-center justify-center text-xs text-cyan-300">
    Graph renders here
  </div>
);

const LiveMetric = ({ label, value, alert }) => (
  <div className={`rounded-xl p-4 border ${
    alert
      ? "border-red-500/40 bg-red-500/10 text-red-400"
      : "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
  }`}>
    <p className="text-xs">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const Log = ({ message, alert }) => (
  <div className={`mb-2 rounded-lg p-2 text-xs ${
    alert
      ? "bg-red-500/10 text-red-400 border-l-4 border-red-500"
      : "bg-green-500/10 text-green-400 border-l-4 border-green-500"
  }`}>
    {message}
  </div>
);
