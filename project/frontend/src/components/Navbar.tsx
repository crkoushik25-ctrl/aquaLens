import React, { useState } from 'react';
import { 
  Radar, 
  LayoutDashboard, 
  Scan, 
  Crosshair, 
  AlertTriangle, 
  ShieldAlert, 
  Map as MapIcon, 
  GitCompare, 
  History, 
  FileText, 
  Settings, 
  Info, 
  User as UserIcon,
  PlayCircle,
  Menu,
  X,
  Radio
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
  onStartJudgeTour: () => void;
  currentUser: User | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAuth,
  onStartJudgeTour,
  currentUser
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Overview', icon: Radar },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyze', label: 'Analyze', icon: Scan },
    { id: 'results', label: 'Detections', icon: Crosshair },
    { id: 'unknown-anomaly', label: 'Anomaly X', icon: AlertTriangle, badge: 'OOD' },
    { id: 'risk', label: 'Risk AI', icon: ShieldAlert },
    { id: 'map', label: 'GIS Map', icon: MapIcon },
    { id: 'comparison', label: 'Temporal Diff', icon: GitCompare },
    { id: 'history', label: 'Database', icon: History },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'about', label: 'Architecture', icon: Info },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'login', label: 'Sign In', icon: UserIcon },
  ];

  return (
    <header className="sticky top-0 z-50 bg-ocean-950/90 backdrop-blur-md border-b border-cyan-500/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Telemetry Indicator */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('landing')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25 border border-cyan-400/40">
              <Radar className="w-6 h-6 text-slate-950 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 font-mono">
                  OceanScan<span className="text-cyan-400 font-sans">.AI</span>
                </span>
                <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  v2.0 • SSS
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Radio className="w-2.5 h-2.5 animate-pulse" /> SSS 455 kHz LIVE
                </span>
                <span>•</span>
                <span>SIH DEFENSE PROTOTYPE</span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.slice(0, 10).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                      : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1 py-0.2 text-[9px] font-mono font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            {/* SIH Judge Demo Button */}
            <button
              onClick={onStartJudgeTour}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-orange-400 transition-all transform hover:scale-105 cursor-pointer"
              title="Start SIH Judge Interactive Walkthrough"
            >
              <PlayCircle className="w-3.5 h-3.5 fill-slate-950 text-amber-400" />
              <span className="font-mono uppercase tracking-wider">Judge Demo</span>
            </button>

            {/* Auth Profile / Login Button */}
            <button
              onClick={() => setActiveTab('login')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900 border-cyan-500/30 text-slate-200 hover:text-cyan-300 hover:border-cyan-400'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline font-mono">
                {currentUser ? currentUser.full_name.split(' ')[0] : 'Sign In'}
              </span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-cyan-500/20 bg-ocean-950/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-1">
          <div className="grid grid-cols-2 gap-1.5 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
