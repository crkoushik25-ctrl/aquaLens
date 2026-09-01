import React, { useState } from 'react';
import { 
  GitCompare, 
  Layers, 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  Sliders,
  Maximize2
} from 'lucide-react';

interface HistoricalComparisonPageProps {
  setActiveTab: (tab: string) => void;
}

export const HistoricalComparisonPage: React.FC<HistoricalComparisonPageProps> = ({ setActiveTab }) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');
  const [showHeatmapOverlay, setShowHeatmapOverlay] = useState<boolean>(true);

  const baselineImg = '/static/sonar_images/survey_2024_baseline.jpg';
  const currentImg = '/static/sonar_images/survey_2026_current.jpg';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              TEMPORAL DIFFERENTIAL AI
            </span>
            <span className="text-slate-400 text-xs font-mono">
              BENTHIC SURFACE EVOLUTION ENGINE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans mt-1">
            Temporal Change Detection & Debris Influx Monitoring
          </h1>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setViewMode('slider')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'slider'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Split-Screen Slider
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'side-by-side'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Side-by-Side View
            </button>
          </div>
        </div>
      </div>

      {/* New Anomaly Alert Callout */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-950/80 via-ocean-900 to-ocean-950 border-2 border-orange-500/50 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/40 shrink-0">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-orange-300 uppercase tracking-wider">
                TEMPORAL DISPARITY DETECTED
              </span>
              <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-orange-950 text-orange-400 border border-orange-500/40">
                CHANGE CONFIDENCE: 84%
              </span>
            </div>
            <h3 className="text-base font-extrabold text-white font-sans">
              NEW ANOMALY DETECTED: Abandoned Monofilament Netting Bundle
            </h3>
            <p className="text-xs text-slate-300">
              No target present in April 2024 baseline survey. Anthropogenic accumulation occurred between 2024 and March 2026.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('reports')}
          className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-mono font-bold text-xs transition-all whitespace-nowrap shadow-md"
        >
          Export Change Report
        </button>
      </div>

      {/* Comparison Canvas Area */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 space-y-4 bg-ocean-950/90 shadow-2xl">
        
        {/* Controls and Metadata Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-300 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Calendar className="w-3.5 h-3.5" />
              BASELINE: APR 2024 (SURV-2024-A)
            </span>
            <span>vs</span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <Clock className="w-3.5 h-3.5" />
              RESURVEY: MAR 2026 (SURV-2026-LIVE)
            </span>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={showHeatmapOverlay}
              onChange={(e) => setShowHeatmapOverlay(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-cyan-400 focus:ring-cyan-400"
            />
            <span>Highlight Differential Delta</span>
          </label>
        </div>

        {/* View Mode: Interactive Slider vs Side-by-Side */}
        {viewMode === 'slider' ? (
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 select-none">
            
            {/* Background: Current 2026 Survey */}
            <img
              src={currentImg}
              alt="2026 Resurvey"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'sepia(0.6) saturate(1.8) hue-rotate(5deg) contrast(1.15)' }}
            />
            
            {/* Top Badge: 2026 */}
            <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-xl bg-orange-950/90 border border-orange-500/40 text-orange-300 font-mono text-xs font-bold shadow-lg">
              CURRENT SURVEY: 2026 (NEW DEBRIS PRESENT)
            </div>

            {/* Foreground: 2024 Baseline Clipped by Slider */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-cyan-400 shadow-2xl z-10"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={baselineImg}
                alt="2024 Baseline"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ 
                  width: '100%', 
                  height: '100%',
                  filter: 'sepia(0.6) saturate(1.8) hue-rotate(5deg) contrast(1.15)' 
                }}
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold shadow-lg">
                BASELINE SURVEY: 2024 (UNDISTURBED SEABED)
              </div>
            </div>

            {/* Slider Drag Handle */}
            <div
              className="absolute inset-y-0 z-30 flex items-center justify-center -ml-3 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-6 h-12 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg border-2 border-slate-950 font-bold font-mono text-[10px]">
                ↔
              </div>
            </div>

            {/* Range Input for Touch/Drag Slider */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-40"
            />

          </div>
        ) : (
          /* Side-by-Side Dual Panels */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
                <span>BASELINE SURVEY (APRIL 2024)</span>
                <span className="text-emerald-400">NO TARGET DETECTED</span>
              </div>
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <img
                  src={baselineImg}
                  alt="Baseline 2024"
                  className="w-full h-full object-cover"
                  style={{ filter: 'sepia(0.6) saturate(1.8) hue-rotate(5deg) contrast(1.15)' }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-orange-300">
                <span>RESURVEY (MARCH 2026)</span>
                <span className="text-orange-400 font-bold">⚠ GHOST NET ACCUMULATION</span>
              </div>
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-orange-500/40 bg-slate-950">
                <img
                  src={currentImg}
                  alt="Resurvey 2026"
                  className="w-full h-full object-cover"
                  style={{ filter: 'sepia(0.6) saturate(1.8) hue-rotate(5deg) contrast(1.15)' }}
                />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Temporal Analysis Findings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-mono text-xs">
        
        <div className="glass-card p-5 rounded-2xl border border-cyan-500/20 space-y-2">
          <span className="text-slate-400 uppercase text-[10px]">Previous 2024 Scan</span>
          <div className="text-sm font-bold text-slate-100">
            No Detected Anthropogenic Object
          </div>
          <p className="text-slate-400 font-sans text-xs">
            Acoustic backscatter exhibited typical sand ripple wavelength without localized shadow disparity.
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-orange-500/30 space-y-2">
          <span className="text-slate-400 uppercase text-[10px]">Current 2026 Resurvey</span>
          <div className="text-sm font-bold text-orange-300">
            High-Risk Synthetic Debris Confirmed
          </div>
          <p className="text-slate-400 font-sans text-xs">
            Detected 8.4m monofilament web casting a 3.2m acoustic shadow. Entanglement severity: HIGH (82/100).
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-cyan-500/20 space-y-2">
          <span className="text-slate-400 uppercase text-[10px]">Change Confidence Rating</span>
          <div className="text-2xl font-extrabold text-cyan-400">
            84.2% Delta Confidence
          </div>
          <p className="text-slate-400 font-sans text-xs">
            Differential correlation confirms genuine physical introduction rather than bathymetric erosion.
          </p>
        </div>

      </div>

    </div>
  );
};
