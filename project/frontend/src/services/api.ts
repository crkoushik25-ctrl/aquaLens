import {
  Detection,
  SonarSampleScan,
  HistoricalSurvey,
  SurveyReport,
  SystemStatistics,
  User,
  ObjectCategory
} from '../types';

const API_BASE = '/api';

export const api = {
  // Statistics & Dashboard
  async getStatistics(): Promise<SystemStatistics> {
    try {
      const res = await fetch(`${API_BASE}/statistics`);
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch (err) {
      console.warn('Using fallback statistics', err);
      return {
        summary: {
          total_scans: 1248,
          anomalies_detected: 86,
          high_risk: 21,
          critical: 7,
          confidence_avg: 91.4,
          surveyed_area_sqkm: 342.8,
          prototype_status: 'Simulated Prototype Intelligence'
        },
        risk_distribution: [
          { name: 'Low Risk', value: 34, color: '#10b981' },
          { name: 'Medium Risk', value: 24, color: '#f59e0b' },
          { name: 'High Risk', value: 21, color: '#f97316' },
          { name: 'Critical Risk', value: 7, color: '#ef4444' }
        ],
        monthly_trends: [
          { month: 'Oct', scans: 142, anomalies: 9, debris: 18, critical: 1 },
          { month: 'Nov', scans: 188, anomalies: 12, debris: 24, critical: 2 },
          { month: 'Dec', scans: 210, anomalies: 15, debris: 31, critical: 3 },
          { month: 'Jan', scans: 265, anomalies: 18, debris: 38, critical: 2 },
          { month: 'Feb', scans: 298, anomalies: 21, debris: 42, critical: 4 },
          { month: 'Mar (Live)', scans: 345, anomalies: 26, debris: 49, critical: 7 }
        ],
        category_distribution: [
          { name: 'Fishing Net', count: 34, color: '#00f2fe' },
          { name: 'Metal Debris', count: 26, color: '#38bdf8' },
          { name: 'Plastic Debris', count: 18, color: '#818cf8' },
          { name: 'Ship Debris', count: 12, color: '#f97316' },
          { name: 'Unknown Anomaly', count: 14, color: '#ef4444' },
          { name: 'Natural Reef', count: 48, color: '#10b981' }
        ],
        live_telemetry: {
          sonar_ping_rate_hz: 12.0,
          active_transducer_khz: 455,
          towfish_altitude_m: 12.4,
          sound_velocity_mps: 1500.0,
          survey_vessel: 'RV SAGAR KANYA (Autonomous Tow)'
        }
      };
    }
  },

  // Sonar Samples
  async getSamples(): Promise<SonarSampleScan[]> {
    try {
      const res = await fetch(`${API_BASE}/sonar/samples`);
      if (!res.ok) throw new Error('Failed to fetch samples');
      return await res.json();
    } catch (err) {
      console.warn('Using fallback samples', err);
      return [
        {
          id: 1,
          scan_code: "SON-001",
          title: "Arabian Sea Transect #04 - Ghost Fishing Gear",
          file_name: "son-001_fishing_net.jpg",
          file_path: "/static/sonar_images/son-001_fishing_net.jpg",
          frequency_khz: 455,
          altitude_m: 12.5,
          slant_range_m: 75.0,
          latitude: 11.0168,
          longitude: 76.9558,
          depth_m: 42.0,
          survey_area: "Arabian Sea - Sector 7",
          target_type: "Fishing Net",
          risk_level: "HIGH",
          risk_score: 82,
          confidence: 0.91,
          is_anomaly: false
        },
        {
          id: 2,
          scan_code: "SON-002",
          title: "Bay of Bengal Port Approach - Metallic Debris",
          file_name: "son-002_metal_debris.jpg",
          file_path: "/static/sonar_images/son-002_metal_debris.jpg",
          frequency_khz: 900,
          altitude_m: 10.0,
          slant_range_m: 50.0,
          latitude: 11.0231,
          longitude: 76.9612,
          depth_m: 36.0,
          survey_area: "Chennai Outer Anchorage",
          target_type: "Metal Debris",
          risk_level: "MEDIUM",
          risk_score: 68,
          confidence: 0.87,
          is_anomaly: false
        },
        {
          id: 3,
          scan_code: "SON-003",
          title: "Lakshadweep Deep Trench - Out-of-Distribution Signature",
          file_name: "son-003_unknown_anomaly.jpg",
          file_path: "/static/sonar_images/son-003_unknown_anomaly.jpg",
          frequency_khz: 455,
          altitude_m: 15.0,
          slant_range_m: 100.0,
          latitude: 11.0282,
          longitude: 76.9671,
          depth_m: 51.0,
          survey_area: "Lakshadweep Ridge",
          target_type: "Unknown Anomaly",
          risk_level: "HIGH",
          risk_score: 76,
          confidence: 0.78,
          is_anomaly: true
        },
        {
          id: 4,
          scan_code: "SON-004",
          title: "Gulf of Mannar Coral Zone - Sunken Hull Section",
          file_name: "son-004_ship_debris.jpg",
          file_path: "/static/sonar_images/son-004_ship_debris.jpg",
          frequency_khz: 455,
          altitude_m: 11.0,
          slant_range_m: 75.0,
          latitude: 11.0112,
          longitude: 76.9490,
          depth_m: 28.5,
          survey_area: "Gulf of Mannar Marine Sanctuary",
          target_type: "Ship Debris",
          risk_level: "CRITICAL",
          risk_score: 92,
          confidence: 0.94,
          is_anomaly: false
        },
        {
          id: 5,
          scan_code: "SON-005",
          title: "Goa Coastal Shoal - Microplastic & Synthetic Accumulation",
          file_name: "son-005_plastic_debris.jpg",
          file_path: "/static/sonar_images/son-005_plastic_debris.jpg",
          frequency_khz: 900,
          altitude_m: 8.5,
          slant_range_m: 40.0,
          latitude: 11.0340,
          longitude: 76.9740,
          depth_m: 22.0,
          survey_area: "Goa Continental Shelf",
          target_type: "Plastic Debris",
          risk_level: "MEDIUM",
          risk_score: 55,
          confidence: 0.85,
          is_anomaly: false
        }
      ];
    }
  },

  // Sonar Upload
  async uploadSonar(formData: FormData) {
    const res = await fetch(`${API_BASE}/sonar/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Upload failed');
    return await res.json();
  },

  // AI Analysis Execution
  async runAnalysis(params: {
    scan_id?: number;
    preset_type?: string;
    confidence_threshold?: number;
    sensitivity?: number;
    enabled_categories?: string[];
    enable_anomaly_detection?: boolean;
  }) {
    const res = await fetch(`${API_BASE}/sonar/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Analysis failed');
    return await res.json();
  },

  // Detections
  async getDetections(filters?: {
    risk_level?: string;
    object_type?: string;
    status?: string;
    search?: string;
    is_anomaly?: boolean;
  }): Promise<Detection[]> {
    const params = new URLSearchParams();
    if (filters?.risk_level) params.append('risk_level', filters.risk_level);
    if (filters?.object_type) params.append('object_type', filters.object_type);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.is_anomaly !== undefined) params.append('is_anomaly', String(filters.is_anomaly));

    try {
      const res = await fetch(`${API_BASE}/detections?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch detections');
      return await res.json();
    } catch (err) {
      console.warn('Fallback detections data');
      return [
        {
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
          created_at: "Today, 14:22"
        },
        {
          id: 2,
          detection_code: "DET-002",
          scan_code: "SON-002",
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
          why_risk: "Metallic cargo remnant in commercial approach channel. Moderate navigation collision hazard.",
          recommendation: "Log coordinates into NAVAREA marine hazard database and monitor displacement.",
          status: "Verified",
          created_at: "Today, 11:05"
        },
        {
          id: 3,
          detection_code: "DET-003",
          scan_code: "SON-003",
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
          why_risk: "Out-of-Distribution acoustic signature. Unnatural symmetry and atypical acoustic shadow ratio.",
          recommendation: "Manual Marine Inspection & ROV camera survey strongly recommended.",
          status: "Review",
          created_at: "Yesterday, 19:40"
        },
        {
          id: 4,
          detection_code: "DET-004",
          scan_code: "SON-004",
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
          why_risk: "Large-scale structural wreckage in shallow coral conservation channel. Critical obstruction danger.",
          recommendation: "Immediate port authority notification and marine exclusion zone establishment.",
          status: "Flagged for ROV",
          created_at: "3 days ago"
        }
      ];
    }
  },

  async updateDetectionStatus(id: number, status: string) {
    const res = await fetch(`${API_BASE}/detections/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Status update failed');
    return await res.json();
  },

  // Temporal Comparison
  async getComparisonSamples(): Promise<HistoricalSurvey[]> {
    try {
      const res = await fetch(`${API_BASE}/comparison/samples`);
      if (!res.ok) throw new Error('Failed to fetch comparisons');
      return await res.json();
    } catch {
      return [
        {
          id: 1,
          survey_code: "SURV-TEMP-2026",
          title: "Temporal Seabed Evolution & Debris Influx Monitoring",
          region_name: "Gulf of Kutch Maritime Approach (Zone C-4)",
          survey_year: 2024,
          scan_count: 1248,
          debris_count: 86,
          baseline_image: "/static/sonar_images/survey_2024_baseline.jpg",
          current_image: "/static/sonar_images/survey_2026_current.jpg",
          change_detected: true,
          change_confidence: 0.84,
          change_summary: "Substantial new acoustic backscatter detected at coordinates 11.0168° N, 76.9558° E. Synthetic monofilament netting bundle (8.4m span) has accumulated over benthic substrate since the 2024 baseline survey."
        }
      ];
    }
  },

  async runComparison(surveyCode = "SURV-TEMP-2026") {
    const res = await fetch(`${API_BASE}/comparison/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ survey_code: surveyCode, baseline_year: 2024, resurvey_year: 2026 })
    });
    if (!res.ok) throw new Error('Comparison failed');
    return await res.json();
  },

  // Reports
  async getReports(): Promise<SurveyReport[]> {
    try {
      const res = await fetch(`${API_BASE}/reports`);
      if (!res.ok) throw new Error('Failed to fetch reports');
      return await res.json();
    } catch {
      return [
        {
          id: 1,
          report_code: "REP-2026-089",
          title: "Priority Acoustic Survey & Marine Hazard Assessment - Arabian Sea Transect #04",
          surveyor_name: "Dr. Aris Thorne",
          organization: "National Oceanographic & Marine Intelligence Bureau",
          survey_area: "Arabian Sea - Sector 7",
          risk_level: "HIGH",
          detections_count: 3,
          executive_summary: "Side-scan sonar imagery collected at 455 kHz revealed high-risk anthropogenic marine debris at depth 42.0m. Primary target identified as an abandoned ghost fishing net with high entanglement hazard.",
          recommended_action: "Deploy Remotely Operated Vehicle (ROV) with hydraulic cutter assembly for targeted debris extraction.",
          generated_at: "2026-03-01 10:45 UTC"
        }
      ];
    }
  },

  async generateReport(scanId: number = 1): Promise<SurveyReport> {
    const res = await fetch(`${API_BASE}/reports/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scan_id: scanId })
    });
    if (!res.ok) throw new Error('Report generation failed');
    return await res.json();
  },

  // Settings
  async getSettings() {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (!res.ok) throw new Error('Failed to fetch settings');
      return await res.json();
    } catch {
      return {
        transducer_frequency_default: 455,
        slant_range_correction: true,
        detection_sensitivity: 0.80,
        confidence_threshold: 0.70,
        critical_risk_threshold: 85,
        high_risk_threshold: 70,
        auto_flag_rov_threshold: 80,
        theme_mode: "deep_ocean_dark",
        enable_ood_detection: true,
        active_navarea_region: "NAVAREA VIII (Indian Ocean)",
        export_format_default: "PDF_A4"
      };
    }
  }
};
