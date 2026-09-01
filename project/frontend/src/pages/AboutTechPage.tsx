import React from 'react';
import { 
  Cpu, 
  Layers, 
  GitBranch, 
  ShieldCheck, 
  Terminal, 
  Database, 
  Compass, 
  Scan, 
  CheckCircle2, 
  ExternalLink,
  Code2,
  Server,
  Zap
} from 'lucide-react';

interface AboutTechPageProps {
  setActiveTab: (tab: string) => void;
}

export const AboutTechPage: React.FC<AboutTechPageProps> = ({ setActiveTab }) => {
  
  const pipelineSteps = [
    { title: 'Side-Scan Sonar Raw Ingestion', desc: 'Accepts hydrographic acoustic stream (100–900 kHz) with slant range & towfish altitude metadata.' },
    { title: 'Acoustic Radiometric Preprocessing', desc: 'Normalizes water-column nadir attenuation and applies CLAHE contrast enhancement & speckle de-noising.' },
    { title: 'AI Computer Vision Feature Extractor', desc: 'Multi-scale convolutional/transformer backbone isolating acoustic highlights and acoustic shadows.' },
    { title: 'Object Detection & Bounding Box Regression', desc: 'Predicts precise bounding box geometry, orientation, and shadow-to-height trigonometric ratios.' },
    { title: 'Multi-Class Marine Debris Classification', desc: 'Classifies targets into Ghost Fishing Nets, Corroded Metal Debris, Plastics, Ship Hulls, and Natural Reefs.' },
    { title: 'Out-of-Distribution (OOD) Anomaly Detector', desc: 'Calculates cosine embedding distance and spectral entropy to identify novel/unclassified underwater anomalies.' },
    { title: 'Explainable AI (XAI) Risk Engine', desc: 'Synthesizes 5 quantifiable hazard factors into an objective 0–100 risk score with natural language reasoning.' },
    { title: 'Geospatial GIS Bathymetry Mapping', desc: 'Projects lat/long fixes, survey tracklines, and risk-colored markers on Leaflet dark ocean basemaps.' },
    { title: 'Marine Decision Intelligence & Dispatch', desc: 'Outputs standardized hydrographic incident dossiers, temporal change alerts, and printable survey reports.' },
  ];

  const techStack = [
    { name: 'React + TypeScript', role: 'Frontend UI', desc: 'Type-safe component architecture with real-time state management and zero layout shift.', icon: Code2 },
    { name: 'FastAPI (Python)', role: 'Backend API', desc: 'High-performance asynchronous API server serving RESTful inference endpoints.', icon: Server },
    { name: 'PyTorch & OpenCV', role: 'AI & CV Pipeline', desc: 'Acoustic radiometric normalization, speckle filtering, and neural bounding box regression.', icon: Cpu },
    { name: 'PostgreSQL & SQLite', role: 'Dual Storage', desc: 'Relational database storing hydrographic scans, detections, risk assessments, and reports.', icon: Database },
    { name: 'Leaflet & OSM', role: 'GIS Mapping', desc: 'Interactive dark ocean bathymetric mapping engine with survey trackline vector layers.', icon: Compass },
    { name: 'Tailwind CSS', role: 'Tactical Design', desc: 'Custom deep ocean design tokens, glassmorphism HUD interfaces, and responsive layouts.', icon: Layers },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 text-xs font-mono border border-cyan-500/30">
          <Zap className="w-3.5 h-3.5" />
          <span>SYSTEM ARCHITECTURE & METHODOLOGY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-sans">
          OceanScan AI Deep Technology Pipeline
        </h1>
        <p className="text-sm text-slate-300">
          Built for the Smart India Hackathon problem statement: AI-Powered Automated Underwater Marine Debris and Anomaly Detection System using Side-Scan Sonar Imagery.
        </p>
      </div>

      {/* 9-Step Pipeline Interactive Flow Diagram */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-cyan-500/30 space-y-6 bg-ocean-950/95 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-lg font-bold text-white font-sans flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            <span>End-to-End Marine Intelligence Architecture Pipeline</span>
          </h2>
          <span className="text-xs font-mono text-cyan-400">9-STAGE REASONING PIPELINE</span>
        </div>

        {/* Pipeline Diagram Cards */}
        <div className="space-y-4">
          {pipelineSteps.map((step, idx) => (
            <div key={idx} className="relative">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-400/50 transition-all flex items-start gap-4 group">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center border border-cyan-500/30 shrink-0 group-hover:bg-cyan-500/20">
                  {idx + 1}
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                    <span>{step.title}</span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {step.desc}
                  </p>
                </div>
              </div>

              {/* Connecting arrow line */}
              {idx < pipelineSteps.length - 1 && (
                <div className="w-0.5 h-3 bg-cyan-500/30 mx-auto my-0.5" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white font-sans text-center">
          Engineered with State-of-the-Art Technologies
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div key={idx} className="glass-card p-6 rounded-2xl border border-cyan-500/20 space-y-3 group">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 group-hover:bg-cyan-500/20 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/20">
                    {tech.role}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white font-sans">
                  {tech.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {tech.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hackathon Prototype Statement Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>SMART INDIA HACKATHON PROTOCOL NOTICE</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          This system is an advanced research and engineering prototype developed for the Smart India Hackathon. It models realistic side-scan sonar physics, acoustic radiometric properties, and explainable AI risk dynamics. The modular service architecture is directly compatible with production PyTorch/TensorRT inference engines and real-world towfish sensor integration.
        </p>
      </div>

    </div>
  );
};
