import React, { useState, useEffect } from 'react';
import { 
  Scan, 
  AlertTriangle, 
  ShieldAlert, 
  Radio, 
  TrendingUp, 
  PieChart as PieIcon, 
  ArrowUpRight, 
  Eye, 
  Filter, 
  Sparkles,
  Compass,
  FileText,
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { api } from '../services/api';
import { SystemStatistics, Detection } from '../types';

interface DashboardPageProps {
  setActiveTab: (tab: string) => void;
  onSelectDetectionForDetail?: (det: Detection) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  setActiveTab,
  onSelectDetectionForDetail
}) => {
  const [stats, setStats] = useState<SystemStatistics | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('ALL');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [statsData, detectionsData] = await Promise.all([
          api.getStatistics(),
          api.getDetections()
        ]);
        setStats(statsData);
        setDetections(detectionsData);
      } catch (err) {
        console.error('Error loading dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return 'bg-red-950/80 text-red-400 border border-red-500/40';
      case 'HIGH':
        return 'bg-orange-950/80 text-orange-400 border border-orange-500/40';
      case 'MEDIUM':
        return 'bg-amber-950/80 text-amber-300 border border-amber-500/40';
      case 'LOW':
      default:
        return 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40';
    }
  };

  const filteredDetections = detections.filter(d => {
    if (selectedRiskFilter === 'ALL') return true;
    return d.risk_level === selectedRiskFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner & Command Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              MISSION CONTROL
            </span>
            <span className="text-slate-400 text-xs font-mono">
              TRANSIT SURVEY SECTOR 7B
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans mt-1">
            Marine Intelligence Command Dashboard
          </h1>
        </div>

        {/* Live Sonar Feed Telemetry */}
        <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-4 text-xs font-mono border border-cyan-500/30">
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>SONAR TOWFISH ACTIVE</span>
          </div>
          <div className="h-4 w-px bg-slate-700" />
          <div className="text-slate-300">
            PING: <span className="text-cyan-300 font-bold">12 Hz</span> • DEPTH: <span className="text-cyan-300 font-bold">42m</span>
          </div>
        </div>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Scans */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Total Scans</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Scan className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white font-mono">
              {stats?.summary.total_scans.toLocaleString() || '1,248'}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-cyan-400 font-mono flex items-center gap-1">
            <span>342.8 sq km surveyed</span>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-0.5 bg-cyan-500/40" />
        </div>

        {/* Anomalies Detected */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Anomalies Detected</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-sky-200 font-mono">
              {stats?.summary.anomalies_detected || '86'}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-sky-400 font-mono">
            14 out-of-distribution (OOD)
          </div>
          <div className="absolute bottom-0 inset-x-0 h-0.5 bg-sky-500/40" />
        </div>

        {/* High Risk */}
        <div className="glass-panel p-5 rounded-2xl border border-orange-500/30 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">High Risk</span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-orange-400 font-mono">
              {stats?.summary.high_risk || '21'}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-orange-300 font-mono">
            Requires visual confirmation
          </div>
          <div className="absolute bottom-0 inset-x-0 h-0.5 bg-orange-500/40" />
        </div>

        {/* Critical Risk */}
        <div className="glass-panel p-5 rounded-2xl border border-red-500/30 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Critical</span>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-red-400 font-mono">
              {stats?.summary.critical || '7'}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-red-300 font-mono">
            Immediate ROV recovery priority
          </div>
          <div className="absolute bottom-0 inset-x-0 h-0.5 bg-red-500/40" />
        </div>

      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Detection Trend (Area/Line Chart) */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-cyan-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-base text-slate-100 font-sans">
                  Temporal Detection Trends
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Monthly Side-Scan Sonar anomalies & marine debris encounters
              </p>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 px-2 py-0.5 bg-cyan-950/60 rounded border border-cyan-500/20">
              SAMPLE TIMELINE
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.monthly_trends || []}>
                <defs>
                  <linearGradient id="debrisGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00f2fe" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="anomalyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#070f1e',
                    borderColor: 'rgba(0, 242, 254, 0.3)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }}
                />
                <Area type="monotone" dataKey="debris" stroke="#00f2fe" strokeWidth={2} fillOpacity={1} fill="url(#debrisGradient)" name="Marine Debris" />
                <Area type="monotone" dataKey="anomalies" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#anomalyGradient)" name="Unknown Anomalies" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Donut Chart */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-cyan-500/20 space-y-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-base text-slate-100 font-sans">
                Risk Distribution
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Severity categorization across catalog
            </p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.risk_distribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(stats?.risk_distribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#070f1e',
                    borderColor: 'rgba(0, 242, 254, 0.3)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  formatter={(value) => <span className="text-[11px] text-slate-300 font-mono">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Detections Table Section */}
      <div className="glass-panel rounded-2xl border border-cyan-500/20 overflow-hidden space-y-4 p-6">
        
        {/* Table Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h3 className="font-bold text-lg text-slate-100 font-sans">
              Recent Sonar Detections
            </h3>
            <p className="text-xs text-slate-400">
              Acoustic detections logged during current transit run
            </p>
          </div>

          {/* Risk Level Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((risk) => (
              <button
                key={risk}
                onClick={() => setSelectedRiskFilter(risk)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                  selectedRiskFilter === risk
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
                }`}
              >
                {risk}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-mono text-[11px] uppercase border-y border-slate-800">
              <tr>
                <th className="px-4 py-3">Scan ID</th>
                <th className="px-4 py-3">Object Type</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3">Risk Level</th>
                <th className="px-4 py-3">Depth</th>
                <th className="px-4 py-3">Coordinates</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {filteredDetections.slice(0, 6).map((item) => (
                <tr key={item.id || item.detection_code} className="hover:bg-slate-900/60 transition-colors">
                  <td className="px-4 py-3 font-bold text-cyan-300">
                    {item.scan_code || item.detection_code}
                  </td>
                  <td className="px-4 py-3 font-sans font-semibold text-white">
                    <span className="flex items-center gap-1.5">
                      {item.is_anomaly && (
                        <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                      )}
                      {item.object_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {Math.round(item.confidence * 100)}%
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getRiskBadge(item.risk_level)}`}>
                      {item.risk_level}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {item.estimated_depth}m
                  </td>
                  <td className="px-4 py-3 text-[11px] text-slate-400">
                    {item.latitude.toFixed(4)}° N, {item.longitude.toFixed(4)}° E
                  </td>
                  <td className="px-4 py-3 text-[11px] text-slate-400">
                    {item.created_at || 'Today'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        if (onSelectDetectionForDetail) onSelectDetectionForDetail(item);
                        setActiveTab('results');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] transition-all flex items-center gap-1 ml-auto"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Review</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Quick Launch Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        <div 
          onClick={() => setActiveTab('analyze')}
          className="glass-card p-5 rounded-2xl cursor-pointer hover:border-cyan-400 group transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 group-hover:bg-cyan-500/20">
              <Scan className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </div>
          <h4 className="font-bold text-base text-white mt-4 font-sans">
            Run AI Sonar Analysis
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Upload new Side-Scan Sonar TIFF/PNG imagery and execute deep bounding box detection.
          </p>
        </div>

        <div 
          onClick={() => setActiveTab('map')}
          className="glass-card p-5 rounded-2xl cursor-pointer hover:border-cyan-400 group transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 group-hover:bg-cyan-500/20">
              <Compass className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </div>
          <h4 className="font-bold text-base text-white mt-4 font-sans">
            GIS Anomaly Bathymetry Map
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Track spatial coordinates, towfish navigation tracklines, and severity markers in full GIS.
          </p>
        </div>

        <div 
          onClick={() => setActiveTab('reports')}
          className="glass-card p-5 rounded-2xl cursor-pointer hover:border-cyan-400 group transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 group-hover:bg-cyan-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </div>
          <h4 className="font-bold text-base text-white mt-4 font-sans">
            Generate Survey Report
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Compile formal hydrographic assessment reports with PDF print formatting and CSV export.
          </p>
        </div>

      </div>

    </div>
  );
};
