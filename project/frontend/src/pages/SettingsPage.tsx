import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Sliders, 
  Bell, 
  Radio, 
  Map, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  RefreshCw,
  Cpu
} from 'lucide-react';

interface SettingsPageProps {
  setActiveTab: (tab: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ setActiveTab }) => {
  const [frequency, setFrequency] = useState<number>(455);
  const [slantRangeCorrection, setSlantRangeCorrection] = useState<boolean>(true);
  const [sensitivity, setSensitivity] = useState<number>(80);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(70);
  const [criticalThreshold, setCriticalThreshold] = useState<number>(85);
  const [enableOOD, setEnableOOD] = useState<boolean>(true);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              SYSTEM CONFIGURATION
            </span>
            <span className="text-slate-400 text-xs font-mono">
              STATION PARAMETERS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans mt-1">
            Sensor, AI Threshold & Preference Settings
          </h1>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        
        {/* Sonar Sensor Calibration */}
        <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 space-y-5 bg-ocean-950/90 shadow-2xl">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold border-b border-slate-800 pb-2">
            <Radio className="w-4 h-4" />
            <span>SIDE-SCAN SONAR TRANSDUCER CALIBRATION</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            
            <div className="space-y-2">
              <label className="text-slate-300 font-semibold block">
                Default Transducer Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-mono focus:outline-none focus:border-cyan-400"
              >
                <option value={100}>100 kHz (Deep Bathymetry / Long Range)</option>
                <option value={455}>455 kHz (Standard Marine Debris Survey)</option>
                <option value={900}>900 kHz (Ultra High-Res Nearfield Scan)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-slate-300 font-semibold block">
                Slant Range Geometric Correction
              </label>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[11px] font-mono">
                  {slantRangeCorrection ? 'Pythagorean Correction Active' : 'Raw Slant Range'}
                </span>
                <button
                  type="button"
                  onClick={() => setSlantRangeCorrection(!slantRangeCorrection)}
                  className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                    slantRangeCorrection ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'
                  }`}
                >
                  <span className="bg-slate-950 w-3.5 h-3.5 rounded-full shadow-md" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* AI Model & Risk Tolerances */}
        <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 space-y-5 bg-ocean-950/90 shadow-2xl">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold border-b border-slate-800 pb-2">
            <Cpu className="w-4 h-4" />
            <span>AI MODEL SENSITIVITY & RISK THRESHOLDS</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300 font-semibold">Detection Sensitivity</span>
                <span className="font-mono text-cyan-400 font-bold">{sensitivity}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={sensitivity}
                onChange={(e) => setSensitivity(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300 font-semibold">Confidence Threshold</span>
                <span className="font-mono text-cyan-400 font-bold">{confidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300 font-semibold">Critical Risk Cutoff</span>
                <span className="font-mono text-red-400 font-bold">{criticalThreshold} / 100</span>
              </div>
              <input
                type="range"
                min="70"
                max="95"
                value={criticalThreshold}
                onChange={(e) => setCriticalThreshold(Number(e.target.value))}
                className="w-full accent-red-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <span className="text-slate-300 font-semibold block">
                Out-of-Distribution (OOD) Anomaly Detector
              </span>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[11px] font-mono">
                  Cosine Entropy Isolation
                </span>
                <button
                  type="button"
                  onClick={() => setEnableOOD(!enableOOD)}
                  className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                    enableOOD ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'
                  }`}
                >
                  <span className="bg-slate-950 w-3.5 h-3.5 rounded-full shadow-md" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-cyan-500/25 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Sensor Configuration</span>
          </button>
        </div>

      </div>

    </div>
  );
};
