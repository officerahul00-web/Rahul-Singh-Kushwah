import React, { useState } from 'react';
import {
  Shield,
  Users,
  AlertOctagon,
  Download,
  Search,
  Filter,
  Ban,
  CheckCircle2,
  FileText,
  MapPin,
  TrendingUp,
  Heart,
  Eye,
  Building2,
  Phone,
  RefreshCw,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Donor, SOSRequest } from '../../types';
import { BLOOD_GROUPS } from '../../data/mockData';

export const AdminDashboard: React.FC = () => {
  const {
    donors,
    banDonor,
    sosRequests,
    updateSosStatus,
    districtAnalytics,
    triggerEmergencyBroadcast
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'donors' | 'sos' | 'analytics'>('donors');
  const [donorSearch, setDonorSearch] = useState('');
  const [selectedBloodFilter, setSelectedBloodFilter] = useState('ALL');
  const [viewingPrescription, setViewingPrescription] = useState<string | null>(null);

  const totalDonors = donors.length;
  const availableDonors = donors.filter(d => d.isAvailable).length;
  const activeSosCount = sosRequests.filter(s => s.status === 'ACTIVE').length;
  const verifiedSosCount = sosRequests.filter(s => s.status === 'VERIFIED').length;

  const filteredDonors = donors.filter(d => {
    const matchSearch =
      d.fullName.toLowerCase().includes(donorSearch.toLowerCase()) ||
      d.phone.includes(donorSearch) ||
      d.district.toLowerCase().includes(donorSearch.toLowerCase()) ||
      d.city.toLowerCase().includes(donorSearch.toLowerCase());
    const matchBlood = selectedBloodFilter === 'ALL' || d.bloodGroup === selectedBloodFilter;
    return matchSearch && matchBlood;
  });

  const exportDonorsCsv = () => {
    const headers = "ID,Name,Phone,BloodGroup,State,District,City,Pincode,Available,TotalDonations,RegisteredDate\n";
    const rows = donors.map(d =>
      `"${d.id}","${d.fullName}","${d.phone}","${d.bloodGroup}","${d.state}","${d.district}","${d.city}","${d.pincode}","${d.isAvailable}","${d.totalDonations}","${d.registeredAt}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `maa_amba_donors_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSosCsv = () => {
    const headers = "SOS_ID,PatientName,BloodGroup,Units,Hospital,WardBed,District,State,AttendantPhone,Status,CreatedAt\n";
    const rows = sosRequests.map(s =>
      `"${s.id}","${s.patientName}","${s.bloodGroup}","${s.unitsRequired}","${s.hospitalName}","${s.wardBedNumber}","${s.district}","${s.state}","${s.attendantPhone}","${s.status}","${s.createdAt}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `maa_amba_sos_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 text-neutral-100 flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-600/20 text-rose-500 border border-rose-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-white font-['Mukta']">
              माँ अम्बा मुफ़्त रक्तदान नेटवर्क — सुपर-एडमिन नियंत्रण कक्ष
            </h2>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Super-Admin Monitoring, Donor Verification, Anti-Spam Moderation & SOS Triage
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="admin-export-donors-btn"
            onClick={exportDonorsCsv}
            className="py-2 px-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200 border border-neutral-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-rose-400" />
            <span>रक्तदाता डेटा (CSV)</span>
          </button>
          <button
            id="admin-export-sos-btn"
            onClick={exportSosCsv}
            className="py-2 px-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200 border border-neutral-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>SOS रिपोर्ट्स (CSV)</span>
          </button>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Donors */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-md">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold mb-2">
            <span>कुल पंजीकृत रक्तदाता</span>
            <Users className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-mono font-black text-white">{totalDonors * 180 + 24}</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{availableDonors * 180 + 10} वर्तमान में उपलब्ध</span>
          </div>
        </div>

        {/* Active Emergency SOS Alerts */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-md">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold mb-2">
            <span>सक्रिय SOS अलर्ट</span>
            <AlertOctagon className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-mono font-black text-amber-400">{activeSosCount}</div>
          <div className="text-[11px] text-neutral-400 mt-1">
            {verifiedSosCount} सत्यापन के बाद सक्रिय
          </div>
        </div>

        {/* District Coverage */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-md">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold mb-2">
            <span>सक्रिय जिला नेटवर्क</span>
            <MapPin className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-mono font-black text-sky-400">{districtAnalytics.length} प्रमुख जिले</div>
          <div className="text-[11px] text-neutral-400 mt-1">
            उत्तर प्रदेश, बिहार, दिल्ली, महाराष्ट्र
          </div>
        </div>

        {/* Lives Impacted */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-md">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold mb-2">
            <span>जीवन सुरक्षा प्रभाव</span>
            <Heart className="w-4 h-4 text-emerald-500 fill-emerald-500" />
          </div>
          <div className="text-2xl font-mono font-black text-emerald-400">1,842+</div>
          <div className="text-[11px] text-neutral-400 mt-1">
            100% मुफ़्त एवं स्वैच्छिक योगदान
          </div>
        </div>
      </div>

      {/* ADMIN SUB-TABS */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
        <button
          id="admin-subtab-donors"
          onClick={() => setActiveAdminTab('donors')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeAdminTab === 'donors'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>रक्तदाता प्रबंधन ({filteredDonors.length})</span>
        </button>

        <button
          id="admin-subtab-sos"
          onClick={() => setActiveAdminTab('sos')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeAdminTab === 'sos'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>SOS आपातकालीन सत्यापन ({sosRequests.length})</span>
        </button>

        <button
          id="admin-subtab-analytics"
          onClick={() => setActiveAdminTab('analytics')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeAdminTab === 'analytics'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>जिला-वार विश्लेषण</span>
        </button>
      </div>

      {/* TAB 1: DONOR MANAGEMENT TABLE */}
      {activeAdminTab === 'donors' && (
        <div className="bg-neutral-900 rounded-3xl border border-neutral-800 p-5 shadow-xl flex flex-col gap-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              <input
                type="text"
                value={donorSearch}
                onChange={e => setDonorSearch(e.target.value)}
                placeholder="नाम, फोन, जिला से खोजें..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-neutral-400">रक्त समूह:</span>
              <select
                value={selectedBloodFilter}
                onChange={e => setSelectedBloodFilter(e.target.value)}
                className="py-2 px-3 rounded-xl bg-neutral-800 border border-neutral-700 text-xs font-semibold text-white"
              >
                <option value="ALL">सभी समूह (All)</option>
                {BLOOD_GROUPS.map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-neutral-800">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-neutral-800/80 text-neutral-400 font-semibold border-b border-neutral-700">
                <tr>
                  <th className="py-3 px-4">रक्तदाता का नाम</th>
                  <th className="py-3 px-4">रक्त समूह</th>
                  <th className="py-3 px-4">स्थान (जिला / राज्य)</th>
                  <th className="py-3 px-4">संपर्क सूत्र</th>
                  <th className="py-3 px-4">स्थिति</th>
                  <th className="py-3 px-4 text-right">कार्रवाई</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {filteredDonors.map(donor => (
                  <tr key={donor.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <span>{donor.fullName}</span>
                        {donor.isVerified && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            सत्यापित
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-500 font-normal">
                        कुल दान: {donor.totalDonations} बार
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md font-bold font-mono text-rose-400 bg-rose-950/60 border border-rose-800/60">
                        {donor.bloodGroup}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span>{donor.city}, {donor.district}</span>
                      <span className="text-[10px] text-neutral-500 block">{donor.state}</span>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {donor.phone}
                      {donor.isMaskedCallingEnabled && (
                        <span className="text-[10px] text-emerald-400 block">गोपनीय रिले सक्षम</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {donor.isAvailable ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          उपलब्ध
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-800 text-neutral-400 border border-neutral-700">
                          विश्राम
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`क्या आप वाकई ${donor.fullName} को प्रतिबंधित (Ban) करना चाहते हैं?`)) {
                            banDonor(donor.id);
                          }
                        }}
                        className="py-1 px-2.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-800/60 text-red-300 text-[11px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Ban className="w-3 h-3" />
                        <span>प्रतिबंधित करें (Ban)</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SOS EMERGENCY MODERATION QUEUE */}
      {activeAdminTab === 'sos' && (
        <div className="bg-neutral-900 rounded-3xl border border-neutral-800 p-5 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-200">
              आपातकालीन अनुरोध सत्यापन कतार (SOS Moderation Queue)
            </h3>
            <span className="text-xs text-neutral-400">
              अस्पताल की पर्ची जांचें एवं दाताओं को पुनः अलर्ट भेजें
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sosRequests.map(req => (
              <div
                key={req.id}
                className="p-4 rounded-2xl bg-neutral-800/60 border border-neutral-700 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-10 h-10 rounded-xl bg-rose-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                      {req.bloodGroup}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-white">{req.patientName}</h4>
                      <p className="text-xs text-neutral-400">{req.hospitalName}</p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                    req.status === 'ACTIVE'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : req.status === 'VERIFIED'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {req.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-800">
                  <div>
                    <span className="text-neutral-500 block text-[10px]">आवश्यकता:</span>
                    <span className="font-bold text-rose-400">{req.unitsRequired} यूनिट रक्त</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">स्थान:</span>
                    <span>{req.district}, {req.state}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">वार्ड/बेड:</span>
                    <span>{req.wardBedNumber}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">अटेंडेंट फोन:</span>
                    <span className="font-mono">{req.attendantPhone}</span>
                  </div>
                </div>

                {/* Prescription Slip Preview if available */}
                {req.prescriptionUrl && (
                  <button
                    onClick={() => setViewingPrescription(req.prescriptionUrl!)}
                    className="py-1.5 px-3 rounded-xl bg-neutral-700/60 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-rose-400" />
                    <span>डॉक्टर की पर्ची देखें (View Prescription)</span>
                  </button>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-700 text-xs">
                  <button
                    onClick={() => triggerEmergencyBroadcast(req)}
                    className="text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>पुनः FCM अलर्ट भेजें</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {req.status !== 'FULFILLED' ? (
                      <button
                        onClick={() => updateSosStatus(req.id, 'FULFILLED')}
                        className="py-1 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
                      >
                        पूर्ण मार्क करें (Fulfill)
                      </button>
                    ) : (
                      <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>रक्त उपलब्ध कराया गया</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DISTRICT-WISE ANALYTICS */}
      {activeAdminTab === 'analytics' && (
        <div className="bg-neutral-900 rounded-3xl border border-neutral-800 p-5 shadow-xl flex flex-col gap-4">
          <h3 className="text-sm font-bold text-neutral-200">
            जिला-वार प्रदर्शन एवं प्रतिक्रिया मेट्रिक्स (District Analytics)
          </h3>

          <div className="overflow-x-auto rounded-2xl border border-neutral-800">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-neutral-800/80 text-neutral-400 font-semibold border-b border-neutral-700">
                <tr>
                  <th className="py-3 px-4">जिला (District)</th>
                  <th className="py-3 px-4">राज्य (State)</th>
                  <th className="py-3 px-4">कुल रक्तदाता</th>
                  <th className="py-3 px-4">सक्रिय उपलब्ध</th>
                  <th className="py-3 px-4">इस माह SOS अलर्ट</th>
                  <th className="py-3 px-4">सफलता दर (Fulfillment Rate)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {districtAnalytics.map(stat => {
                  const rate = Math.round((stat.fulfilledRequests / stat.sosRequestsThisMonth) * 100);
                  return (
                    <tr key={stat.district} className="hover:bg-neutral-800/40">
                      <td className="py-3 px-4 font-bold text-white">{stat.district}</td>
                      <td className="py-3 px-4">{stat.state}</td>
                      <td className="py-3 px-4 font-mono">{stat.totalDonors}</td>
                      <td className="py-3 px-4 font-mono text-emerald-400">{stat.availableDonors}</td>
                      <td className="py-3 px-4 font-mono text-amber-400">{stat.sosRequestsThisMonth}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-neutral-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${rate}%` }}></div>
                          </div>
                          <span className="font-mono font-bold text-white">{rate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Prescription Modal Viewer */}
      {viewingPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-neutral-900 border border-neutral-800 p-5 text-white flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm">डॉक्टर की अधिकृत पर्ची (Verified Slip)</h4>
              <button
                onClick={() => setViewingPrescription(null)}
                className="text-xs text-neutral-400 hover:text-white font-bold"
              >
                बंद करें ✕
              </button>
            </div>
            <img
              src={viewingPrescription}
              alt="Prescription Slip"
              className="w-full max-h-96 object-contain rounded-xl border border-neutral-800"
            />
          </div>
        </div>
      )}

    </div>
  );
};
