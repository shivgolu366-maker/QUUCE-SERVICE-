import React, { useState, useEffect, useRef } from 'react';
import { useQuickService } from '../../context/QuickServiceContext';
import { 
  firebasePhoneAuth, 
  PhoneConfirmationResult, 
  FirebaseUserCredential,
  DEFAULT_FIREBASE_CONFIG
} from '../../services/firebasePhoneAuth';
import { 
  X, 
  Smartphone, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles, 
  Lock, 
  PhoneCall, 
  Info,
  Flame,
  ChevronDown,
  Code,
  HardHat,
  Copy,
  Check
} from 'lucide-react';
import { ServiceCategory } from '../../types';

interface PhoneAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'customer' | 'partner';
  onSuccess?: (credential: FirebaseUserCredential, role: 'customer' | 'partner') => void;
}

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳', placeholder: '98765 43210' },
  { code: '+1', country: 'USA / Canada', flag: '🇺🇸', placeholder: '(555) 012-3456' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧', placeholder: '7911 123456' },
  { code: '+971', country: 'UAE', flag: '🇦🇪', placeholder: '50 123 4567' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬', placeholder: '8123 4567' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦', placeholder: '50 123 4567' },
];

export const PhoneAuthModal: React.FC<PhoneAuthModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'customer',
  onSuccess
}) => {
  const { 
    customer, 
    loginCustomer, 
    loginPartnerWithOtp,
    triggerGlobalSms,
    setViewMode
  } = useQuickService();

  const [role, setRole] = useState<'customer' | 'partner'>(defaultRole);
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  
  // Country & Phone
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  
  // Partner specific fields
  const [partnerCategory, setPartnerCategory] = useState<ServiceCategory>('repairs');

  // Firebase Phone Auth states
  const [confirmationResult, setConfirmationResult] = useState<PhoneConfirmationResult | null>(null);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<FirebaseUserCredential | null>(null);
  const [showFirebaseCodeHelper, setShowFirebaseCodeHelper] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setStep('phone');
      setErrorMsg('');
      setIsSubmitting(false);
      setRole(defaultRole);
      setOtpDigits(['', '', '', '', '', '']);
      if (defaultRole === 'customer' && customer?.isLoggedIn) {
        setFullName(customer.name);
        setPhoneNumber(customer.phone.replace('+91', '').trim());
      } else {
        setFullName('');
        setPhoneNumber('');
      }

      // Initialize Firebase reCAPTCHA container
      setTimeout(() => {
        firebasePhoneAuth.setupRecaptcha('firebase-recaptcha-widget');
      }, 100);
    }
  }, [isOpen, defaultRole, customer]);

  // Resend Countdown Timer
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (step === 'otp' && resendTimer > 0) {
      timerId = setInterval(() => {
        setResendTimer(t => t - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timerId);
  }, [step, resendTimer]);

  // Listen to Global SMS banner autofill trigger
  useEffect(() => {
    const handleAutofillEvent = (e: any) => {
      if (e.detail?.otp && step === 'otp') {
        const rawOtp = String(e.detail.otp).replace(/\D/g, '').slice(0, 6);
        const digits = rawOtp.split('');
        while (digits.length < 6) digits.push('');
        setOtpDigits(digits);
        setErrorMsg('');
      }
    };
    window.addEventListener('quick_service_autofill_otp', handleAutofillEvent);
    return () => window.removeEventListener('quick_service_autofill_otp', handleAutofillEvent);
  }, [step]);

  if (!isOpen) return null;

  const handlePhoneInputChange = (val: string) => {
    // Keep numbers only
    const clean = val.replace(/\D/g, '');
    setPhoneNumber(clean.slice(0, 12));
    if (errorMsg) setErrorMsg('');
  };

  const handleFillDemo = (type: 'customer' | 'partner') => {
    setRole(type);
    setSelectedCountry(COUNTRY_CODES[0]);
    if (type === 'customer') {
      setFullName('Rahul Sharma');
      setPhoneNumber('9876543210');
    } else {
      setFullName('Rajesh Kumar Verma');
      setPhoneNumber('9876543211');
      setPartnerCategory('repairs');
    }
    setErrorMsg('');
  };

  // STEP 1: Send OTP via Firebase signInWithPhoneNumber logic
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 7) {
      setErrorMsg('Please enter a valid mobile number.');
      return;
    }

    const fullE164Phone = `${selectedCountry.code}${cleanPhone}`;

    setIsSubmitting(true);
    try {
      // Step A: Setup reCAPTCHA verifier
      const verifier = firebasePhoneAuth.setupRecaptcha('firebase-recaptcha-widget');

      // Step B: Trigger Firebase signInWithPhoneNumber
      const result = await firebasePhoneAuth.signInWithPhoneNumber(fullE164Phone, verifier);
      setConfirmationResult(result);

      // Trigger global simulated SMS push
      triggerGlobalSms(fullE164Phone, result.generatedOtp, 'VK-FIREBASE');

      // Reset OTP screen state
      setOtpDigits(['', '', '', '', '', '']);
      setResendTimer(30);
      setCanResend(false);
      setStep('otp');

      // Auto focus first OTP input after render
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send OTP via Firebase Auth.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // OTP 6-Digit input handlers
  const handleOtpDigitChange = (index: number, val: string) => {
    // Only numbers
    const cleanVal = val.replace(/\D/g, '');
    
    // Handle paste of whole 6 digits in single field
    if (cleanVal.length > 1) {
      const pasted = cleanVal.slice(0, 6).split('');
      const newDigits = [...otpDigits];
      pasted.forEach((d, i) => {
        if (i < 6) newDigits[i] = d;
      });
      setOtpDigits(newDigits);
      const nextIdx = Math.min(pasted.length, 5);
      otpInputRefs.current[nextIdx]?.focus();
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal.slice(-1);
    setOtpDigits(newDigits);

    // Auto advance to next box
    if (cleanVal && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;
    const digits = pastedData.split('');
    const newDigits = [...otpDigits];
    digits.forEach((d, i) => {
      if (i < 6) newDigits[i] = d;
    });
    setOtpDigits(newDigits);
    const targetIdx = Math.min(digits.length, 5);
    otpInputRefs.current[targetIdx]?.focus();
  };

  const handle1TapAutofill = () => {
    if (confirmationResult?.generatedOtp) {
      const digits = confirmationResult.generatedOtp.split('');
      while (digits.length < 6) digits.push('');
      setOtpDigits(digits);
      setErrorMsg('');
    }
  };

  // STEP 2: Verify 6-digit OTP using confirmationResult.confirm()
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const enteredCode = otpDigits.join('');
    if (enteredCode.length !== 6) {
      setErrorMsg('Please enter all 6 digits of the OTP verification code.');
      return;
    }

    if (!confirmationResult) {
      setErrorMsg('No active Firebase confirmation session. Please request a new OTP.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // Execute Firebase confirmationResult.confirm(otp)
      const credential = await confirmationResult.confirm(enteredCode);
      setAuthenticatedUser(credential);

      // Perform App Context Login based on role
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      const fullPhone = `${selectedCountry.code}${cleanPhone}`;
      const displayName = fullName.trim() || (role === 'customer' ? `Customer (${selectedCountry.code} ${cleanPhone.slice(-4)})` : `Partner (${cleanPhone.slice(-4)})`);

      if (role === 'customer') {
        loginCustomer(displayName, fullPhone);
      } else {
        loginPartnerWithOtp(cleanPhone, {
          fullName: displayName,
          category: partnerCategory,
          proofType: 'aadhaar',
          docNumber: '5821-9823-4122'
        });
      }

      if (onSuccess) {
        onSuccess(credential, role);
      }

      setStep('success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid or expired OTP. Please verify and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyFirebaseSnippet = () => {
    const snippet = `// Production Firebase Phone Auth Setup:
import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const firebaseConfig = ${JSON.stringify(DEFAULT_FIREBASE_CONFIG, null, 2)};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 1. Initialize reCAPTCHA
const appVerifier = new RecaptchaVerifier(auth, 'firebase-recaptcha-widget', { size: 'invisible' });

// 2. Request OTP
const confirmationResult = await signInWithPhoneNumber(auth, '${selectedCountry.code}${phoneNumber || '9876543210'}', appVerifier);

// 3. Confirm 6-Digit OTP
const userCredential = await confirmationResult.confirm('${otpDigits.join('') || '123456'}');
console.log('Firebase User UID:', userCredential.user.uid);`;

    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] my-auto">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">
                  Phone OTP Authentication
                </h2>
                <span className="flex items-center gap-1 text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                  <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                  Firebase Auth
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {step === 'phone' && 'Enter mobile number for instant 6-digit OTP verification'}
                {step === 'otp' && `Verifying code sent to ${confirmationResult?.phoneNumber}`}
                {step === 'success' && 'Authenticated successfully via Firebase Phone Auth'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role Selector Tabs (Customer vs Partner) */}
        {step === 'phone' && (
          <div className="px-4 sm:px-6 pt-4 pb-1">
            <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  role === 'customer'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Customer Login</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('partner')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  role === 'partner'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <HardHat className="w-3.5 h-3.5" />
                <span>Partner Terminal</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">

          {/* ================= STEP 1: PHONE NUMBER INPUT ================= */}
          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              
              {/* Quick Sample Demo Fillers */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs">
                <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Instant Demo Fill:</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleFillDemo('customer')}
                    className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-[11px] transition-colors border border-amber-500/30"
                  >
                    Demo Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillDemo('partner')}
                    className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-[11px] transition-colors border border-emerald-500/30"
                  >
                    Demo Partner
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Full Name {role === 'partner' ? '(Service Professional)' : ''}</span>
                  <span className="text-[10px] text-slate-500">Required for profile creation</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={role === 'customer' ? 'e.g. Rahul Sharma' : 'e.g. Rajesh Kumar Verma'}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Partner Category Selector (Only for Partner role) */}
              {role === 'partner' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Trade / Service Category
                  </label>
                  <select
                    value={partnerCategory}
                    onChange={(e) => setPartnerCategory(e.target.value as ServiceCategory)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="repairs">Plumber & Electrician (Emergency)</option>
                    <option value="chores">Sabji & Grocery Errands / Delivery</option>
                    <option value="mobility">Driver & Bike Taxi Partner</option>
                    <option value="cleaning">Home Deep Cleaning & Housekeeping</option>
                    <option value="appliances">AC & Appliance Repair Specialist</option>
                    <option value="carpentry">Carpentry & Furniture Assembly</option>
                  </select>
                </div>
              )}

              {/* Mobile Number Input with Country Code Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Mobile Phone Number *</span>
                  <span className="text-[10px] text-amber-400 font-mono">E.164 Format Required</span>
                </label>

                <div className="flex items-center gap-2">
                  {/* Country Selector Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      className="h-12 px-3 rounded-2xl bg-slate-800 border border-slate-700 hover:border-slate-600 flex items-center gap-1.5 text-sm text-white font-medium transition-colors"
                    >
                      <span className="text-base">{selectedCountry.flag}</span>
                      <span className="font-mono">{selectedCountry.code}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    {isCountryDropdownOpen && (
                      <div className="absolute left-0 top-14 z-50 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-xl overflow-hidden py-1">
                        {COUNTRY_CODES.map((item) => (
                          <button
                            key={item.code}
                            type="button"
                            onClick={() => {
                              setSelectedCountry(item);
                              setIsCountryDropdownOpen(false);
                            }}
                            className="w-full px-3 py-2 text-left text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <span>{item.flag}</span>
                              <span>{item.country}</span>
                            </span>
                            <span className="font-mono text-amber-400">{item.code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Phone digits input */}
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => handlePhoneInputChange(e.target.value)}
                      placeholder={selectedCountry.placeholder}
                      className="w-full h-12 bg-slate-800/90 border border-slate-700 rounded-2xl px-4 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 tracking-wider transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Firebase Invisible reCAPTCHA Container Placeholder */}
              <div id="firebase-recaptcha-widget" className="min-h-[38px] flex items-center">
                <div className="w-full flex items-center gap-2 py-2 px-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 font-mono">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Firebase RecaptchaVerifier active</span>
                  <span className="text-slate-500 ml-auto">Google Identity</span>
                </div>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium text-center animate-in shake">
                  {errorMsg}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Contacting Firebase Auth Gateway...</span>
                  </>
                ) : (
                  <>
                    <span>Send 6-Digit OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Firebase Code Helper Collapsible Toggle */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowFirebaseCodeHelper(!showFirebaseCodeHelper)}
                  className="w-full flex items-center justify-center gap-1.5 text-[11px] text-slate-400 hover:text-amber-400 transition-colors py-1 cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>{showFirebaseCodeHelper ? 'Hide Firebase Auth Blueprint' : 'View Firebase SDK Drop-in Logic'}</span>
                </button>

                {showFirebaseCodeHelper && (
                  <div className="mt-2 p-3 bg-slate-950 border border-slate-800 rounded-2xl text-[11px] font-mono space-y-2 text-slate-300">
                    <div className="flex items-center justify-between text-amber-400 font-bold border-b border-slate-800 pb-1.5">
                      <span>Firebase Web v9/v10 Modular Drop-in</span>
                      <button
                        type="button"
                        onClick={copyFirebaseSnippet}
                        className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white"
                      >
                        {copiedSnippet ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedSnippet ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="text-[10px] leading-relaxed text-slate-400 overflow-x-auto whitespace-pre">
{`// 1. signInWithPhoneNumber
const verifier = new RecaptchaVerifier(auth, 'recaptcha', { size: 'invisible' });
const confirmationResult = await signInWithPhoneNumber(auth, '${selectedCountry.code}${phoneNumber || '9876543210'}', verifier);

// 2. confirm(otpCode)
const credential = await confirmationResult.confirm(otpCode);`}
                    </pre>
                  </div>
                )}
              </div>

            </form>
          )}

          {/* ================= STEP 2: 6-DIGIT OTP VERIFICATION ================= */}
          {step === 'otp' && (
            <div className="space-y-4">
              
              {/* Simulated Carrier / Firebase Delivery Box */}
              <div className="p-3.5 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-emerald-500/40 rounded-2xl space-y-2 shadow-xl ring-1 ring-emerald-500/20 animate-in slide-in-from-top-2">
                <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-800">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-extrabold tracking-wide">
                    <Flame className="w-3.5 h-3.5 fill-emerald-400" />
                    FIREBASE SMS GATEWAY · SENDER: VK-FIREBASE
                  </span>
                  <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    Delivered
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed">
                  Verification Code: <strong className="text-amber-400 text-sm font-bold bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/40">{confirmationResult?.generatedOtp || '123456'}</strong> for QuickService login on {confirmationResult?.phoneNumber}. Valid for 10 minutes.
                </div>

                {/* 1-Tap Auto-fill Button */}
                <button
                  type="button"
                  onClick={handle1TapAutofill}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                  <span>⚡ 1-Tap Auto-fill Code ({confirmationResult?.generatedOtp})</span>
                </button>
              </div>

              {/* Instructions & Change Number */}
              <div className="text-center space-y-1">
                <p className="text-xs text-slate-300">
                  Enter the 6-digit OTP code sent to{' '}
                  <span className="font-bold text-white font-mono">{confirmationResult?.phoneNumber}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                >
                  Edit phone number
                </button>
              </div>

              {/* 6 Digit OTP Input Boxes */}
              <div className="flex justify-center gap-1.5 sm:gap-2.5">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <input
                    key={idx}
                    ref={(el) => { otpInputRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otpDigits[idx]}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={handleOtpPaste}
                    className="w-10 sm:w-12 h-12 sm:h-14 text-center text-lg sm:text-2xl font-bold font-mono bg-slate-800 border-2 border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-xl sm:rounded-2xl text-white outline-none transition-all shadow-inner"
                  />
                ))}
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium text-center">
                  {errorMsg}
                </div>
              )}

              {/* Verify OTP Button */}
              <button
                type="button"
                onClick={() => handleVerifyOtp()}
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying with Firebase Auth...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Authenticate</span>
                  </>
                )}
              </button>

              {/* Resend and Timer */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Didn&apos;t receive OTP code?</span>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="flex items-center gap-1 text-amber-400 font-bold hover:underline cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Resend Code</span>
                  </button>
                ) : (
                  <span className="font-mono text-slate-500">
                    Resend in {resendTimer}s
                  </span>
                )}
              </div>

            </div>
          )}

          {/* ================= STEP 3: SUCCESS SCREEN ================= */}
          {step === 'success' && authenticatedUser && (
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-white">
                  Authentication Successful!
                </h3>
                <p className="text-xs text-slate-300">
                  Welcome to Quick Service platform as{' '}
                  <strong className="text-amber-400 capitalize">{role}</strong>.
                </p>
              </div>

              {/* Authenticated Firebase Session Card */}
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl text-left space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between text-slate-400 pb-1.5 border-b border-slate-800">
                  <span>Firebase User Record</span>
                  <span className="text-emerald-400 font-bold">STATE: LOGGED_IN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="text-white font-bold">{authenticatedUser.user.phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Provider:</span>
                  <span className="text-amber-400">firebase.auth().PhoneAuthProvider</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">UID:</span>
                  <span className="text-slate-300 truncate max-w-[200px]">{authenticatedUser.user.uid}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (role === 'partner') {
                    setViewMode('partner');
                  } else {
                    setViewMode('customer');
                  }
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                Go to {role === 'partner' ? 'Partner Terminal' : 'Services Home'}
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
