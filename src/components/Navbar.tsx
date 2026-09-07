import React from 'react';
import {
  Droplet,
  Smartphone,
  Shield,
  Code2,
  Globe,
  HeartHandshake,
  AlertTriangle,
  User,
  Heart
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export type ActiveTab = 'MOBILE_APP' | 'ADMIN_PANEL' | 'ARCHITECTURE_CODE';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isMobileFullscreen: boolean;
  setIsMobileFullscreen: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isMobileFullscreen,
  setIsMobileFullscreen
}) => {
  const { language, setLanguage, user, switchRole, t } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md">
      {/* Top emergency non-commercial compliance ticker */}
      <div className="bg-gradient-to-r from-rose-950/80 via-neutral-900 to-rose-950/80 border-b border-rose-900/40 px-3 py-1.5 text-[11px] text-neutral-300 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[80vw]">
          <span className="px-1.5 py-0.2 rounded bg-rose-600 text-white font-bold text-[10px] uppercase tracking-wider">
            मुफ़्त व स्वैच्छिक
          </span>
          <span className="text-rose-200 font-medium hidden sm:inline">
            भारतीय औषधि अधिनियम: मानव रक्त की खरीद-फरोख्त गैर-जमानती अपराध है।
          </span>
          <span className="text-neutral-400 truncate">
            Maa Amba Free Blood Donation Network — 100% Non-Profit Initiative
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-amber-400 font-bold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>हेल्पलाइन: 108 / 102</span>
          </span>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-red-800 flex items-center justify-center text-white shadow-lg shadow-rose-600/30 border border-rose-400/40">
            <Droplet className="w-6 h-6 fill-white text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-white font-['Mukta']">
                माँ अम्बा मुफ़्त रक्तदान
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                भारत नेटवर्क
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 hidden sm:block">
              Mother Amba Free Blood Donation & Emergency SOS Network
            </p>
          </div>
        </div>

        {/* Primary View Switcher (Desktop & Tablet) */}
        <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-1 gap-1">
          <button
            id="tab-mobile-app-btn"
            onClick={() => setActiveTab('MOBILE_APP')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'MOBILE_APP'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden md:inline">मोबाइल ऐप (Flutter UI)</span>
            <span className="md:hidden">ऐप</span>
          </button>

          <button
            id="tab-admin-panel-btn"
            onClick={() => setActiveTab('ADMIN_PANEL')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ADMIN_PANEL'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span className="hidden md:inline">सुपर-एडमिन पोर्टल</span>
            <span className="md:hidden">एडमिन</span>
          </button>

          <button
            id="tab-architecture-code-btn"
            onClick={() => setActiveTab('ARCHITECTURE_CODE')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ARCHITECTURE_CODE'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span className="hidden md:inline">आर्किटेक्चर व फ्लटर कोड</span>
            <span className="md:hidden">कोड</span>
          </button>
        </div>

        {/* Right side controls: Language toggle, User role badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Multilingual Switcher */}
          <div className="flex items-center rounded-lg bg-neutral-900 border border-neutral-800 p-0.5 text-xs font-bold">
            <button
              id="lang-hi-btn"
              onClick={() => setLanguage('hi')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                language === 'hi' ? 'bg-rose-600 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
            <button
              id="lang-en-btn"
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                language === 'en' ? 'bg-rose-600 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {/* User Dual-Mode Toggle */}
          {user && (
            <button
              id="quick-role-switch-btn"
              onClick={() => switchRole(user.activeRole === 'DONOR' ? 'SEEKER' : 'DONOR')}
              title="रक्तदाता / रक्त खोजी मोड बदलें"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/60 text-xs font-medium text-neutral-200 transition-all cursor-pointer"
            >
              {user.activeRole === 'DONOR' ? (
                <>
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span className="text-rose-300 font-bold">रक्तदाता (Donor)</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-sky-400" />
                  <span className="text-sky-300 font-bold">रक्त खोजी (Seeker)</span>
                </>
              )}
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
