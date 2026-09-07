export const SYSTEM_ARCHITECTURE = `
========================================================================================
           MAA AMBA MUFT RAKTDAAN (MOTHER AMBA FREE BLOOD DONATION NETWORK)
                    ENTERPRISE HYBRID CLOUD & MOBILE ARCHITECTURE
========================================================================================

           +-----------------------------------------------------------+
           |                   CLIENT LAYER (FRONTEND)                 |
           +-----------------------------------------------------------+
           |  [Flutter Mobile App (Android & iOS)]                     |
           |   - Clean Architecture: UI Layer (Riverpod Consumers)     |
           |   - Domain Layer: Entities, UseCases & Value Objects      |
           |   - Data Layer: Firestore Repositories, Offline Cache     |
           |   - Pinput SMS Retriever (Auto-OTP without manual typing) |
           |   - Dual Mode State Machine (Donor <-> Seeker Switch)     |
           |   - Multilingual Engine (Hindi / English Localizations)   |
           |                                                           |
           |  [Web Admin Control Panel (Responsive Portal)]            |
           |   - Donor Directory, Spammer Ban Engine, SOS Triage       |
           +-----------------------------+-----------------------------+
                                         |
                                         | HTTPS / gRPC
                                         v
           +-----------------------------------------------------------+
           |               FIREBASE / GOOGLE CLOUD BACKEND             |
           +-----------------------------------------------------------+
           |  1. Firebase Authentication                               |
           |     * Phone Number OTP Auth with SMS Gateway (+91 India)  |
           |     * Custom User Claims (role: 'admin' | 'donor')        |
           |                                                           |
           |  2. Cloud Firestore (Optimized Low-Bandwidth NoSQL)       |
           |     * /users/{userId}          -> Basic Profile & Role    |
           |     * /donors/{donorId}        -> Geospatial Indexed Data |
           |     * /sos_requests/{reqId}    -> Active Hospital SOS     |
           |     * /districts/{districtId}  -> Aggregated Ticker Stats |
           |     * /audit_logs/{logId}      -> DPDP Access & Call Logs |
           |                                                           |
           |  3. Cloud Storage                                         |
           |     * /sos_prescriptions/{reqId} -> Doctor requisition    |
           |                                                           |
           |  4. Cloud Functions for Firebase (Node.js 20 / v2)        |
           |     * onSosRequestCreated: Triggers instant FCM to        |
           |       matching donors in that district with high priority |
           |     * onDonorAvailabilityChanged: Real-time counter sync  |
           |     * cleanupStaleSosAlerts: Cron run every 6 hours       |
           |                                                           |
           |  5. Firebase Cloud Messaging (FCM)                        |
           |     * Multicast Emergency Payload (Sound: emergency_alert)|
           |     * Android Channel: 'emergency_blood_alerts' (Max Urg) |
           |     * iOS APNs Critical Alert Payload                     |
           +-----------------------------------------------------------+
`;

export const FIRESTORE_SCHEMA = `
/**
 * CLOUD FIRESTORE SCHEMA SPECIFICATION
 * Project: Maa Amba Muft Raktdaan
 * Version: 2026.1 (Production)
 */

1. COLLECTION: /users/{userId}
   Document ID: Firebase Auth UID
   Fields:
     - uid: String (Required, indexed)
     - phone: String (+91 format, e.g., '+919876543210')
     - displayName: String
     - preferredLanguage: String ('hi' | 'en')
     - activeRole: String ('DONOR' | 'SEEKER')
     - isDonorRegistered: Boolean (Default: false)
     - fcmTokens: Array<String> (Device tokens for push notifications)
     - createdAt: Timestamp (Server timestamp)
     - updatedAt: Timestamp

2. COLLECTION: /donors/{donorId}
   Document ID: Firebase Auth UID of Donor
   Fields:
     - id: String (Same as userId)
     - fullName: String (Masked for seekers if privacy enabled)
     - phone: String (Direct or virtual masked ID)
     - bloodGroup: String ('A+'|'A-'|'B+'|'B-'|'O+'|'O-'|'AB+'|'AB-'|'Bombay Blood Group (hh)')
     - state: String (e.g., 'Uttar Pradesh')
     - district: String (e.g., 'Varanasi')
     - city: String (e.g., 'Godowlia')
     - pincode: String (e.g., '221001')
     - lastDonationDate: Timestamp (or null)
     - isAvailable: Boolean (Controlled by donor toggle)
     - isVerified: Boolean (Admin badge)
     - isBanned: Boolean (Admin spam protection)
     - isMaskedCallingEnabled: Boolean (DPDP privacy option)
     - totalDonations: Number (Impact counter)
     - geoQueryKey: String (Composite: "up_varanasi_o+")
     - registeredAt: Timestamp

3. COLLECTION: /sos_requests/{requestId}
   Document ID: Auto-generated UID
   Fields:
     - id: String
     - seekerUid: String
     - patientName: String
     - bloodGroup: String
     - unitsRequired: Number
     - hospitalName: String
     - wardBedNumber: String
     - state: String
     - district: String
     - city: String
     - attendantName: String
     - attendantPhone: String
     - prescriptionSlipUrl: String (Cloud Storage URL, optional)
     - status: String ('ACTIVE' | 'VERIFIED' | 'FULFILLED' | 'CANCELLED')
     - urgencyLevel: String ('CRITICAL' | 'URGENT')
     - notifiedDonorsCount: Number
     - createdAt: Timestamp
     - fulfilledAt: Timestamp (optional)

4. COLLECTION: /districts/{districtId}
   Document ID: e.g., "up_varanasi"
   Fields:
     - districtName: String ('Varanasi')
     - stateName: String ('Uttar Pradesh')
     - totalRegisteredDonors: Number
     - liveAvailableDonors: Number
     - activeSosAlerts: Number
     - livesSavedCount: Number

5. COMPOSITE INDEXES REQUIRED (firestore.indexes.json):
   [
     {
       "collectionGroup": "donors",
       "queryScope": "COLLECTION",
       "fields": [
         { "fieldPath": "state", "order": "ASCENDING" },
         { "fieldPath": "district", "order": "ASCENDING" },
         { "fieldPath": "bloodGroup", "order": "ASCENDING" },
         { "fieldPath": "isAvailable", "order": "ASCENDING" }
       ]
     },
     {
       "collectionGroup": "sos_requests",
       "queryScope": "COLLECTION",
       "fields": [
         { "fieldPath": "district", "order": "ASCENDING" },
         { "fieldPath": "status", "order": "ASCENDING" },
         { "fieldPath": "createdAt", "order": "DESCENDING" }
       ]
     }
   ]
`;

