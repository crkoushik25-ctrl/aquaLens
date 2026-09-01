import React from 'react';
import { 
  AlertTriangle, 
  HelpCircle, 
  Search, 
  ShieldAlert, 
  Cpu, 
  Radio, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Compass, 
  FileText,
  Activity,
  Layers,
  Zap
} from 'lucide-react';
import { SonarCanvas } from '../components/SonarCanvas';
import { Detection } from '../types';

interface UnknownAnomalyPageProps {
  setActiveTab: (tab: string) => void;
}

export const UnknownAnomalyPage: React.FC<UnknownAnomalyPageProps> = ({ setActiveTab }) => {
  
  const anomalyDetection: Detection = {
    id: 3,
    detection_code: "DET-ANOMALY-003",
    scan_code: "SON-003",
    image_url: "/static/sonar_images/son-003_unknown_anomaly.jpg",
    object_type: "Unknown Anomaly",
    confidence: 0.78,
    risk_level: "HIGH",
    risk_score: 76,
    estimated_size: "6.2m × 5.8m",
    estimated_depth: 51.0,
    latitude: 11.0282,
    longitude: 76.9671,
    bbox: { x: 0.35, y: 0.28, w: 0.30, h: 0.36 },
    acoustic_shadow_len_m: 4.1,
    is_anomaly: true,
    ood_score: 0.82,
    known_similarity: 0.21,
    why_risk: "Out-of-Distribution acoustic signature. Unnatural symmetry and atypical acoustic shadow ratio indicate potential unclassified anthropogenic structure or unusual benthic geological anomaly.",
    recommendation: "Manual Marine Inspection & ROV camera survey strongly recommended.",
    status: "Review"
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Alert Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-red-950/80 via-orange-950/60 to-ocean-950 border-2 border-red-500/50 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/40 shrink-0">
              <AlertTriangle className="w-8 h-8 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950 text-red-300 border border-red-500/40">
                OUT-OF-DISTRIBUTION (OOD) TRIGGERED
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white font-sans uppercase tracking-tight">
                ⚠ UNKNOWN ANOMALY DETECTED
              </h1>
              <p className="text-xs text-red-200/90 max-w-xl">
                The acoustic feature vector falls outside the confidence manifold of standard marine debris training classes (Cosine similarity &lt; 0.25).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('map')}
              className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-slate-950 font-bold text-xs font-mono transition-all flex items-center gap-1.5 shadow-lg shadow-red-500/25"
            >
              <Compass className="w-4 h-4" />
              <span>Locate on GIS Map</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Sonar Canvas & Anomaly Visualizer */}
        <div className="lg:col-span-7 space-y-6">
          
          <SonarCanvas
            imageUrl="/static/sonar_images/son-003_unknown_anomaly.jpg"
            detections={[anomalyDetection]}
            selectedDetection={anomalyDetection}
            showOverlay={true}
          />

          {/* Uncertainty & Scientific Integrity Card */}
          <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-xs">
              <HelpCircle className="w-4 h-4" />
              <span>HONEST SCIENTIFIC UNCERTAINTY MODELING</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              OceanScan AI does not force false-positive classifications on novel underwater phenomena. Rather than misclassifying ambiguous signatures as common nets or rocks, the system isolates high-entropy anomalies and prompts specialized human-in-the-loop inspection.
            </p>
          </div>

        </div>

        {/* Right Column: Deep Anomaly Diagnostics */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-panel p-6 rounded-3xl border border-red-500/30 space-y-6 bg-ocean-950/95 shadow-2xl">
            
            <h3 className="text-base font-bold text-white font-sans flex items-center gap-2 border-b border-slate-800 pb-3">
              <Activity className="w-4 h-4 text-red-400" />
              <span>Acoustic Signature Anomaly Metrics</span>
            </h3>

            {/* Metric Bars */}
            <div className="space-y-4 font-mono text-xs">
              
              {/* OOD Score */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Out-of-Distribution (OOD) Distance</span>
                  <span className="text-red-400 font-bold">0.82 (High)</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full w-[82%]" />
                </div>
              </div>

              {/* Known-Class Similarity */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Known-Class Similarity</span>
                  <span className="text-amber-400 font-bold">21% (Low)</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[21%]" />
                </div>
              </div>

              {/* Backscatter Entropy */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Acoustic Backscatter Pattern</span>
                  <span className="text-cyan-300 font-bold">Unusual Radial Symmetry</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full w-[78%]" />
                </div>
              </div>

            </div>

            {/* Target Telemetry Box */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Bathymetric Depth:</span>
                <span className="text-slate-100 font-bold">51.0 meters</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Target Span:</span>
                <span className="text-slate-100 font-bold">6.2m × 5.8m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Coordinates:</span>
                <span className="text-cyan-300 font-bold">11.0282° N, 76.9671° E</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Risk Index:</span>
                <span className="text-orange-400 font-bold">76 / 100 (HIGH)</span>
              </div>
            </div>

            {/* Recommendation Protocol */}
            <div className="space-y-2">
              <span className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                RECOMMENDED OPERATIONAL ACTION
              </span>
              <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-xs text-red-200 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-red-300">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Manual Marine Inspection & ROV Ground-Truthing</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Deploy sub-surface ROV with optical 4K cameras and multibeam sonar to establish visual ground truth. Archive raw acoustic IQ backscatter for active deep learning retraining.
                </p>
              </div>
            </div>

            {/* Dispatch Action */}
            <button
              onClick={() => setActiveTab('reports')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-lg"
            >
              Generate Anomaly Incident Report
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
