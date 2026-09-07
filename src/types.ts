export type Language = 'hi' | 'en';

export type BloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'O+'
  | 'O-'
  | 'AB+'
  | 'AB-'
  | 'Bombay Blood Group (hh)';

export interface Donor {
  id: string;
  fullName: string;
  phone: string;
  bloodGroup: BloodGroup;
  state: string;
  district: string;
  city: string;
  pincode: string;
  lastDonationDate: string; // YYYY-MM-DD or 'never'
  isAvailable: boolean;
  isVerified: boolean;
  isMaskedCallingEnabled: boolean;
  totalDonations: number;
  registeredAt: string;
  medicalEligibility: {
    ageConfirmed: boolean; // 18-65
    weightConfirmed: boolean; // > 45kg
    noChronicConditions: boolean;
    dpdpConsent: boolean;
  };
}

export type SOSStatus = 'ACTIVE' | 'VERIFIED' | 'FULFILLED' | 'CANCELLED';

export interface SOSRequest {
  id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  unitsRequired: number;
  hospitalName: string;
  wardBedNumber: string;
  city: string;
  district: string;
  state: string;
  attendantName: string;
  attendantPhone: string;
  prescriptionUrl?: string;
  status: SOSStatus;
  urgencyLevel: 'CRITICAL' | 'URGENT' | 'STANDARD';
  createdAt: string;
  verifiedByAdmin?: boolean;
  notifiedDonorsCount: number;
}

export interface UserProfile {
  uid: string;
  phone: string;
  name: string;
  activeRole: 'DONOR' | 'SEEKER';
  isDonorRegistered: boolean;
  donorProfileId?: string;
  savedDistrict: string;
  savedState: string;
  language: Language;
}

export interface DistrictAnalytics {
  district: string;
  state: string;
  totalDonors: number;
  availableDonors: number;
  sosRequestsThisMonth: number;
  fulfilledRequests: number;
}
