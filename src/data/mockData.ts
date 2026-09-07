import { BloodGroup, Donor, SOSRequest, DistrictAnalytics } from '../types';

export const BLOOD_GROUPS: BloodGroup[] = [
  'A+',
  'A-',
  'B+',
  'B-',
  'O+',
  'O-',
  'AB+',
  'AB-',
  'Bombay Blood Group (hh)',
];

export const INDIAN_STATES_DISTRICTS: Record<string, string[]> = {
  "Uttar Pradesh": [
    "Lucknow", "Varanasi", "Kanpur Nagar", "Prayagraj", "Agra", "Gorakhpur", "Bareilly", "Meerut", "Aligarh", "Ayodhya"
  ],
  "Bihar": [
    "Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Purnia", "Begusarai", "Rohtas", "Samastipur"
  ],
  "Delhi NCR": [
    "Central Delhi", "New Delhi", "North Delhi", "South Delhi", "West Delhi", "East Delhi", "Noida (Gautam Buddha Nagar)", "Gurugram", "Ghaziabad", "Faridabad"
  ],
  "Maharashtra": [
    "Mumbai City", "Mumbai Suburban", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad (Chhatrapati Sambhajinagar)", "Solapur", "Kolhapur"
  ],
  "Rajasthan": [
    "Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Alwar", "Bhilwara", "Sikar"
  ],
  "Madhya Pradesh": [
    "Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Rewa", "Satna"
  ],
  "Gujarat": [
    "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar"
  ],
  "West Bengal": [
    "Kolkata", "Howrah", "North 24 Parganas", "South 24 Parganas", "Hooghly", "Darjeeling", "Siliguri"
  ],
  "Karnataka": [
    "Bengaluru Urban", "Bengaluru Rural", "Mysuru", "Hubballi-Dharwad", "Mangaluru", "Belagavi"
  ],
  "Punjab": [
    "Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Bathinda", "Mohali (SAS Nagar)"
  ]
};

export const INITIAL_DONORS: Donor[] = [
  {
    id: "donor_001",
    fullName: "Rameshwar Prasad Sharma",
    phone: "+91 98721 54310",
    bloodGroup: "O+",
    state: "Uttar Pradesh",
    district: "Varanasi",
    city: "Godowlia / Cantt",
    pincode: "221001",
    lastDonationDate: "2024-01-15",
    isAvailable: true,
    isVerified: true,
    isMaskedCallingEnabled: false,
    totalDonations: 8,
    registeredAt: "2023-04-12",
    medicalEligibility: {
      ageConfirmed: true,
      weightConfirmed: true,
      noChronicConditions: true,
      dpdpConsent: true
    }
  },
  {
    id: "donor_002",
    fullName: "Pooja Verma",
    phone: "+91 98112 34567",
    bloodGroup: "B+",
    state: "Uttar Pradesh",
    district: "Lucknow",
    city: "Hazratganj / Alambagh",
    pincode: "226001",
    lastDonationDate: "2023-11-20",
    isAvailable: true,
    isVerified: true,
    isMaskedCallingEnabled: true,
    totalDonations: 4,
    registeredAt: "2023-08-01",
    medicalEligibility: {
      ageConfirmed: true,
      weightConfirmed: true,
      noChronicConditions: true,
      dpdpConsent: true
    }
  },
  {
    id: "donor_003",
    fullName: "Amitabh Sen",
    phone: "+91 94330 98765",
    bloodGroup: "Bombay Blood Group (hh)",
    state: "Maharashtra",
    district: "Mumbai City",
    city: "Parel (KEM Hospital Area)",
    pincode: "400012",
    lastDonationDate: "2023-12-05",
    isAvailable: true,
    isVerified: true,
    isMaskedCallingEnabled: false,
    totalDonations: 14,
    registeredAt: "2022-01-19",
    medicalEligibility: {
      ageConfirmed: true,
      weightConfirmed: true,
      noChronicConditions: true,
      dpdpConsent: true
    }
  },
  {
    id: "donor_004",
    fullName: "Dr. Arvind Chaurasia",
    phone: "+91 94520 11223",
    bloodGroup: "AB-",
    state: "Bihar",
    district: "Patna",
    city: "Kankarbagh / AIIMS area",
    pincode: "800020",
    lastDonationDate: "2024-02-10",
    isAvailable: true,
    isVerified: true,
    isMaskedCallingEnabled: false,
    totalDonations: 12,
    registeredAt: "2022-06-10",
    medicalEligibility: {
      ageConfirmed: true,
      weightConfirmed: true,
      noChronicConditions: true,
      dpdpConsent: true
    }
  },
  {
    id: "donor_005",
    fullName: "Kavita Meena",
    phone: "+91 98290 55443",
    bloodGroup: "O-",
    state: "Rajasthan",
    district: "Jaipur",
    city: "Malviya Nagar",
    pincode: "302017",
    lastDonationDate: "2023-10-02",
    isAvailable: true,
    isVerified: true,
    isMaskedCallingEnabled: true,
    totalDonations: 6,
    registeredAt: "2023-03-22",
    medicalEligibility: {
      ageConfirmed: true,
      weightConfirmed: true,
      noChronicConditions: true,
      dpdpConsent: true
    }
  },
  {
    id: "donor_006",
    fullName: "Mohammad Farooq",
    phone: "+91 98101 23490",
    bloodGroup: "A+",
    state: "Delhi NCR",
    district: "South Delhi",
    city: "Saket (Near Max Hospital)",
    pincode: "110017",
    lastDonationDate: "2024-01-28",
    isAvailable: true,
    isVerified: true,
    isMaskedCallingEnabled: false,
    totalDonations: 9,
    registeredAt: "2022-09-14",
    medicalEligibility: {
      ageConfirmed: true,
      weightConfirmed: true,
      noChronicConditions: true,
      dpdpConsent: true
    }
  },
  {
    id: "donor_007",
    fullName: "Sunita Patel",
    phone: "+91 98980 12345",
    bloodGroup: "B-",
    state: "Gujarat",
    district: "Ahmedabad",
    city: "Navrangpura / Civil Hospital",
    pincode: "380009",
    lastDonationDate: "2023-09-14",
    isAvailable: false,
    isVerified: true,
    isMaskedCallingEnabled: true,
    totalDonations: 3,
    registeredAt: "2023-10-11",
    medicalEligibility: {
      ageConfirmed: true,
      weightConfirmed: true,
      noChronicConditions: true,
      dpdpConsent: true
    }
  },
  {
    id: "donor_008",
    fullName: "Gurpreet Singh",
    phone: "+91 98881 76543",
    bloodGroup: "A-",
    state: "Punjab",
    district: "Amritsar",
    city: "Guru Nanak Dev Hospital Area",
    pincode: "143001",
    lastDonationDate: "2024-02-01",
    isAvailable: true,
    isVerified: true,
    isMaskedCallingEnabled: false,
    totalDonations: 7,
    registeredAt: "2023-01-05",
    medicalEligibility: {
      ageConfirmed: true,
      weightConfirmed: true,
      noChronicConditions: true,
      dpdpConsent: true
    }
  }
];

