import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  HelpCircle, 
  Layers, 
  CheckCircle2, 
  Ruler, 
  Activity, 
  Compass, 
  Anchor, 
  FileText,
  Sliders
} from 'lucide-react';
import { Detection } from '../types';

interface RiskAnalysisPageProps {
  currentDetection: Detection | null;
  setActiveTab: (tab: string) => void;
}

export const RiskAnalysisPage: React.FC<RiskAnalysisPageProps> = ({
  currentDetection,
  setActiveTab
}) => {
  const [activeScenario, setActiveScenario] = useState<string>('net');

  const scenarios: Record<string, Detection> = {
    net: {
      detection_code: "DET-001",
      image_url: "/static/sonar_images/son-001_fishing_net.jpg",
      object_type: "Fishing Net",
      confidence: 0.91,
      risk_level: "HIGH",
      risk_score: 82,
      estimated_size: "8.4m × 2.1m",
      estimated_depth: 42.0,
      latitude: 11.0168,
      longitude: 76.9558,
      bbox: { x: 0.32, y: 0.26, w: 0.36, h: 0.38 },
      acoustic_shadow_len_m: 3.2,
      is_anomaly: false,
      ood_score: 0.12,
      known_similarity: 0.91,
      why_risk: "Classification as 'Fishing Net' carries a baseline hazard weighting of 82/100 (Ghost Fishing Gear / Entanglement Hazard). Physical dimensions (8.4m span) contribute 19/25 to structural obstruction rating. Recorded bathymetric depth of 42.0m places the target within active commercial trawl and shallow navigation zones. Environmental impact analysis: High lethal entanglement risk for marine fauna, cetaceans, and sea turtles.",
      recommendation: "Priority diver/ROV recovery operation recommended to mitigate ghost fishing.",
      status: "Review",
      factor_breakdown: {
        object_hazard: 24.6,
        physical_dimensions: 19,
        depth_vulnerability: 15,
        acoustic_signature: 25,
        ood_uncertainty: 5
      }
    },
    ship: {
      detection_code: "DET-004",
      image_url: "/static/sonar_images/son-004_ship_debris.jpg",
      object_type: "Ship Debris",
      confidence: 0.94,
      risk_level: "CRITICAL",
      risk_score: 92,
      estimated_size: "18.5m × 8.2m",
      estimated_depth: 28.5,
      latitude: 11.0112,
      longitude: 76.9490,
      bbox: { x: 0.28, y: 0.22, w: 0.44, h: 0.48 },
      acoustic_shadow_len_m: 7.8,
      is_anomaly: false,
      ood_score: 0.08,
      known_similarity: 0.95,
      why_risk: "Large-scale sunken vessel section / structural keel fragment located at shallow bathymetry (28.5m). Severe collision hazard for commercial deep-draft cargo traffic and potential residual chemical leakage.",
      recommendation: "Immediate port authority notification, NAVAREA broadcast, and exclusion zone establishment.",
      status: "Flagged for ROV",
      factor_breakdown: {
        object_hazard: 28.0,
        physical_dimensions: 25,
        depth_vulnerability: 20,
        acoustic_signature: 25,
        ood_uncertainty: 2
      }
    },
    metal: {
      detection_code: "DET-002",
      image_url: "/static/sonar_images/son-002_metal_debris.jpg",
      object_type: "Metal Debris",
      confidence: 0.87,
      risk_level: "MEDIUM",
      risk_score: 68,
      estimated_size: "4.8m × 2.4m",
      estimated_depth: 36.0,
      latitude: 11.0231,
      longitude: 76.9612,
      bbox: { x: 0.40, y: 0.34, w: 0.24, h: 0.26 },
      acoustic_shadow_len_m: 2.8,
      is_anomaly: false,
      ood_score: 0.18,
      known_similarity: 0.88,
      why_risk: "Dense metallic cargo container remnant with sharp acoustic reflections. Moderate navigation collision hazard and localized benthic seabed abrasion.",
      recommendation: "Log coordinates into NAVAREA marine hazard database and monitor displacement.",
      status: "Verified",
      factor_breakdown: {
        object_hazard: 20.4,
        physical_dimensions: 14,
        depth_vulnerability: 15,
        acoustic_signature: 18,
        ood_uncertainty: 4
      }
    },
    anomaly: {
      detection_code: "DET-003",
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
      why_risk: "Object does not sufficiently match known training categories. High Out-of-Distribution uncertainty elevates priority for ground-truth confirmation before risk downgrade.",
      recommendation: "Manual Marine Inspection & ROV camera survey strongly recommended.",
      status: "Review",
      factor_breakdown: {
        object_hazard: 22.8,
        physical_dimensions: 18,
        depth_vulnerability: 10,
        acoustic_signature: 20,
        ood_uncertainty: 15
      }
    }
  };

  const target = currentDetection || scenarios[activeScenario];

  const getRiskColor = (score: number) => {
    if (score >= 85) return 'from-red-500 to-rose-600';
    if (score >= 70) return 'from-orange-500 to-amber-500';
    if (score >= 40) return 'from-amber-400 to-yellow-500';
    return 'from-emerald-400 to-teal-500';
  };

  const factors = [
    { name: 'Object Classification Hazard', weight: '30%', score: target.factor_breakdown?.object_hazard || 24.6, desc: 'Intrinsic environmental and entanglement severity' },
    { name: 'Physical Dimensions & Span', weight: '25%', score: target.factor_breakdown?.physical_dimensions || 19, desc: 'Obstruction footprint across seabed' },
    { name: 'Depth Vulnerability', weight: '20%', score: target.factor_breakdown?.depth_vulnerability || 15, desc: 'Proximity to shallow navigation & trawling planes' },
    { name: 'Acoustic Backscatter & Shadow', weight: '15%', score: target.factor_breakdown?.acoustic_signature || 25, desc: 'Hard vs soft reflection intensity return' },
    { name: 'Out-of-Distribution Uncertainty', weight: '10%', score: target.factor_breakdown?.ood_uncertainty || 5, desc: 'Elevates score when classification certainty is low' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              EXPLAINABLE AI (XAI)
            </span>
            <span className="text-slate-400 text-xs font-mono">
              QUANTIFIABLE RISK MODELING ENGINE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans mt-1">
            Explainable AI Risk Scoring & Factor Breakdown
          </h1>
        </div>

        {/* Target Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'net', label: 'Ghost Net (High)' },
            { id: 'ship', label: 'Ship Hull (Critical)' },
            { id: 'metal', label: 'Metal Cargo (Med)' },
            { id: 'anomaly', label: 'Unknown Anomaly (High)' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveScenario(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                activeScenario === item.id
                  ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Composite Risk Meter & Factor Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Risk Score Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 space-y-6 bg-ocean-950/95 shadow-2xl">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  TARGET RISK ASSESSMENT INDEX
                </span>
                <h3 className="text-xl font-bold text-white font-sans flex items-center gap-2">
                  <span>{target.object_type}</span>
                  <span className="text-xs font-mono text-cyan-400 font-normal">
                    ({target.detection_code})
                  </span>
                </h3>
              </div>

              {/* Large Score Callout */}
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black font-mono text-white">
                  {target.risk_score}
                </span>
                <span className="text-xl font-mono text-slate-400 font-bold">/ 100</span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-black uppercase tracking-wider ${
                  target.risk_score >= 85 ? 'bg-red-950 text-red-400 border border-red-500' :
                  target.risk_score >= 70 ? 'bg-orange-950 text-orange-400 border border-orange-500' :
                  'bg-amber-950 text-amber-300 border border-amber-500'
                }`}>
                  {target.risk_level}
                </span>
              </div>
            </div>

            {/* Horizontal Risk Meter Bar */}
            <div className="space-y-2">
              <div className="w-full bg-slate-900 h-4 rounded-full overflow-hidden p-0.5 border border-slate-800 flex relative">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${getRiskColor(target.risk_score)} transition-all duration-500`}
                  style={{ width: `${target.risk_score}%` }}
                />
              </div>

              {/* Threshold Labels */}
              <div className="grid grid-cols-4 text-center text-[10px] font-mono text-slate-400 pt-1">
                <div className="text-emerald-400 font-semibold border-r border-slate-800">LOW (0–39)</div>
                <div className="text-amber-400 font-semibold border-r border-slate-800">MEDIUM (40–69)</div>
                <div className="text-orange-400 font-semibold border-r border-slate-800">HIGH (70–84)</div>
                <div className="text-red-400 font-semibold">CRITICAL (85–100)</div>
              </div>
            </div>

          </div>

          {/* 5 Quantifiable Risk Factors List */}
          <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 font-mono flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Multi-Factor Weighting Breakdown</span>
            </h3>

            <div className="space-y-3">
              {factors.map((f, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{f.name}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[10px] text-slate-500">Weight: {f.weight}</span>
                      <span className="text-cyan-400 font-bold">{f.score} pts</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Explainable AI "Why Was This Classified As..." */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 space-y-6 bg-ocean-950/95 shadow-2xl">
            
            <div className="space-y-1 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold">
                <Sparkles className="w-4 h-4" />
                <span>EXPLAINABLE AI REASONING (XAI)</span>
              </div>
              <h3 className="text-lg font-extrabold text-white font-sans">
                Why was this classified as {target.risk_level} risk?
              </h3>
            </div>

            {/* Causal Reasoning Paragraph */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/20 text-xs text-slate-200 leading-relaxed space-y-3 font-sans">
              <p>
                {target.why_risk}
              </p>
            </div>

            {/* Verified Factor Checklist */}
            <div className="space-y-2 text-xs font-mono">
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider">
                FACTOR VERIFICATION MATRIX
              </span>
              <div className="space-y-1.5 text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Object Size: {target.estimated_size}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Acoustic Backscatter: Shadow confirmed ({target.acoustic_shadow_len_m}m)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Bathymetry: Depth {target.estimated_depth}m within active trawl zone</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Proximity: Commercial Shipping Channel Sector 7</span>
                </div>
              </div>
            </div>

            {/* Next Steps CTA */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => setActiveTab('reports')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider shadow-lg transition-all"
              >
                Export Risk Assessment to PDF Report
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
