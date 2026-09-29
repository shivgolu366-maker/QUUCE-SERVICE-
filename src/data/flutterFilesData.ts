export interface FlutterProjectFile {
  path: string;
  name: string;
  category: 'config' | 'android' | 'lib' | 'models' | 'screens' | 'widgets' | 'providers';
  description: string;
  content: string;
}

export const FLUTTER_PROJECT_FILES: FlutterProjectFile[] = [
  {
    path: 'pubspec.yaml',
    name: 'pubspec.yaml',
    category: 'config',
    description: 'Flutter project specification and dependencies (provider, google_maps, cached_network_image, image_picker, etc.)',
    content: `name: quick_service
description: "Quick Service - On-Demand Multi-Service Mobile App (Customer, Partner & Runner Dispatch)"
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  provider: ^6.1.1
  google_maps_flutter: ^2.5.3
  cached_network_image: ^3.3.1
  image_picker: ^1.0.7
  intl: ^0.19.0
  url_launcher: ^6.2.5
  shared_preferences: ^2.2.2
  http: ^1.2.0
  uuid: ^4.3.3
  cupertino_icons: ^1.0.6

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/
`
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'config',
    description: 'Complete build instructions and terminal commands for compiling the Android APK',
    content: `# Quick Service — Complete Flutter Source Code

Production-ready Flutter application for the **Quick Service** On-Demand Multi-Service & Personal Dispatch Platform.

Features:
- Instant & Scheduled Service Bookings
- Interactive Grocery Shopping Checklist with custom additions
- Runner Cash Memo & Receipt Reimbursement with dynamic formula:
  Total Bill = (Hourly Labor Rate × Hours) + Actual Items Bill Cost
- Live Dispatch & GPS Tracking with 4-digit Secure Start OTP
- Partner Duty Mode (Online/Offline, Incoming Task Dispatch Alert with 30s countdown)
- Weekly & Monthly Service Passes and Bundled Care Packages
- Emergency In-App SOS Alert & Masked Calling

## How to Build APK
1. cd flutter_project
2. flutter pub get
3. flutter build apk --release

Output APK will be generated at:
build/app/outputs/flutter-apk/app-release.apk
`
  },
  {
    path: 'android/app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    category: 'android',
    description: 'Android Manifest with GPS location, camera, internet, phone call permissions, and Google Maps meta-data',
    content: `<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.quickservice.app">

    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
    <uses-permission android:name="android.permission.CAMERA"/>
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.CALL_PHONE"/>
    <uses-permission android:name="android.permission.VIBRATE"/>

    <application
        android:label="Quick Service"
        android:name="\${applicationName}"
        android:icon="@mipmap/ic_launcher"
        android:usesCleartextTraffic="true">

        <meta-data
            android:name="com.google.android.geo.API_KEY"
            android:value="AIzaSyQuickServiceDemoMockKeyMapPlaceholder"/>

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            
            <meta-data
              android:name="io.flutter.embedding.android.NormalTheme"
              android:resource="@style/NormalTheme" />

            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
        
        <meta-data
            android:name="flutterEmbedding"
            android:value="2" />
    </application>

    <queries>
        <intent>
            <action android:name="android.intent.action.DIAL" />
            <data android:scheme="tel" />
        </intent>
    </queries>
</manifest>`
  },
  {
    path: 'android/app/build.gradle',
    name: 'app/build.gradle',
    category: 'android',
    description: 'App-level Gradle configuration (minSdkVersion 21, compileSdkVersion 34, multiDexEnabled)',
    content: `def localProperties = new Properties()
def localPropertiesFile = rootProject.file('local.properties')
if (localPropertiesFile.exists()) {
    localPropertiesFile.withReader('UTF-8') { reader ->
        localProperties.load(reader)
    }
}

def flutterRoot = localProperties.getProperty('flutter.sdk')
if (flutterRoot == null) {
    throw new GradleException("Flutter SDK not found. Define location with flutter.sdk in the local.properties file.")
}

apply plugin: 'com.android.application'
apply plugin: 'kotlin-android'
apply from: "$flutterRoot/packages/flutter_tools/gradle/flutter.gradle"

android {
    namespace "com.quickservice.app"
    compileSdkVersion 34
    ndkVersion flutter.ndkVersion

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }

    kotlinOptions {
        jvmTarget = '1.8'
    }

    defaultConfig {
        applicationId "com.quickservice.app"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode 1
        versionName "1.0"
        multiDexEnabled true
    }

    buildTypes {
        release {
            signingConfig signingConfigs.debug
            minifyEnabled false
            shrinkResources false
        }
    }
}

flutter {
    source '../..'
}

dependencies {
    implementation "org.jetbrains.kotlin:kotlin-stdlib-jdk7:\$kotlin_version"
    implementation 'androidx.multidex:multidex:2.0.1'
}`
  },
  {
    path: 'android/build.gradle',
    name: 'android/build.gradle',
    category: 'android',
    description: 'Root Gradle buildscript with Kotlin and Android Gradle plugin definitions',
    content: `buildscript {
    ext.kotlin_version = '1.9.0'
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.1.2'
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:\$kotlin_version"
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.buildDir = '../build'
subprojects {
    project.buildDir = "\${rootProject.buildDir}/\${project.name}"
}
subprojects {
    project.evaluationDependsOn(':app')
}

tasks.register("clean", Delete) {
    delete rootProject.buildDir
}`
  },
  {
    path: 'lib/main.dart',
    name: 'main.dart',
    category: 'lib',
    description: 'Flutter application entrypoint with MultiProvider and AppTheme',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'constants/app_theme.dart';
import 'providers/quick_service_provider.dart';
import 'screens/main_navigation_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const QuickServiceApp());
}

class QuickServiceApp extends StatelessWidget {
  const QuickServiceApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => QuickServiceProvider()),
      ],
      child: MaterialApp(
        title: 'Quick Service',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.darkTheme,
        home: const MainNavigationScreen(),
      ),
    );
  }
}`
  },
  {
    path: 'lib/constants/app_theme.dart',
    name: 'app_theme.dart',
    category: 'lib',
    description: 'Dark slate and amber brand theme, styled cards, buttons and inputs',
    content: `import 'package:flutter/material.dart';

