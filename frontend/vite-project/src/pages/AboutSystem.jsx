import React, { useState, useEffect, useRef } from 'react';

export default function AboutSystem() {
  const [text, setText] = useState("");
  const [showTeam, setShowTeam] = useState(false);
  const canvasRef = useRef(null);

  // 1. CRAZY INTERACTIVE NETWORK BACKGROUND
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => { mouse.x = e.x; mouse.y = e.y; });
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
        this.color = '#06b6d4';
      }
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
      update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
          this.x -= directionX;
          this.y -= directionY;
          this.color = '#ef4444'; 
        } else {
          this.color = '#06b6d4';
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 10;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 10;
          }
        }
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < 150; i++) particles.push(new Particle());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update();
        for (let j = i; j < particles.length; j++) {
          let dx = particles[i].x - particles[j].x;
          let dy = particles[i].y - particles[j].y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            ctx.strokeStyle = distance < 50 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(6, 182, 212, 0.1)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    };
    init();
    animate();
    return () => window.removeEventListener('resize', resize);
  }, []);

  // 2. TYPING EFFECT
  const fullDescription = `> INITIALIZING SDG-9 PROTOCOL...
> LOADING NEURAL ENGINE: SimpleNN [128-64-5]
> DATA SOURCE: NSL-KDD (AUGMENTED VIA SMOTE/GAN)
> HARDWARE: ESP32 REAL-TIME CAPTURE NODE
> STATUS: DEFENSIVE AI ACTIVE
> MISSION: SECURING INDUSTRIAL INFRASTRUCTURE...`;

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setText(fullDescription.slice(0, i));
      i++;
      if (i > fullDescription.length) {
        clearInterval(timer);
        setTimeout(() => setShowTeam(true), 500);
      }
    }, 20);
    return () => clearInterval(timer);
  }, []);

  const team = [
    { name: "Nikita S Raj Kapini", usn: "1RV23CS155", role: "Machine Learning" },
    { name: "Rajata M Hegde", usn: "1RV23IS098", role: "Artificial Intelligence" },
    { name: "Navya G Hebbar", usn: "1RV24CD403", role: "FullStack" },
    { name: "M. Muzammil Choudhari", usn: "1RV24CS412", role: "Frontend" }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-cyan-500 font-mono p-4 lg:p-8 overflow-hidden relative selection:bg-cyan-500 selection:text-black">
      
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* TOP HEADER */}
      <div className="relative z-30 flex justify-between items-center mb-10 border-b border-cyan-500/20 pb-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
            <h1 className="text-5xl font-black italic tracking-tighter text-white animate-pulse">SDG 9</h1>
            <div className="bg-cyan-500 text-black px-2 py-1 text-xs font-bold uppercase skew-x-12">System_Core</div>
          </div>
          <p className="text-[10px] tracking-[0.8em] text-cyan-800 font-bold mt-2 uppercase">Industry & Innovation Defense</p>
        </div>
        
        <div className="text-right hidden md:block">
          <div className="text-3xl font-black text-cyan-900/40 select-none">NODE_4491_ACTIVE</div>
          <div className="flex gap-2 justify-end">
            <span className="h-2 w-8 bg-cyan-500/20 animate-pulse" />
            <span className="h-2 w-8 bg-red-500/40 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 relative z-20">
        
        {/* LEFT COLUMN: TERMINAL + NEW CRAZY STUFF */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          
          {/* TERMINAL BOX */}
          <div className="border border-cyan-500/40 bg-black/90 p-6 backdrop-blur-xl shadow-[20px_20px_60px_rgba(0,0,0,1)] relative">
            <div className="absolute top-0 right-0 p-2 text-[8px] text-cyan-900 animate-pulse">INTERNAL_FEED_v4.1</div>
            <div className="flex items-center gap-2 mb-4 border-b border-cyan-500/30 pb-2">
              <div className="h-3 w-3 rounded-full bg-red-500 animate-ping" />
              <span className="text-[10px] tracking-widest uppercase font-bold text-white">Threat Analytics Terminal</span>
            </div>
            <pre className="text-sm lg:text-base leading-relaxed whitespace-pre-wrap text-cyan-400 h-48">
              {text}
              <span className="animate-bounce inline-block w-2 h-5 bg-cyan-500 ml-1"></span>
            </pre>
          </div>

          {/* NEW CRAZY ELEMENT: TACTICAL HUD PANEL */}
          <div className="grid grid-cols-2 gap-4">
            {/* Real-time "Radar" Visualization */}
            <div className="border border-cyan-500/20 bg-black/60 p-4 relative group overflow-hidden">
                <div className="absolute inset-0 bg-cyan-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                <p className="text-[9px] font-bold text-cyan-700 mb-3 tracking-tighter uppercase underline">Packet_Source_Vector</p>
                <div className="relative h-32 w-32 mx-auto border border-cyan-500/30 rounded-full flex items-center justify-center">
                    <div className="absolute inset-0 border-t-2 border-cyan-400 rounded-full animate-spin duration-[3000ms]" />
                    <div className="absolute inset-2 border border-cyan-500/10 rounded-full" />
                    <div className="absolute h-1 w-1 bg-red-500 rounded-full animate-ping top-1/4 left-1/3" />
                    <div className="absolute h-1 w-1 bg-cyan-500 rounded-full top-3/4 right-1/4" />
                    <span className="text-[10px] text-cyan-300 font-bold italic animate-pulse">SCANNING</span>
                </div>
            </div>

            {/* Live Data Ticker */}
            <div className="border border-cyan-500/20 bg-black/60 p-4 flex flex-col justify-between">
                <div>
                    <p className="text-[9px] font-bold text-cyan-700 mb-2 tracking-tighter uppercase underline">Node_Log_v0.2</p>
                    <div className="space-y-1 text-[8px] leading-tight text-cyan-600/70 italic">
                        <p className="animate-pulse"># Capture: ESP32_STREAM_01</p>
                        <p> NSL-KDD Packet Ref: 48922</p>
                        <p className="text-red-900">Anomaly_Score: 0.984!!</p>
                        <p>SMOTE_SYNTHETIC: APPLIED</p>
                        <p> SimpleNN: Forward_Pass...</p>
                    </div>
                </div>
                <div className="mt-4 pt-2 border-t border-cyan-950 flex justify-between items-center">
                    <span className="text-[10px] text-white font-bold">L-INFRA</span>
                    <div className="flex gap-0.5">
                        {[...Array(4)].map((_, i) => <div key={i} className="h-3 w-1 bg-cyan-500 animate-[bounce_1s_infinite]" style={{animationDelay: `${i*0.2}s`}} />)}
                    </div>
                </div>
            </div>
          </div>

          {/* Small Status Bar */}
          <div className="border border-cyan-500/10 bg-cyan-950/20 p-2 text-[9px] flex justify-between items-center italic">
            <span className="text-cyan-700 uppercase tracking-widest font-bold">Sub-System: Zero-Day Protection Active</span>
            <span className="text-cyan-400">FPS: 60.2</span>
          </div>

        </div>

        {/* TEAM GRID (RIGHT COLUMN) */}
        <div className={`col-span-12 lg:col-span-7 transition-all duration-1000 ${showTeam ? 'opacity-100' : 'opacity-0 translate-x-20'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {team.map((member, idx) => (
              <div 
                key={idx} 
                className="group relative h-64 bg-zinc-950/90 border border-white/5 hover:border-cyan-500 transition-all duration-500 overflow-hidden cursor-crosshair"
              >
                <div className="p-6 h-full flex flex-col justify-between relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-[8px] text-cyan-800 font-bold mb-1">PROX_ID // {member.usn}</div>
                      <h3 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors">
                        {member.name}
                      </h3>
                    </div>
                    <div className="text-[10px] text-zinc-800 group-hover:text-cyan-500 transition-colors">0{idx + 1}</div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1 flex-1 bg-cyan-950 overflow-hidden">
                        <div className="h-full bg-cyan-500 group-hover:translate-x-full transition-transform duration-1000 ease-in-out" style={{width: '100%', transform: 'translateX(-100%)'}} />
                      </div>
                      <span className="text-[8px] text-cyan-600 font-bold">LINK_SYNC</span>
                    </div>
                    
                    <div>
                      <p className="text-[9px] uppercase text-zinc-600 tracking-tighter mb-1">Functional_Role</p>
                      <p className="text-xs font-bold text-cyan-200 uppercase italic underline decoration-cyan-900 group-hover:decoration-cyan-500">{member.role}</p>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
                <div className="absolute top-0 left-0 w-full h-full border-t border-cyan-500/20 -translate-y-full group-hover:translate-y-0 transition-transform duration-[4000ms] ease-linear" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER TICKER */}
      <div className="absolute bottom-0 left-0 w-full bg-cyan-500 text-black py-0.5 z-50 text-[10px] font-black italic overflow-hidden">
        <div className="animate-[marquee_30s_linear_infinite] whitespace-nowrap uppercase flex gap-20">
            <span> THREAT_DETECTED: PORT_8080</span>
            <span> ESP32_LIVE_CAPTURE: BUFFER_CLEAN</span>
            <span> NEURAL_LOAD: 44.2%</span>
            <span> SMOTE_GAN_AUGMENTATION: COMPLETE</span>
            <span> RVCE_SDG_9_UNIT: OPERATIONAL</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
      `}</style>

      {/* FIXED GRID & SCANLINE */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:30px_30px] z-[5] pointer-events-none" />
      <div className="fixed inset-0 z-40 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px]" />

    </div>
  );
}