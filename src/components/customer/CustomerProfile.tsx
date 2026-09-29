import React, { useState, useEffect } from 'react';
import { useQuickService } from '../../context/QuickServiceContext';
import { 
  Wallet, 
  MapPin, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Plus, 
  ChevronRight, 
  Check, 
  HelpCircle,
  Lock,
  Headphones,
  Fingerprint,
  Award,
  Sparkles,
  LogOut,
  UserCheck,
  LogIn,
  Edit2,
  FileCheck2,
  AlertCircle,
  ExternalLink,
  ShieldAlert,
  MessageSquare,
  KeyRound,
  RotateCcw,
  Navigation,
  Trash2,
  Flame,
  Download,
  Smartphone
} from 'lucide-react';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

export const CustomerProfile: React.FC = () => {
  const { 
    customer, 
    addWalletMoney, 
    setViewMode, 
    loginCustomer,
    logoutCustomer, 
    setIsLoginModalOpen, 
    setIsAadhaarModalOpen,
    setIsAddressModalOpen,
    setEditingAddress,
    setDefaultAddress,
    deleteCustomerAddress,
    triggerGlobalSms,
    sendMockSmsOtp,
    verifyMockSmsOtp,
    updateCustomerProfile,
    openPhoneAuth,
    openMobileLogin
  } = useQuickService();

  const [showAddMoney, setShowAddMoney] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(500);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(customer.name);
  const [editEmail, setEditEmail] = useState(customer.email || '');

  // Inline Phone & OTP Login State
  const [showInlineLogin, setShowInlineLogin] = useState<boolean>(!customer.isLoggedIn && !customer.phone);
  const [loginPhone, setLoginPhone] = useState(customer.phone ? customer.phone.replace('+91', '').trim() : '9820154321');
  const [loginName, setLoginName] = useState(customer.name === 'Guest Customer' ? 'Aarav Malhotra' : customer.name);
  const [loginStep, setLoginStep] = useState<'phone' | 'otp'>('phone');
  const [loginOtp, setLoginOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('492815');
  const [otpTimer, setOtpTimer] = useState(30);
  const [showSmsBanner, setShowSmsBanner] = useState(false);
  const [authError, setAuthError] = useState('');

  // Listen to Global SMS Banner's "⚡ Auto-fill OTP" button
  useEffect(() => {
    const handleAutofillEvent = (e: any) => {
      if (e.detail?.otp && showInlineLogin && loginStep === 'otp') {
        setLoginOtp(e.detail.otp);
        setAuthError('');
      }
    };
    window.addEventListener('quick_service_autofill_otp', handleAutofillEvent);
    return () => window.removeEventListener('quick_service_autofill_otp', handleAutofillEvent);
  }, [showInlineLogin, loginStep]);

  // OTP Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loginStep === 'otp' && otpTimer > 0) {
      timer = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [loginStep, otpTimer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDigits = loginPhone.replace(/\D/g, '').slice(-10);
    if (cleanDigits.length < 10) {
      setAuthError('Kripya valid 10-digit mobile number enter karein');
      return;
    }
    const res = await sendMockSmsOtp(cleanDigits, 'customer', 'VK-QKSERV');
    setGeneratedOtp(res.otp);
    setAuthError('');
    setLoginStep('otp');
    setOtpTimer(30);
    setShowSmsBanner(true);
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanOtp = loginOtp.trim();
    const verifyResult = verifyMockSmsOtp(loginPhone, cleanOtp, 'customer');
    if (!verifyResult.success && cleanOtp !== generatedOtp && cleanOtp !== '123456' && cleanOtp !== '000000') {
      setAuthError(`Galat OTP! Kripya ${generatedOtp} ya 123456 enter karein`);
      return;
    }
    setAuthError('');
    loginCustomer(loginName.trim() || 'Aarav Malhotra', loginPhone);
    setShowInlineLogin(false);
    setShowSmsBanner(false);
    setLoginStep('phone');
    setSuccessMsg('Mobile Number verified & logged in successfully! 🎉');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleTopUp = () => {
    addWalletMoney(topUpAmount);
    setSuccessMsg(`Added ₹${topUpAmount} to your wallet!`);
    setTimeout(() => {
      setSuccessMsg('');
      setShowAddMoney(false);
    }, 1200);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerProfile({
      name: editName.trim() || customer.name,
      email: editEmail.trim() || customer.email
    });
    setIsEditing(false);
    setSuccessMsg('Profile updated successfully!');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 pb-24">
      
      {/* ========================================================================= */}
      {/* 1. CUSTOMER ACCOUNT & AUTH CARD */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-sm">
        
        {/* Inline Phone & OTP Login Flow */}
        {(showInlineLogin || (!customer.isLoggedIn && !customer.phone)) ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {loginStep === 'phone' ? 'Phone Number Login' : 'Enter 6-Digit OTP'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {loginStep === 'phone' 
                      ? 'Apna mobile number daalein aur OTP se login karein' 
                      : `6-digit verification code sent to +91 ${loginPhone}`}
                  </p>
                </div>
              </div>
              {customer.isLoggedIn && (
                <button
                  onClick={() => setShowInlineLogin(false)}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-800"
                >
                  Cancel
                </button>
              )}
            </div>

            {/* Simulated SMS Alert Banner */}
            {showSmsBanner && (
              <div className="p-3 bg-amber-500/15 border border-amber-500/40 rounded-2xl space-y-1.5 animate-in slide-in-from-top-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    <span>SMS Notification · QuickService</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Just now</span>
                </div>
                <p className="text-xs text-white">
                  Your QuickService login OTP is <span className="font-mono font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded">{generatedOtp}</span>. Valid for 10 minutes.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setLoginOtp(generatedOtp);
                    setAuthError('');
                  }}
                  className="text-[11px] font-bold text-amber-300 bg-amber-500/25 hover:bg-amber-500/40 px-2.5 py-1 rounded-lg border border-amber-500/40 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                >
                  <span>⚡ Auto-fill OTP ({generatedOtp})</span>
                </button>
              </div>
            )}

            {/* Step 1: Phone & Name Input */}
            {loginStep === 'phone' ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Mobile Number (10 Digits) *
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={loginPhone}
                      onChange={e => {
                        setLoginPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                        setAuthError('');
                      }}
                      placeholder="98201 54321"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-14 pr-3 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    value={loginName}
                    onChange={e => setLoginName(e.target.value)}
                    placeholder="e.g. Aarav Malhotra"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                {authError && (
                  <p className="text-xs text-rose-400 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{authError}</span>
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Send OTP / OTP Bhejo</span>
                </button>
              </form>
            ) : (
              /* Step 2: OTP Entry */
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-300 font-semibold">Enter 6-Digit OTP Code</span>
                    <button
                      type="button"
                      onClick={() => setLoginStep('phone')}
                      className="text-amber-400 hover:underline text-[11px] cursor-pointer"
                    >
                      Change Number
                    </button>
                  </div>

                  <input
                    type="text"
                    inputMode="numeric"
                    value={loginOtp}
                    onChange={e => {
                      setLoginOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                      setAuthError('');
                    }}
                    placeholder="Enter 6-digit OTP (e.g. 492815)"
                    maxLength={6}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-center text-lg font-mono tracking-widest text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                    autoFocus
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Resend in: <strong className="font-mono text-amber-400">{otpTimer}s</strong></span>
                  <button
                    type="button"
                    disabled={otpTimer > 0}
                    onClick={async () => {
                      const res = await sendMockSmsOtp(loginPhone, 'customer', 'VK-QKSERV');
                      setGeneratedOtp(res.otp);
                      setOtpTimer(30);
                      setShowSmsBanner(true);
                    }}
                    className={`flex items-center gap-1 ${
                      otpTimer > 0 ? 'text-slate-600 cursor-not-allowed' : 'text-amber-400 hover:underline cursor-pointer'
                    }`}
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Resend OTP</span>
                  </button>
                </div>

                {authError && (
                  <p className="text-xs text-rose-400 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{authError}</span>
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Verify OTP & Login (OTP Verify Karein)</span>
                </button>
              </form>
            )}
          </div>
        ) : (
          /* Profile Details when Logged In */
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 overflow-hidden border-2 border-amber-500/40 shadow-md">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(customer.name)}&backgroundColor=b6e3f4`} 
                      alt={customer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {customer.isAadhaarVerified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center ring-2 ring-slate-900 shadow">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {customer.name}
                    </h3>
                    {customer.isAadhaarVerified ? (
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>Aadhaar Verified</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                        <Check className="w-3 h-3 text-amber-400" />
                        <span>Phone OTP Verified</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{customer.phone || '+91 98201 54321'}</span>
                  </div>

                  {customer.email && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5 truncate max-w-[200px]">
                      <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                  )}

                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Member since {customer.memberSince || 'March 2025'}
                  </div>
                </div>
              </div>

              {/* Edit button */}
              <button
                onClick={() => {
                  setEditName(customer.name);
                  setEditEmail(customer.email || '');
                  setIsEditing(!isEditing);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700/60"
                title="Edit Profile"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Actions: Switch Login or Logout */}
            <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-800 text-xs">
              <button
                onClick={() => {
                  setShowInlineLogin(true);
                  setLoginStep('phone');
                }}
                className="flex-1 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-[11px] flex items-center justify-center gap-1.5 transition-colors border border-slate-700/50"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span>Login with Phone & OTP</span>
              </button>

              <button
                onClick={logoutCustomer}
                className="py-1.5 px-3 rounded-xl bg-slate-800/40 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 font-medium text-[11px] flex items-center justify-center gap-1 transition-colors border border-slate-800 hover:border-rose-500/20"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}

        {/* Edit Profile Drawer */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="pt-3 border-t border-slate-800 space-y-3 animate-in fade-in">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Edit Profile Details
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Full Name</label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Email Address</label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="py-2 px-3 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {successMsg && (
          <div className="p-2 text-center text-xs font-bold text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            {successMsg}
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 2. AADHAAR VERIFICATION SECTION (Profile KYC - Main User Request) */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-3 shadow-md">
        
        {/* Decorative Top Accent */}
        <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 absolute top-0 left-0 right-0" />

        {/* CASE A: AADHAAR ALREADY VERIFIED */}
        {customer.isAadhaarVerified ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Government Aadhaar KYC
                    </h4>
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded border border-emerald-500/30">
                      VERIFIED ✅
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    UIDAI e-KYC Identity Authenticated
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsAadhaarModalOpen(true)}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold"
              >
                Update / Re-verify
              </button>
            </div>

            {/* Verified Digital Certificate Card */}
            <div className="p-3.5 bg-slate-800/80 border border-emerald-500/30 rounded-2xl space-y-2.5">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Name on Aadhaar</span>
                  <span className="font-bold text-white text-xs">{customer.aadhaarName || customer.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Masked Aadhaar</span>
                  <span className="font-mono font-bold text-amber-400 text-xs">
                    {customer.aadhaarNumber || 'XXXX XXXX 5518'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Verified On</span>
                  <span className="text-slate-300 text-[11px]">
                    {customer.aadhaarVerifiedAt || 'Today, UIDAI CIDR'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Status</span>
                  <span className="text-emerald-400 font-medium text-[11px] flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>DigiLocker Certified</span>
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Award className="w-3 h-3" />
                  <span>₹200 Welcome Bonus Credited</span>
                </span>
                <span>Priority Dispatch Active</span>
              </div>
            </div>
          </div>
        ) : (
          /* CASE B: AADHAAR NOT VERIFIED YET (Call to action) */
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Verify Profile with Aadhaar
                    </h4>
                    <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      +₹200 Reward
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                    Apna profile 100% verified banayein aur seedhe paayein <strong className="text-amber-400">₹200 Free Wallet Credit</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Perks grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div className="p-2 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>₹200 Wallet Cash instantly</span>
              </div>
              <div className="p-2 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Priority Partner Dispatch</span>
              </div>
              <div className="p-2 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Verified Customer Badge</span>
              </div>
              <div className="p-2 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>100% Secure UIDAI e-KYC</span>
              </div>
            </div>

            {/* Verification Button */}
            <button
              onClick={() => setIsAadhaarModalOpen(true)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all cursor-pointer"
            >
              <Fingerprint className="w-4 h-4" />
              <span>Verify Aadhaar ID Now (+₹200 Bonus)</span>
            </button>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 3. WALLET CARD */}
      {/* ========================================================================= */}
      <div className="p-4 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/30 rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-300 block">Quick Service Wallet</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold font-mono text-white">₹{customer.walletBalance}</span>
                {customer.isAadhaarVerified && (
                  <span className="text-[10px] text-emerald-400 font-mono font-medium">(Includes ₹200 KYC Bonus)</span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowAddMoney(!showAddMoney)}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Money</span>
          </button>
        </div>

        {/* Top Up Drawer */}
        {showAddMoney && (
          <div className="pt-3 border-t border-amber-500/20 space-y-2 animate-in fade-in">
            <div className="text-[11px] text-slate-300">Select Top-Up Amount:</div>
            <div className="grid grid-cols-3 gap-2">
              {[200, 500, 1000].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTopUpAmount(amt)}
                  className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                    topUpAmount === amt
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <button
              onClick={handleTopUp}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs mt-1 hover:bg-amber-400 transition-colors shadow-sm"
            >
              Confirm Add ₹{topUpAmount}
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3.5. APP INSTALLATION & PWA HOME SCREEN SETUP */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-amber-500/40 rounded-3xl space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  App Installation &amp; Offline Ready
                </h4>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 font-mono font-bold px-1.5 py-0.2 rounded border border-amber-500/30">
                  PWA
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Install Quick Service directly on Android, iPhone, or Desktop without app stores.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <PWAInstallButton variant="primary" className="flex-1" />
          <button
            onClick={() => openMobileLogin('customer')}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-amber-500/40 text-amber-300 font-bold text-xs transition-colors cursor-pointer"
          >
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Firebase Phone OTP</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. SAVED ADDRESSES (Address Edit & GPS Auto-Detection - User Requirement) */}
      {/* ========================================================================= */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Saved Addresses ({customer.savedAddresses.length})</span>
            </h4>
            <span className="text-[10px] text-slate-400">GPS location se pata edit ya add karein</span>
          </div>
          
          <button 
            onClick={() => {
              setEditingAddress(null);
              setIsAddressModalOpen(true);
            }}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> 
            <span>+ Add Address</span>
          </button>
        </div>

        {/* GPS Quick Action Bar */}
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
            <div className="text-[11px] text-slate-300">
              <span className="font-bold text-white">Live GPS Location:</span>{' '}
              <span>Kaha rehte hain? GPS se auto-detect karein</span>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingAddress(null);
              setIsAddressModalOpen(true);
            }}
            className="px-2.5 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] shrink-0 transition-colors shadow-sm cursor-pointer"
          >
            Detect GPS
          </button>
        </div>

        <div className="space-y-2.5">
          {customer.savedAddresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-3.5 bg-slate-800/70 rounded-2xl border transition-all ${
                addr.isDefault 
                  ? 'border-amber-500/40 bg-slate-800/90 shadow-sm shadow-amber-500/5' 
                  : 'border-slate-700/60 hover:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white">{addr.label}</span>
                      {addr.isDefault ? (
                        <span className="text-[9px] text-emerald-400 bg-emerald-500/15 px-2 py-0.2 rounded-full font-mono font-bold border border-emerald-500/30">
                          DEFAULT ADDRESS
                        </span>
                      ) : (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="text-[10px] text-slate-400 hover:text-amber-300 font-medium underline cursor-pointer"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-snug break-words">
                      {addr.address}
                    </p>
                    {addr.coords && (
                      <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                        📍 GPS Pin: {addr.coords[0].toFixed(4)}, {addr.coords[1].toFixed(4)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      setEditingAddress(addr);
                      setIsAddressModalOpen(true);
                    }}
                    className="p-1.5 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-600/50 flex items-center gap-1 text-[11px] font-semibold px-2"
                    title="Edit this address"
                  >
                    <Edit2 className="w-3 h-3 text-amber-400" />
                    <span>Edit</span>
                  </button>

                  {customer.savedAddresses.length > 1 && (
                    <button
                      onClick={() => deleteCustomerAddress(addr.id)}
                      className="p-1.5 rounded-xl bg-slate-700/40 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer border border-slate-700/50"
                      title="Delete this address"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. TRUST & SAFETY SECTION */}
      {/* ========================================================================= */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-2.5">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Safety & Support
        </h4>

        <div className="space-y-1 text-xs">
          <div className="p-2.5 bg-slate-800/40 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Masked Phone Relay Privacy</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">Active</span>
          </div>

          <div className="p-2.5 bg-slate-800/40 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-200">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>4-Digit Service Start OTP</span>
            </div>
            <span className="text-[10px] text-slate-400">Enabled</span>
          </div>

          <div className="p-2.5 bg-slate-800/40 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-200">
              <Headphones className="w-4 h-4 text-sky-400" />
              <span>24/7 Safety & Dispatch Desk</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. PROFESSIONAL NETWORK (Worker & Staff Links) */}
      {/* ========================================================================= */}
      <div className="p-4 bg-slate-900/50 border border-slate-800/80 rounded-3xl space-y-2 text-xs">
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Professional Network
        </h4>

        <div className="space-y-1.5">
          <button
            onClick={() => setViewMode('partner')}
            className="w-full p-2.5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 rounded-xl flex items-center justify-between transition-colors text-left"
          >
            <div className="flex items-center gap-2.5 text-amber-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Become a Partner / Partner Login</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          <button
            onClick={() => setViewMode('admin')}
            className="w-full p-2.5 bg-slate-800/30 hover:bg-slate-800/60 border border-slate-800 rounded-xl flex items-center justify-between transition-colors text-left text-slate-400 hover:text-slate-300"
          >
            <div className="flex items-center gap-2.5 text-slate-400">
              <Lock className="w-3.5 h-3.5" />
              <span className="text-[11px]">Operations & Staff Portal</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          </button>
        </div>
      </div>

    </div>
  );
};
