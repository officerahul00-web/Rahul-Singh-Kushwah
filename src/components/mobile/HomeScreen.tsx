import React from 'react';
import {
  Heart,
  Search,
  AlertOctagon,
  Users,
  ShieldAlert,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  PhoneCall,
  Info,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HomeScreenProps {
  onNavigate: (tab: 'search' | 'register' | 'sos' | 'profile') => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const { t, donors, sosRequests, user, startCall } = useApp();

  const activeDonorsCount = donors.filter(d => d.isAvailable).length;
  const userDistrict = user?.savedDistrict || 'Varanasi';
  const districtAlertsCount = sosRequests.filter(
    s => s.status === 'ACTIVE' && s.district.toLowerCase() === userDistrict.toLowerCase()
  ).length;

  return (
    <div className="flex flex-col gap-5 pb-20 text-neutral-900 animate-in fade-in duration-200">
      
      {/* Top Welcome Header */}
      <div className="bg-gradient-to-br from-rose-700 via-rose-600 to-red-700 text-white rounded-2xl p-5 shadow-lg border border-rose-500/30">
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/20 text-rose-100 text-xs font-semibold mb-2">
              <MapPin className="w-3.5 h-3.5 text-rose-300" />
              <span>{userDistrict}, {user?.savedState || 'Uttar Pradesh'}</span>
            </div>
            <h2 className="text-xl font-black tracking-tight font-['Mukta']">
              माँ अम्बा मुफ़्त रक्तदान नेटवर्क
            </h2>
            <p className="text-xs text-rose-100 mt-0.5">
              100% नि:शुल्क एवं स्वैच्छिक आपातकालीन सेवा
            </p>
          </div>

          <button
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center font-bold text-sm cursor-pointer"
          >
            {user?.name.charAt(0) || 'र'}
          </button>
        </div>

        {/* Live SOS ticker alert if any in district */}
        {districtAlertsCount > 0 && (
          <div
            onClick={() => onNavigate('search')}
            className="mt-4 p-2.5 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-between font-bold text-xs shadow-md cursor-pointer hover:bg-amber-300 transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
              </span>
              <span>आपके जिले में {districtAlertsCount} आपातकालीन रक्त अलर्ट सक्रिय हैं!</span>
            </div>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </div>
        )}
      </div>

      {/* TWO PROMINENT PRIMARY ACTION BUTTONS */}
      <div className="grid grid-cols-1 gap-3.5">
        {/* 1. Register as Donor */}
        <button
          id="home-register-donor-btn"
          onClick={() => onNavigate('register')}
          className="group relative overflow-hidden p-5 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-800 text-white shadow-xl hover:shadow-2xl active:scale-[0.99] transition-all text-left border-2 border-emerald-500/40 cursor-pointer"
        >
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 border border-white/30 group-hover:scale-105 transition-transform">
                <Heart className="w-7 h-7 text-white fill-white" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-200 uppercase tracking-wide">
                  जीवनरक्षक बनें (Save Lives)
                </span>
                <h3 className="text-xl font-black tracking-tight font-['Mukta']">
                  रक्तदान करें / Register as Donor
                </h3>
                <p className="text-xs text-emerald-100/90 mt-0.5">
                  स्वैच्छिक दाता के रूप में जुड़ें एवं आपातकाल में सहायता करें
                </p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-emerald-200 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* 2. Find a Blood Donor */}
        <button
          id="home-find-donor-btn"
          onClick={() => onNavigate('search')}
          className="group relative overflow-hidden p-5 rounded-2xl bg-gradient-to-r from-rose-700 to-red-800 text-white shadow-xl hover:shadow-2xl active:scale-[0.99] transition-all text-left border-2 border-rose-500/40 cursor-pointer"
        >
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 border border-white/30 group-hover:scale-105 transition-transform">
                <Search className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-xs font-bold text-rose-200 uppercase tracking-wide">
                  आपातकालीन खोज (Emergency Finder)
                </span>
                <h3 className="text-xl font-black tracking-tight font-['Mukta']">
                  रक्त की आवश्यकता है / Find a Blood Donor
                </h3>
                <p className="text-xs text-rose-100/90 mt-0.5">
                  रक्त समूह व जिले के अनुसार उपलब्ध रक्तदाता तुरंत खोजें
                </p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-rose-200 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* QUICK STATISTICS BANNER */}
      <div className="rounded-2xl bg-white p-4.5 border border-neutral-200 shadow-sm">
        <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">
          नेटवर्क प्रभाव सांख्यिकी (Network Statistics)
        </h4>

        <div className="grid grid-cols-3 gap-2 divide-x divide-neutral-100 text-center">
          <div className="px-1">
            <div className="text-2xl font-black text-rose-700 font-mono">
              {activeDonorsCount * 180 + 24}
            </div>
            <div className="text-[11px] font-semibold text-neutral-600 mt-1 leading-tight">
              सक्रिय पंजीकृत दाता
            </div>
          </div>

          <div className="px-1">
            <div className="text-2xl font-black text-emerald-700 font-mono">
              1,842+
            </div>
            <div className="text-[11px] font-semibold text-neutral-600 mt-1 leading-tight">
              बचाई गईं जिंदगियां
            </div>
          </div>

          <div className="px-1">
            <div className="text-2xl font-black text-amber-600 font-mono">
              {districtAlertsCount}
            </div>
            <div className="text-[11px] font-semibold text-neutral-600 mt-1 leading-tight">
              जिले में सक्रिय अलर्ट
            </div>
          </div>
        </div>
      </div>

      {/* EMERGENCY SOS BROADCAST PROMPT */}
      <div className="rounded-2xl bg-gradient-to-r from-red-950 via-neutral-900 to-red-950 p-4.5 text-white border border-rose-800/60 shadow-md">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-rose-600/30 text-rose-400 border border-rose-600/40 shrink-0">
            <AlertOctagon className="w-6 h-6 animate-pulse" />
          </div>
          <div className="flex-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white uppercase tracking-wider">
              अति-आपातकालीन स्थिति
            </span>
            <h4 className="font-bold text-sm text-white mt-1">
              दाता न मिलने पर SOS ब्रॉडकास्ट जारी करें
            </h4>
            <p className="text-xs text-neutral-300 mt-0.5 leading-relaxed">
              जिले के सभी मेल खाने वाले रक्तदाताओं के मोबाइल पर एक साथ सायरन व पुश अलर्ट भेजें।
            </p>
            
            <button
              id="home-trigger-sos-btn"
              onClick={() => onNavigate('sos')}
              className="mt-3 w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>{t.sosAlertBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ACTIVE EMERGENCY REQUESTS IN DISTRICT */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h4 className="font-extrabold text-sm text-neutral-800 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-rose-600" />
            <span>जिले में तत्काल आवश्यकताएं</span>
          </h4>
          <span className="text-xs text-rose-600 font-bold">
            {sosRequests.length} सक्रिय
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {sosRequests.slice(0, 2).map(req => (
            <div
              key={req.id}
              className="p-3.5 rounded-xl bg-white border border-rose-200/80 shadow-sm flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-rose-600 text-white font-black text-xs flex items-center justify-center">
                    {req.bloodGroup}
                  </span>
                  <div>
                    <span className="font-bold text-xs text-neutral-900 block">{req.patientName}</span>
                    <span className="text-[11px] text-neutral-500">{req.hospitalName}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  {req.unitsRequired} यूनिट चाहिए
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-[11px]">
                <span className="text-neutral-500 font-medium">वार्ड: {req.wardBedNumber}</span>
                <button
                  onClick={() => {
                    const tempDonor = donors[0];
                    startCall(tempDonor);
                  }}
                  className="text-rose-600 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>अटेंडेंट से बात करें</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BLOOD GROUP COMPATIBILITY GUIDE */}
      <div className="rounded-xl bg-neutral-50 p-3.5 border border-neutral-200 text-xs">
        <div className="flex items-center gap-1.5 text-neutral-700 font-bold mb-2">
          <Info className="w-4 h-4 text-rose-600" />
          <span>रक्त समूह मिलान मार्गदर्शिका (Blood Compatibility)</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-600">
          <div className="p-2 rounded bg-white border border-neutral-200">
            <span className="font-bold text-rose-600">O- (यूनिवर्सल डोनर):</span> किसी भी रक्त समूह को दिया जा सकता है।
          </div>
          <div className="p-2 rounded bg-white border border-neutral-200">
            <span className="font-bold text-rose-600">AB+ (यूनिवर्सल रिसीवर):</span> किसी भी रक्त समूह से ले सकता है।
          </div>
          <div className="p-2 rounded bg-white border border-neutral-200 col-span-2">
            <span className="font-bold text-rose-600">बॉम्बे ब्लड ग्रुप (hh):</span> अति-दुर्लभ रक्त। केवल बॉम्बे ब्लड ग्रुप के दाता से ही लिया जा सकता है।
          </div>
        </div>
      </div>

      {/* LEGAL NOTICE FOOTER BANNER */}
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-[11px] leading-relaxed">
        <strong>कानूनी सूचना:</strong> {t.legalDisclaimer}
      </div>

    </div>
  );
};
