import React from 'react';

export default function ModelPerformance() {
  // Real data from your notebook training results
  const metrics = {
    accuracy: 80.87, // SMOTE Baseline NN
    ganAccuracy: 36.46, // GAN Baseline NN
    loss: 1.3732,    // Final training loss
    layers: [128, 64, 5], // SimpleNN Architecture
    classes: ["Normal", "DoS", "Probe", "R2L", "U2R"] // Target classes
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 font-mono">
      {/* GLITCH HEADER */}
      <div className="flex justify-between items-end border-b border-cyan-500/30 pb-4 mb-8">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            NEURAL ENGINE PERFORMANCE
          </h1>
          <p className="text-cyan-600 text-xs mt-1">MODULE: NSL-KDD INTRUSION CLASSIFIER // VER 2.1</p>
        </div>
        <div className="text-right">
          <div className="text-cyan-400 text-2xl font-bold">{metrics.accuracy}%</div>
          <div className="text-[10px] text-cyan-700">PEAK VALIDATION ACCURACY</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        
        {/* LEFT: ARCHITECTURE VISUALIZER */}
        <div className="col-span-12 lg:col-span-4">
          <PerformanceCard title="Model Architecture" subtitle="SimpleNN PyTorch">
            <div className="flex flex-col gap-6 py-4 items-center">
              {metrics.layers.map((nodes, i) => (
                <div key={i} className="flex flex-col items-center w-full">
                  <div className="text-[10px] text-cyan-500 mb-1">Layer {i+1}: FC ({nodes})</div>
                  <div className="w-full h-8 bg-cyan-500/10 border border-cyan-500/30 rounded flex items-center justify-around overflow-hidden relative">
                     {/* Animated "nodes" */}
                    {[...Array(8)].map((_, j) => (
                      <div key={j} className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_cyan]" />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent animate-shimmer" />
                  </div>
                  {i < metrics.layers.length - 1 && <div className="h-6 w-0.5 bg-gradient-to-b from-cyan-500/50 to-transparent" />}
                </div>
              ))}
            </div>
            <div className="mt-4 p-2 bg-black/40 rounded text-[10px] text-gray-400 leading-relaxed border border-white/5">
              Optimizer: Adam (lr=0.001) <br/>
              Criterion: CrossEntropyLoss
            </div>
          </PerformanceCard>
        </div>

        {/* CENTER: AUGMENTATION COMPARISON */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <MetricBox label="Current Loss" value={metrics.loss} color="cyan" />
            <MetricBox label="Epochs Run" value="20" color="purple" />
          </div>

          <PerformanceCard title="Augmentation Duel" subtitle="SMOTE vs GAN Accuracy">
            <div className="mt-8 space-y-8">
              <ComparisonBar label="SMOTE (Synthetic Minority Over-sampling)" value={metrics.accuracy} color="cyan" active />
              <ComparisonBar label="GAN (Generative Adversarial Network)" value={metrics.ganAccuracy} color="red" />
            </div>
            <p className="mt-6 text-[10px] text-red-400 italic">
              ⚠️ Warning: GAN training resulted in 'NaN' loss values.
            </p>
          </PerformanceCard>
        </div>

        {/* RIGHT: CLASS RADAR/LOGS */}
        <div className="col-span-12 lg:col-span-3">
          <PerformanceCard title="Class Detection" subtitle="Input Distribution">
            <div className="space-y-3 mt-4">
              {metrics.classes.map((cls) => (
                <div key={cls} className="flex justify-between items-center group">
                  <span className="text-xs text-cyan-300 group-hover:text-white transition-colors">{cls}</span>
                  <div className="flex-1 mx-4 h-[1px] bg-cyan-900 group-hover:bg-cyan-500 transition-all"></div>
                  <span className="text-[10px] text-cyan-600">ONLINE</span>
                </div>
              ))}
            </div>
          </PerformanceCard>

          <div className="mt-6 h-48 border border-cyan-500/20 bg-black/60 rounded-xl p-4 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/40 animate-scan" />
            <h3 className="text-[10px] text-cyan-500 mb-2 uppercase tracking-widest">Training Telemetry</h3>
            <div className="text-[9px] text-green-500/80 space-y-1">
               <div>[SUCCESS] X_train_sm created (X, 42)</div>
               <div>[INFO] Epoch [20/20] - Loss: 1.3732</div>
               <div className="animate-pulse">[PROCESS] Calculating Confusion Matrix...</div>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(192px); }
        }
        .animate-shimmer { animation: shimmer 2s infinite; }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
}

/* ---------- UI COMPONENTS ---------- */

const PerformanceCard = ({ title, subtitle, children }) => (
  <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-2 opacity-10">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-cyan-500">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    </div>
    <h3 className="text-cyan-400 font-bold uppercase tracking-widest text-sm">{title}</h3>
    <p className="text-[10px] text-slate-500 mb-4">{subtitle}</p>
    {children}
  </div>
);

const ComparisonBar = ({ label, value, color, active }) => (
  <div>
    <div className="flex justify-between text-[10px] mb-1 uppercase tracking-tight">
      <span className={active ? "text-cyan-300" : "text-slate-500"}>{label}</span>
      <span className={active ? "text-cyan-400" : "text-slate-400"}>{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
      <div 
        className={`h-full transition-all duration-1000 ${color === 'cyan' ? 'bg-cyan-500 shadow-[0_0_10px_cyan]' : 'bg-red-500'}`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const MetricBox = ({ label, value, color }) => (
  <div className={`p-4 border border-${color}-500/20 bg-${color}-500/5 rounded-xl`}>
    <p className="text-[10px] text-slate-500 uppercase">{label}</p>
    <p className={`text-2xl font-black text-${color}-400`}>{value}</p>
  </div>
);