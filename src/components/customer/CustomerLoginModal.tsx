import React, { useState, useEffect } from 'react';
import { useQuickService } from '../../context/QuickServiceContext';
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
  MessageSquare,
  Share2,
  Copy,
  Check,
  Flame
} from 'lucide-react';

interface CustomerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAadhaarVerification?: () => void;
}

export const CustomerLoginModal: React.FC<CustomerLoginModalProps> = ({
  isOpen,
  onClose,
  onOpenAadhaarVerification
}) => {
  const { customer, loginCustomer, sendMockSmsOtp, verifyMockSmsOtp, openPhoneAuth } = useQuickService();

  const [step, setStep] = useState<'input' | 'otp' | 'success'>('input');
  const [fullName, setFullName] = useState(customer?.name || '');
  const [phone, setPhone] = useState(customer?.phone?.replace('+91', '').trim() || '');
  const [email, setEmail] = useState(customer?.email || '');
  
  // 6-digit OTP state (User Requirement)
  const [generatedOtp, setGeneratedOtp] = useState('492815');
  const [enteredOtp, setEnteredOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [showSimulatedSms, setShowSimulatedSms] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep('input');
      setErrorMsg('');
      setShowSimulatedSms(false);
      setFullName(customer?.isLoggedIn ? customer.name : '');
      setPhone(customer?.isLoggedIn ? customer.phone.replace('+91', '').trim() : '');
    }
  }, [isOpen, customer]);

  // Listen to Global SMS Banner's "⚡ Auto-fill OTP" button
  useEffect(() => {
    const handleAutofillEvent = (e: any) => {
      if (e.detail?.otp) {
        const digits = e.detail.otp.slice(0, 6).split('');
        while (digits.length < 6) digits.push('');
        setEnteredOtp(digits);
        setErrorMsg('');
      }
    };
    window.addEventListener('quick_service_autofill_otp', handleAutofillEvent);
    return () => window.removeEventListener('quick_service_autofill_otp', handleAutofillEvent);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer(t => t - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  const handlePhoneChange = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 10);
    setPhone(clean);
    if (errorMsg) setErrorMsg('');
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      setErrorMsg('Kripya 10-digit mobile number enter karein (Please enter valid 10-digit phone)');
      return;
    }

    // Call Mock SMS OTP service from QuickServiceContext
    const res = await sendMockSmsOtp(cleanPhone, 'customer', 'VK-QKSERV');
    setGeneratedOtp(res.otp);
    setEnteredOtp(['', '', '', '', '', '']);
    setTimer(30);
    setCanResend(false);
    setErrorMsg('');
    setStep('otp');
    setShowSimulatedSms(true);
  };

  const handleOtpBoxChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newArr = [...enteredOtp];
    newArr[index] = val.slice(-1);
    setEnteredOtp(newArr);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`customer-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !enteredOtp[index] && index > 0) {
      const prevInput = document.getElementById(`customer-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleAutofillOtp = () => {
    const digits = generatedOtp.split('');
    while (digits.length < 6) digits.push('');
    setEnteredOtp(digits);
    setErrorMsg('');
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const joined = enteredOtp.join('');
    if (joined.length < 6) {
      setErrorMsg('Kripya 6-digit OTP code enter karein');
      return;
    }

    const verification = verifyMockSmsOtp(phone, joined, 'customer');
    if (!verification.success && joined !== generatedOtp && joined !== '123456' && joined !== '000000') {
      setErrorMsg('Invalid OTP! Demo code: ' + generatedOtp);
      return;
    }

    // Log the user in
    const effectiveName = fullName.trim() || `Customer (+91 ${phone.slice(-4)})`;
    loginCustomer(effectiveName, phone, email);
    setStep('success');
  };

  const handleQuickDemoFill = () => {
    setFullName('Rahul Sharma');
    setPhone('9876543210');
    setEmail('rahul.sharma@gmail.com');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                {step === 'input' && 'Customer Login / Sign In'}
                {step === 'otp' && 'Verify Mobile OTP'}
                {step === 'success' && 'Login Successful!'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {step === 'input' && 'Name & Phone number daal kar seedhe login karein'}
                {step === 'otp' && `OTP sent to +91 ${phone}`}
                {step === 'success' && 'Welcome to Quick Service platform'}
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

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">

          {/* Switch to Firebase Phone Auth */}
          <div className="p-3 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-white">Firebase Phone Auth:</span>
                <span className="text-[11px] text-slate-300 block">Use 6-digit Firebase OTP modal with reCAPTCHA</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                openPhoneAuth('customer');
              }}
              className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[11px] transition-all cursor-pointer shrink-0 shadow-sm"
            >
              Open Firebase Auth
            </button>
          </div>

          {/* ================= STEP 1: Name and Phone Input ================= */}
          {step === 'input' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              
              {/* Quick Fill Button for testing */}
              <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-2xl">
                <div className="flex items-center gap-2 text-xs text-amber-300 font-medium">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Instant Demo Customer?</span>
                </div>
                <button
                  type="button"
                  onClick={handleQuickDemoFill}
                  className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition-colors shadow-sm"
                >
                  Fill Sample Details
                </button>
              </div>

              {/* Name Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Aapka Poora Naam (Full Name) *</span>
                  <span className="text-[10px] text-slate-500">As on Aadhaar / Govt ID</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Phone Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Mobile Number (10 Digits) *</span>
                  <span className="text-[10px] text-amber-400">OTP will be sent here</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 text-sm font-semibold shrink-0">
                    <span className="text-base leading-none">🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="98765 43210"
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl pl-3 pr-4 py-3 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 tracking-wider transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Optional Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                  <span>Email Address (Optional)</span>
                  <span className="text-[10px] text-slate-500">For booking invoices</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul.sharma@example.com"
                  className="w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all"
                />
              </div>

              {/* Aadhaar Hint Banner */}
              <div className="p-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-2xl flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-300">
                  <span className="font-bold text-emerald-400">Aadhaar Profile Verification:</span>{' '}
                  Login ke baad aap apna Aadhaar card verify karke <span className="text-amber-400 font-bold">₹200 Wallet Reward</span> aur Government Verified Customer Badge paa sakte hain.
                </div>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium text-center">
                  {errorMsg}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all cursor-pointer"
              >
                <span>Get OTP & Proceed</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[10px] text-slate-500">
                By logging in, you agree to Quick Service Terms of Use & Privacy Policy.
              </div>
            </form>
          )}

          {/* ================= STEP 2: OTP Verification ================= */}
          {step === 'otp' && (
            <div className="space-y-4">
              
              {/* Official SMS & WhatsApp Gateway Banner */}
              {showSimulatedSms && (
                <div className="p-3.5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-emerald-500/50 rounded-2xl space-y-2.5 animate-in slide-in-from-top-2 shadow-xl ring-1 ring-emerald-500/20">
                  <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-700">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-extrabold tracking-wide">
                      <Smartphone className="w-3.5 h-3.5" />
                      OFFICIAL SMS DELIVERY · VK-QKSERV
                    </span>
                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      Delivered SIM 1
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 font-mono bg-slate-950/80 p-2.5 rounded-xl border border-slate-700 leading-relaxed">
                    Dear Customer, <strong className="text-amber-400 font-bold bg-amber-500/20 px-1 py-0.5 rounded border border-amber-500/30">{generatedOtp}</strong> is your QuickService verification code. Sent to +91 {phone}. Valid for 10 mins.
                  </p>

                  {/* Real Mobile Delivery Options */}
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    {/* Send to real WhatsApp */}
                    <a
                      href={`https://api.whatsapp.com/send?phone=91${phone.replace(/\D/g, '')}&text=${encodeURIComponent(`Dear Customer, your QuickService verification code is *${generatedOtp}*. Valid for 10 minutes. Do not share.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1.5 px-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 text-emerald-300 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      title="Receive real verification OTP code on WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp OTP</span>
                    </a>

                    {/* Open in real Phone SMS app */}
                    <a
                      href={`sms:+91${phone.replace(/\D/g, '')}?body=${encodeURIComponent(`Your QuickService verification code is ${generatedOtp}`)}`}
                      className="py-1.5 px-2 rounded-xl bg-sky-600/30 hover:bg-sky-600/50 border border-sky-500/50 text-sky-300 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      title="Open native SMS messaging app with OTP"
                    >
                      <Share2 className="w-3.5 h-3.5 text-sky-400" />
                      <span>Phone SMS App</span>
                    </a>
                  </div>

                  {/* 1-Tap Auto-fill Button */}
                  <button
                    type="button"
                    onClick={handleAutofillOtp}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                    <span>⚡ 1-Tap Auto-fill Code ({generatedOtp})</span>
                  </button>
                </div>
              )}

              <div className="text-center space-y-1">
                <p className="text-xs text-slate-300">
                  Enter 6-digit verification code sent to <span className="font-bold text-white font-mono">+91 {phone}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="text-[11px] text-amber-400 underline hover:text-amber-300 cursor-pointer"
                >
                  Change Phone number
                </button>
              </div>

              {/* 6 Digit Boxes */}
              <div className="flex justify-center gap-1.5 sm:gap-2">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <input
                    key={idx}
                    id={`customer-otp-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={enteredOtp[idx]}
                    onChange={(e) => handleOtpBoxChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-10 sm:w-12 h-12 sm:h-14 text-center text-lg sm:text-xl font-bold font-mono bg-slate-800 border-2 border-slate-700 rounded-xl sm:rounded-2xl text-white focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all shadow-inner"
                  />
                ))}
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium text-center">
                  {errorMsg}
                </div>
              )}

              {/* Verify OTP Button */}
              <button
                type="button"
                onClick={() => handleVerifyOtp()}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Complete Login</span>
              </button>

              {/* Resend and Timer */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Didn&apos;t receive code?</span>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="flex items-center gap-1 text-amber-400 font-bold hover:underline"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Resend OTP</span>
                  </button>
                ) : (
                  <span className="font-mono text-slate-500">
                    Resend in {timer}s
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ================= STEP 3: Success Screen ================= */}
          {step === 'success' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">
                  Namaste, {fullName}!
                </h3>
                <p className="text-xs text-slate-300">
                  Aapka Quick Service account successfully login ho gaya hai.
                </p>
                <div className="inline-block mt-1 font-mono text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Mobile: +91 {phone}
                </div>
              </div>

              {/* Aadhaar Verification Callout */}
              <div className="p-4 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-slate-900 border border-amber-500/30 rounded-3xl text-left space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Complete Profile with Aadhaar KYC</h4>
                    <span className="text-[10px] text-amber-300 font-semibold">Earn ₹200 Free Wallet Credit</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Apne profile ko 100% verified banane ke liye 12-digit Aadhaar verify karein. Verified customers ko milti hai <strong className="text-white">priority dispatch aur instant worker acceptance</strong>.
                </p>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onOpenAadhaarVerification) {
                        onOpenAadhaarVerification();
                      }
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verify Aadhaar Now (+₹200)</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
                  >
                    Later
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
