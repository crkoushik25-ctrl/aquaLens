import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert, 
  Sparkles,
  ArrowUpDown,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { Detection } from '../types';

interface DetectionHistoryPageProps {
  onSelectDetection: (det: Detection) => void;
  setActiveTab: (tab: string) => void;
}

export const DetectionHistoryPage: React.FC<DetectionHistoryPageProps> = ({
  onSelectDetection,
  setActiveTab
}) => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Filters
  const [search, setSearch] = useState<string>('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await api.getDetections();
        setDetections(data);
      } catch (err) {
        console.error('Failed to load detections history', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleStatusChange = async (id: number | undefined, newStatus: string) => {
    if (!id) return;
    try {
      await api.updateDetectionStatus(id, newStatus);
      setDetections(prev => prev.map(d => d.id === id ? { ...d, status: newStatus as any } : d));
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Detection Code", "Object Type", "Confidence", "Risk Level", "Risk Score", "Estimated Size", "Depth (m)", "Latitude", "Longitude", "Status"];
    const rows = filteredDetections.map(d => [
      d.detection_code,
      d.object_type,
      `${Math.round(d.confidence * 100)}%`,
      d.risk_level,
      d.risk_score,
      `"${d.estimated_size}"`,
      d.estimated_depth,
      d.latitude,
      d.longitude,
      d.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `OceanScan_Detections_Export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter logic
  const filteredDetections = detections.filter(d => {
    if (riskFilter !== 'ALL' && d.risk_level !== riskFilter) return false;
    if (typeFilter !== 'ALL' && d.object_type !== typeFilter) return false;
    if (statusFilter !== 'ALL' && d.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        d.detection_code.toLowerCase().includes(q) ||
        d.object_type.toLowerCase().includes(q) ||
        d.recommendation.toLowerCase().includes(q) ||
        d.why_risk.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalPages = Math.ceil(filteredDetections.length / itemsPerPage) || 1;
  const paginatedDetections = filteredDetections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'CRITICAL': return 'bg-red-950 text-red-400 border border-red-500/40';
      case 'HIGH': return 'bg-orange-950 text-orange-400 border border-orange-500/40';
      case 'MEDIUM': return 'bg-amber-950 text-amber-300 border border-amber-500/40';
      case 'LOW':
      default: return 'bg-emerald-950 text-emerald-400 border border-emerald-500/40';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              HYDROGRAPHIC ARCHIVE
            </span>
            <span className="text-slate-400 text-xs font-mono">
              ACOUSTIC TARGET DATABASE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans mt-1">
            Historical Sonar Detections Registry
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-200 text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Compile Report</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search detection code, class, recommendation..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 font-mono"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Risk Level */}
          <select
            value={riskFilter}
            onChange={(e) => { setRiskFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>

          {/* Object Type */}
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Object Types</option>
            <option value="Fishing Net">Fishing Net</option>
            <option value="Metal Debris">Metal Debris</option>
            <option value="Plastic Debris">Plastic Debris</option>
            <option value="Ship Debris">Ship Debris</option>
            <option value="Unknown Anomaly">Unknown Anomaly</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Verification Statuses</option>
            <option value="Review">In Review</option>
            <option value="Verified">Verified</option>
            <option value="Flagged for ROV">Flagged for ROV</option>
            <option value="Resolved">Resolved</option>
          </select>

        </div>

      </div>

      {/* Main Detections Data Table */}
      <div className="glass-panel rounded-3xl border border-cyan-500/20 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Detection Code</th>
                <th className="px-5 py-3.5">Object Class</th>
                <th className="px-5 py-3.5">Confidence</th>
                <th className="px-5 py-3.5">Risk Score</th>
                <th className="px-5 py-3.5">Estimated Size</th>
                <th className="px-5 py-3.5">Depth</th>
                <th className="px-5 py-3.5">Coordinates</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {paginatedDetections.map((det) => (
                <tr key={det.id || det.detection_code} className="hover:bg-slate-900/60 transition-colors">
                  
                  <td className="px-5 py-3.5 font-bold text-cyan-300">
                    {det.detection_code}
                  </td>

                  <td className="px-5 py-3.5 font-sans font-semibold text-white">
                    <span className="flex items-center gap-1.5">
                      {det.is_anomaly && (
                        <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                      )}
                      {det.object_type}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 text-cyan-400 font-bold">
                    {Math.round(det.confidence * 100)}%
                  </td>

                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getRiskBadge(det.risk_level)}`}>
                      {det.risk_score} • {det.risk_level}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 text-slate-300">
                    {det.estimated_size}
                  </td>

                  <td className="px-5 py-3.5 text-slate-300">
                    {det.estimated_depth}m
                  </td>

                  <td className="px-5 py-3.5 text-[11px] text-slate-400">
                    {det.latitude.toFixed(4)}° N, {det.longitude.toFixed(4)}° E
                  </td>

                  <td className="px-5 py-3.5">
                    <select
                      value={det.status}
                      onChange={(e) => handleStatusChange(det.id, e.target.value)}
                      className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[11px] text-slate-200 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Review">Review</option>
                      <option value="Verified">Verified</option>
                      <option value="Flagged for ROV">Flagged for ROV</option>
                      <option value="Resolved">Resolved</option>
                      <option value="False Positive">False Positive</option>
                    </select>
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => {
                        onSelectDetection(det);
                        setActiveTab('results');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] transition-all inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/60 border-t border-slate-800 text-xs font-mono text-slate-400">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredDetections.length)} of {filteredDetections.length} records
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-bold text-cyan-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