export const INITIAL_SOS_REQUESTS: SOSRequest[] = [
  {
    id: "sos_2026_0901",
    patientName: "Smt. Shanti Devi (62 Yrs)",
    bloodGroup: "O-",
    unitsRequired: 2,
    hospitalName: "Banaras Hindu University (BHU) Trauma Centre",
    wardBedNumber: "Emergency Ward, Bed #14",
    city: "Varanasi",
    district: "Varanasi",
    state: "Uttar Pradesh",
    attendantName: "Vikas Kumar (Son)",
    attendantPhone: "+91 94500 88219",
    prescriptionUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80",
    status: "ACTIVE",
    urgencyLevel: "CRITICAL",
    createdAt: "18 mins ago",
    verifiedByAdmin: true,
    notifiedDonorsCount: 42
  },
  {
    id: "sos_2026_0902",
    patientName: "Master Aarav Gupta (7 Yrs, Thalassemia)",
    bloodGroup: "B+",
    unitsRequired: 1,
    hospitalName: "AIIMS Patna, Department of Hematology",
    wardBedNumber: "Pediatric Ward 3B, Bed #07",
    city: "Patna",
    district: "Patna",
    state: "Bihar",
    attendantName: "Rajesh Gupta (Father)",
    attendantPhone: "+91 94310 44321",
    status: "VERIFIED",
    urgencyLevel: "URGENT",
    createdAt: "1 hour ago",
    verifiedByAdmin: true,
    notifiedDonorsCount: 89
  },
  {
    id: "sos_2026_0903",
    patientName: "Deepak Rawat (Accident Trauma)",
    bloodGroup: "Bombay Blood Group (hh)",
    unitsRequired: 3,
    hospitalName: "KEM Hospital, Emergency Surgery Wing",
    wardBedNumber: "ICU-2, Bed #04",
    city: "Mumbai",
    district: "Mumbai City",
    state: "Maharashtra",
    attendantName: "Dr. Ananya Joshi (Blood Bank Coordinator)",
    attendantPhone: "+91 98200 11998",
    status: "ACTIVE",
    urgencyLevel: "CRITICAL",
    createdAt: "45 mins ago",
    verifiedByAdmin: true,
    notifiedDonorsCount: 6
  }
];

export const INITIAL_DISTRICT_ANALYTICS: DistrictAnalytics[] = [
  { district: "Varanasi", state: "Uttar Pradesh", totalDonors: 1420, availableDonors: 890, sosRequestsThisMonth: 124, fulfilledRequests: 118 },
  { district: "Patna", state: "Bihar", totalDonors: 2180, availableDonors: 1340, sosRequestsThisMonth: 198, fulfilledRequests: 182 },
  { district: "South Delhi", state: "Delhi NCR", totalDonors: 3450, availableDonors: 2100, sosRequestsThisMonth: 230, fulfilledRequests: 226 },
  { district: "Mumbai City", state: "Maharashtra", totalDonors: 4890, availableDonors: 3120, sosRequestsThisMonth: 340, fulfilledRequests: 334 },
  { district: "Jaipur", state: "Rajasthan", totalDonors: 1870, availableDonors: 1150, sosRequestsThisMonth: 112, fulfilledRequests: 106 },
  { district: "Lucknow", state: "Uttar Pradesh", totalDonors: 2640, availableDonors: 1670, sosRequestsThisMonth: 210, fulfilledRequests: 202 },
];