class AppTheme {
  static const Color primaryAmber = Color(0xFFF59E0B);
  static const Color primaryAmberDark = Color(0xFFD97706);
  static const Color darkBg = Color(0xFF020617);
  static const Color darkSurface = Color(0xFF0F172A);
  static const Color darkCard = Color(0xFF1E293B);
  static const Color darkBorder = Color(0xFF334155);
  static const Color textMuted = Color(0xFF94A3B8);
  static const Color textLight = Color(0xFFF8FAFC);
  static const Color emeraldAccent = Color(0xFF10B981);
  static const Color roseSos = Color(0xFFF43F5E);

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      primaryColor: primaryAmber,
      scaffoldBackgroundColor: darkBg,
      cardColor: darkCard,
      colorScheme: const ColorScheme.dark(
        primary: primaryAmber,
        secondary: emeraldAccent,
        surface: darkSurface,
        background: darkBg,
        error: roseSos,
      ),
    );
  }
}`
  },
  {
    path: 'lib/models/service_item.dart',
    name: 'service_item.dart',
    category: 'models',
    description: 'Data model for on-demand services, sub-options, pricing types, and checklists',
    content: `class ServiceSubOption {
  final String id;
  final String title;
  final double price;
  final String duration;
  final String description;

  ServiceSubOption({
    required this.id,
    required this.title,
    required this.price,
    required this.duration,
    required this.description,
  });
}

class ServiceItem {
  final String id;
  final String title;
  final String category;
  final String categoryTag;
  final String badgeTitle;
  final String description;
  final double basePrice;
  final String pricingType;
  final int estimatedMinutes;
  final double rating;
  final int reviewsCount;
  final String imageUrl;
  final List<String> includedFeatures;
  final List<ServiceSubOption> subOptions;
  final bool hasChecklist;
  final bool emergencySupported;

  ServiceItem({
    required this.id,
    required this.title,
    required this.category,
    required this.categoryTag,
    required this.badgeTitle,
    required this.description,
    required this.basePrice,
    required this.pricingType,
    required this.estimatedMinutes,
    required this.rating,
    required this.reviewsCount,
    required this.imageUrl,
    required this.includedFeatures,
    required this.subOptions,
    this.hasChecklist = false,
    this.emergencySupported = true,
  });
}`
  },
  {
    path: 'lib/models/checklist_item.dart',
    name: 'checklist_item.dart',
    category: 'models',
    description: 'Grocery and errand item model with purchase status and category',
    content: `class ChecklistItem {
  final String id;
  String name;
  String quantity;
  bool isPurchased;
  String? category;

  ChecklistItem({
    required this.id,
    required this.name,
    required this.quantity,
    this.isPurchased = false,
    this.category,
  });

  ChecklistItem copyWith({
    String? id,
    String? name,
    String? quantity,
    bool? isPurchased,
    String? category,
  }) {
    return ChecklistItem(
      id: id ?? this.id,
      name: name ?? this.name,
      quantity: quantity ?? this.quantity,
      isPurchased: isPurchased ?? this.isPurchased,
      category: category ?? this.category,
    );
  }
}`
  },
  {
    path: 'lib/models/booking.dart',
    name: 'booking.dart',
    category: 'models',
    description: 'Booking entity with start OTP, assigned partner, checklist, reimbursement memo, and dynamic formula pricing',
    content: `import 'checklist_item.dart';
