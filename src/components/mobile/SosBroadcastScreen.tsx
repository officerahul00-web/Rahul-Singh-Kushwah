import React, { useState } from 'react';
import {
  AlertOctagon,
  Building2,
  Bed,
  FileText,
  Upload,
  User,
  Phone,
  Droplet,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { BloodGroup } from '../../types';
import { BLOOD_GROUPS, INDIAN_STATES_DISTRICTS } from '../../data/mockData';

interface SosBroadcastScreenProps {
  onSuccess: () => void;
}

export const SosBroadcastScreen: React.FC<SosBroadcastScreenProps> = ({ onSuccess }) => {
  const { t, createSosRequest, user } = useApp();

  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [unitsRequired, setUnitsRequired] = useState(2);
  const [hospitalName, setHospitalName] = useState('');
  const [wardBedNumber, setWardBedNumber] = useState('');
  const [state, setState] = useState(user?.savedState || 'Uttar Pradesh');
  const [district, setDistrict] = useState(user?.savedDistrict || 'Varanasi');
  const [city, setCity] = useState('');
  const [attendantName, setAttendantName] = useState(user?.name || '');
  const [attendantPhone, setAttendantPhone] = useState(user?.phone || '+91 94500 88219');
  
  const [prescriptionFile, setPrescriptionFile] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [broadcastedSosId, setBroadcastedSosId] = useState('');
  const [notifiedCount, setNotifiedCount] = useState(0);

  const handleStateChange = (st: string) => {
    setState(st);
    const districts = INDIAN_STATES_DISTRICTS[st] || [];
    setDistrict(districts[0] || '');
  };

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setTimeout(() => {
        setPrescriptionFile(URL.createObjectURL(file));
        setIsUploading(false);
      }, 700);
    }
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !hospitalName.trim() || !attendantPhone.trim()) {
      alert('कृपया मरीज का नाम, अस्पताल का नाम और अटेंडेंट का मोबाइल नंबर अनिवार्य रूप से भरें');
      return;
    }

    setIsBroadcasting(true);

    setTimeout(() => {
      const newSos = createSosRequest({
        patientName,
        bloodGroup,
        unitsRequired,
        hospitalName,
        wardBedNumber: wardBedNumber.trim() || 'Emergency Ward',
        city: city.trim() || district,
        district,
        state,
        attendantName: attendantName.trim() || 'परिजनों/अटेंडेंट',
        attendantPhone,
        prescriptionUrl: prescriptionFile || undefined,
        urgencyLevel: 'CRITICAL',
        verifiedByAdmin: true
      });

      setBroadcastedSosId(newSos.id);
      setNotifiedCount(newSos.notifiedDonorsCount || 18);
      setIsBroadcasting(false);
      setIsSuccess(true);

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 }
      });
    }, 1200);
  };

  if (isSuccess) {
    return (
      <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xl text-center flex flex-col items-center animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3 animate-pulse">
          <AlertOctagon className="w-9 h-9" />
        </div>

        <h3 className="text-xl font-black text-rose-700 font-['Mukta']">
          🚨 आपातकालीन SOS ब्रॉडकास्ट जारी!
        </h3>
        <p className="text-xs text-neutral-600 mt-1 max-w-sm leading-relaxed">
          <strong>{district}</strong> जिले के <strong>{bloodGroup}</strong> रक्त समूह वाले पंजीकृत दाताओं के मोबाइल पर आपातकालीन अलर्ट भेज दिया गया है।
        </p>

        <div className="mt-4 p-4 rounded-xl bg-neutral-900 text-white text-xs w-full text-left space-y-2 border border-neutral-800">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
            <span className="text-neutral-400">अलर्ट ID:</span>
            <span className="font-mono text-rose-400">{broadcastedSosId}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
            <span className="text-neutral-400">सूचित दाता:</span>
            <span className="font-bold text-emerald-400">{notifiedCount} रक्तदाता (FCM Dispatched)</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
            <span className="text-neutral-400">मरीज:</span>
            <span className="font-semibold">{patientName} ({unitsRequired} यूनिट)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-400">अस्पताल:</span>
            <span className="font-semibold truncate max-w-[180px]">{hospitalName}</span>
          </div>
        </div>

        <button
          id="sos-broadcast-return-home-btn"
          onClick={onSuccess}
          className="mt-6 w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
        >
          डैशबोर्ड पर वापस जाएं
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleBroadcast} className="flex flex-col gap-4 pb-20 text-neutral-900 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-800 via-rose-700 to-red-800 text-white p-4.5 rounded-2xl shadow-lg border border-red-600">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          <h2 className="text-lg font-black tracking-tight font-['Mukta']">
            {t.sosTitle}
          </h2>
        </div>
        <p className="text-xs text-rose-100 mt-1 leading-relaxed">
          {t.sosSubtitle}
        </p>
      </div>

      {/* PATIENT & BLOOD REQUIREMENT */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex flex-col gap-3">
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
          मरीज एवं रक्त विवरण (Patient Details)
        </h3>

        {/* Patient Name */}
        <div>
          <label className="text-xs font-semibold text-neutral-700 mb-1 block">
            {t.patientName} *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              id="sos-patient-name"
              required
              value={patientName}
              onChange={e => setPatientName(e.target.value)}
              placeholder="मरीज का नाम व आयु"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* Blood Group */}
        <div>
          <label className="text-xs font-semibold text-neutral-700 mb-1.5 block">
            आवश्यक रक्त समूह (Blood Group) *
          </label>
          <div className="grid grid-cols-3 gap-2">
            {BLOOD_GROUPS.map(bg => (
              <button
                type="button"
                key={bg}
                id={`sos-bg-${bg.replace(/[^a-zA-Z0-9]/g, '')}`}
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

        {/* Units Needed */}
        <div>
          <label className="text-xs font-semibold text-neutral-700 mb-1 block">
            {t.unitsNeeded} *
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map(num => (
              <button
                type="button"
                key={num}
                id={`sos-units-${num}`}
                onClick={() => setUnitsRequired(num)}
                className={`flex-1 py-2 rounded-xl text-center font-bold text-xs border transition-all cursor-pointer ${
                  unitsRequired === num
                    ? 'bg-rose-600 text-white border-rose-600 shadow'
                    : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                }`}
              >
                {num} यूनिट
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* HOSPITAL & LOCATION */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex flex-col gap-3">
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
          अस्पताल एवं स्थान विवरण (Hospital Location)
        </h3>

        {/* Hospital Name */}
        <div>
          <label className="text-xs font-semibold text-neutral-700 mb-1 block">
            {t.hospitalName} *
          </label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              id="sos-hospital-name"
              required
              value={hospitalName}
              onChange={e => setHospitalName(e.target.value)}
              placeholder="उदा. बीएचयू ट्रॉमा सेंटर / मेदांता / जिला अस्पताल"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* Bed/Ward */}
        <div>
          <label className="text-xs font-semibold text-neutral-700 mb-1 block">
            {t.bedWard}
          </label>
          <div className="relative">
            <Bed className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              id="sos-ward-bed"
              value={wardBedNumber}
              onChange={e => setWardBedNumber(e.target.value)}
              placeholder="उदा. ICU-2, बेड नंबर 14"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-semibold"
            />
          </div>
        </div>

        {/* State & District */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-neutral-700 mb-1 block">राज्य (State)</label>
            <select
              id="sos-state-select"
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
              id="sos-district-select"
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
      </div>

      {/* ATTENDANT CONTACT */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex flex-col gap-3">
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
          अटेंडेंट संपर्क सूत्र (Attendant Contact)
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-neutral-700 mb-1 block">अटेंडेंट का नाम</label>
            <input
              type="text"
              id="sos-attendant-name"
              value={attendantName}
              onChange={e => setAttendantName(e.target.value)}
              placeholder="उदा. राहुल शर्मा"
              className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-700 mb-1 block">मोबाइल नंबर *</label>
            <input
              type="text"
              id="sos-attendant-phone"
              required
              value={attendantPhone}
              onChange={e => setAttendantPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-semibold"
            />
          </div>
        </div>
      </div>

      {/* DOCTOR PRESCRIPTION / SLIP UPLOAD */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-rose-600" />
            <span>{t.prescriptionSlip}</span>
          </label>
          <span className="text-[10px] text-neutral-400">सत्यापन हेतु (वैकल्पिक)</span>
        </div>

        <div className="border-2 border-dashed border-neutral-300 rounded-xl p-4 text-center hover:border-rose-400 transition-colors bg-neutral-50">
          {prescriptionFile ? (
            <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-neutral-200">
              <span className="text-xs font-medium text-emerald-600 truncate max-w-[200px]">
                ✓ पर्ची सफलतापूर्वक संलग्न की गई
              </span>
              <button
                type="button"
                onClick={() => setPrescriptionFile(null)}
                className="text-xs text-rose-600 hover:underline font-bold"
              >
                हटाएं
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center cursor-pointer">
              <Upload className="w-6 h-6 text-neutral-400 mb-1" />
              <span className="text-xs font-bold text-neutral-700">डॉक्टर की पर्ची चुनें या फोटो खींचें</span>
              <span className="text-[11px] text-neutral-500 mt-0.5">JPG, PNG या PDF (अधिकतम 5MB)</span>
              <input
                type="file"
                id="sos-prescription-file"
                accept="image/*"
                onChange={handleSimulatedFileUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* BROADCAST BUTTON */}
      <button
        type="submit"
        id="submit-sos-broadcast-btn"
        disabled={isBroadcasting}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-800 active:scale-[0.98] text-white font-extrabold text-sm shadow-xl shadow-rose-600/40 flex items-center justify-center gap-2 cursor-pointer transition-all"
      >
        {isBroadcasting ? (
          <span>पुश नोटिफिकेशन प्रसारित हो रहा है...</span>
        ) : (
          <>
            <AlertOctagon className="w-5 h-5 animate-pulse" />
            <span>{t.broadcastNow}</span>
          </>
        )}
      </button>

      {/* Legal non-commercial compliance note */}
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-[11px] leading-relaxed">
        <strong>सत्यापन नियम:</strong> फर्जी या व्यावसायिक आपातकालीन अनुरोध भेजना कानूनी रूप से दंडनीय है। यह मंच केवल वास्तविक मरीजों के लिए 100% मुफ़्त है।
      </div>

    </form>
  );
};
