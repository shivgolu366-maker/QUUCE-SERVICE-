/**
 * Firebase Phone Authentication Service & Placeholder
 *
 * This module provides the complete Firebase Phone Authentication architecture:
 * 1. Invisible / Visible reCAPTCHA initialization (`RecaptchaVerifier`)
 * 2. Mobile number submission & OTP generation (`signInWithPhoneNumber`)
 * 3. 6-digit verification code resolution (`confirmationResult.confirm(otp)`)
 * 4. User credential creation & session token generation
 *
 * --- PRODUCTION FIREBASE DROP-IN GUIDE ---
 * When linking to live Firebase credentials:
 * 1. Run: npm install firebase
 * 2. Set Firebase project config in .env:
 *      VITE_FIREBASE_API_KEY=AIzaSy...
 *      VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
 *      VITE_FIREBASE_PROJECT_ID=your-app
 * 3. Replace the placeholder methods with:
 *      import { initializeApp } from 'firebase/app';
 *      import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
 *      const auth = getAuth(initializeApp(firebaseConfig));
 *      const verifier = new RecaptchaVerifier(auth, containerId, { size: 'invisible' });
 *      const confirmationResult = await signInWithPhoneNumber(auth, fullPhoneNumber, verifier);
 *      const credential = await confirmationResult.confirm(sixDigitOtp);
 */

export interface FirebasePhoneAuthConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export interface FirebaseUserCredential {
  user: {
    uid: string;
    phoneNumber: string;
    displayName: string | null;
    email: string | null;
    providerId: 'phone';
    isAnonymous: boolean;
    metadata: {
      creationTime: string;
      lastSignInTime: string;
    };
  };
  token: string;
  operationType: 'signIn';
}

export interface PhoneConfirmationResult {
  verificationId: string;
  phoneNumber: string;
  generatedOtp: string; // available in preview/placeholder mode for testing
  confirm: (verificationCode: string) => Promise<FirebaseUserCredential>;
}

export interface RecaptchaVerifierMock {
  type: 'recaptcha-v2' | 'recaptcha-invisible';
  containerId: string;
  isRendered: boolean;
  clear: () => void;
  verify: () => Promise<string>;
}

// Sample Firebase project configuration (Placeholder)
export const DEFAULT_FIREBASE_CONFIG: FirebasePhoneAuthConfig = {
  apiKey: "AIzaSyQuickServiceDemoKey2026SecureOtpKey",
  authDomain: "quickservice-platform.firebaseapp.com",
  projectId: "quickservice-platform",
  storageBucket: "quickservice-platform.appspot.com",
  messagingSenderId: "916858960689",
  appId: "1:916858960689:web:a1b2c3d4e5f67890"
};

class FirebasePhoneAuthManager {
  private config: FirebasePhoneAuthConfig = DEFAULT_FIREBASE_CONFIG;
  private activeConfirmation: PhoneConfirmationResult | null = null;
  private simulatedOtpStorage: Map<string, { otp: string; expiresAt: number; phone: string }> = new Map();

  /**
   * Initializes reCAPTCHA verifier for invisible or visible security check.
   * Required by Firebase Phone Auth before sending SMS.
   */
  public setupRecaptcha(containerId: string = 'recaptcha-container'): RecaptchaVerifierMock {
    if (typeof document !== 'undefined') {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = '';
        const badge = document.createElement('div');
        badge.className = 'flex items-center gap-2 py-1.5 px-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-400 font-mono';
        badge.innerHTML = `
          <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span>Firebase reCAPTCHA Protected</span>
          <span class="text-slate-500 ml-auto">Google Cloud Identity</span>
        `;
        container.appendChild(badge);
      }
    }

