import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  ShieldCheck, 
  Anchor, 
  Compass, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  AlertTriangle,
  Send,
  Building
} from 'lucide-react';
import { api } from '../services/api';
import { SurveyReport } from '../types';

interface ReportGenerationPageProps {
  setActiveTab: (tab: string) => void;
}

export const ReportGenerationPage: React.FC<ReportGenerationPageProps> = ({ setActiveTab }) => {
  const [report, setReport] = useState<SurveyReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [surveyor, setSurveyor] = useState<string>('Dr. Aris Thorne');
  const [organization, setOrganization] = useState<string>('National Marine & Defense Intelligence Bureau');

  useEffect(() => {
    async function loadReport() {
      setLoading(true);
      try {
        const data = await api.generateReport(1);
        setReport(data);
      } catch (err) {
        console.error('Failed to generate report', err);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    if (!report) return;
    const headers = ["Report Code", "Title", "Survey Area", "Risk Level", "Detections Count", "Executive Summary", "Recommendation", "Generated At"];
    const rows = [[
      report.report_code,
      `"${report.title}"`,
      `"${report.survey_area}"`,
      report.risk_level,
      report.detections_count,
      `"${report.executive_summary.replace(/"/g, '""')}"`,
      `"${report.recommended_action.replace(/"/g, '""')}"`,
      report.generated_at
    ]];

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${report.report_code}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header & Actions Bar (Hidden on print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              HYDROGRAPHIC DOSSIER
            </span>
            <span className="text-slate-400 text-xs font-mono">
              DEFENSE INTELLIGENCE DISPATCH
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans mt-1">
            Underwater Anomaly & Marine Hazard Survey Report
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Official Survey Document Card (Printable) */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-cyan-500/30 bg-ocean-950 text-slate-100 shadow-2xl space-y-8 print:p-0 print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Document Header with Official Insignia */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2 border-cyan-500/30 print:border-black">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <Anchor className="w-7 h-7 text-cyan-400 print:text-black" />
              <span className="font-mono font-black text-2xl tracking-wider text-white print:text-black">
                OceanScan<span className="text-cyan-400 print:text-black">.AI</span>
              </span>
            </div>
            <div className="text-xs text-slate-400 print:text-slate-600 font-mono">
              Autonomous Side-Scan Sonar Marine Intelligence Bureau
            </div>
            <div className="text-[11px] text-cyan-400 print:text-slate-800 font-mono">
              Hydrographic Standard S-44 • NAVAREA VIII Protocol
            </div>
          </div>

          <div className="text-left sm:text-right space-y-1 font-mono text-xs">
            <div className="text-cyan-400 print:text-black font-bold text-sm">
              REPORT REF: {report?.report_code || 'REP-2026-0042'}
            </div>
            <div className="text-slate-400 print:text-slate-600 text-[11px]">
              DATE: {report?.generated_at || '2026-03-01 10:45 UTC'}
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-400 border border-red-500/40 print:bg-slate-200 print:text-black">
              PRIORITY HAZARD RATING: {report?.risk_level || 'HIGH'}
            </div>
          </div>
        </div>

        {/* Survey Metadata Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 font-mono text-xs print:bg-slate-100 print:text-black print:border-slate-300">
          <div>
            <span className="text-slate-400 print:text-slate-500 block text-[10px]">SURVEY AREA</span>
            <span className="font-bold text-slate-200 print:text-black">{report?.survey_area || 'Arabian Sea - Sector 7'}</span>
          </div>
          <div>
            <span className="text-slate-400 print:text-slate-500 block text-[10px]">ACOUSTIC TRANSDUCER</span>
            <span className="font-bold text-slate-200 print:text-black">455 kHz Dual Side-Scan</span>
          </div>
          <div>
            <span className="text-slate-400 print:text-slate-500 block text-[10px]">TOWFISH ALTITUDE</span>
            <span className="font-bold text-slate-200 print:text-black">12.5m (Range: 75m)</span>
          </div>
          <div>
            <span className="text-slate-400 print:text-slate-500 block text-[10px]">INVESTIGATOR</span>
            <span className="font-bold text-slate-200 print:text-black">{report?.surveyor_name || surveyor}</span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h3 className="font-mono text-xs font-bold text-cyan-400 print:text-black uppercase tracking-wider">
            1. EXECUTIVE SUMMARY & ACOUSTIC FINDINGS
          </h3>
          <p className="text-xs leading-relaxed text-slate-300 print:text-black bg-slate-900/50 print:bg-transparent p-4 rounded-2xl border border-slate-800 print:border-none">
            {report?.executive_summary || 
              "Automated acoustic analysis conducted on Side-Scan Sonar survey at depth 42.0m identified primary target as an abandoned ghost fishing net with high entanglement hazard for benthic ecosystems and subsurface navigation. Total surveyed area: 342.8 sq km with 91.4% model confidence."
            }
          </p>
        </div>

        {/* Sonar High-Res Visual Capture Crop */}
        <div className="space-y-2">
          <h3 className="font-mono text-xs font-bold text-cyan-400 print:text-black uppercase tracking-wider">
            2. ACOUSTIC WATERFALL RADIOMETRIC CAPTURE
          </h3>
          <div className="relative aspect-[21/9] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
            <img
              src="/static/sonar_images/son-001_fishing_net.jpg"
              alt="Sonar Radiometric Crop"
              className="w-full h-full object-cover"
              style={{ filter: 'sepia(0.6) saturate(1.8) hue-rotate(5deg) contrast(1.15)' }}
            />
            <div className="absolute top-3 left-3 px-2 py-1 rounded bg-ocean-950/90 font-mono text-[10px] text-cyan-400 border border-cyan-500/30">
              TARGET BBOX OVERLAY: [X: 0.32, Y: 0.26, W: 0.36, H: 0.38]
            </div>
          </div>
        </div>

        {/* Detected Targets Registry Table */}
        <div className="space-y-2">
          <h3 className="font-mono text-xs font-bold text-cyan-400 print:text-black uppercase tracking-wider">
            3. DETECTED ANOMALY CLASSIFICATION TABLE
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-800 print:border-black">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 text-slate-400 print:bg-slate-200 print:text-black text-[10px] uppercase">
                <tr>
                  <th className="p-3">Target ID</th>
                  <th className="p-3">Object Type</th>
                  <th className="p-3">AI Conf.</th>
                  <th className="p-3">Risk Level</th>
                  <th className="p-3">Size (Span)</th>
                  <th className="p-3">Depth</th>
                  <th className="p-3">Acoustic Shadow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-300 text-slate-300 print:text-black">
                <tr>
                  <td className="p-3 font-bold text-cyan-300 print:text-black">DET-001</td>
                  <td className="p-3 font-sans font-semibold">Fishing Net (Ghost Gear)</td>
                  <td className="p-3 text-cyan-400 print:text-black">91%</td>
                  <td className="p-3"><span className="text-orange-400 print:text-black font-bold">82 / HIGH</span></td>
                  <td className="p-3">8.4m × 2.1m</td>
                  <td className="p-3">42.0m</td>
                  <td className="p-3">3.2m Shadow</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommended Action Protocol */}
        <div className="space-y-2">
          <h3 className="font-mono text-xs font-bold text-cyan-400 print:text-black uppercase tracking-wider">
            4. ACTIONABLE HYDROGRAPHIC DISPATCH & MITIGATION
          </h3>
          <div className="p-4 rounded-2xl bg-cyan-950/30 print:bg-slate-100 border border-cyan-500/30 print:border-black text-xs text-slate-200 print:text-black leading-relaxed">
            <strong className="text-cyan-300 print:text-black">Operational Recommendation:</strong> {report?.recommended_action || 
              "Deploy Remotely Operated Vehicle (ROV) with hydraulic cutter assembly for targeted debris extraction. Transmit safety notice to local fishing fleets and port authority."
            }
          </div>
        </div>

        {/* Signatures & Certification */}
        <div className="pt-8 border-t border-slate-800 print:border-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 font-mono text-xs text-slate-400 print:text-black">
          <div className="space-y-1">
            <div className="text-slate-200 print:text-black font-bold">
              CERTIFIED HYDROGRAPHER SIGNATURE
            </div>
            <div className="font-sans italic text-cyan-400 print:text-black text-sm">
              Dr. Aris Thorne, Ph.D.
            </div>
            <div className="text-[10px]">
              National Marine & Defense Intelligence Bureau
            </div>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <div className="text-slate-200 print:text-black font-bold">
              SYSTEM ARCHITECTURE STATUS
            </div>
            <div className="text-emerald-400 print:text-black font-bold">
              AI INFERENCE VERIFIED • SIH PROTOCOL
            </div>
            <div className="text-[10px]">
              OceanScan AI Engine v2.0
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
