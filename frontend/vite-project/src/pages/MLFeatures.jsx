import React from "react";
import MLFeaturesInfo from "../components/MLFeaturesInfo";

export default function MLFeatures() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white p-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-widest text-cyan-400 mb-2">
          🤖 ML CLASSIFICATION FEATURES
        </h1>
        <p className="text-gray-400 text-lg">
          Understanding how the trained machine learning model detects attacks
        </p>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto">
        <MLFeaturesInfo />

        {/* Additional Explanation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Attack Types */}
          <div className="rounded-2xl border border-purple-500/30 bg-white/5 backdrop-blur-xl p-6">
            <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
              <span>🎯</span> Attack Types Detected
            </h3>
            <div className="space-y-3">
              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-semibold text-yellow-300">DoS (Denial of Service)</h4>
                <p className="text-sm text-gray-400">
                  Attacks that crash/overload servers: neptune, back, land, smurf, teardrop
                </p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-orange-300">Probe (Scanning)</h4>
                <p className="text-sm text-gray-400">
                  Network reconnaissance: nmap, ipsweep, portsweep, mscan
                </p>
              </div>
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-semibold text-red-300">R2L (Remote-to-Local)</h4>
                <p className="text-sm text-gray-400">
                  Unauthorized access: httptunnel, ftp_write, imap, guess_passwd
                </p>
              </div>
              <div className="border-l-4 border-pink-500 pl-4">
                <h4 className="font-semibold text-pink-300">U2R (User-to-Root)</h4>
                <p className="text-sm text-gray-400">
                  Privilege escalation: buffer_overflow, rootkit, shellcode
                </p>
              </div>
            </div>
          </div>

          {/* How Features Help */}
          <div className="rounded-2xl border border-green-500/30 bg-white/5 backdrop-blur-xl p-6">
            <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
              <span>🔍</span> How Features Detect Attacks
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div>
                <span className="text-green-300 font-semibold">📊 Error Rates:</span>
                <p>High serror_rate (0.5) indicates connection failures → DoS attacks</p>
              </div>
              <div>
                <span className="text-green-300 font-semibold">💫 Connection Patterns:</span>
                <p>High srv_count + low src_bytes = port scanning → Probe attacks</p>
              </div>
              <div>
                <span className="text-green-300 font-semibold">🎯 Destination Stats:</span>
                <p>Unusual dst_host patterns = targeting specific services → R2L/U2R</p>
              </div>
              <div>
                <span className="text-green-300 font-semibold">⏱️ Duration & Flow:</span>
                <p>Connection duration + srv_count patterns = behavioral analysis</p>
              </div>
            </div>
          </div>
        </div>

        {/* Training Info */}
        <div className="rounded-2xl border border-cyan-500/30 bg-white/5 backdrop-blur-xl p-6 mt-8">
          <h3 className="text-xl font-bold text-cyan-300 mb-4">📚 Training Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded p-4">
              <p className="text-gray-400 text-xs">Dataset</p>
              <p className="text-cyan-300 font-bold text-lg">KDD 1999</p>
            </div>
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded p-4">
              <p className="text-gray-400 text-xs">Training Samples</p>
              <p className="text-cyan-300 font-bold text-lg">41,093</p>
            </div>
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded p-4">
              <p className="text-gray-400 text-xs">Features</p>
              <p className="text-cyan-300 font-bold text-lg">20</p>
            </div>
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded p-4">
              <p className="text-gray-400 text-xs">Model Accuracy</p>
              <p className="text-cyan-300 font-bold text-lg">~94%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