    return {
      type: 'recaptcha-invisible',
      containerId,
      isRendered: true,
      clear: () => {
        if (typeof document !== 'undefined') {
          const container = document.getElementById(containerId);
          if (container) container.innerHTML = '';
        }
      },
      verify: async () => {
        // Simulate reCAPTCHA token generation
        await new Promise((resolve) => setTimeout(resolve, 200));
        return 'mock-recaptcha-token-' + Math.random().toString(36).substring(2, 10);
      }
    };
  }

  /**
   * Placeholder logic for Firebase `signInWithPhoneNumber(auth, phoneNumber, appVerifier)`
   * 1. Validates phone number format (+E.164 standard)
   * 2. Simulates network dispatch to Firebase Authentication servers
   * 3. Generates 6-digit OTP
   * 4. Returns confirmationResult with confirm() method
   */
  public async signInWithPhoneNumber(
    fullPhoneNumber: string,
    appVerifier?: RecaptchaVerifierMock
  ): Promise<PhoneConfirmationResult> {
    // Basic E.164 phone check
    const cleanNumber = fullPhoneNumber.trim();
    if (!cleanNumber.startsWith('+') || cleanNumber.length < 8) {
      const err: any = new Error('auth/invalid-phone-number: The phone number must be in E.164 format (e.g. +919876543210)');
      err.code = 'auth/invalid-phone-number';
      throw err;
    }

    // Simulate reCAPTCHA verification if verifier provided
    if (appVerifier) {
      await appVerifier.verify();
    }

    // Simulate realistic 300ms network round-trip to Firebase Auth backend
    await new Promise((resolve) => setTimeout(resolve, 350));

    // Generate secure 6-digit OTP (e.g. 482915)
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationId = 'firebase_vid_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    this.simulatedOtpStorage.set(verificationId, {
      otp: generatedOtp,
      expiresAt,
      phone: cleanNumber
    });

    const confirmationResult: PhoneConfirmationResult = {
      verificationId,
      phoneNumber: cleanNumber,
      generatedOtp,
      confirm: async (verificationCode: string): Promise<FirebaseUserCredential> => {
        return this.confirmVerificationCode(verificationId, verificationCode, cleanNumber);
      }
    };

    this.activeConfirmation = confirmationResult;

    // Trigger local broadcast so OS notification banner and sound alert can pick up the simulated SMS
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('firebase_phone_otp_dispatched', {
          detail: {
            phoneNumber: cleanNumber,
            otp: generatedOtp,
            verificationId,
            sender: 'VK-FIREBASE'
          }
        })
      );
    }

    return confirmationResult;
  }

  /**
   * Placeholder logic for Firebase `confirmationResult.confirm(otpCode)`
   * Validates the 6-digit OTP code against the verificationId session.
   */
  public async confirmVerificationCode(
    verificationId: string,
    code: string,
    phoneNumber: string
  ): Promise<FirebaseUserCredential> {
    // Simulate realistic 250ms verification check
    await new Promise((resolve) => setTimeout(resolve, 300));

    const session = this.simulatedOtpStorage.get(verificationId);
    const cleanedCode = code.trim().replace(/\D/g, '');

    if (!session) {
      // Allow fallback master code '123456' or '000000' for demo safety
      if (cleanedCode !== '123456' && cleanedCode !== '000000') {
        const err: any = new Error('auth/session-expired: The SMS verification session has expired. Please request a new code.');
        err.code = 'auth/session-expired';
        throw err;
      }
    } else {
      if (Date.now() > session.expiresAt) {
        const err: any = new Error('auth/code-expired: The SMS code has expired. Please request a new code.');
        err.code = 'auth/code-expired';
        throw err;
      }

      // Check OTP against stored session or universal demo code
      if (cleanedCode !== session.otp && cleanedCode !== '123456' && cleanedCode !== '000000') {
        const err: any = new Error('auth/invalid-verification-code: The verification code entered is incorrect.');
        err.code = 'auth/invalid-verification-code';
        throw err;
      }
    }

    // Success! Generate authenticated Firebase credential
    const uid = 'usr_ph_' + Math.random().toString(36).substring(2, 12);
    const token = 'mock_jwt_token_' + btoa(JSON.stringify({ uid, phone: phoneNumber, exp: Date.now() + 3600000 }));

    return {
      user: {
        uid,
        phoneNumber,
        displayName: null,
        email: null,
        providerId: 'phone',
        isAnonymous: false,
        metadata: {
          creationTime: new Date().toISOString(),
          lastSignInTime: new Date().toISOString()
        }
      },
      token,
      operationType: 'signIn'
    };
  }

  /**
   * Returns current active confirmation result if one exists
   */
  public getActiveConfirmation(): PhoneConfirmationResult | null {
    return this.activeConfirmation;
  }

  /**
   * Clear active confirmation
   */
  public clearConfirmation(): void {
    this.activeConfirmation = null;
  }

  /**
   * Get placeholder Firebase config
   */
  public getConfig(): FirebasePhoneAuthConfig {
    return this.config;
  }
}

export const firebasePhoneAuth = new FirebasePhoneAuthManager();
