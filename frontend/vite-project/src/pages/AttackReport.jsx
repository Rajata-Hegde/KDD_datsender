import React, { useState } from 'react';

export default function AttackReport() {
  const [selectedReport, setSelectedReport] = useState(null);

  // Mock Data representing your NSL-KDD + SimpleNN results
  const reports = [
    { 
      id: "TR-9942", 
      timestamp: "2023-10-27 14:20:01", 
      type: "DoS (Denial of Service)", 
      severity: "CRITICAL", 
      source: "192.168.1.45", 
      confidence: "98.4%",
      protocol: "TCP",
      payload_summary: "Abnormal SYN-Flood sequence detected from ESP32 node.",
      flags: ["src_bytes: 0", "count: 511", "serror_rate: 1.0"]
    },
    { 
      id: "TR-9943", 
      timestamp: "2023-10-27 14:22:15", 
      type: "Probe (Nmap Scan)", 
      severity: "MEDIUM", 
      source: "10.0.0.12", 
      confidence: "82.1%",
      protocol: "UDP",
      payload_summary: "Port scanning activity identified across industrial subnets.",
      flags: ["dst_host_srv_count: 255", "diff_srv_rate: 0.05"]
    },
    { 
      id: "TR-9945", 
      timestamp: "2023-10-27 15:05:44", 
      type: "Zero-Day Anomaly", 
      severity: "HIGH", 
      source: "Unknown (Masked)", 
      confidence: "91.9%",
      protocol: "Unknown",
      payload_summary: "Unseen attack signature flagged by SMOTE-GAN augmented model.",
      flags: ["Zero-Day: True", "Anomaly_Score: 0.92"]
    }
  ];

  const handleDownload = (report) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `Report_${report.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-cyan-500 font-mono p-4 lg:p-8 relative overflow-hidden">
      
      {/* 1. TOP STATUS HEADER */}
      <div className="flex justify-between items-center border-b border-cyan-900 pb-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">Attack_Forensics_v1.0</h1>
          <p className="text-[10px] text-cyan-700 font-bold tracking-[0.3em]">SDG-9 INFRASTRUCTURE PROTECTION ARCHIVE</p>
        </div>
        <div className="text-right flex items-center gap-6">
          <div className="hidden md:block">
            <p className="text-[9px] text-zinc-600">REPORTS_SAVED</p>
            <p className="text-xl font-bold text-cyan-400">000{reports.length}</p>
          </div>
          <div className="h-10 w-10 border border-red-500/50 rounded-full flex items-center justify-center animate-pulse">
            <div className="h-2 w-2 bg-red-600 rounded-full" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 relative z-10">
        
        {/* 2. REPORT LIST (LEFT) */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <h2 className="text-xs font-bold text-cyan-900 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="h-2 w-2 bg-cyan-900 rounded-full" /> Captured_Incidents
          </h2>
          <div className="h-[70vh] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {reports.map((report) => (
              <div 
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className={`p-4 border cursor-pointer transition-all duration-300 group relative ${
                  selectedReport?.id === report.id 
                  ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                  : 'border-cyan-500/10 bg-zinc-950 hover:border-cyan-500/40'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 ${
                    report.severity === 'CRITICAL' ? 'bg-red-950 text-red-500' : 'bg-cyan-950 text-cyan-500'
                  }`}>
                    {report.severity}
                  </span>
                  <span className="text-[10px] text-zinc-600">{report.id}</span>
                </div>
                <h3 className="text-white font-bold group-hover:text-cyan-400">{report.type}</h3>
                <p className="text-[10px] text-cyan-800 mt-1">{report.timestamp}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. DEEP INSPECTION PANEL (RIGHT) */}
        <div className="col-span-12 lg:col-span-8">
          {selectedReport ? (
            <div className="border border-cyan-500/30 bg-black/80 h-full flex flex-col relative overflow-hidden">
              {/* Scanline overlay */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px]" />
              
              <div className="p-8 relative z-10 flex-1">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-4xl font-black text-white italic tracking-tighter mb-2">{selectedReport.id}</h2>
                    <p className="text-cyan-600 font-bold uppercase tracking-widest text-xs">Diagnostic_Inspection_Report</p>
                  </div>
                  <button 
                    onClick={() => handleDownload(selectedReport)}
                    className="bg-cyan-500 text-black px-4 py-2 text-xs font-black uppercase hover:bg-white transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download_JSON
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-12 text-sm">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Source_IP_Address</label>
                      <p className="text-white font-mono text-xl">{selectedReport.source}</p>
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">AI_Confidence_Score</label>
                      <p className="text-2xl font-black text-cyan-400">{selectedReport.confidence}</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Network_Protocol</label>
                      <p className="text-white font-mono text-xl">{selectedReport.protocol}</p>
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Threat_Category</label>
                      <p className="text-xl font-bold text-red-500 italic">{selectedReport.type}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-2 underline decoration-cyan-900">NSL-KDD_Feature_Signature</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedReport.flags.map((flag, i) => (
                      <div key={i} className="bg-zinc-900 p-2 text-[10px] border border-cyan-500/10 text-cyan-400">
                        {flag}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-10 border-t border-cyan-500/20 pt-6">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-2">Automated_Payload_Analysis</label>
                  <p className="text-cyan-200/80 italic text-sm leading-relaxed">
                    "{selectedReport.payload_summary}"
                  </p>
                </div>
              </div>

              {/* Security Footer */}
              <div className="bg-cyan-500/10 p-4 border-t border-cyan-500/20 flex justify-between text-[8px] font-bold uppercase tracking-widest text-cyan-800">
                <span>Validator: SimpleNN-Eng-v4.0</span>
                <span>Checksum: 0x9942AF_VALID</span>
              </div>
            </div>
          ) : (
            <div className="h-full border border-dashed border-cyan-500/20 flex flex-col items-center justify-center opacity-40">
              <div className="h-20 w-20 border-2 border-cyan-500/30 rounded-full animate-pulse flex items-center justify-center mb-4">
                <div className="h-10 w-10 border border-cyan-500/50 rounded-full animate-spin" />
              </div>
              <p className="text-xs uppercase tracking-[0.5em]">Waiting_for_Selection</p>
            </div>
          )}
        </div>
      </div>

      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
    </div>
  );
}