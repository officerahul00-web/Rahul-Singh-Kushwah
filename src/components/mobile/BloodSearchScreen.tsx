import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  Filter,
  AlertTriangle,
  Heart,
  Droplet,
  ArrowRight,
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BloodGroup, Donor } from '../../types';
import { BLOOD_GROUPS, INDIAN_STATES_DISTRICTS } from '../../data/mockData';

interface BloodSearchScreenProps {
  onNavigateToSos: () => void;
}

export const BloodSearchScreen: React.FC<BloodSearchScreenProps> = ({ onNavigateToSos }) => {
  const { t, donors, startCall } = useApp();

  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup>('O+');
  const [selectedState, setSelectedState] = useState<string>('Uttar Pradesh');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Varanasi');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [availableOnly, setAvailableOnly] = useState<boolean>(true);
  const [hasSearched, setHasSearched] = useState<boolean>(true);

  const availableDistricts = INDIAN_STATES_DISTRICTS[selectedState] || [];

  // Filter donors based on criteria
  const filteredDonors = donors.filter(donor => {
    const matchBlood = donor.bloodGroup === selectedBloodGroup;
    const matchState = !selectedState || donor.state.toLowerCase() === selectedState.toLowerCase();
    const matchDistrict = !selectedDistrict || donor.district.toLowerCase() === selectedDistrict.toLowerCase();
    const matchCity = !selectedCity || donor.city.toLowerCase().includes(selectedCity.toLowerCase());
    const matchAvailability = availableOnly ? donor.isAvailable : true;
    return matchBlood && matchState && matchDistrict && matchCity && matchAvailability;
  });

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const districts = INDIAN_STATES_DISTRICTS[stateName] || [];
    setSelectedDistrict(districts[0] || '');
  };

  const openWhatsApp = (donor: Donor) => {
    const text = encodeURIComponent(
      `नमस्ते ${donor.fullName} जी, माँ अम्बा मुफ़्त रक्तदान नेटवर्क के माध्यम से हमें अस्पताल में मरीज के लिए ${donor.bloodGroup} रक्त की आपातकालीन आवश्यकता है। क्या आप रक्तदान करने में सहायता कर सकते हैं?`
    );
    window.open(`https://wa.me/${donor.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col gap-4 pb-20 text-neutral-900 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-rose-700 text-white p-4 rounded-2xl shadow-md border border-rose-600">
        <h2 className="text-lg font-black tracking-tight font-['Mukta'] flex items-center gap-2">
          <Search className="w-5 h-5" />
          <span>{t.searchTitle}</span>
        </h2>
        <p className="text-xs text-rose-100 mt-0.5">
          सत्यापित स्वैच्छिक रक्तदाताओं से सीधे संपर्क करें — 100% मुफ़्त
        </p>
      </div>

      {/* FILTER STEP 1: BLOOD GROUP CHIPS */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
        <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider block mb-2.5">
          {t.step1BloodGroup}
        </label>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {BLOOD_GROUPS.map(bg => {
            const isSelected = selectedBloodGroup === bg;
            const isBombay = bg.includes('Bombay');

            return (
              <button
                key={bg}
                id={`filter-bg-${bg.replace(/[^a-zA-Z0-9]/g, '')}`}
                onClick={() => setSelectedBloodGroup(bg)}
                className={`py-2 px-1 rounded-xl text-center font-bold text-xs transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md scale-[1.02]'
                    : isBombay
                    ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 col-span-3 sm:col-span-2'
                    : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {bg}
              </button>
            );
          })}
        </div>
      </div>

      {/* FILTER STEP 2: LOCATION */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex flex-col gap-3">
        <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider block">
          {t.step2Location}
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* State */}
          <div>
            <span className="text-[11px] font-medium text-neutral-500 mb-1 block">राज्य (State)</span>
            <select
              id="search-state-select"
              value={selectedState}
              onChange={e => handleStateChange(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {Object.keys(INDIAN_STATES_DISTRICTS).map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <span className="text-[11px] font-medium text-neutral-500 mb-1 block">जिला (District)</span>
            <select
              id="search-district-select"
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {availableDistricts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Availability toggle checkbox */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer">
            <input
              type="checkbox"
              id="search-available-only-toggle"
              checked={availableOnly}
              onChange={e => setAvailableOnly(e.target.checked)}
              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
            />
            <span>{t.filterAvailableOnly}</span>
          </label>
          <span className="text-xs font-bold text-rose-600">
            {filteredDonors.length} {t.resultsFound}
          </span>
        </div>
      </div>

      {/* SEARCH RESULTS LIST */}
      <div className="flex flex-col gap-3">
        {filteredDonors.length === 0 ? (
          <div className="p-6 rounded-2xl bg-amber-50/80 border-2 border-amber-300 text-center flex flex-col items-center">
            <AlertTriangle className="w-10 h-10 text-amber-600 mb-2" />
            <h3 className="font-bold text-sm text-neutral-900">
              इस क्षेत्र में अभी कोई सक्रिय रक्तदाता उपलब्ध नहीं मिला
            </h3>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed max-w-xs">
              {t.noDonorsFound}
            </p>

            <button
              id="search-fallback-sos-btn"
              onClick={onNavigateToSos}
              className="mt-4 py-3 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
            >
              <Droplet className="w-4 h-4" />
              <span>तत्काल SOS आपातकालीन ब्रॉडकास्ट जारी करें</span>
            </button>
          </div>
        ) : (
          filteredDonors.map(donor => (
            <div
              key={donor.id}
              className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:border-rose-300 transition-all flex flex-col gap-3"
            >
              {/* Donor Header Card */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-600 to-red-700 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                    {donor.bloodGroup}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-neutral-900">{donor.fullName}</h4>
                      {donor.isVerified && (
                        <span title="सत्यापित दाता">
                          <UserCheck className="w-4 h-4 text-emerald-600" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{donor.city}, {donor.district} ({donor.pincode})</span>
                    </p>
                  </div>
                </div>

                {donor.isAvailable ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    उपलब्ध (Ready)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-300">
                    अनुपलब्ध (Resting)
                  </span>
                )}
              </div>

              {/* Donation history stats */}
              <div className="flex items-center justify-between text-[11px] text-neutral-600 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-100">
                <span>अंतिम रक्तदान: <strong>{donor.lastDonationDate || 'प्रथम बार'}</strong></span>
                <span>कुल रक्तदान: <strong>{donor.totalDonations} बार</strong></span>
              </div>

              {/* Action Buttons: Call Now, WhatsApp, Masked Call */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {/* Direct Call / Masked Call */}
                <button
                  id={`call-donor-${donor.id}`}
                  onClick={() => startCall(donor, donor.isMaskedCallingEnabled)}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{donor.isMaskedCallingEnabled ? 'गोपनीय कॉल' : 'सीधे कॉल करें'}</span>
                </button>

                {/* WhatsApp message */}
                <button
                  id={`whatsapp-donor-${donor.id}`}
                  onClick={() => openWhatsApp(donor)}
                  className="py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-teal-600/20 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp मैसेज</span>
                </button>
              </div>

              {donor.isMaskedCallingEnabled && (
                <div className="text-[10px] text-neutral-500 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>DPDP अधिनियम गोपनीयता: दाता का वास्तविक नंबर सुरक्षित रखा गया है।</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* NON-COMMERCIAL & LEGAL COMPLIANCE BANNER */}
      <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-950 text-xs leading-relaxed flex items-start gap-2.5">
        <ShieldAlert className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold block">कानूनी चेतावनी (Legal Mandate):</strong>
          {t.legalDisclaimer}
        </div>
      </div>

    </div>
  );
};