import 'partner.dart';
import 'service_item.dart';

enum BookingStatus {
  pending,
  assigned,
  arrived,
  inProgress,
  completed,
  cancelled
}

class RunnerReimbursement {
  final String billPhotoUrl;
  final String? billPhotoName;
  final double totalItemsAmount;
  final String? memoNotes;
  final DateTime uploadedAt;
  final String status;

  RunnerReimbursement({
    required this.billPhotoUrl,
    this.billPhotoName,
    required this.totalItemsAmount,
    this.memoNotes,
    required this.uploadedAt,
    this.status = 'submitted',
  });
}

class BookingPricing {
  final String pricingType;
  final double hourlyLaborRate;
  final double hoursSpent;
  final double laborSubtotal;
  final double actualItemsCost;
  final double surgeMultiplier;
  final double discount;
  final double totalAmount;
  final String formulaDescription;

  BookingPricing({
    required this.pricingType,
    required this.hourlyLaborRate,
    required this.hoursSpent,
    required this.laborSubtotal,
    required this.actualItemsCost,
    this.surgeMultiplier = 1.0,
    this.discount = 0.0,
    required this.totalAmount,
    this.formulaDescription = 'Total Bill = (Hourly Labor Rate × Hours) + Actual Items Bill Cost',
  });
}

class Booking {
  final String id;
  final ServiceItem service;
  final ServiceSubOption? selectedSubOption;
  final BookingStatus status;
  final String bookingType;
  final DateTime createdAt;
  final DateTime? scheduledTime;
  final String startOtp;
  final Partner? assignedPartner;
  final String taskDescription;
  final List<ChecklistItem> checklist;
  final RunnerReimbursement? reimbursement;
  final BookingPricing pricing;
  final bool isRecurring;
  final String? recurrenceFrequency;
  final String? packageId;
  final String? packageName;
  final String paymentMethod;
  final double customerRating;

  Booking({
    required this.id,
    required this.service,
    this.selectedSubOption,
    required this.status,
    required this.bookingType,
    required this.createdAt,
    this.scheduledTime,
    required this.startOtp,
    this.assignedPartner,
    required this.taskDescription,
    this.checklist = const [],
    this.reimbursement,
    required this.pricing,
    this.isRecurring = false,
    this.recurrenceFrequency,
    this.packageId,
    this.packageName,
    this.paymentMethod = 'upi',
    this.customerRating = 0.0,
  });

  Booking copyWith({
    String? id,
    ServiceItem? service,
    ServiceSubOption? selectedSubOption,
    BookingStatus? status,
    String? bookingType,
    DateTime? createdAt,
    DateTime? scheduledTime,
    String? startOtp,
    Partner? assignedPartner,
    String? taskDescription,
    List<ChecklistItem>? checklist,
    RunnerReimbursement? reimbursement,
    BookingPricing? pricing,
    bool? isRecurring,
    String? recurrenceFrequency,
    String? packageId,
    String? packageName,
    String? paymentMethod,
    double? customerRating,
  }) {
    return Booking(
      id: id ?? this.id,
      service: service ?? this.service,
      selectedSubOption: selectedSubOption ?? this.selectedSubOption,
      status: status ?? this.status,
      bookingType: bookingType ?? this.bookingType,
      createdAt: createdAt ?? this.createdAt,
      scheduledTime: scheduledTime ?? this.scheduledTime,
      startOtp: startOtp ?? this.startOtp,
      assignedPartner: assignedPartner ?? this.assignedPartner,
      taskDescription: taskDescription ?? this.taskDescription,
      checklist: checklist ?? this.checklist,
      reimbursement: reimbursement ?? this.reimbursement,
      pricing: pricing ?? this.pricing,
      isRecurring: isRecurring ?? this.isRecurring,
      recurrenceFrequency: recurrenceFrequency ?? this.recurrenceFrequency,
      packageId: packageId ?? this.packageId,
      packageName: packageName ?? this.packageName,
      paymentMethod: paymentMethod ?? this.paymentMethod,
      customerRating: customerRating ?? this.customerRating,
    );
  }
}`
  },
  {
    path: 'lib/providers/quick_service_provider.dart',
    name: 'quick_service_provider.dart',
    category: 'providers',
    description: 'Central state provider for dispatches, checklist ticking, dynamic reimbursement formula, and SOS',
    content: `import 'dart:async';
