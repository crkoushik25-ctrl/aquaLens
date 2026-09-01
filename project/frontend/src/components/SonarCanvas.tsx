import React, { useState, useRef, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  Crosshair, 
  Ruler, 
  Eye, 
  EyeOff, 
  Download,
  Activity,
  Maximize2
} from 'lucide-react';
import { Detection } from '../types';

interface SonarCanvasProps {
  imageUrl: string;
  detections: Detection[];
  selectedDetection?: Detection | null;
  onSelectDetection?: (det: Detection) => void;
  showOverlay?: boolean;
}

export type ColormapMode = 'amber' | 'cyan' | 'thermal' | 'grayscale';

export const SonarCanvas: React.FC<SonarCanvasProps> = ({
  imageUrl,
  detections,
  selectedDetection,
  onSelectDetection,
  showOverlay = true
}) => {
  const [colormap, setColormap] = useState<ColormapMode>('amber');
  const [zoom, setZoom] = useState<number>(1);
  const [showBoxes, setShowBoxes] = useState<boolean>(true);
  const [showRuler, setShowRuler] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom(prev => Math.min(2.5, prev + 0.25));
  const handleZoomOut = () => setZoom(prev => Math.max(0.75, prev - 0.25));
  const handleResetZoom = () => setZoom(1);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x: Math.round(x), y: Math.round(y) });
  };

  const getColormapFilter = () => {
    switch (colormap) {
      case 'cyan':
        return 'hue-rotate(180deg) saturate(1.4) contrast(1.2)';
      case 'thermal':
        return 'invert(0.9) hue-rotate(240deg) saturate(2) contrast(1.3)';
      case 'grayscale':
        return 'grayscale(1) contrast(1.25) brightness(1.1)';
      case 'amber':
      default:
        return 'sepia(0.6) saturate(1.8) hue-rotate(5deg) contrast(1.15)';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'CRITICAL': return '#ef4444';
      case 'HIGH': return '#f97316';
      case 'MEDIUM': return '#f59e0b';
      case 'LOW':
      default: return '#10b981';
    }
  };

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden glass-panel border border-cyan-500/30 shadow-2xl bg-ocean-950/90">
      
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-ocean-900/90 border-b border-cyan-500/20 text-xs">
        
        {/* Colormap Selectors */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1 mr-1">
            <Layers className="w-3.5 h-3.5 text-cyan-400" /> Colormap:
          </span>
          {[
            { id: 'amber', label: 'Amber Sonar', color: 'bg-amber-500' },
            { id: 'cyan', label: 'Cyan Waterfall', color: 'bg-cyan-400' },
            { id: 'thermal', label: 'Thermal IR', color: 'bg-purple-500' },
            { id: 'grayscale', label: 'Grayscale', color: 'bg-slate-400' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setColormap(mode.id as ColormapMode)}
              className={`px-2 py-1 rounded-md font-mono text-[11px] flex items-center gap-1.5 transition-all ${
                colormap === mode.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${mode.color}`} />
              <span>{mode.label}</span>
            </button>
          ))}
        </div>

        {/* Canvas Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-slate-900/80 rounded-lg border border-slate-700/80 p-0.5">
            <button
              onClick={handleZoomOut}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[10px] text-cyan-300">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 ml-0.5 border-l border-slate-700"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Toggle overlays */}
          <button
            onClick={() => setShowBoxes(!showBoxes)}
            className={`p-1.5 rounded-lg border text-xs font-mono flex items-center gap-1 transition-all ${
              showBoxes
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
            title="Toggle Bounding Boxes"
          >
            {showBoxes ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline text-[11px]">Boxes</span>
          </button>

          <button
            onClick={() => setShowRuler(!showRuler)}
            className={`p-1.5 rounded-lg border text-xs font-mono flex items-center gap-1 transition-all ${
              showRuler
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
            title="Toggle Acoustic Shadow Meter"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Shadows</span>
          </button>

          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1.5 rounded-lg border text-xs font-mono flex items-center gap-1 transition-all ${
              showGrid
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
            title="Toggle Slant Range Grid"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Main Sonar Canvas Area */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMousePos(null)}
        className="relative w-full aspect-[16/9] min-h-[380px] bg-slate-950 overflow-hidden cursor-crosshair select-none flex items-center justify-center"
      >
        {/* Sonar Image Layer */}
        <div 
          className="relative w-full h-full transition-transform duration-150 ease-out origin-center"
          style={{ transform: `scale(${zoom})` }}
        >
          <img
            src={imageUrl || "/static/sonar_images/son-001_fishing_net.jpg"}
            alt="Side-Scan Sonar Acoustic Waterfall"
            className="w-full h-full object-cover"
            style={{ filter: getColormapFilter() }}
            onError={(e) => {
              // Fallback generated canvas if image path not found
              e.currentTarget.style.display = 'none';
            }}
          />

          {/* Central Nadir Line (Towfish Flight Path) */}
          {showGrid && (
            <>
              <div className="absolute inset-y-0 left-1/2 w-0.5 bg-cyan-400/40 border-l border-dashed border-cyan-300/60 pointer-events-none">
                <span className="absolute top-2 left-2 text-[9px] font-mono text-cyan-300/80 bg-ocean-950/80 px-1 py-0.5 rounded border border-cyan-500/30">
                  NADIR (TOWFISH TRACK)
                </span>
              </div>
              
              {/* Slant Range Distance Indicators */}
              <div className="absolute inset-0 pointer-events-none sonar-grid opacity-60" />
              
              {/* Range Scale Markers */}
              <div className="absolute top-2 left-3 text-[10px] font-mono text-cyan-400/80 bg-ocean-950/70 px-2 py-0.5 rounded border border-cyan-500/20">
                PORT (LEFT CHANNEL): 75m
              </div>
              <div className="absolute top-2 right-3 text-[10px] font-mono text-cyan-400/80 bg-ocean-950/70 px-2 py-0.5 rounded border border-cyan-500/20">
                STARBOARD (RIGHT CHANNEL): 75m
              </div>
            </>
          )}

          {/* AI Bounding Box Overlays */}
          {showBoxes && detections.map((det, idx) => {
            const isSelected = selectedDetection?.detection_code === det.detection_code;
            const riskColor = getRiskColor(det.risk_level);
            
            const leftPct = (det.bbox.x * 100);
            const topPct = (det.bbox.y * 100);
            const widthPct = (det.bbox.w * 100);
            const heightPct = (det.bbox.h * 100);

            return (
              <div
                key={det.id || idx}
                onClick={() => onSelectDetection && onSelectDetection(det)}
                className={`absolute cursor-pointer transition-all ${
                  isSelected 
                    ? 'ring-2 ring-cyan-300 ring-offset-2 ring-offset-slate-950 scale-[1.02]' 
                    : 'hover:scale-[1.01]'
                }`}
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  width: `${widthPct}%`,
                  height: `${heightPct}%`,
                }}
              >
                {/* Bounding Box Rect */}
                <div 
                  className="w-full h-full border-2 rounded-sm relative"
                  style={{ 
                    borderColor: riskColor,
                    backgroundColor: `${riskColor}18`,
                    boxShadow: `0 0 15px ${riskColor}40`
                  }}
                >
                  {/* Corner Reticle Markers */}
                  <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2" style={{ borderColor: riskColor }} />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2" style={{ borderColor: riskColor }} />
                  <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2" style={{ borderColor: riskColor }} />
                  <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2" style={{ borderColor: riskColor }} />

                  {/* Header Label Tag */}
                  <div 
                    className="absolute -top-7 left-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1.5 whitespace-nowrap shadow-lg"
                    style={{ 
                      backgroundColor: '#070f1e',
                      color: '#ffffff',
                      border: `1px solid ${riskColor}`
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: riskColor }} />
                    <span className="uppercase tracking-wider">{det.object_type}</span>
                    <span className="text-cyan-300 font-extrabold">{Math.round(det.confidence * 100)}%</span>
                  </div>

                  {/* Dimension Tag */}
                  <div className="absolute -bottom-5 right-0 px-1.5 py-0.2 rounded text-[9px] font-mono bg-slate-950/90 text-slate-300 border border-slate-700">
                    {det.estimated_size} • {det.estimated_depth}m
                  </div>

                  {/* Acoustic Shadow Meter Line */}
                  {showRuler && det.acoustic_shadow_len_m && (
                    <div className="absolute -top-10 right-1/2 translate-x-1/2 flex flex-col items-center pointer-events-none">
                      <div className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30 whitespace-nowrap">
                        SHADOW: {det.acoustic_shadow_len_m}m
                      </div>
                      <div className="w-0.5 h-4 bg-cyan-400/60 border-l border-dashed border-cyan-300" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Crosshair Cursor HUD */}
        {mousePos && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-ocean-950/85 backdrop-blur border border-cyan-500/30 font-mono text-[10px] text-cyan-400 flex items-center gap-2 pointer-events-none">
            <Crosshair className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>REL POS: X: {mousePos.x}% • Y: {mousePos.y}%</span>
            <span>|</span>
            <span>BACKSCATTER: -18.4 dB</span>
          </div>
        )}

        {/* Live Sonar Sweep Line */}
        <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40 pointer-events-none animate-waterfall-scan" />

      </div>

      {/* Bottom Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-ocean-900/80 border-t border-cyan-500/20 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-cyan-300">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            TRANSDUCER FREQ: 455 kHz
          </span>
          <span>ALTITUDE: 12.5m</span>
          <span>SLANT RANGE: 75m</span>
        </div>
        <div className="text-slate-300">
          ACOUSTIC RESOLUTION: 0.05m/pixel • GAIN CURVE: TVG-18
        </div>
      </div>

    </div>
  );
};
