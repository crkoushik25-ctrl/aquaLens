import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { JudgeDemoTour } from './components/JudgeDemoTour';
import { LandingPage } from './pages/LandingPage';
import { AuthModal } from './pages/AuthModal';
import { DashboardPage } from './pages/DashboardPage';
import { SonarAnalysisPage } from './pages/SonarAnalysisPage';
import { DetectionResultsPage } from './pages/DetectionResultsPage';
import { UnknownAnomalyPage } from './pages/UnknownAnomalyPage';
import { RiskAnalysisPage } from './pages/RiskAnalysisPage';
import { AnomalyMapPage } from './pages/AnomalyMapPage';
import { HistoricalComparisonPage } from './pages/HistoricalComparisonPage';
import { DetectionHistoryPage } from './pages/DetectionHistoryPage';
import { ReportGenerationPage } from './pages/ReportGenerationPage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutTechPage } from './pages/AboutTechPage';
import { LoginPage } from './pages/LoginPage';
import { Detection, User } from './types';
import { api } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('oceanscan_user');
      return saved ? JSON.parse(saved) : {
        id: 1,
        email: 'oceanographer@oceanscan.marine.gov',
        full_name: 'Dr. Aris Thorne',
        role: 'Chief Marine Surveyor',
        organization: 'National Marine & Defense Intelligence Bureau'
      };
    } catch {
      return {
        id: 1,
        email: 'oceanographer@oceanscan.marine.gov',
        full_name: 'Dr. Aris Thorne',
        role: 'Chief Marine Surveyor',
        organization: 'National Marine & Defense Intelligence Bureau'
      };
    }
  });

  // Active Detection & List
  const [currentDetection, setCurrentDetection] = useState<Detection | null>(null);
  const [allDetections, setAllDetections] = useState<Detection[]>([]);

  // Judge Demo Tour state
  const [isJudgeTourActive, setIsJudgeTourActive] = useState<boolean>(false);
  const [judgeTourStepIndex, setJudgeTourStepIndex] = useState<number>(0);

  // Load initial detections on mount
  useEffect(() => {
    async function init() {
      try {
        const data = await api.getDetections();
        setAllDetections(data);
        if (data.length > 0) {
          setCurrentDetection(data[0]);
        }
      } catch (err) {
        console.error('Failed to load initial detections', err);
      }
    }
    init();
  }, []);

  const handleStartJudgeTour = () => {
    setIsJudgeTourActive(true);
    setJudgeTourStepIndex(0);
    setActiveTab('landing');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#00f2fe', '#4facfe', '#f59e0b']
    });
  };

  const handleAnalysisComplete = (result: any) => {
    if (result && result.primary_detection) {
      setCurrentDetection(result.primary_detection);
      if (result.detections) {
        setAllDetections(result.detections);
      }
    }
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#00f2fe', '#10b981', '#f97316']
    });
  };

  const handleSelectDetection = (det: Detection) => {
    setCurrentDetection(det);
  };

  return (
    <div className="min-h-screen flex flex-col bg-ocean-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Tactical Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setAuthModalOpen(true)}
        onStartJudgeTour={handleStartJudgeTour}
        currentUser={currentUser}
      />

      {/* Main View Container */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage
            setActiveTab={setActiveTab}
            onStartJudgeTour={handleStartJudgeTour}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage
            setActiveTab={setActiveTab}
            onSelectDetectionForDetail={handleSelectDetection}
          />
        )}

        {activeTab === 'analyze' && (
          <SonarAnalysisPage
            onAnalysisComplete={handleAnalysisComplete}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'results' && (
          <DetectionResultsPage
            currentDetection={currentDetection}
            allDetections={allDetections}
            onSelectDetection={handleSelectDetection}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'unknown-anomaly' && (
          <UnknownAnomalyPage
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'risk' && (
          <RiskAnalysisPage
            currentDetection={currentDetection}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'map' && (
          <AnomalyMapPage
            onSelectDetection={handleSelectDetection}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'comparison' && (
          <HistoricalComparisonPage
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'history' && (
          <DetectionHistoryPage
            onSelectDetection={handleSelectDetection}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'reports' && (
          <ReportGenerationPage
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsPage
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'about' && (
          <AboutTechPage
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'login' && (
          <LoginPage
            onLoginSuccess={(user) => setCurrentUser(user)}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* Interactive SIH Judge Demo Tour Controller */}
      {isJudgeTourActive && (
        <JudgeDemoTour
          currentStepIndex={judgeTourStepIndex}
          setCurrentStepIndex={setJudgeTourStepIndex}
          setActiveTab={setActiveTab}
          onClose={() => setIsJudgeTourActive(false)}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />

      {/* Tactical Footer */}
      <Footer setActiveTab={setActiveTab} />

    </div>
  );
}

export default App;
