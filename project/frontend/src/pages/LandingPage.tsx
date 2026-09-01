import React from 'react';
import { 
  Radar, 
  Scan, 
  ShieldAlert, 
  MapPin, 
  GitCompare, 
  FileCheck, 
  Sparkles, 
  ArrowRight, 
  PlayCircle,
  Radio, 
  Crosshair, 
  Layers,
  Database,
  Compass,
  CheckCircle
} from 'lucide-react';
import { SonarCanvas } from '../components/SonarCanvas';
import { Detection } from '../types';

interface LandingPageProps {
  setActiveTab: (tab: string) => void;
  onStartJudgeTour: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  setActiveTab,
  onStartJudgeTour
}) => {
  // Sample Hero Detection for live canvas demonstration
  const heroDetection: Detection = {
    id: 99,
    detection_code: 'DET-HERO-01',
    image_url: '/static/sonar_images/son-001_fishing_net.jpg',
    object_type: 'Fishing Net',
    confidence: 0.91,
    risk_level: 'HIGH',
    risk_score: 82,
    estimated_size: '8.4m × 2.1m',
    estimated_depth: 42.0,
    latitude: 11.0168,
    longitude: 76.9558,
    bbox: { x: 0.32, y: 0.26, w: 0.36, h: 0.38 },
    acoustic_shadow_len_m: 3.2,
    is_anomaly: false,
    ood_score: 0.12,
    known_similarity: 0.91,
    why_risk: 'High lethal entanglement threat for marine fauna and propeller hazard at 42m bathymetry.',
    recommendation: 'Priority diver/ROV recovery operation recommended to mitigate ghost fishing.',
    status: 'Review'
  };

  const metrics = [
    { label: 'Sonar Scans Analyzed', value: '1,248+', change: '+18% this month', icon: Scan },
    { label: 'Anomalies Detected', value: '86', change: '14 unclassified', icon: Crosshair },
    { label: 'High & Critical Risk', value: '28', change: 'Priority remediation', icon: ShieldAlert },
    { label: 'Prototype AI Confidence', value: '94.2%', change: 'Simulated baseline', icon: Sparkles },
  ];

  const workflowSteps = [
    { num: '01', title: 'Upload Sonar', desc: 'Accepts raw TIFF, PNG, and JPEG Side-Scan Sonar imagery with frequency & altitude metadata.' },
    { num: '02', title: 'AI Preprocessing', desc: 'Radiometric calibration, acoustic contrast normalization, and speckle noise reduction.' },
    { num: '03', title: 'Object Detection', desc: 'Automated bounding box regression across marine debris classes with acoustic shadow analysis.' },
    { num: '04', title: 'Anomaly Engine', desc: 'Out-of-Distribution (OOD) detector identifies unclassified signatures and flags inspection.' },
    { num: '05', title: 'Explainable Risk', desc: '0-100 hazard scoring with transparent causal reasoning across 5 environmental factors.' },
    { num: '06', title: 'GIS & Temporal Diff', desc: 'Full GIS bathymetric mapping and historical survey change detection over time.' },
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Cinematic Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 border-b border-cyan-500/20 bathy-contour">
        {/* Background Radar Animation */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] rounded-full border border-cyan-500/10 pointer-events-none opacity-30 flex items-center justify-center">
          <div className="w-[550px] h-[550px] rounded-full border border-cyan-500/15" />
          <div className="w-[350px] h-[350px] rounded-full border border-cyan-500/20" />
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-transparent rounded-full animate-radar-sweep origin-center" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Problem Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs font-mono">
                <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                <span>SMART INDIA HACKATHON • MARINE INTELLIGENCE</span>
              </div>

              {/* Headings */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans">
                  Turning Sonar Data into{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
                    Underwater Intelligence.
                  </span>
                </h1>
                
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                  OceanScan AI automatically detects, classifies, maps, and prioritizes marine debris and underwater anomalies from Side-Scan Sonar imagery.
                </p>
              </div>

              {/* Tagline Callout */}
              <div className="p-3.5 rounded-xl bg-ocean-900/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Mission Directive</span>
                  <span className="font-bold text-cyan-200">“From Sonar Signals to Actionable Marine Intelligence.”</span>
                </div>
                <span className="text-slate-400 hidden sm:inline">Detect • Understand • Prioritize • Protect</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('analyze')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center gap-2 transition-all transform hover:scale-105"
                >
                  <Scan className="w-4 h-4" />
                  <span>Analyze Sonar Data</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-6 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 text-slate-200 hover:text-cyan-300 text-sm font-semibold transition-all flex items-center gap-2"
                >
                  <Radio className="w-4 h-4 text-cyan-400" />
                  <span>Explore Dashboard</span>
                </button>

                <button
                  onClick={onStartJudgeTour}
                  className="px-4 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-sm font-mono font-bold transition-all flex items-center gap-1.5"
                >
                  <PlayCircle className="w-4 h-4 text-amber-400" />
                  <span>Judge Demo Tour</span>
                </button>
              </div>

              {/* Prototype Disclaimer Badge */}
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Simulated AI Computer Vision Architecture • SIH Prototype</span>
              </div>

            </div>

            {/* Hero Right Visualizer */}
            <div className="lg:col-span-6">
              <div className="relative">
                {/* Glow Backdrop */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur-xl opacity-25" />
                
                {/* Sonar Canvas Component */}
                <div className="relative">
                  <SonarCanvas
                    imageUrl="/static/sonar_images/son-001_fishing_net.jpg"
                    detections={[heroDetection]}
                    selectedDetection={heroDetection}
                    showOverlay={true}
                  />

                  {/* Floating AI Insight Card */}
                  <div className="absolute -bottom-4 -left-4 glass-card p-3 rounded-xl border border-cyan-400/50 bg-ocean-950/95 shadow-2xl flex items-center gap-3 max-w-xs">
                    <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      <ShieldAlert className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase">
                        AI Detection: Ghost Fishing Net
                      </div>
                      <div className="text-[10px] text-slate-300">
                        Confidence: 91% • Risk: HIGH (82/100) • 42m Depth
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Simulated Prototype Metrics Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div key={idx} className="glass-card p-5 rounded-2xl relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    {m.label}
                  </span>
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white font-mono">
                    {m.value}
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-cyan-400/90 font-mono">
                  {m.change}
                </div>
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
              </div>
            );
          })}
        </div>
      </section>

      {/* End-to-End Workflow Architecture Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 text-xs font-mono border border-cyan-500/30">
            <Radio className="w-3.5 h-3.5" />
            <span>INTELLIGENCE WORKFLOW PIPELINE</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white font-sans">
            From Raw Acoustic Ping to Actionable Marine Protocol
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            A modular 6-stage architecture designed to seamlessly bridge raw hydrographic side-scan surveys with autonomous anomaly mitigation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflowSteps.map((step, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl relative group">
              <span className="font-mono text-3xl font-extrabold text-cyan-500/30 group-hover:text-cyan-400/60 transition-colors">
                {step.num}
              </span>
              <h3 className="text-base font-bold text-slate-100 mt-2">
                {step.title}
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {step.desc}
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-cyan-400">
                <span>STAGE VERIFIED</span>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Launch CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-cyan-950/90 via-slate-900 to-blue-950/90 border border-cyan-500/40 relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
                Ready to evaluate the Side-Scan Sonar AI Pipeline?
              </h3>
              <p className="text-sm text-slate-300 max-w-xl">
                Experience simulated inference on curated marine datasets: Ghost Fishing Nets, Sunken Hull Debris, and Out-of-Distribution Anomalies.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab('analyze')}
                className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all"
              >
                Launch Sonar Analyzer
              </button>
              <button
                onClick={onStartJudgeTour}
                className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-sm transition-all"
              >
                Interactive Judge Tour
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
