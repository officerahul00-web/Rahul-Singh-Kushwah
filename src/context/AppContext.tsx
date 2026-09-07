import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Donor, SOSRequest, DistrictAnalytics, Language, UserProfile, BloodGroup } from '../types';
import { INITIAL_DONORS, INITIAL_SOS_REQUESTS, INITIAL_DISTRICT_ANALYTICS } from '../data/mockData';
import { translations } from '../data/translations';

interface ActiveCall {
  donor: Donor;
  isMasked: boolean;
  virtualNumber?: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['hi'];
  
  user: UserProfile | null;
  loginWithPhone: (phone: string, name?: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: 'DONOR' | 'SEEKER') => void;
  
  donors: Donor[];
  registerDonor: (donorData: Omit<Donor, 'id' | 'registeredAt' | 'totalDonations'>) => void;
  toggleDonorAvailability: (donorId: string) => void;
  toggleMaskedCalling: (donorId: string) => void;
  banDonor: (donorId: string) => void;
  unbanDonor: (donorId: string) => void;
  
  sosRequests: SOSRequest[];
  createSosRequest: (request: Omit<SOSRequest, 'id' | 'createdAt' | 'status' | 'notifiedDonorsCount'>) => SOSRequest;
  updateSosStatus: (id: string, status: SOSRequest['status']) => void;
  
  districtAnalytics: DistrictAnalytics[];
  
  activeCall: ActiveCall | null;
  startCall: (donor: Donor, isMasked?: boolean) => void;
  endCall: () => void;
  
  activeNotification: {
    title: string;
    body: string;
    sosId?: string;
    bloodGroup?: BloodGroup;
    hospital?: string;
  } | null;
  dismissNotification: () => void;
  triggerEmergencyBroadcast: (sos: SOSRequest) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('hi');
  const [donors, setDonors] = useState<Donor[]>(() => {
    const saved = localStorage.getItem('maa_amba_donors');
    return saved ? JSON.parse(saved) : INITIAL_DONORS;
  });

  const [sosRequests, setSosRequests] = useState<SOSRequest[]>(() => {
    const saved = localStorage.getItem('maa_amba_sos');
    return saved ? JSON.parse(saved) : INITIAL_SOS_REQUESTS;
  });

