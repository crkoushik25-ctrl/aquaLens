import React from 'react';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Sparkles, 
  Radar, 
  Award,
  Zap
} from 'lucide-react';

interface Step {
  id: string;
  tab: string;
  title: string;
  badge: string;
  description: string;
  actionText: string;
}

const DEMO_STEPS: Step[] = [
  {
    id: 'step-1',
    tab: 'landing',
    title: '1. Problem Overview & Mission Hero',
    badge: 'SIH OVERVIEW',
    description: 'Explore the mission statement: Turning Sonar Data into Underwater Intelligence. Review simulated prototype metrics & live acoustic stream.',
    actionText: 'Next: Command Dashboard'
  },
  {
    id: 'step-2',
    tab: 'dashboard',
    title: '2. Tactical Command Dashboard',
    badge: 'TELEMETRY & KPIS',
    description: 'Command center displaying 1,248+ scans, 86 anomalies, Recharts detection trends over time, risk breakdown donut chart, and live towfish telemetry.',
    actionText: 'Next: Sonar Analysis'
  },
  {
    id: 'step-3',
    tab: 'analyze',
    title: '3. Sonar Image Upload & AI Inference',
    badge: 'ACOUSTIC PIPELINE',
    description: 'Select a sample side-scan sonar image (or upload TIFF/PNG), calibrate sensitivity sliders, and execute the 7-step AI Computer Vision pipeline.',
    actionText: 'Next: Detection Canvas'
  },
  {
    id: 'step-4',
    tab: 'results',
    title: '4. AI Bounding Box & Acoustic Shadow',
    badge: 'CV VISUALIZER',
    description: 'Interactive canvas rendering AI bounding box overlay, confidence score (91%), estimated dimensions (8.4m × 2.1m), and multi-spectral colormap filters.',
    actionText: 'Next: Unknown Anomaly Engine'
  },
  {
    id: 'step-5',
    tab: 'unknown-anomaly',
    title: '5. Out-of-Distribution Unknown Anomaly Detection',
    badge: 'OOD ANOMALY',
    description: 'Specialized inspection interface for unclassified acoustic signatures. Shows low known-class similarity and recommends marine inspection protocol.',
    actionText: 'Next: Explainable AI Risk'
  },
  {
    id: 'step-6',
    tab: 'risk',
    title: '6. Explainable AI (XAI) Risk Assessment',
    badge: 'XAI REASONING',
    description: 'Composite risk score (82/100 HIGH) with multi-factor weighting (object size, depth, acoustic signature) and transparent natural-language causal reasoning.',
    actionText: 'Next: GIS Bathymetry Map'
  },
  {
    id: 'step-7',
    tab: 'map',
    title: '7. Full-Screen GIS Anomaly Map',
    badge: 'GIS LEAFLET',
    description: 'Interactive Leaflet marine map with survey tracklines, risk-colored pulsing markers (🟢🟡🟠🔴), and quick-inspection anomaly dossiers.',
    actionText: 'Next: Temporal Change Detection'
  },
  {
    id: 'step-8',
    tab: 'comparison',
    title: '8. Temporal Change Detection (2024 vs 2026)',
    badge: 'CHANGE DETECTION',
    description: 'Compare historical baseline survey against resurvey with interactive side-by-side split slider. Instantly flags newly introduced marine debris.',
    actionText: 'Next: Survey Report'
  },
  {
    id: 'step-9',
    tab: 'reports',
    title: '9. Official Marine Survey Report Generator',
    badge: 'REPORT & EXPORT',
    description: 'Generate defense/scientific survey anomaly reports with executive summaries, risk matrices, high-res sonar crops, PDF print layout, and CSV exports.',
    actionText: 'Finish Tour'
  }
];

interface JudgeDemoTourProps {
  currentStepIndex: number;
  setCurrentStepIndex: (idx: number) => void;
  setActiveTab: (tab: string) => void;
  onClose: () => void;
}

export const JudgeDemoTour: React.FC<JudgeDemoTourProps> = ({
  currentStepIndex,
  setCurrentStepIndex,
  setActiveTab,
  onClose
}) => {
  const currentStep = DEMO_STEPS[currentStepIndex] || DEMO_STEPS[0];
  const progressPct = Math.round(((currentStepIndex + 1) / DEMO_STEPS.length) * 100);

  const goToStep = (idx: number) => {
    if (idx >= 0 && idx < DEMO_STEPS.length) {
      setCurrentStepIndex(idx);
      setActiveTab(DEMO_STEPS[idx].tab);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      goToStep(currentStepIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-3xl">
      <div className="glass-panel rounded-2xl p-4 border-2 border-amber-500/50 shadow-2xl shadow-amber-500/15 bg-ocean-950/95 backdrop-blur-xl">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Award className="w-4 h-4" />
            </span>
            <div>
              <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider">
                SIH Judge Guided Demonstration
              </span>
              <span className="ml-2 text-[11px] font-mono text-slate-400">
                Step {currentStepIndex + 1} of {DEMO_STEPS.length} ({progressPct}%)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              {currentStep.badge}
            </span>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800"
              title="Close Judge Demo Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full my-2.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-cyan-500 via-amber-400 to-orange-500 h-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Content Body */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-1">
          <div className="space-y-1 max-w-xl">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              {currentStep.title}
            </h3>
            <p className="text-xs text-slate-300 leading-snug">
              {currentStep.description}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none text-xs font-medium flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-orange-400 flex items-center gap-1.5 transition-all"
            >
              <span>{currentStep.actionText}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Jump Step Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-2 border-t border-slate-800/80 mt-2">
          {DEMO_STEPS.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => goToStep(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentStepIndex 
                  ? 'w-6 bg-amber-400' 
                  : idx < currentStepIndex 
                    ? 'w-2 bg-cyan-400/70' 
                    : 'w-2 bg-slate-700'
              }`}
              title={s.title}
            />
          ))}
        </div>

      </div>
    </div>
  );
};
