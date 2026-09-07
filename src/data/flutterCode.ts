export interface FlutterCodeFile {
  path: string;
  category: 'core' | 'auth' | 'donor' | 'search' | 'sos' | 'config';
  description: string;
  code: string;
}

export const FLUTTER_CODE_FILES: FlutterCodeFile[] = [
  {
    path: "pubspec.yaml",
    category: "config",
    description: "Flutter package dependencies including Riverpod, Firebase Auth, Cloud Firestore, FCM, and localization",
    code: `name: maa_amba_raktdaan
description: "Maa Amba Muft Raktdaan - 100% Free & Voluntary Emergency Blood Network"
publish_to: "none"
version: 1.0.0+1

environment:
  sdk: ">=3.0.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter

  # State Management & DI
  flutter_riverpod: ^2.5.1

  # Firebase Suite
  firebase_core: ^3.1.1
  firebase_auth: ^5.1.1
  cloud_firestore: ^5.0.2
  firebase_messaging: ^15.0.2
  firebase_storage: ^12.1.0

  # Device & Communication
  url_launcher: ^6.3.0
  image_picker: ^1.1.2
  cached_network_image: ^3.3.1
  flutter_local_notifications: ^17.2.1

  # Local Persistence & Utilities
  shared_preferences: ^2.2.3
  intl: ^0.19.0
  google_fonts: ^6.2.1
  pinput: ^5.0.0 # High quality OTP input widget with SMS autofill

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/icons/
    - assets/images/`
  },
  {
    path: "lib/main.dart",
    category: "core",
    description: "Application entry point with Firebase initialization, FCM background handler, and Riverpod root",
    code: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'core/theme/app_theme.dart';
import 'core/localization/app_localizations.dart';
import 'features/home/presentation/home_screen.dart';
import 'features/auth/presentation/phone_login_screen.dart';
import 'features/auth/presentation/auth_provider.dart';

// Top-level FCM background handler for emergency alerts
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  // Emergency siren / alert sound can be dispatched here
  debugPrint('Handling background SOS alert: \${message.messageId}');
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

  // Request critical notification permissions
  final messaging = FirebaseMessaging.instance;
  await messaging.requestPermission(
    alert: true,
    badge: true,
    sound: true,
    criticalAlert: true,
  );

  runApp(
    const ProviderScope(
      child: MaaAmbaApp(),
    ),
  );
}

class MaaAmbaApp extends ConsumerWidget {
  const MaaAmbaApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authStateProvider);
    final locale = ref.watch(appLocaleProvider);

    return MaterialApp(
      title: 'माँ अम्बा मुफ़्त रक्तदान',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.light, // Default high-contrast accessible light
      locale: locale,
      supportedLocales: const [
        Locale('hi', 'IN'), // Hindi default
        Locale('en', 'US'), // English
      ],
      localizationsDelegates: AppLocalizations.delegates,
      home: authState.when(
        data: (user) => user != null ? const HomeScreen() : const PhoneLoginScreen(),
        loading: () => const Scaffold(
          body: Center(child: CircularProgressIndicator(color: AppTheme.crimsonRed)),
        ),
        error: (_, __) => const PhoneLoginScreen(),
      ),
    );
  }
}`
  },
  {
    path: "lib/core/theme/app_theme.dart",
    category: "core",
    description: "Accessible, high-contrast theme optimized for elderly users and distressed attendants under sunlight",
    code: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const Color crimsonRed = Color(0xFFD32F2F);
  static const Color emergencyRed = Color(0xFFB71C1C);
  static const Color bloodDark = Color(0xFF880E4F);
  static const Color alertAmber = Color(0xFFF57F17);
  static const Color successGreen = Color(0xFF2E7D32);
  static const Color backgroundLight = Color(0xFFFDFBF7); // Warm accessible neutral

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: backgroundLight,
      colorScheme: ColorScheme.fromSeed(
        seedColor: crimsonRed,
        primary: crimsonRed,
        secondary: emergencyRed,
        surface: Colors.white,
      ),
      textTheme: GoogleFonts.muktaTextTheme().copyWith(
        displayLarge: GoogleFonts.mukta(
          fontSize: 32,
          fontWeight: FontWeight.bold,
          color: Colors.black87,
        ),
        titleLarge: GoogleFonts.mukta(
          fontSize: 22,
          fontWeight: FontWeight.bold,
          color: Colors.black87,
        ),
        bodyLarge: GoogleFonts.mukta(
          fontSize: 18, // High readability for rural/non-tech users
          fontWeight: FontWeight.w500,
          color: Colors.black87,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          minimumSize: const Size.fromHeight(56), // Touch target >= 56px
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: GoogleFonts.mukta(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  static ThemeData get darkTheme => lightTheme; // High-contrast preferred
}`
  },
  {
    path: "lib/features/auth/presentation/phone_login_screen.dart",
    category: "auth",
    description: "Mobile OTP Onboarding with auto SMS retriever and instant language switcher",
    code: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinput/pinput.dart';
import '../../../core/theme/app_theme.dart';
import 'auth_provider.dart';

class PhoneLoginScreen extends ConsumerStatefulWidget {
  const PhoneLoginScreen({super.key});

  @override
  ConsumerState<PhoneLoginScreen> createState() => _PhoneLoginScreenState();
}

class _PhoneLoginScreenState extends ConsumerState<PhoneLoginScreen> {
  final _phoneController = TextEditingController();
  final _otpController = TextEditingController();
  String? _verificationId;
  bool _isOtpSent = false;
  bool _isLoading = false;

  void _sendOtp() async {
    final phone = _phoneController.text.trim();
    if (phone.length != 10) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें')),
      );
      return;
    }

    setState(() => _isLoading = true);
    await ref.read(authRepositoryProvider).verifyPhoneNumber(
      phoneNumber: '+91$phone',
      verificationCompleted: (credential) async {
        // Auto-read on Android devices via Google Play Services
        await ref.read(authRepositoryProvider).signInWithCredential(credential);
      },
      codeSent: (verificationId, resendToken) {
        setState(() {
          _verificationId = verificationId;
          _isOtpSent = true;
          _isLoading = false;
        });
      },
      verificationFailed: (e) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('सत्यापन विफल: \${e.message}')),
        );
      },
    );
  }

  void _verifyOtp() async {
    if (_otpController.text.length != 6 || _verificationId == null) return;
    setState(() => _isLoading = true);
    try {
      await ref.read(authRepositoryProvider).verifyOtp(
        verificationId: _verificationId!,
        smsCode: _otpController.text.trim(),
      );
    } catch (e) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('गलत OTP: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 32),
              // App Logo / Symbol
              Center(
                child: Container(
                  width: 90,
                  height: 90,
                  decoration: BoxDecoration(
                    color: AppTheme.crimsonRed.withOpacity(0.12),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.volunteer_activism,
                    size: 48,
                    color: AppTheme.crimsonRed,
                  ),
                ),
              ),
              const SizedBox(height: 20),
              const Text(
                'माँ अम्बा मुफ़्त रक्तदान नेटवर्क',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const Text(
                '100% नि:शुल्क एवं स्वैच्छिक आपातकालीन सेवा',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 16, color: Colors.grey),
              ),
              const SizedBox(height: 40),

              if (!_isOtpSent) ...[
                const Text('मोबाइल नंबर दर्ज करें', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 8),
                TextField(
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  maxLength: 10,
                  decoration: InputDecoration(
                    prefixText: '+91 ',
                    prefixStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                    hintText: '98765 43210',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    counterText: '',
                  ),
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: _isLoading ? null : _sendOtp,
                  style: ElevatedButton.styleFrom(backgroundColor: AppTheme.crimsonRed, foregroundColor: Colors.white),
                  child: _isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text('OTP प्राप्त करें / Get OTP'),
                ),
              ] else ...[
                const Text('6-अंकों का OTP दर्ज करें', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 12),
                Pinput(
                  controller: _otpController,
                  length: 6,
                  autofocus: true,
                  onCompleted: (_) => _verifyOtp(),
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: _isLoading ? null : _verifyOtp,
                  style: ElevatedButton.styleFrom(backgroundColor: AppTheme.crimsonRed, foregroundColor: Colors.white),
                  child: _isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text('सत्यापित करें एवं आगे बढ़ें'),
                ),
              ],
              
              const SizedBox(height: 32),
              // DPDP & Legal Disclaimer
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.amber.shade50,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.amber.shade300),
                ),
                child: const Text(
                  'नोट: रक्त बेचना या खरीदना गैर-कानूनी अपराध है। यह ऐप DPDP अधिनियम 2023 के तहत आपकी गोपनीयता की रक्षा करता है।',
                  style: TextStyle(fontSize: 12, color: Colors.brown),
                  textAlign: TextAlign.center,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}`
  },
  {
    path: "lib/features/donor/domain/donor_model.dart",
    category: "donor",
    description: "Domain Model for voluntary blood donors with Bombay blood group and DPDP consent",
    code: `import 'package:cloud_firestore/cloud_firestore.dart';

