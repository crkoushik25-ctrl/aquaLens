import React, { useState, useEffect } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Polyline,
  Circle,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import { 
  Compass, 
  Filter, 
  Search, 
  Crosshair, 
  ShieldAlert, 
  Eye, 
  Layers, 
  Radio, 
  Navigation,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { api } from '../services/api';
import { Detection } from '../types';

// Custom Leaflet marker icons with pulsating radar rings
const createMarkerIcon = (risk: string, isAnomaly: boolean) => {
  let color = '#10b981'; // Green
  if (risk === 'CRITICAL') color = '#ef4444'; // Red
  else if (risk === 'HIGH') color = '#f97316'; // Orange
  else if (risk === 'MEDIUM') color = '#f59e0b'; // Amber

  const html = `
    <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
      <span style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background-color: ${color}; opacity: 0.3; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
      <span style="width: 14px; height: 14px; border-radius: 50%; background-color: ${color}; border: 2px solid #ffffff; box-shadow: 0 0 10px ${color};"></span>
    </div>
  `;

  return L.divIcon({
    html: html,
    className: 'custom-sonar-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
};

// Component to handle map recentering
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
}

interface AnomalyMapPageProps {
  onSelectDetection: (det: Detection) => void;
  setActiveTab: (tab: string) => void;
}

export const AnomalyMapPage: React.FC<AnomalyMapPageProps> = ({
  onSelectDetection,
  setActiveTab
}) => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [focusedLocation, setFocusedLocation] = useState<{ lat: number; lng: number }>({
    lat: 11.0168,
    lng: 76.9558
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await api.getDetections();
        setDetections(data);
      } catch (err) {
        console.error('Failed to load map detections', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filtered markers
  const filteredMarkers = detections.filter((d) => {
    if (selectedFilter === 'UNKNOWN') return d.is_anomaly;
    if (selectedFilter !== 'ALL' && d.risk_level !== selectedFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        d.detection_code.toLowerCase().includes(q) ||
        d.object_type.toLowerCase().includes(q) ||
        d.status.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Simulated Towfish Trackline Path
  const surveyTrackline: [number, number][] = [
    [11.0050, 76.9400],
    [11.0120, 76.9480],
    [11.0168, 76.9558],
    [11.0231, 76.9612],
    [11.0282, 76.9671],
    [11.0350, 76.9750]
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              GEOSPATIAL HYDROGRAPHIC GIS
            </span>
            <span className="text-slate-400 text-xs font-mono">
              NAVAREA VIII • CONTINENTAL SHELF
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans mt-1">
            Side-Scan Sonar Anomaly & Bathymetry Map
          </h1>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ID, class, status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-48 sm:w-60 font-mono"
            />
          </div>

          {/* Filter Toolbar */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'UNKNOWN'].map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                  selectedFilter === f
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Full-Screen GIS Map Container */}
      <div className="relative w-full h-[620px] rounded-3xl overflow-hidden glass-panel border border-cyan-500/30 shadow-2xl">
        
        {/* Map Overlays (Legend / Telemetry HUD) */}
        <div className="absolute top-4 left-4 z-[1000] glass-panel px-4 py-3 rounded-2xl border border-cyan-500/30 text-xs font-mono space-y-2 bg-ocean-950/90 shadow-xl max-w-xs pointer-events-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-cyan-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse" /> SURVEY TRACK #04
            </span>
            <span className="text-[10px] text-slate-400">{filteredMarkers.length} TARGETS</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Low Risk (🟢)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Medium Risk (🟡)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
              <span>High Risk (🟠)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span>Critical (🔴)</span>
            </div>
          </div>
          
          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
            BLUE LINE: Active Autonomous Towfish Track
          </div>
        </div>

        {/* Leaflet Map */}
        <MapContainer
          center={[11.0168, 76.9558]}
          zoom={13}
          scrollWheelZoom={true}
          className="w-full h-full z-0"
        >
          <RecenterMap lat={focusedLocation.lat} lng={focusedLocation.lng} />

          {/* Dark Ocean Basemap TileLayer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Towfish Survey Path Line */}
          <Polyline
            positions={surveyTrackline}
            pathOptions={{ color: '#00f2fe', weight: 3, dashArray: '6, 8', opacity: 0.85 }}
          />

          {/* Marine Conservation Exclusion Zone Circle */}
          <Circle
            center={[11.0168, 76.9558]}
            radius={900}
            pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.08, weight: 1.5 }}
          />

          {/* Markers */}
          {filteredMarkers.map((det) => (
            <Marker
              key={det.id || det.detection_code}
              position={[det.latitude, det.longitude]}
              icon={createMarkerIcon(det.risk_level, det.is_anomaly)}
            >
              <Popup>
                <div className="p-2 space-y-2 text-xs font-mono text-slate-200 min-w-[220px]">
                  
                  {/* Popup Header */}
                  <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                    <span className="font-bold text-cyan-300">
                      {det.scan_code || det.detection_code}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                      det.risk_level === 'CRITICAL' ? 'bg-red-950 text-red-400' :
                      det.risk_level === 'HIGH' ? 'bg-orange-950 text-orange-400' :
                      det.risk_level === 'MEDIUM' ? 'bg-amber-950 text-amber-300' :
                      'bg-emerald-950 text-emerald-400'
                    }`}>
                      {det.risk_level}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="space-y-1">
                    <div className="font-sans font-bold text-white text-sm">
                      {det.object_type}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Confidence: <strong className="text-cyan-400">{Math.round(det.confidence * 100)}%</strong>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Depth: <strong>{det.estimated_depth}m</strong> • Size: <strong>{det.estimated_size}</strong>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Fix: {det.latitude.toFixed(4)}° N, {det.longitude.toFixed(4)}° E
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => {
                      onSelectDetection(det);
                      setActiveTab('results');
                    }}
                    className="w-full mt-2 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] uppercase transition-all flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View Full Analysis</span>
                  </button>

                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

      </div>

    </div>
  );
};