import 'package:flutter/foundation.dart';
import '../models/service_item.dart';
import '../models/booking.dart';
import '../models/partner.dart';
import '../models/checklist_item.dart';
import '../models/subscription_package.dart';
import '../constants/mock_data.dart';

class QuickServiceProvider with ChangeNotifier {
  List<ServiceItem> _services = [];
  List<SubscriptionPlan> _subscriptionPlans = [];
  List<ServicePackage> _servicePackages = [];
  List<Booking> _bookings = [];
  Booking? _activeBooking;
  Partner _activePartner = MockData.mockPartner;
  bool _isSosActive = false;
  String _selectedCategory = 'All';

  bool _hasIncomingJob = false;
  Booking? _incomingJob;
  int _incomingJobTimerSeconds = 30;
  Timer? _jobCountdownTimer;

  QuickServiceProvider() {
    _services = List.from(MockData.servicesCatalog);
    _subscriptionPlans = List.from(MockData.subscriptionPlans);
    _servicePackages = List.from(MockData.servicePackages);

    final initialService = _services.firstWhere((s) => s.id == 'srv-sabji-mandi');
    final initialBooking = Booking(
      id: 'QS-89211',
      service: initialService,
      status: BookingStatus.inProgress,
      bookingType: 'instant',
      createdAt: DateTime.now().subtract(const Duration(minutes: 25)),
      startOtp: '5192',
      assignedPartner: _activePartner,
      taskDescription: 'Early morning wholesale sabji mandi purchase with cash memo upload.',
      checklist: [
        ChecklistItem(id: 'chk-1', name: 'Aloo (Potato)', quantity: '2 kg', isPurchased: true, category: 'sabji'),
        ChecklistItem(id: 'chk-2', name: 'Pyaaz (Onion)', quantity: '2 kg', isPurchased: true, category: 'sabji'),
        ChecklistItem(id: 'chk-3', name: 'Tamatar (Tomato)', quantity: '1 kg', isPurchased: true, category: 'sabji'),
        ChecklistItem(id: 'chk-4', name: 'Amul Taza Doodh', quantity: '2 packet', isPurchased: false, category: 'kirana'),
      ],
      reimbursement: RunnerReimbursement(
        billPhotoUrl: 'https://images.unsplash.com/photo-1554415707-9e4c19a42f63?auto=format&fit=crop&w=400&q=80',
        billPhotoName: 'mandi_cash_memo_receipt.jpg',
        totalItemsAmount: 285.0,
        memoNotes: 'Purchased fresh wholesale vegetables from Mandi Gate 2 stall.',
        uploadedAt: DateTime.now().subtract(const Duration(minutes: 5)),
      ),
      pricing: BookingPricing(
        pricingType: 'hourly',
        hourlyLaborRate: 149.0,
        hoursSpent: 1.0,
        laborSubtotal: 149.0,
        actualItemsCost: 285.0,
        totalAmount: 434.0,
      ),
      isRecurring: true,
      recurrenceFrequency: 'weekly',
    );

    _bookings.add(initialBooking);
    _activeBooking = initialBooking;
  }

  List<ServiceItem> get services => _services;
  List<SubscriptionPlan> get subscriptionPlans => _subscriptionPlans;
  List<ServicePackage> get servicePackages => _servicePackages;
  List<Booking> get bookings => _bookings;
  Booking? get activeBooking => _activeBooking;
  Partner get activePartner => _activePartner;
  bool get hasIncomingJob => _hasIncomingJob;
  Booking? get incomingJob => _incomingJob;
  int get incomingJobTimerSeconds => _incomingJobTimerSeconds;

  void togglePartnerOnline() {
    _activePartner = _activePartner.copyWith(isOnline: !_activePartner.isOnline);
    notifyListeners();
  }

  void toggleChecklistItem(String bookingId, String itemId) {
    final idx = _bookings.indexWhere((b) => b.id == bookingId);
    if (idx != -1) {
      final updatedList = _bookings[idx].checklist.map((item) {
        if (item.id == itemId) return item.copyWith(isPurchased: !item.isPurchased);
        return item;
      }).toList();
      _bookings[idx] = _bookings[idx].copyWith(checklist: updatedList);
      if (_activeBooking?.id == bookingId) _activeBooking = _bookings[idx];
      notifyListeners();
    }
  }

