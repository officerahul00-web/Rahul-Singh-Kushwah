import React, { useState } from 'react';
import {
  User,
  Heart,
  Phone,
  ShieldCheck,
  Globe,
  LogOut,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Trash2,
  Clock,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const UserProfileScreen: React.FC = () => {
  const { user, switchRole, language, setLanguage, t, donors, toggleDonorAvailability, toggleMaskedCalling, logout, loginWithPhone } = useApp();

  const [phoneInput, setPhoneInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');

  const currentDonorProfile = donors.find(d => d.phone === user?.phone || d.id === user?.donorProfileId);

  const handleSimulatedLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpStep) {
      if (!phoneInput || phoneInput.length < 10) {
        alert('कृपया 10 अंकों का वैध फोन नंबर दर्ज करें');
        return;
      }
      setOtpStep(true);
      setOtp('739281'); // Auto-read OTP simulator
    } else {
      setIsLoggingIn(true);
      setTimeout(() => {
        loginWithPhone(phoneInput, nameInput || 'नागरिक (Citizen)');
        setIsLoggingIn(false);
        setOtpStep(false);
      }, 700);
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-20 text-neutral-900 animate-in fade-in duration-200">
      
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white p-5 rounded-2xl shadow-lg border border-neutral-700">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center font-bold text-2xl shadow-md border-2 border-rose-400">
            {user?.name.charAt(0) || 'उ'}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold tracking-tight text-white">{user?.name || 'उपयोगकर्ता'}</h3>
            <p className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
              <Phone className="w-3.5 h-3.5 text-neutral-400" />
              <span>{user?.phone || 'लॉगिन नहीं है'}</span>
            </p>
            <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{user?.savedDistrict || 'Varanasi'}, {user?.savedState || 'Uttar Pradesh'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* DUAL-MODE ACCOUNT ARCHITECTURE SWITCH */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            खाता मोड (Dual-Mode Account)
          </h4>
          <span className="text-[11px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md">
            एकल खाता
          </span>
        </div>

        <p className="text-xs text-neutral-600 leading-relaxed">
          आप एक ही पंजीकृत खाते से आवश्यकता पड़ने पर <strong>रक्तदाता (Donor)</strong> और <strong>रक्त खोजी (Seeker)</strong> दोनों मोड में कार्य कर सकते हैं।
        </p>

        <div className="grid grid-cols-2 gap-2 bg-neutral-100 p-1 rounded-xl">
          <button
            id="profile-mode-seeker-btn"
            onClick={() => switchRole('SEEKER')}
            className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              user?.activeRole === 'SEEKER'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>रक्त खोजी (Seeker)</span>
          </button>

          <button
            id="profile-mode-donor-btn"
            onClick={() => switchRole('DONOR')}
            className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              user?.activeRole === 'DONOR'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>रक्तदाता (Donor)</span>
          </button>
        </div>
      </div>

      {/* DONOR SPECIFIC CONTROLS IF REGISTERED */}
      {currentDonorProfile && (
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex flex-col gap-3">
          <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            रक्तदाता स्थिति एवं नियंत्रण (Live Controls)
          </h4>

          {/* Live Availability Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <div>
              <span className="text-xs font-bold text-emerald-950 block">
                {currentDonorProfile.isAvailable ? 'रक्तदान हेतु उपलब्ध (Active)' : 'वर्तमान में विश्राम पर (Resting)'}
              </span>
              <span className="text-[11px] text-emerald-700">
                काम, यात्रा या स्वास्थ्य विश्राम के दौरान इसे बंद कर सकते हैं
              </span>
            </div>
            <button
              id="profile-toggle-availability-btn"
              onClick={() => toggleDonorAvailability(currentDonorProfile.id)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                currentDonorProfile.isAvailable ? 'bg-emerald-600' : 'bg-neutral-300'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  currentDonorProfile.isAvailable ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Masked Calling Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200">
            <div>
              <span className="text-xs font-bold text-neutral-900 block">
                गोपनीय नंबर कॉलिंग (DPDP Masked Calling)
              </span>
              <span className="text-[11px] text-neutral-500">
                {currentDonorProfile.isMaskedCallingEnabled ? 'सक्रिय (नंबर सुरक्षित)' : 'निष्क्रिय (प्रत्यक्ष नंबर दृश्य)'}
              </span>
            </div>
            <button
              id="profile-toggle-masked-btn"
              onClick={() => toggleMaskedCalling(currentDonorProfile.id)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                currentDonorProfile.isMaskedCallingEnabled ? 'bg-rose-600' : 'bg-neutral-300'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  currentDonorProfile.isMaskedCallingEnabled ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded-lg">
            रक्त समूह: <strong className="text-rose-600 font-mono">{currentDonorProfile.bloodGroup}</strong> | कुल योगदान: <strong>{currentDonorProfile.totalDonations} बार</strong>
          </div>
        </div>
      )}

      {/* APP LANGUAGE PREFERENCE */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-rose-600" />
          <div>
            <span className="text-xs font-bold text-neutral-900 block">भाषा चुनें (Language)</span>
            <span className="text-[11px] text-neutral-500">हिन्दी अथवा अंग्रेजी में ऐप चलाएं</span>
          </div>
        </div>

        <div className="flex rounded-lg bg-neutral-100 p-0.5 text-xs font-bold">
          <button
            id="profile-lang-hi-btn"
            onClick={() => setLanguage('hi')}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
              language === 'hi' ? 'bg-rose-600 text-white' : 'text-neutral-600'
            }`}
          >
            हिन्दी
          </button>
          <button
            id="profile-lang-en-btn"
            onClick={() => setLanguage('en')}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
              language === 'en' ? 'bg-rose-600 text-white' : 'text-neutral-600'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* DPDP DATA PRIVACY & USER RIGHTS */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>DPDP अधिनियम 2023 के तहत आपके अधिकार</span>
        </div>
        <p className="text-[11px] text-neutral-600 leading-relaxed">
          आपका डेटा केवल वास्तविक आपातकालीन रक्त खोज हेतु उपयोग किया जाता है। इसे कभी भी विज्ञापनों या तीसरे पक्ष के साथ साझा नहीं किया जाता।
        </p>

        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
          <button
            onClick={() => alert('DPDP 2023 अधिकार: आपका पूरा डेटा एन्क्रिप्टेड है और कभी भी मिटाया जा सकता है।')}
            className="text-neutral-600 hover:underline font-semibold"
          >
            गोपनीयता नीति पढ़ें
          </button>
          <button
            onClick={() => alert('आपका डेटा हटाने का अनुरोध स्वीकार किया गया।')}
            className="text-rose-600 hover:underline font-semibold flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>डेटा मिटाने का अनुरोध</span>
          </button>
        </div>
      </div>

      {/* LOGOUT OR SWITCH ACCOUNT */}
      <button
        id="profile-logout-btn"
        onClick={logout}
        className="w-full py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>खाता लॉगआउट करें (Logout)</span>
      </button>

    </div>
  );
};
