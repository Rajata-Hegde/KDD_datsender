import { useState } from "react";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "👋 Hello! I’m your AI assistant. Ask me anything." }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages(prev => [
      ...prev,
      { role: "user", text: input },
      { role: "bot", text: "⚡ Processing your request..." }
    ]);
    setInput("");
  };

  return (
    <>
      {/* CHAT WINDOW */}
      {open && (
        <div
          className="fixed bottom-28 right-6 z-50
                     w-96 max-h-[70vh]
                     flex flex-col
                     rounded-2xl border border-cyan-400/30
                     bg-black/75 backdrop-blur-xl
                     shadow-[0_0_60px_rgba(0,255,255,0.35)]
                     animate-[fadeIn_0.35s_ease-out]"
        >
          {/* HEADER */}
          <div className="relative flex items-center justify-between px-4 py-3 border-b border-cyan-500/20">
            <h3 className="text-cyan-400 font-semibold tracking-widest text-xs">
              AI COMMAND INTERFACE
            </h3>

            <button
              onClick={() => setOpen(false)}
              className="text-cyan-400 hover:text-red-400 transition"
            >
              ✕
            </button>

            <span className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm scrollbar-thin scrollbar-thumb-cyan-500/20">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[78%] px-4 py-2 rounded-xl leading-relaxed
                    ${
                      m.role === "user"
                        ? "bg-cyan-500/20 text-cyan-200 border border-cyan-400/30"
                        : "bg-white/10 text-gray-200 border border-white/10"
                    }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div className="p-3 border-t border-cyan-500/20 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your query..."
              className="flex-1 bg-black/60 border border-cyan-500/30
                         rounded-lg px-3 py-2 text-white text-sm
                         focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
            <button
              onClick={sendMessage}
              className="px-4 rounded-lg bg-cyan-400 text-black
                         hover:bg-cyan-300 transition shadow"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* FLOATING AI CORE ICON */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50
                   h-16 w-16 flex items-center justify-center
                   rounded-xl
                   bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600
                   shadow-[0_0_50px_rgba(0,255,255,0.8)]
                   hover:scale-110 transition
                   animate-[pulseGlow_2.2s_infinite]"
        title="AI Assistant"
      >
        {/* inner core */}
        <div className="relative h-8 w-8 flex items-center justify-center">
          <span className="absolute inset-0 rounded-full border border-cyan-200/40 animate-ping" />
          <span className="text-xl">⚡</span>
        </div>

        {/* rotating scanner */}
        <span className="absolute inset-0 rounded-xl border border-cyan-300/30 animate-spinSlow" />
      </button>

      {/* CUSTOM ANIMATIONS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 30px rgba(0,255,255,0.6); }
          50% { box-shadow: 0 0 65px rgba(0,255,255,1); }
        }

        .animate-spinSlow {
          animation: spin 7s linear infinite;
        }
      `}</style>
    </>
  );
}
