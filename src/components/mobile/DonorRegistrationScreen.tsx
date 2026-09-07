import React, { useState } from 'react';
import {
  Heart,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Calendar,
  MapPin,
  Sparkles,
  Phone,
  User,
  Activity
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { BloodGroup } from '../../types';
import { BLOOD_GROUPS, INDIAN_STATES_DISTRICTS } from '../../data/mockData';

interface DonorRegistrationScreenProps {
  onRegistrationComplete: () => void;
}

export const DonorRegistrationScreen: React.FC<DonorRegistrationScreenProps> = ({
  onRegistrationComplete
}) => {
  const { t, registerDonor, user } = useApp();

  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [state, setState] = useState('Uttar Pradesh');
  const [district, setDistrict] = useState('Varanasi');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('221001');
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [isNeverDonated, setIsNeverDonated] = useState(true);

  // Medical eligibility
  const [ageConfirmed, setAgeConfirmed] = useState(true);
  const [weightConfirmed, setWeightConfirmed] = useState(true);
  const [noChronicConditions, setNoChronicConditions] = useState(true);
  const [dpdpConsent, setDpdpConsent] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isMaskedCallingEnabled, setIsMaskedCallingEnabled] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleStateChange = (st: string) => {
    setState(st);
    const districts = INDIAN_STATES_DISTRICTS[st] || [];
    setDistrict(districts[0] || '');
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'कृपया पूरा नाम दर्ज करें';
    if (!pincode.trim() || pincode.length !== 6) errs.pincode = '6 अंकों का वैध पिनकोड आवश्यक है';
    if (!ageConfirmed) errs.age = 'आयु 18-65 वर्ष होना अनिवार्य है';
    if (!weightConfirmed) errs.weight = 'वजन 45 किग्रा से अधिक होना चाहिए';
    if (!noChronicConditions) errs.health = 'चिकित्सीय फिटनेस अनिवार्य है';
    if (!dpdpConsent) errs.dpdp = 'आपातकालीन संपर्क साझा करने की सहमति आवश्यक है';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      registerDonor({
        fullName,
        phone,
        bloodGroup,
        state,
        district,
        city: city.trim() || district,
        pincode,
        lastDonationDate: isNeverDonated ? 'never' : lastDonationDate || '2024-01-01',
        isAvailable,
        isVerified: true,
        isMaskedCallingEnabled,
        medicalEligibility: {
          ageConfirmed,
          weightConfirmed,
          noChronicConditions,
          dpdpConsent
        }
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 600);
  };

  if (isSuccess) {
    return (
      <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-lg text-center flex flex-col items-center animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-neutral-900 font-['Mukta']">
          रक्तदाता पंजीकरण सफल!
        </h3>
        <p className="text-xs text-neutral-600 mt-2 leading-relaxed max-w-sm">
          {t.registeredSuccess} आप अब सीधे जरूरतमंद मरीजों के लिए जीवनरक्षक के रूप में पंजीकृत हैं।
        </p>

        <div className="mt-4 p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs w-full text-left">
          <div className="flex justify-between py-1 border-b border-neutral-200">
            <span className="text-neutral-500">रक्त समूह:</span>
            <span className="font-bold text-rose-600">{bloodGroup}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-neutral-200">
            <span className="text-neutral-500">क्षेत्र:</span>
            <span className="font-bold">{district}, {state}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-neutral-500">लाइव उपलब्धता:</span>
            <span className="font-bold text-emerald-600">उपलब्ध (Active)</span>
          </div>
        </div>

        <button
          id="registration-done-btn"
          onClick={onRegistrationComplete}
          className="mt-6 w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
        >
          डैशबोर्ड पर वापस जाएं
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-20 text-neutral-900 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-4 rounded-2xl shadow-md border border-emerald-600">
        <h2 className="text-lg font-black tracking-tight font-['Mukta'] flex items-center gap-2">
          <Heart className="w-5 h-5 fill-white text-white" />
          <span>{t.regTitle}</span>
        </h2>
        <p className="text-xs text-emerald-100 mt-0.5">
          {t.regSubtitle} — कोई भी शुल्क नहीं, केवल मानवता
        </p>
      </div>

      {/* BASIC DETAILS */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex flex-col gap-3">
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
          व्यक्तिगत एवं संपर्क विवरण (Personal Info)
        </h3>

        {/* Full Name */}
        <div>
          <label className="text-xs font-semibold text-neutral-700 mb-1 block">
            {t.fullName} *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              id="donor-reg-name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="उदा. रमेश कुमार"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          {errors.fullName && <span className="text-[11px] text-red-600 mt-0.5 block">{errors.fullName}</span>}
        </div>

        {/* Phone */}
        <div>
          <label className="text-xs font-semibold text-neutral-700 mb-1 block">
            मोबाइल नंबर (OTP प्रमाणित)
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              value={phone}
              disabled
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-600"
            />
          </div>
        </div>

        {/* Blood Group Selection */}
        <div>
          <label className="text-xs font-semibold text-neutral-700 mb-1.5 block">
            {t.bloodGroup} *
          </label>
          <div className="grid grid-cols-3 gap-2">
            {BLOOD_GROUPS.map(bg => (
              <button
                type="button"
                key={bg}
                id={`reg-bg-${bg.replace(/[^a-zA-Z0-9]/g, '')}`}
                onClick={() => setBloodGroup(bg)}
                className={`py-2 px-1 rounded-xl text-center font-bold text-xs border transition-all cursor-pointer ${
                  bloodGroup === bg
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                    : bg.includes('Bombay')
                    ? 'bg-amber-50 text-amber-900 border-amber-300 col-span-3'
                    : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GEOGRAPHIC LOCATION */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex flex-col gap-3">
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
          स्थान एवं क्षेत्र (Location & District)
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-neutral-700 mb-1 block">राज्य (State)</label>
            <select
              id="donor-reg-state"
              value={state}
              onChange={e => handleStateChange(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-semibold text-neutral-800"
            >
              {Object.keys(INDIAN_STATES_DISTRICTS).map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-700 mb-1 block">जिला (District)</label>
            <select
              id="donor-reg-district"
              value={district}
              onChange={e => setDistrict(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-semibold text-neutral-800"
            >
              {(INDIAN_STATES_DISTRICTS[state] || []).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-neutral-700 mb-1 block">शहर / कस्बा / तहसील</label>
            <input
              type="text"
              id="donor-reg-city"
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="उदा. दशाश्वमेध"
              className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-700 mb-1 block">पिनकोड *</label>
            <input
              type="text"
              id="donor-reg-pincode"
              maxLength={6}
              value={pincode}
              onChange={e => setPincode(e.target.value)}
              placeholder="221001"
              className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-semibold"
            />
            {errors.pincode && <span className="text-[11px] text-red-600 mt-0.5 block">{errors.pincode}</span>}
          </div>
        </div>
      </div>

      {/* DONATION HISTORY */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex flex-col gap-3">
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
          अंतिम रक्तदान का विवरण (Donation History)
        </h3>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="donor-never-donated"
            checked={isNeverDonated}
            onChange={e => setIsNeverDonated(e.target.checked)}
            className="w-4 h-4 rounded text-rose-600"
          />
          <label htmlFor="donor-never-donated" className="text-xs font-semibold text-neutral-700 cursor-pointer">
            मैं पहली बार रक्तदान करने जा रहा/रही हूँ (First-time Donor)
          </label>
        </div>

        {!isNeverDonated && (
          <div>
            <label className="text-xs font-semibold text-neutral-700 mb-1 block">
              {t.lastDonationDate}
            </label>
            <input
              type="date"
              id="donor-last-date"
              value={lastDonationDate}
              onChange={e => setLastDonationDate(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-semibold"
            />
          </div>
        )}
      </div>

      {/* MEDICAL ELIGIBILITY CHECK */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
          <Activity className="w-4 h-4 text-emerald-600" />
          <span>{t.eligibilityTitle}</span>
        </div>

        <label className="flex items-start gap-2.5 p-2 rounded-xl bg-neutral-50 border border-neutral-100 cursor-pointer text-xs">
          <input
            type="checkbox"
            id="eligibility-age-check"
            checked={ageConfirmed}
            onChange={e => setAgeConfirmed(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 mt-0.5"
          />
          <span className="text-neutral-700 font-medium">{t.ageCheck}</span>
        </label>

        <label className="flex items-start gap-2.5 p-2 rounded-xl bg-neutral-50 border border-neutral-100 cursor-pointer text-xs">
          <input
            type="checkbox"
            id="eligibility-weight-check"
            checked={weightConfirmed}
            onChange={e => setWeightConfirmed(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 mt-0.5"
          />
          <span className="text-neutral-700 font-medium">{t.weightCheck}</span>
        </label>

        <label className="flex items-start gap-2.5 p-2 rounded-xl bg-neutral-50 border border-neutral-100 cursor-pointer text-xs">
          <input
            type="checkbox"
            id="eligibility-health-check"
            checked={noChronicConditions}
            onChange={e => setNoChronicConditions(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 mt-0.5"
          />
          <span className="text-neutral-700 font-medium">{t.healthCheck}</span>
        </label>

        <label className="flex items-start gap-2.5 p-2 rounded-xl bg-amber-50/60 border border-amber-200 cursor-pointer text-xs">
          <input
            type="checkbox"
            id="eligibility-dpdp-check"
            checked={dpdpConsent}
            onChange={e => setDpdpConsent(e.target.checked)}
            className="w-4 h-4 rounded text-amber-600 mt-0.5"
          />
          <span className="text-amber-900 font-medium">{t.dpdpConsent}</span>
        </label>
      </div>

      {/* LIVE AVAILABILITY & PRIVACY TOGGLE */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex flex-col gap-3">
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
          उपलब्धता एवं गोपनीयता प्राथमिकता (Settings)
        </h3>

        {/* Live Availability */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
          <div>
            <span className="text-xs font-bold text-emerald-900 block">{t.liveStatusToggle}</span>
            <span className="text-[11px] text-emerald-700">काम या बीमारी के समय इसे बंद कर सकते हैं</span>
          </div>
          <input
            type="checkbox"
            id="donor-live-availability-toggle"
            checked={isAvailable}
            onChange={e => setIsAvailable(e.target.checked)}
            className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
          />
        </div>

        {/* Masked Calling Toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200">
          <div>
            <span className="text-xs font-bold text-neutral-900 block">गोपनीय कॉलिंग सक्षम करें (Masked Phone)</span>
            <span className="text-[11px] text-neutral-500">खोजी आपका वास्तविक मोबाइल नंबर नहीं देख पाएंगे</span>
          </div>
          <input
            type="checkbox"
            id="donor-masked-calling-toggle"
            checked={isMaskedCallingEnabled}
            onChange={e => setIsMaskedCallingEnabled(e.target.checked)}
            className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
          />
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        id="submit-donor-registration-btn"
        disabled={isSubmitting}
        className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-extrabold text-sm shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
      >
        {isSubmitting ? (
          <span>पंजीकरण हो रहा है...</span>
        ) : (
          <>
            <Heart className="w-5 h-5 fill-white text-white" />
            <span>{t.submitRegistration}</span>
          </>
        )}
      </button>

    </form>
  );
};