class DonorModel {
  final String id;
  final String fullName;
  final String phone;
  final String bloodGroup; // A+, A-, B+, B-, O+, O-, AB+, AB-, Bombay Blood Group (hh)
  final String state;
  final String district;
  final String city;
  final String pincode;
  final DateTime? lastDonationDate;
  final bool isAvailable;
  final bool isVerified;
  final bool isMaskedCallingEnabled;
  final int totalDonations;
  final DateTime registeredAt;

  DonorModel({
    required this.id,
    required this.fullName,
    required this.phone,
    required this.bloodGroup,
    required this.state,
    required this.district,
    required this.city,
    required this.pincode,
    this.lastDonationDate,
    required this.isAvailable,
    this.isVerified = false,
    this.isMaskedCallingEnabled = false,
    this.totalDonations = 0,
    required this.registeredAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'fullName': fullName,
      'phone': phone,
      'bloodGroup': bloodGroup,
      'state': state,
      'district': district,
      'city': city,
      'pincode': pincode,
      'lastDonationDate': lastDonationDate != null ? Timestamp.fromDate(lastDonationDate!) : null,
      'isAvailable': isAvailable,
      'isVerified': isVerified,
      'isMaskedCallingEnabled': isMaskedCallingEnabled,
      'totalDonations': totalDonations,
      'registeredAt': Timestamp.fromDate(registeredAt),
      'geoQueryKey': '\${state.toLowerCase()}_\${district.toLowerCase()}_\${bloodGroup.toLowerCase()}',
    };
  }

