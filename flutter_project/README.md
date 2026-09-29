# Quick Service — Multi-Portal Architecture & Flutter Source Code

Production-ready Flutter application for the **Quick Service** On-Demand Multi-Service & Personal Dispatch Platform.

---

## 🏛️ Clean 3-Tier Multi-Portal Architecture

The system is architected into **3 isolated, role-based views**:

### 1. 🛍️ Customer Portal (`/` - Default Root Link)
- **Public & Clean**: Zero developer tools, zero APK builder buttons, zero code exports.
- **Features**:
  - Service directory (Cleaning, Electrician, Plumber, Chauffeur, Sabji Mandi, Kirana, etc.)
  - Interactive Grocery Checklist with item notes
  - Instant & Scheduled booking dispatcher
  - Dynamic UPI QR Code, Card & Wallet checkout
  - Live GPS tracking, Driver ETA, and 4-digit Service Start OTP
  - Discrete Partner Login & Staff link in Profile

### 2. 👷 Partner / Worker Terminal (`/partner`)
- **Duty Controls**: Instant Online / Offline duty toggle switch
- **Customer Privacy Protection**:
  - Incoming job leads display masked customer phone (`🔒 +91 98201 •••••`) and approximate neighborhood (`Sector 100, ~1.8 km away`)
  - Full flat address, phone number, and in-app masked calling/chat unlock **only after the partner accepts the job**
- **Job Execution**: Arrived status, Start OTP verification, Grocery reimbursement memo, and instant bank payout withdrawal.

### 3. ⚙️ Admin & Developer Console (`/admin`)
- **Protected Operations Desk**:
  - Live dispatch monitor & booking statuses
  - Partner KYC verification & document approval
  - Dynamic pricing (Surge multiplier & Platform commission take-rate)
  - Emergency SOS panic dispatch monitor
  - **Developer APK & Source Hub**: Microsoft PWABuilder 1-click cloud APK generator, WebAPK installer, GitHub Actions `.github/workflows/build-apk.yml`, and 1-click ZIP export.

---

## 🚀 How to Build APK Step-by-Step

### 1. Prerequisites
- **Flutter SDK** (Version 3.19.0 or later): `flutter doctor`
- **Android Studio** or **VS Code** with Flutter & Dart extensions
- **Android SDK & Build Tools** installed

### 2. Setup
1. Extract or clone this directory to your machine.
2. In your terminal, navigate to this directory:
   ```bash
   cd flutter_project
   ```
3. Fetch Flutter dependencies:
   ```bash
   flutter pub get
   ```

### 3. Add Google Maps API Key (Optional for production map rendering)
Open `android/app/src/main/AndroidManifest.xml` and replace:
```xml
<meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="YOUR_GOOGLE_MAPS_API_KEY"/>
```
with your valid Google Maps Android API Key from Google Cloud Console.

### 4. Test on Physical Phone or Emulator
Connect your Android phone with USB Debugging enabled, or start an emulator:
```bash
flutter run
```

### 5. Build 3 Separate Standalone Release APKs

To build the dedicated **Customer App APK**:
```bash
flutter build apk --target lib/main_customer.dart --release
# Output: build/app/outputs/flutter-apk/app-release.apk -> rename to QuickService-Customer.apk
```

To build the dedicated **Partner / Delivery Runner App APK**:
```bash
flutter build apk --target lib/main_partner.dart --release
# Output: build/app/outputs/flutter-apk/app-release.apk -> rename to QuickService-Partner.apk
```

To build the dedicated **Admin Operations Desk APK**:
```bash
flutter build apk --target lib/main_admin.dart --release
# Output: build/app/outputs/flutter-apk/app-release.apk -> rename to QuickService-Admin.apk
```

To optimize download size for 64-bit devices, append `--split-per-abi`:
```bash
flutter build apk --target lib/main_customer.dart --release --split-per-abi
```

### 6. Automated GitHub Cloud Release
You can also push this project to GitHub: the `.github/workflows/build-apk.yml` action automatically compiles and releases all 3 APK files in parallel for direct download!