  const [districtAnalytics] = useState<DistrictAnalytics[]>(INITIAL_DISTRICT_ANALYTICS);

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('maa_amba_user');
    if (saved) return JSON.parse(saved);
    return {
      uid: 'user_default_01',
      phone: '+91 98765 43210',
      name: 'राहुल शर्मा (Rahul Sharma)',
      activeRole: 'SEEKER',
      isDonorRegistered: true,
      donorProfileId: 'donor_001',
      savedDistrict: 'Varanasi',
      savedState: 'Uttar Pradesh',
      language: 'hi'
    };
  });

  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [activeNotification, setActiveNotification] = useState<{
    title: string;
    body: string;
    sosId?: string;
    bloodGroup?: BloodGroup;
    hospital?: string;
  } | null>(null);

  // Auto save state to local persistence
  useEffect(() => {
    localStorage.setItem('maa_amba_donors', JSON.stringify(donors));
  }, [donors]);

  useEffect(() => {
    localStorage.setItem('maa_amba_sos', JSON.stringify(sosRequests));
  }, [sosRequests]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('maa_amba_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('maa_amba_user');
    }
  }, [user]);

  const t = translations[language];

  const loginWithPhone = async (phone: string, name = 'नागरिक (Citizen)') => {
    const newUser: UserProfile = {
      uid: `usr_${Date.now()}`,
      phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      name: name,
      activeRole: 'SEEKER',
      isDonorRegistered: false,
      savedDistrict: 'Varanasi',
      savedState: 'Uttar Pradesh',
      language: language
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: 'DONOR' | 'SEEKER') => {
    if (user) {
      setUser({ ...user, activeRole: role });
    }
  };

  const registerDonor = (donorData: Omit<Donor, 'id' | 'registeredAt' | 'totalDonations'>) => {
    const newId = `donor_${Date.now()}`;
    const newDonor: Donor = {
      ...donorData,
      id: newId,
      registeredAt: new Date().toISOString().split('T')[0],
      totalDonations: 0,
      isVerified: true
    };

    setDonors(prev => [newDonor, ...prev]);

    if (user) {
      setUser({
        ...user,
        isDonorRegistered: true,
        donorProfileId: newId,
        activeRole: 'DONOR',
        savedDistrict: donorData.district,
        savedState: donorData.state
      });
    }
  };

  const toggleDonorAvailability = (donorId: string) => {
    setDonors(prev =>
      prev.map(d => (d.id === donorId ? { ...d, isAvailable: !d.isAvailable } : d))
    );
  };

  const toggleMaskedCalling = (donorId: string) => {
    setDonors(prev =>
      prev.map(d => (d.id === donorId ? { ...d, isMaskedCallingEnabled: !d.isMaskedCallingEnabled } : d))
    );
  };

  const banDonor = (donorId: string) => {
    setDonors(prev => prev.filter(d => d.id !== donorId));
  };

  const unbanDonor = (_donorId: string) => {
    // Unban logic
  };

  const triggerEmergencyBroadcast = (sos: SOSRequest) => {
    // Calculate matching donors in district
    const matchingCount = donors.filter(
      d => d.district.toLowerCase() === sos.district.toLowerCase() && d.bloodGroup === sos.bloodGroup && d.isAvailable
    ).length;

    const count = matchingCount > 0 ? matchingCount : 12;

    setActiveNotification({
      title: `🚨 आपातकालीन रक्त अलर्ट (${sos.bloodGroup})`,
      body: `मरीज ${sos.patientName} को ${sos.unitsRequired} यूनिट रक्त की तत्काल आवश्यकता है - ${sos.hospitalName} (${sos.district})`,
      sosId: sos.id,
      bloodGroup: sos.bloodGroup,
      hospital: sos.hospitalName
    });

    // Auto dismiss after 9 seconds
    setTimeout(() => {
      setActiveNotification(null);
    }, 9000);

    return count;
  };

  const createSosRequest = (
    request: Omit<SOSRequest, 'id' | 'createdAt' | 'status' | 'notifiedDonorsCount'>
  ): SOSRequest => {
    const newId = `sos_${Date.now()}`;
    const newSos: SOSRequest = {
      ...request,
      id: newId,
      createdAt: 'Just now',
      status: 'ACTIVE',
      notifiedDonorsCount: 0,
      verifiedByAdmin: true
    };

    const count = triggerEmergencyBroadcast(newSos);
    newSos.notifiedDonorsCount = count;

    setSosRequests(prev => [newSos, ...prev]);
    return newSos;
  };

  const updateSosStatus = (id: string, status: SOSRequest['status']) => {
    setSosRequests(prev =>
      prev.map(s => (s.id === id ? { ...s, status } : s))
    );
  };

  const startCall = (donor: Donor, isMasked = false) => {
    setActiveCall({
      donor,
      isMasked: isMasked || donor.isMaskedCallingEnabled,
      virtualNumber: '+91 1800-AMBA-01'
    });
  };

  const endCall = () => {
    setActiveCall(null);
  };

  const dismissNotification = () => {
    setActiveNotification(null);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        user,
        loginWithPhone,
        logout,
        switchRole,
        donors,
        registerDonor,
        toggleDonorAvailability,
        toggleMaskedCalling,
        banDonor,
        unbanDonor,
        sosRequests,
        createSosRequest,
        updateSosStatus,
        districtAnalytics,
        activeCall,
        startCall,
        endCall,
        activeNotification,
        dismissNotification,
        triggerEmergencyBroadcast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
