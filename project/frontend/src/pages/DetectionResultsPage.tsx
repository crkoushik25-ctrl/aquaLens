import React, { useState } from 'react';
import { 
  Crosshair, 
  ShieldAlert, 
  MapPin, 
  Ruler, 
  Activity, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  FileText, 
  Compass, 
  GitCompare,
  AlertTriangle,
  CheckCircle2,
  Download,
  Info
} from 'lucide-react';
import { SonarCanvas } from '../components/SonarCanvas';
import { Detection } from '../types';

interface DetectionResultsPageProps {
  currentDetection: Detection | null;
  allDetections: Detection[];
  onSelectDetection: (det: Detection) => void;
  setActiveTab: (tab: string) => void;
}

export const DetectionResultsPage: React.FC<DetectionResultsPageProps> = ({
  currentDetection,
  allDetections,
  onSelectDetection,
  setActiveTab
}) => {
  // Default fallback detection if none selected
  const defaultDet: Detection = {
    id: 1,
    detection_code: "DET-001",
    scan_code: "SON-001",
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
    why_risk: "High lethal entanglement threat for marine fauna and propeller hazard at 42m bathymetry.",
    recommendation: "Priority diver/ROV recovery operation recommended to mitigate ghost fishing.",
    status: "Review",
    factor_breakdown: {
      object_hazard: 24.6,
      physical_dimensions: 19,
      depth_vulnerability: 15,
      acoustic_signature: 25,
      ood_uncertainty: 5
    }
  };

  const activeDet = currentDetection || defaultDet;
  const detectionsList = allDetections.length > 0 ? allDetections : [activeDet];

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return 'bg-red-950 text-red-400 border border-red-500/40';
      case 'HIGH':
        return 'bg-orange-950 text-orange-400 border border-orange-500/40';
      case 'MEDIUM':
        return 'bg-amber-950 text-amber-300 border border-amber-500/40';
      case 'LOW':
      default:
        return 'bg-emerald-950 text-emerald-400 border border-emerald-500/40';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              DETECTION RESULT DOSSIER
            </span>
            <span className="text-slate-400 text-xs font-mono">
              TARGET CODE: {activeDet.detection_code}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans mt-1">
            Acoustic Target Overlay & Bounding Box Inspection
          </h1>
        </div>

        {/* Quick Jump Action Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('map')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>View on GIS Map</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive High-Resolution Sonar Canvas */}
        <div className="lg:col-span-8 space-y-4">
          
          <SonarCanvas
            imageUrl={activeDet.image_url}
            detections={detectionsList}
            selectedDetection={activeDet}
            onSelectDetection={onSelectDetection}
            showOverlay={true}
          />

          {/* Detections List Selector Strip */}
          {detectionsList.length > 1 && (
            <div className="glass-panel p-3 rounded-2xl border border-cyan-500/20 flex items-center gap-3 overflow-x-auto">
              <span className="text-xs font-mono text-slate-400 shrink-0">
                DETECTED TARGETS:
              </span>
              {detectionsList.map((d) => (
                <button
                  key={d.id || d.detection_code}
                  onClick={() => onSelectDetection(d)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-2 shrink-0 transition-all border ${
                    activeDet.detection_code === d.detection_code
                      ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Crosshair className="w-3 h-3 text-cyan-400" />
                  <span>{d.object_type}</span>
                  <span className="text-cyan-300 font-bold">{Math.round(d.confidence * 100)}%</span>
                </button>
              ))}
            </div>
          )}

          {/* Acoustic Shadow Analysis Box */}
          <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold">
              <Ruler className="w-4 h-4" />
              <span>ACOUSTIC SHADOW & ELEVATION GEOMETRY</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Based on acoustic ray tracing with towfish altitude of 12.5m and slant range of 75m, the observed acoustic shadow length ({activeDet.acoustic_shadow_len_m}m) indicates an object height protrusion of approximately 1.2m above the seabed plane.
            </p>
          </div>

        </div>

        {/* Right Column: Detailed Target Intelligence Dossier */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 space-y-6 bg-ocean-950/95 shadow-2xl">
            
            {/* Header / Classification Banner */}
            <div className="space-y-2 pb-4 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-slate-400">
                  CLASSIFICATION RESULT
                </span>
                <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${getRiskBadge(activeDet.risk_level)}`}>
                  {activeDet.risk_level} RISK
                </span>
              </div>
              <h2 className="text-2xl font-black text-white font-sans uppercase">
                {activeDet.object_type}
              </h2>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 font-mono">
              
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 block">AI CONFIDENCE</span>
                <span className="text-lg font-bold text-cyan-400">
                  {Math.round(activeDet.confidence * 100)}%
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 block">RISK SCORE</span>
                <span className="text-lg font-bold text-orange-400">
                  {activeDet.risk_score} / 100
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 block">ESTIMATED SIZE</span>
                <span className="text-sm font-bold text-slate-200">
                  {activeDet.estimated_size}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 block">BATHYMETRIC DEPTH</span>
                <span className="text-sm font-bold text-slate-200">
                  {activeDet.estimated_depth}m
                </span>
              </div>

            </div>

            {/* Coordinates */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>GEOGRAPHIC FIX:</span>
              </div>
              <span className="text-cyan-300 font-bold">
                {activeDet.latitude.toFixed(4)}° N, {activeDet.longitude.toFixed(4)}° E
              </span>
            </div>

            {/* Recommendation & Status */}
            <div className="space-y-2">
              <span className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                RECOMMENDED ACTION
              </span>
              <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 leading-relaxed">
                {activeDet.recommendation}
              </div>
            </div>

            {/* Explainability Snippet */}
            <div className="space-y-2">
              <span className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                EXPLAINABLE AI CAUSAL REASONING
              </span>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                {activeDet.why_risk}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => setActiveTab('risk')}
                className="w-full py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 font-bold text-xs font-mono transition-all flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Deep Risk & Explainability Breakdown</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveTab('comparison')}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs font-mono transition-all flex items-center justify-center gap-2"
              >
                <GitCompare className="w-4 h-4 text-cyan-400" />
                <span>Compare Against Historical Survey</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
