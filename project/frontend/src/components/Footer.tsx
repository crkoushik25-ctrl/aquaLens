import React from 'react';
import { Shield, Anchor, Cpu, Terminal, ExternalLink } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="border-t border-cyan-500/20 bg-ocean-950/80 backdrop-blur-md pt-12 pb-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hackathon Prototype Banner */}
        <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-cyan-950/60 via-slate-900/80 to-blue-950/60 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-cyan-300 font-semibold text-sm">
                Smart India Hackathon Prototype Architecture
              </div>
              <div className="text-slate-300 text-xs mt-0.5">
                Problem Statement: AI-Powered Automated Underwater Marine Debris & Anomaly Detection using Side-Scan Sonar Imagery
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-400/90 bg-cyan-950/40 px-3 py-1.5 rounded-lg border border-cyan-500/20">
            <Terminal className="w-3.5 h-3.5" />
            <span>SIMULATED ACOUSTIC AI PIPELINE v2.0</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <Anchor className="w-5 h-5 text-cyan-400" />
              <span className="font-extrabold text-lg text-slate-100 font-mono">
                OceanScan<span className="text-cyan-400">.AI</span>
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed max-w-md">
              From Sonar Signals to Actionable Marine Intelligence. Detect. Understand. Prioritize. Protect. 
              An autonomous intelligence suite empowering marine scientists, defense hydrographers, and port authorities with explainable acoustic computer vision.
            </p>
            <div className="text-[11px] text-slate-400">
              <strong className="text-slate-300">Disclaimer:</strong> This application is an advanced interactive prototype presenting the proposed AI architecture and simulated side-scan sonar datasets for hackathon evaluation.
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-xs mb-3 font-mono">
              System Modules
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-cyan-400 transition-colors">
                  Command Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('analyze')} className="hover:text-cyan-400 transition-colors">
                  Sonar Waterfall Analysis
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('unknown-anomaly')} className="hover:text-cyan-400 transition-colors">
                  Unknown Anomaly Engine (OOD)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('risk')} className="hover:text-cyan-400 transition-colors">
                  Explainable AI Risk Scoring
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('comparison')} className="hover:text-cyan-400 transition-colors">
                  Temporal Change Detection
                </button>
              </li>
            </ul>
          </div>

          {/* Technical Specs */}
          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-xs mb-3 font-mono">
              Technology Stack
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>FastAPI + Python AI Engine</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>React + TypeScript + Tailwind</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Leaflet GIS + OpenStreetMap</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>PostgreSQL / SQLite Storage</span>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="text-cyan-400 hover:underline flex items-center gap-1 mt-2">
                  <span>View Pipeline Architecture</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-400">
          <div>
            © 2026 OceanScan AI. Developed for Smart India Hackathon.
          </div>
          <div className="font-mono text-[11px] text-cyan-500/80">
            Acoustic Band: 100/455/900 kHz • Hydrographic Standard S-44
          </div>
        </div>

      </div>
    </footer>
  );
};
