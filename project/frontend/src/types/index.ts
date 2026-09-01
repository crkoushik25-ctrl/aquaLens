export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ObjectCategory = 
  | 'Fishing Net'
  | 'Metal Debris'
  | 'Plastic Debris'
  | 'Ship Debris'
  | 'Rock / Natural Object'
  | 'Unknown Anomaly';

export interface BoundingBox {
  x: number; // 0.0 to 1.0
  y: number;
  w: number;
  h: number;
}

export interface FactorBreakdown {
  object_hazard: number;
  physical_dimensions: number;
  depth_vulnerability: number;
  acoustic_signature: number;
  ood_uncertainty: number;
}

export interface Detection {
  id?: number;
  detection_code: string;
  scan_id?: number;
  scan_code?: string;
  image_url: string;
  object_type: ObjectCategory | string;
  confidence: number; // 0.0 - 1.0
  risk_level: RiskLevel;
  risk_score: number; // 0 - 100
  estimated_size: string;
  estimated_depth: number;
  latitude: number;
  longitude: number;
  bbox: BoundingBox;
  acoustic_shadow_len_m: number;
  backscatter_intensity_db?: number;
  entropy_score?: number;
  is_anomaly: boolean;
  ood_score: number;
  known_similarity: number;
  why_risk: string;
  recommendation: string;
  status: 'Review' | 'Verified' | 'Flagged for ROV' | 'Resolved' | 'False Positive';
  factor_breakdown?: FactorBreakdown;
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface SonarSampleScan {
  id: number;
  scan_code: string;
  title: string;
  file_name: string;
  file_path: string;
  frequency_khz: number;
  altitude_m: number;
  slant_range_m: number;
  latitude: number;
  longitude: number;
  depth_m: number;
  survey_area: string;
  target_type: ObjectCategory;
  risk_level: RiskLevel;
  risk_score: number;
  confidence: number;
  is_anomaly: boolean;
}

export interface HistoricalSurvey {
  id: number;
  survey_code: string;
  title: string;
  region_name: string;
  survey_year: number;
  scan_count: number;
  debris_count: number;
  baseline_image: string;
  current_image: string;
  change_detected: boolean;
  change_confidence: number;
  change_summary: string;
}

export interface SurveyReport {
  id: number;
  report_code: string;
  scan_id?: number;
  title: string;
  surveyor_name: string;
  organization: string;
  survey_area: string;
  risk_level: RiskLevel;
  detections_count: number;
  executive_summary: string;
  recommended_action: string;
  generated_at: string;
  scan_metadata?: {
    scan_code: string;
    frequency_khz: number;
    altitude_m: number;
    slant_range_m: number;
    latitude: number;
    longitude: number;
    depth_m: number;
    image_url: string;
  };
  detections?: Array<{
    detection_code: string;
    object_type: string;
    confidence: number;
    risk_level: RiskLevel;
    risk_score: number;
    estimated_size: string;
    depth_m: number;
    shadow_len_m: number;
    why_risk: string;
  }>;
}

export interface SystemStatistics {
  summary: {
    total_scans: number;
    anomalies_detected: number;
    high_risk: number;
    critical: number;
    confidence_avg: number;
    surveyed_area_sqkm: number;
    prototype_status: string;
  };
  risk_distribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  monthly_trends: Array<{
    month: string;
    scans: number;
    anomalies: number;
    debris: number;
    critical: number;
  }>;
  category_distribution: Array<{
    name: string;
    count: number;
    color: string;
  }>;
  live_telemetry: {
    sonar_ping_rate_hz: number;
    active_transducer_khz: number;
    towfish_altitude_m: number;
    sound_velocity_mps: number;
    survey_vessel: string;
  };
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  organization: string;
}