export const FIRESTORE_RULES = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isAdmin() {
      return isAuthenticated() && request.auth.token.role == 'admin';
    }

    // Users Collection: Users manage their own basic profile
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create, update: if isOwner(userId);
      allow delete: if isAdmin();
    }

    // Donors Collection: DPDP Privacy Protected
    // Banned donors are hidden; availability state is respected
    match /donors/{donorId} {
      allow read: if isAuthenticated();
      allow create: if isOwner(donorId);
      allow update: if isOwner(donorId) || isAdmin();
      allow delete: if isAdmin();
    }

    // SOS Emergency Requests: Any authenticated seeker can broadcast
    match /sos_requests/{requestId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.resource.data.status == 'ACTIVE';
      allow update: if (isAuthenticated() && request.auth.uid == resource.data.seekerUid) || isAdmin();
      allow delete: if isAdmin();
    }

    // District Aggregated Stats: Read-only for public ticker, writes by Cloud Functions
    match /districts/{districtId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
`;

export const CLOUD_FUNCTIONS_CODE = `
/**
 * Firebase Cloud Functions v2 (Node.js 20)
 * Handles Real-time SOS Push Broadcasts, FCM Multicast, and District Analytics
 */

const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();
const messaging = admin.messaging();

/**
 * TRIGGER: When an emergency SOS Request is logged in Firestore
 * DISPATCH: Instant high-priority FCM notification to all registered donors
 * of that matching blood group residing in the target district.
 */
exports.onSosRequestCreated = onDocumentCreated("sos_requests/{requestId}", async (event) => {
  const snap = event.data;
  if (!snap) return null;

  const sosData = snap.data();
  const { bloodGroup, district, state, patientName, hospitalName, unitsRequired, wardBedNumber } = sosData;

  console.log(\`[SOS BROADCAST] Processing alert for \${patientName} (\${bloodGroup}) at \${hospitalName}, \${district}\`);

  try {
    // 1. Query available donors with the matching blood group in this district
    const donorsQuery = await db.collection("donors")
      .where("district", "==", district)
      .where("bloodGroup", "==", bloodGroup)
      .where("isAvailable", "==", true)
      .where("isBanned", "==", false)
      .get();

    if (donorsQuery.empty) {
      console.log(\`No active donors found for \${bloodGroup} in \${district}. Broadcasting to neighboring districts if configured.\`);
      return null;
    }

    const donorUids = donorsQuery.docs.map(doc => doc.id);

    // 2. Fetch active FCM tokens for these donor user accounts
    const tokens = [];
    const userChunks = [];
    
    // Firestore 'in' queries allow up to 30 items per batch
    for (let i = 0; i < donorUids.length; i += 30) {
      const batchIds = donorUids.slice(i, i + 30);
      userChunks.push(db.collection("users").where(admin.firestore.FieldPath.documentId(), "in", batchIds).get());
    }

    const userSnapshots = await Promise.all(userChunks);
    userSnapshots.forEach(snap => {
      snap.docs.forEach(doc => {
        const userData = doc.data();
        if (Array.isArray(userData.fcmTokens)) {
          tokens.push(...userData.fcmTokens);
        }
      });
    });

    const uniqueTokens = [...new Set(tokens)];
    if (uniqueTokens.length === 0) {
      console.log("No valid FCM tokens found for target donors.");
      return null;
    }

    // 3. Build High-Priority Emergency Multicast Message
    const messagePayload = {
      notification: {
        title: \`🚨 आपातकालीन रक्त आवश्यकता (\${bloodGroup})\`,
        body: \`मरीज: \${patientName} को \${unitsRequired} यूनिट \${bloodGroup} रक्त की तत्काल आवश्यकता है - \${hospitalName} (\${district})\`,
      },
      data: {
        type: "EMERGENCY_SOS",
        sosId: event.params.requestId,
        bloodGroup: bloodGroup,
        hospital: hospitalName,
        bedNumber: wardBedNumber || "Emergency",
        click_action: "FLUTTER_NOTIFICATION_CLICK"
      },
      android: {
        priority: "high",
        notification: {
          channelId: "emergency_blood_alerts", // Critical priority sound & vibration channel
          sound: "emergency_siren",
          color: "#D32F2F",
          icon: "ic_blood_emergency",
          clickAction: "FLUTTER_NOTIFICATION_CLICK"
        }
      },
      apns: {
        payload: {
          aps: {
            sound: "emergency_siren.caf",
            badge: 1,
            critical: true
          }
        }
      },
      tokens: uniqueTokens
    };

    // 4. Send Multicast via FCM (batches of up to 500)
    const response = await messaging.sendEachForMulticast(messagePayload);
    console.log(\`Successfully dispatched SOS alert to \${response.successCount} donors out of \${uniqueTokens.length}\`);

    // 5. Update SOS record with verified count
    await snap.ref.update({
      notifiedDonorsCount: response.successCount,
      notificationDispatchedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, notifiedCount: response.successCount };
  } catch (error) {
    console.error("Error dispatching SOS emergency notification:", error);
    return null;
  }
});

/**
 * CLEANUP CRON: Mark stale emergency requests (older than 48 hours) as expired
 */
exports.cleanupStaleSosAlerts = onSchedule("every 6 hours", async (event) => {
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const snapshot = await db.collection("sos_requests")
    .where("status", "==", "ACTIVE")
    .where("createdAt", "<=", admin.firestore.Timestamp.fromDate(cutoff))
    .get();

  const batch = db.batch();
  snapshot.docs.forEach(doc => {
    batch.update(doc.ref, { status: "EXPIRED" });
  });

  await batch.commit();
  console.log(\`Cleaned up \${snapshot.size} stale SOS requests.\`);
});
`;

export const DEPLOYMENT_GUIDE = `
# STEP-BY-STEP DEPLOYMENT & PRODUCTION GUIDE
## Application: Maa Amba Muft Raktdaan (Mother Amba Free Blood Donation Network)

### 1. Firebase Project Configuration
1. Go to https://console.firebase.google.com and create a new project: 'maa-amba-raktdaan'.
2. Enable Authentication:
   - Go to Build -> Authentication -> Sign-in method.
   - Enable 'Phone' provider.
   - For testing in India, add a test phone number like '+91 9876543210' with OTP '123456'.
3. Enable Cloud Firestore:
   - Create Database in production mode in region 'asia-south1' (Mumbai, India) for lowest latency across India.
   - Deploy composite indexes using: \`firebase deploy --only firestore:indexes\`.
4. Enable Cloud Messaging (FCM):
   - Under Project Settings -> Cloud Messaging, note the Server Key and enable FCM v1 API.

### 2. Android App Configuration & SHA-256 Setup
1. Register Android app with package name: \`org.maaamba.muftraktdaan\`.
2. Generate SHA-1 and SHA-256 signing keys from your release keystore:
   \`keytool -list -v -keystore android/app/upload-keystore.jks -alias upload\`
3. Paste BOTH SHA-1 and SHA-256 fingerprints into the Firebase Console Android app configuration.
   *(CRITICAL: Phone OTP auto-reading via SMS Retriever API strictly requires SHA-256 verification)*.
4. Download \`google-services.json\` and place in \`android/app/google-services.json\`.

### 3. Deploying Cloud Functions
1. Install Firebase CLI: \`npm install -g firebase-tools\`
2. Login and initialize: \`firebase login && firebase init functions\`
3. Copy the provided Node.js Cloud Functions code into \`functions/index.js\`.
4. Deploy: \`firebase deploy --only functions\`

### 4. Digital Personal Data Protection (DPDP) Act Compliance Checklist
- Non-commercial statement shown prominently on search and registration.
- Explicit checkbox consent for emergency contact sharing.
- Masked calling functionality enabled for female donors or privacy-conscious volunteers.
- Audit trail for admin contact reviews.
- Clear data deletion option (Right to be Forgotten) in user profile.

### 5. Google Play Store Release Steps
1. Prepare Android App Bundle (.aab):
   \`flutter build appbundle --release\`
2. Create Google Play Console Developer Account.
3. Complete Data Safety Form:
   - Data Collected: Phone Number (for Auth & SOS contact), Location (Coarse/District level for matching), Blood Group.
   - Data not shared with third parties or advertisers.
4. Upload App Bundle under Production Track.
`;
