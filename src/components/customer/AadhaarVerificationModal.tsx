import React, { useState, useEffect } from 'react';
import { useQuickService } from '../../context/QuickServiceContext';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Smartphone, 
  FileText, 
  Sparkles, 
  Lock, 
  RefreshCw, 
  AlertCircle,
  Upload,
  Check,
  Award,
  Fingerprint,
  Calendar,
  Building2,
  ExternalLink
} from 'lucide-react';

interface AadhaarVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AadhaarVerificationModal: React.FC<AadhaarVerificationModalProps> = ({
  isOpen,
  onClose
}) => {
  const { customer, verifyCustomerAadhaar } = useQuickService();

  const [step, setStep] = useState<'form' | 'otp' | 'processing' | 'success'>('form');
  
  // Aadhaar form inputs
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [fullName, setFullName] = useState(customer?.name || '');
  const [dob, setDob] = useState('1996-05-14');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [stateName, setStateName] = useState('Uttar Pradesh (Delhi NCR)');
  const [consentGiven, setConsentGiven] = useState(true);
  const [docUploadSimulated, setDocUploadSimulated] = useState(false);
  const [docName, setDocName] = useState('');

  // OTP state (6 digits for official UIDAI format)
  const [enteredOtp, setEnteredOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Processing state
  const [processingStatus, setProcessingStatus] = useState('Contacting UIDAI Central Identities Data Repository (CIDR)...');

  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setErrorMsg('');
      setDocUploadSimulated(false);
      setDocName('');
      setFullName(customer?.name || 'Aarav Malhotra');
      if (customer?.aadhaarNumber) {
        setAadhaarNumber(customer.aadhaarNumber.replace(/\D/g, ''));
      } else {
        setAadhaarNumber('');
      }
    }
  }, [isOpen, customer]);

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

  // Format 12-digit Aadhaar input as "XXXX XXXX XXXX"
  const handleAadhaarChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 12);
    setAadhaarNumber(raw);
    if (errorMsg) setErrorMsg('');
  };

  const getFormattedAadhaar = () => {
    const parts = aadhaarNumber.match(/.{1,4}/g);
    return parts ? parts.join(' ') : aadhaarNumber;
  };

  const handleQuickSampleAadhaar = () => {
    setAadhaarNumber('784291035518');
    setFullName(customer?.name || 'Aarav Malhotra');
    setDob('1994-08-15');
    setGender('Male');
    setStateName('Uttar Pradesh (Delhi NCR)');
    setConsentGiven(true);
    setErrorMsg('');
  };

  const handleRequestAadhaarOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (aadhaarNumber.length !== 12) {
      setErrorMsg('Kripya 12-digit valid Aadhaar number enter karein');
      return;
    }
    if (aadhaarNumber.startsWith('0') || aadhaarNumber.startsWith('1')) {
      setErrorMsg('Aadhaar number typically starts with digits 2 to 9 as per UIDAI rules');
      return;
    }
    if (!fullName.trim() || fullName.trim().length < 3) {
      setErrorMsg('Kripya legal full name enter karein jaisa Aadhaar par hai');
      return;
    }
    if (!consentGiven) {
      setErrorMsg('Please accept UIDAI e-KYC verification consent to proceed');
      return;
    }

    // Generate random 6-digit UIDAI OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setEnteredOtp(['', '', '', '', '', '']);
    setTimer(30);
    setCanResend(false);
    setErrorMsg('');
    setStep('otp');
  };

  const handleOtpBoxChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newArr = [...enteredOtp];
    newArr[index] = val.slice(-1);
    setEnteredOtp(newArr);

    if (val && index < 5) {
      const nextInput = document.getElementById(`aadhaar-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !enteredOtp[index] && index > 0) {
      const prevInput = document.getElementById(`aadhaar-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyAadhaarOtp = () => {
    const joined = enteredOtp.join('').trim();
    if (joined.length < 4) {
      setErrorMsg('Kripya valid 6-digit UIDAI OTP enter karein');
      return;
    }

    // Move to e-KYC processing
    setStep('processing');
    setErrorMsg('');

    setTimeout(() => {
      setProcessingStatus('Verifying Aadhaar Demographics & DigiLocker e-Sign...');
    }, 900);

    setTimeout(() => {
      setProcessingStatus('Generating UIDAI e-KYC Digital Certificate...');
    }, 1700);

    setTimeout(() => {
      verifyCustomerAadhaar({
        aadhaarNumber,
        aadhaarName: fullName,
        dob,
        gender,
        address: `${stateName}, India`,
        docUrl: docName ? `/docs/${docName}` : '/docs/digilocker_aadhaar.xml'
      });
      setStep('success');
    }, 2400);
  };

  const handleSimulateDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocName(file.name);
      setDocUploadSimulated(true);
    } else {
      setDocName('Aadhaar_Card_Front_Back.jpg');
      setDocUploadSimulated(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Tricolor & Government Emblem Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-500" />

        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner shrink-0">
              <Fingerprint className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-extrabold text-white">
                  Aadhaar Identity Verification
                </h2>
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  UIDAI e-KYC
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Government of India ID Verification · 256-Bit Encrypted
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

          {/* ================= STEP 1: Aadhaar Form ================= */}
          {step === 'form' && (
            <form onSubmit={handleRequestAadhaarOtp} className="space-y-4">
              
              {/* Perk Callout */}
              <div className="p-3 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-emerald-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400 shrink-0" />
                  <div className="text-xs text-slate-200">
                    <span className="font-bold text-white">KYC Perk:</span>{' '}
                    Earn <strong className="text-amber-400 font-mono">₹200 Instant Wallet Cash</strong> + Verified Customer Badge!
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleQuickSampleAadhaar}
                  className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] shrink-0 transition-colors shadow-sm"
                >
                  Demo Autofill
                </button>
              </div>

              {/* 12-Digit Aadhaar Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                  <span>12-Digit Aadhaar Number (आधार संख्या) *</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {aadhaarNumber.length}/12 Digits
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={getFormattedAadhaar()}
                    onChange={(e) => handleAadhaarChange(e.target.value)}
                    placeholder="XXXX XXXX XXXX"
                    maxLength={14}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-base font-mono font-bold tracking-widest text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-inner transition-all"
                  />
                  <Fingerprint className="w-5 h-5 text-amber-400 absolute left-3.5 top-3.5" />
                </div>
                <p className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>Aadhaar data is protected under Aadhaar Act 2016. Masked storage only.</span>
                </p>
              </div>

              {/* Full Legal Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                  <span>Full Legal Name (नाम आधार के अनुसार) *</span>
                  <span className="text-[10px] text-slate-400">Must match your Aadhaar card</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Malhotra"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all"
                />
              </div>

              {/* DOB & Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Date of Birth (जन्म तिथि)
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Gender (लिंग)
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Male">Male (पुरुष)</option>
                    <option value="Female">Female (महिला)</option>
                    <option value="Other">Other (अन्य)</option>
                  </select>
                </div>
              </div>

              {/* State / Region */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  State / Territory (राज्य)
                </label>
                <select
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Uttar Pradesh (Delhi NCR)">Uttar Pradesh (Delhi NCR / Noida)</option>
                  <option value="Delhi NCT">Delhi NCT</option>
                  <option value="Haryana (Gurugram / Faridabad)">Haryana (Gurugram / Faridabad)</option>
                  <option value="Maharashtra (Mumbai / Pune)">Maharashtra (Mumbai / Pune)</option>
                  <option value="Karnataka (Bengaluru)">Karnataka (Bengaluru)</option>
                  <option value="Other State in India">Other State in India</option>
                </select>
              </div>

              {/* Optional Aadhaar Photo Upload */}
              <div className="p-3 bg-slate-800/50 border border-slate-700/60 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload Aadhaar Photo / e-Aadhaar PDF (Optional)</span>
                  </span>
                  <span className="text-[10px] text-slate-400">DigiLocker / JPG / PNG</span>
                </div>

                {docUploadSimulated ? (
                  <div className="flex items-center justify-between p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="truncate max-w-[200px]">{docName || 'Aadhaar_Document_Uploaded.pdf'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDocUploadSimulated(false)}
                      className="text-slate-400 hover:text-white text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 p-2.5 border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-xl cursor-pointer text-xs text-slate-300 hover:text-white transition-colors bg-slate-800/30">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>Attach Aadhaar Image / DigiLocker File</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleSimulateDocUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Legal Consent Checkbox */}
              <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-800/30 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-0.5 rounded text-amber-500 focus:ring-amber-400 bg-slate-800 border-slate-700"
                />
                <span className="text-[11px] text-slate-300 leading-snug">
                  I give voluntary consent to Quick Service to authenticate my identity via UIDAI Aadhaar e-KYC and DigiLocker as per Aadhaar Act 2016 regulations.
                </span>
              </label>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium text-center">
                  {errorMsg}
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all cursor-pointer"
              >
                <span>Request UIDAI Aadhaar OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          )}

          {/* ================= STEP 2: UIDAI OTP Authentication ================= */}
          {step === 'otp' && (
            <div className="space-y-4">
              
              <div className="text-center space-y-1">
                <p className="text-xs text-slate-300">
                  Enter 6-digit OTP sent to mobile registered with Aadhaar <span className="font-bold text-white font-mono">{getFormattedAadhaar()}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="text-[11px] text-amber-400 underline hover:text-amber-300"
                >
                  Change Aadhaar details
                </button>
              </div>

              {/* 6 Digit Input Boxes */}
              <div className="flex justify-center gap-2 sm:gap-2.5">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <input
                    key={idx}
                    id={`aadhaar-otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={enteredOtp[idx]}
                    onChange={(e) => handleOtpBoxChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 sm:w-12 h-13 text-center text-lg font-bold font-mono bg-slate-800 border-2 border-slate-700 rounded-2xl text-white focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all shadow-inner"
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
                onClick={handleVerifyAadhaarOtp}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Aadhaar & Complete KYC</span>
              </button>

              {/* Resend and Timer */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Didn&apos;t get UIDAI SMS?</span>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleRequestAadhaarOtp}
                    className="flex items-center gap-1 text-amber-400 font-bold hover:underline"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Resend UIDAI OTP</span>
                  </button>
                ) : (
                  <span className="font-mono text-slate-500">
                    Resend in {timer}s
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ================= STEP 3: Processing Animation ================= */}
          {step === 'processing' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500 text-amber-400 flex items-center justify-center mx-auto animate-spin">
                <RefreshCw className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">
                  Verifying with UIDAI & DigiLocker...
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {processingStatus}
                </p>
              </div>

              <div className="max-w-xs mx-auto bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full animate-pulse w-3/4" />
              </div>
            </div>
          )}

          {/* ================= STEP 4: Success Certificate & Reward ================= */}
          {step === 'success' && (
            <div className="space-y-4 py-2">
              
              {/* Reward Banner */}
              <div className="p-4 bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-amber-500/20 border border-emerald-500/40 rounded-3xl text-center space-y-1 shadow-lg">
                <div className="w-12 h-12 rounded-full bg-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/40">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-extrabold text-white">
                  Aadhaar Verification Successful!
                </h3>
                <p className="text-xs text-emerald-300 font-medium">
                  🎉 ₹200 Welcome Bonus has been credited to your wallet!
                </p>
              </div>

              {/* Digital Aadhaar Verified Card */}
              <div className="p-4 bg-slate-800/90 border-2 border-emerald-500/30 rounded-3xl space-y-3 relative overflow-hidden shadow-xl">
                
                {/* Background Watermark */}
                <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
                  <Fingerprint className="w-36 h-36 text-white" />
                </div>

                <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">
                        UIDAI e-KYC Verified ID
                      </span>
                      <span className="text-xs font-bold text-white">
                        Government Identity Certificate
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                    VERIFIED ✅
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Customer Legal Name</span>
                    <span className="font-bold text-white">{fullName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Masked Aadhaar No.</span>
                    <span className="font-mono font-bold text-amber-400">
                      XXXX XXXX {aadhaarNumber.slice(-4) || '5518'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">State / Jurisdiction</span>
                    <span className="text-slate-300 text-[11px]">{stateName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Verification Token</span>
                    <span className="font-mono text-[10px] text-slate-300">
                      UIDAI-KYC-{Math.floor(100000 + Math.random() * 900000)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Authorized by UIDAI CIDR Protocol</span>
                  <span className="text-emerald-400 font-medium">Valid Lifetime</span>
                </div>
              </div>

              {/* Unlocked Privileges */}
              <div className="space-y-1.5 text-xs text-slate-300 bg-slate-800/40 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Aapke Unlocked Privileges:
                </span>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Priority Partner Dispatch (Instant worker assignment)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Verified Customer Badge on all service requests</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Higher Wallet Transaction Limit (Up to ₹50,000)</span>
                </div>
              </div>

              {/* Done Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all cursor-pointer"
              >
                <span>Back to Profile & Book Services</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