  factory DonorModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return DonorModel(
      id: doc.id,
      fullName: data['fullName'] ?? '',
      phone: data['phone'] ?? '',
      bloodGroup: data['bloodGroup'] ?? '',
      state: data['state'] ?? '',
      district: data['district'] ?? '',
      city: data['city'] ?? '',
      pincode: data['pincode'] ?? '',
      lastDonationDate: (data['lastDonationDate'] as Timestamp?)?.toDate(),
      isAvailable: data['isAvailable'] ?? false,
      isVerified: data['isVerified'] ?? false,
      isMaskedCallingEnabled: data['isMaskedCallingEnabled'] ?? false,
      totalDonations: data['totalDonations'] ?? 0,
      registeredAt: (data['registeredAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
    );
  }
}`
  },
  {
    path: "lib/features/donor/data/donor_repository.dart",
    category: "donor",
    description: "Firestore Data Repository for real-time donor queries and availability toggle",
    code: `import 'package:cloud_firestore/cloud_firestore.dart';
import '../domain/donor_model.dart';

class DonorRepository {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Search donors by Blood Group and Geographic District (indexed)
  Stream<List<DonorModel>> searchDonors({
    required String bloodGroup,
    required String state,
    required String district,
    bool availableOnly = true,
  }) {
    Query query = _firestore.collection('donors')
      .where('state', isEqualTo: state)
      .where('district', isEqualTo: district)
      .where('bloodGroup', isEqualTo: bloodGroup);

    if (availableOnly) {
      query = query.where('isAvailable', isEqualTo: true);
    }

    return query.snapshots().map((snapshot) {
      return snapshot.docs.map((doc) => DonorModel.fromFirestore(doc)).toList();
    });
  }

