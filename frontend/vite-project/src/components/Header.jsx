import { Menu } from "lucide-react";

export default function Header({ toggleMenu }) {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-cyan-500/20 bg-black/60 backdrop-blur-xl">
      
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMenu}
          className="text-cyan-400 hover:text-cyan-300 transition"
        >
          <Menu size={24} />
        </button>

        <h1 className="text-lg font-bold tracking-widest text-cyan-400">
          ANOMALYX CONTROL PANEL
        </h1>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <span className="text-green-400 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-ping" />
          System Online
        </span>

        <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/40">
          Threat Level: HIGH
        </span>
      </div>
    </header>
  );
}