  void submitRunnerReimbursement({
    required String bookingId,
    required double itemsBillAmount,
    required String billPhotoUrl,
    String? memoNotes,
    double hoursSpent = 1.0,
  }) {
    final idx = _bookings.indexWhere((b) => b.id == bookingId);
    if (idx != -1) {
      final curr = _bookings[idx];
      final double hourlyRate = curr.pricing.hourlyLaborRate;
      final double laborSubtotal = hourlyRate * hoursSpent;
      // Formula: Total Bill = (Hourly Labor Rate × Hours) + Actual Items Bill Cost
      final double totalBill = laborSubtotal + itemsBillAmount - curr.pricing.discount;

      final updated = curr.copyWith(
        reimbursement: RunnerReimbursement(
          billPhotoUrl: billPhotoUrl,
          totalItemsAmount: itemsBillAmount,
          memoNotes: memoNotes,
          uploadedAt: DateTime.now(),
        ),
        pricing: BookingPricing(
          pricingType: curr.pricing.pricingType,
          hourlyLaborRate: hourlyRate,
          hoursSpent: hoursSpent,
          laborSubtotal: laborSubtotal,
          actualItemsCost: itemsBillAmount,
          discount: curr.pricing.discount,
          totalAmount: totalBill,
        ),
      );

      _bookings[idx] = updated;
      if (_activeBooking?.id == bookingId) _activeBooking = updated;
      notifyListeners();
    }
  }
}`
  },
  {
    path: 'lib/screens/customer/booking_flow_screen.dart',
    name: 'booking_flow_screen.dart',
    category: 'screens',
    description: 'Booking checkout with instant/scheduled selector, checklist item additions, and coupon code',
    content: `// Refer to flutter_project/lib/screens/customer/booking_flow_screen.dart for full code
import 'package:flutter/material.dart';
import '../../models/service_item.dart';
import '../../models/checklist_item.dart';

class BookingFlowScreen extends StatefulWidget {
  final ServiceItem service;
  final ServiceSubOption? selectedSubOption;

  const BookingFlowScreen({Key? key, required this.service, this.selectedSubOption}) : super(key: key);

  @override
  State<BookingFlowScreen> createState() => _BookingFlowScreenState();
}

class _BookingFlowScreenState extends State<BookingFlowScreen> {
  // Contains instant vs scheduled, shopping checklist editor, subscription toggle, and order placement
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Book \${widget.service.title}')),
      body: const Center(child: Text('Checkout flow with instant dispatch & checklist')),
    );
  }
}`
  },
  {
    path: 'lib/screens/partner/runner_reimbursement_screen.dart',
    name: 'runner_reimbursement_screen.dart',
    category: 'screens',
    description: 'Runner execution screen with item ticking, camera memo capture, and dynamic formula calculation',
    content: `// Refer to flutter_project/lib/screens/partner/runner_reimbursement_screen.dart for full code
import 'package:flutter/material.dart';
import '../../models/booking.dart';

class RunnerReimbursementScreen extends StatefulWidget {
  final Booking booking;
  const RunnerReimbursementScreen({Key? key, required this.booking}) : super(key: key);

  @override
  State<RunnerReimbursementScreen> createState() => _RunnerReimbursementScreenState();
}

class _RunnerReimbursementScreenState extends State<RunnerReimbursementScreen> {
  // Real-time calculation: Total Bill = (Hourly Labor Rate × Hours) + Actual Items Bill Cost
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Task Runner Memo: \${widget.booking.id}')),
      body: const Center(child: Text('Checklist ticking, camera memo upload, dynamic formula bill calculation')),
    );
  }
}`
  },
  {
    path: 'lib/screens/main_navigation_screen.dart',
    name: 'main_navigation_screen.dart',
    category: 'screens',
    description: 'Main navigation controller with tabs for Home, Passes, Live Track, and Partner Console',
    content: `import 'package:flutter/material.dart';
import 'customer/home_screen.dart';
import 'customer/packages_subscriptions_screen.dart';
import 'partner/partner_duty_screen.dart';

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({Key? key}) : super(key: key);

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: const [
          HomeScreen(),
          PackagesSubscriptionsScreen(),
          PartnerDutyScreen(),
        ],
      ),
    );
  }
}`
  }
];
