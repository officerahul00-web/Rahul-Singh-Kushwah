import React, { useState } from 'react';
import {
  Home,
  Search,
  AlertOctagon,
  Heart,
  User,
  Wifi,
  Battery,
  Signal,
  Maximize2,
  Minimize2,
  Smartphone
} from 'lucide-react';
import { HomeScreen } from './HomeScreen';
import { BloodSearchScreen } from './BloodSearchScreen';
import { DonorRegistrationScreen } from './DonorRegistrationScreen';
import { SosBroadcastScreen } from './SosBroadcastScreen';
import { UserProfileScreen } from './UserProfileScreen';
import { useApp } from '../../context/AppContext';

export type MobileTab = 'home' | 'search' | 'sos' | 'register' | 'profile';

export const MobileShell: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<MobileTab>('home');
  const [isFramed, setIsFramed] = useState<boolean>(true);
  const { user, sosRequests } = useApp();

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const activeSosCount = sosRequests.filter(s => s.status === 'ACTIVE').length;

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 sm:p-6">
      
      {/* Frame Mode Toggle Bar */}
      <div className="w-full max-w-md flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
          <Smartphone className="w-4 h-4 text-rose-500" />
          <span>Flutter Mobile Experience (Android & iOS)</span>
        </div>
        <button
          onClick={() => setIsFramed(!isFramed)}
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 transition-colors cursor-pointer"
        >
          {isFramed ? (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span>विस्तारित दृश्य</span>
            </>
          ) : (
            <>
              <Minimize2 className="w-3.5 h-3.5" />
              <span>फ़ोन फ्रेम दृश्य</span>
            </>
          )}
        </button>
      </div>

      {/* Main Container (Framed or Full Responsive) */}
      <div
        className={`w-full transition-all duration-300 relative ${
          isFramed
            ? 'max-w-md rounded-[44px] border-[10px] border-neutral-800 bg-neutral-100 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden min-h-[780px] max-h-[850px] flex flex-col'
            : 'max-w-2xl rounded-3xl border border-neutral-800 bg-neutral-100 shadow-2xl overflow-hidden min-h-[700px] flex flex-col'
        }`}
      >
        {/* Device Notch & Status Bar */}
        {isFramed && (
          <div className="bg-neutral-900 text-white px-7 pt-3 pb-2 flex items-center justify-between text-xs select-none shrink-0 z-20">
            <span className="font-semibold text-[13px]">{currentTime}</span>

            {/* Simulated Dynamic Island / Speaker Notch */}
            <div className="w-24 h-4 rounded-full bg-black mx-auto flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-700"></div>
            </div>

            <div className="flex items-center gap-1.5 text-neutral-300">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 fill-white" />
            </div>
          </div>
        )}

        {/* Scrollable Mobile Screen Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 relative bg-[#FDFBF7]">
          {currentTab === 'home' && (
            <HomeScreen onNavigate={(tab) => setCurrentTab(tab)} />
          )}
          {currentTab === 'search' && (
            <BloodSearchScreen onNavigateToSos={() => setCurrentTab('sos')} />
          )}
          {currentTab === 'register' && (
            <DonorRegistrationScreen onRegistrationComplete={() => setCurrentTab('home')} />
          )}
          {currentTab === 'sos' && (
            <SosBroadcastScreen onSuccess={() => setCurrentTab('home')} />
          )}
          {currentTab === 'profile' && (
            <UserProfileScreen />
          )}
        </div>

        {/* Bottom Floating Navigation Bar */}
        <nav className="sticky bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-2 py-1.5 flex items-center justify-around shrink-0 shadow-lg">
          {/* Home */}
          <button
            id="tab-btn-home"
            onClick={() => setCurrentTab('home')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
              currentTab === 'home' ? 'text-rose-600 font-bold scale-105' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">होम</span>
          </button>

          {/* Search */}
          <button
            id="tab-btn-search"
            onClick={() => setCurrentTab('search')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
              currentTab === 'search' ? 'text-rose-600 font-bold scale-105' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Search className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">रक्त खोज</span>
          </button>

          {/* SOS Broadcast (Center Highlighted) */}
          <button
            id="tab-btn-sos"
            onClick={() => setCurrentTab('sos')}
            className="flex flex-col items-center justify-center -mt-5 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 to-red-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 border-2 border-white group-hover:scale-105 group-active:scale-95 transition-transform relative">
              <AlertOctagon className="w-6 h-6 animate-pulse" />
              {activeSosCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-black text-[9px] font-black flex items-center justify-center border border-white">
                  {activeSosCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-extrabold text-rose-700 mt-0.5">SOS</span>
          </button>

          {/* Register as Donor */}
          <button
            id="tab-btn-register"
            onClick={() => setCurrentTab('register')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
              currentTab === 'register' ? 'text-rose-600 font-bold scale-105' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Heart className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">रक्तदान</span>
          </button>

          {/* Profile */}
          <button
            id="tab-btn-profile"
            onClick={() => setCurrentTab('profile')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
              currentTab === 'profile' ? 'text-rose-600 font-bold scale-105' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">प्रोफ़ाइल</span>
          </button>
        </nav>

        {/* Device Home Indicator Bar */}
        {isFramed && (
          <div className="bg-white py-1.5 flex justify-center shrink-0">
            <div className="w-32 h-1 bg-neutral-300 rounded-full"></div>
          </div>
        )}

      </div>
    </div>
  );
};