  // Live availability toggle for donor rest periods
  Future<void> updateAvailability(String donorId, bool isAvailable) async {
    await _firestore.collection('donors').doc(donorId).update({
      'isAvailable': isAvailable,
      'updatedAt': FieldValue.serverTimestamp(),
    });
  }

  // Register new voluntary donor
  Future<void> registerDonor(DonorModel donor) async {
    await _firestore.collection('donors').doc(donor.id).set(donor.toMap());
    // Also mark in user root document
    await _firestore.collection('users').doc(donor.id).update({
      'isDonorRegistered': true,
      'donorBloodGroup': donor.bloodGroup,
    });
  }
}`
  },
  {
    path: "lib/features/sos/presentation/sos_broadcast_screen.dart",
    category: "sos",
    description: "Emergency SOS Broadcast screen with hospital info, slip upload, and instant FCM push dispatch",
    code: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../core/theme/app_theme.dart';

class SosBroadcastScreen extends ConsumerStatefulWidget {
  const SosBroadcastScreen({super.key});

  @override
  ConsumerState<SosBroadcastScreen> createState() => _SosBroadcastScreenState();
}

class _SosBroadcastScreenState extends ConsumerState<SosBroadcastScreen> {
  final _patientNameController = TextEditingController();
  final _hospitalController = TextEditingController();
  final _bedController = TextEditingController();
  final _phoneController = TextEditingController();
  String _selectedBloodGroup = 'O+';
  int _unitsRequired = 2;
  bool _isSubmitting = false;

  void _triggerSosAlert() async {
    if (_patientNameController.text.isEmpty || _hospitalController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('कृपया मरीज और अस्पताल का नाम दर्ज करें')),
      );
      return;
    }

    setState(() => _isSubmitting = true);
    try {
      // Writing to Firestore triggers our Cloud Function for instant district FCM broadcast
      await FirebaseFirestore.instance.collection('sos_requests').add({
        'patientName': _patientNameController.text.trim(),
        'hospitalName': _hospitalController.text.trim(),
        'wardBedNumber': _bedController.text.trim(),
        'attendantPhone': _phoneController.text.trim(),
        'bloodGroup': _selectedBloodGroup,
        'unitsRequired': _unitsRequired,
        'district': 'Varanasi', // Current detected or selected district
        'state': 'Uttar Pradesh',
        'status': 'ACTIVE',
        'urgencyLevel': 'CRITICAL',
        'createdAt': FieldValue.serverTimestamp(),
      });

      if (mounted) {
        showDialog(
          context: context,
          builder: (ctx) => AlertDialog(
            title: const Text('🚨 SOS ब्रॉडकास्ट जारी!'),
            content: const Text('जिले के सभी मेल खाने वाले रक्तदाताओं को तत्काल आपातकालीन पुश नोटिफिकेशन भेज दिया गया है।'),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.pop(ctx);
                  Navigator.pop(context);
                },
                child: const Text('ठीक है'),
              ),
            ],
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('आपातकालीन रक्त SOS'),
        backgroundColor: AppTheme.emergencyRed,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.emergencyRed.withOpacity(0.08),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppTheme.emergencyRed),
              ),
              child: const Row(
                children: [
                  Icon(Icons.warning_amber_rounded, color: AppTheme.emergencyRed, size: 36),
                  SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'यह आपातकालीन ब्रॉडकास्ट जिले के सभी मैचिंग रक्तदाताओं के मोबाइल पर तुरंत सायरन/अलर्ट भेजेगा।',
                      style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.emergencyRed),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _patientNameController,
              decoration: const InputDecoration(labelText: 'मरीज का नाम (Patient Name)'),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _hospitalController,
              decoration: const InputDecoration(labelText: 'अस्पताल का नाम व पता (Hospital)'),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _bedController,
              decoration: const InputDecoration(labelText: 'वार्ड / बेड नंबर (Ward / Bed #)'),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: _isSubmitting ? null : _triggerSosAlert,
              icon: const Icon(Icons.send_rounded),
              label: _isSubmitting
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text('तत्काल SOS अलर्ट जारी करें'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.emergencyRed,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
            ),
          ],
        ),
      ),
    );
  }
}`
  }
];
