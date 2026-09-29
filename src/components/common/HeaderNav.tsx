import React, { useState, useRef, useEffect } from 'react';
import { useQuickService } from '../../context/QuickServiceContext';
import { 
  Smartphone, 
  HardHat, 
  ShieldCheck, 
  Layers, 
  Maximize2, 
  Minimize2, 
  AlertTriangle,
  Radio,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  Lock,
  ExternalLink,
  MapPin,
  Clock,
  Download,
  Fingerprint,
  UserCheck,
  Flame,
  Share2,
  MoreVertical,
  X,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { ShareLiveModal } from './ShareLiveModal';

export const HeaderNav: React.FC = () => {
  const { 
    viewMode, 
    setViewMode, 
    deviceFrame, 
    setDeviceFrame, 
    emergencyAlerts,
    activeBooking,
    activePartner,
    customer,
    setIsLoginModalOpen,
    setIsAadhaarModalOpen,
    setIsAddressModalOpen,
    setEditingAddress,
    availableOpenJobs,
    openPhoneAuth,
  } = useQuickService();

  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareModalTab, setShareModalTab] = useState<'customer' | 'partner'>('customer');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const activeSosCount = emergencyAlerts.filter(a => a.status === 'active').length;

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const handleAdminAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin.trim() === '1234' || adminPin.trim() === '') {
      setStaffModalOpen(false);
      setAdminPin('');
      setPinError('');
      setViewMode('admin');
    } else {
      setPinError('Incorrect PIN. (Default: 1234 or leave blank for demo)');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 select-none">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-4 md:px-6 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-3">
          
          {/* ========================================================================= */}
          {/* 1. CUSTOMER VIEW HEADER (Mobile-optimized, Clean & Professional) */}
          {/* ========================================================================= */}
          {viewMode === 'customer' && (
            <>
              {/* Left Wing: Brand Logo, Title & Location Selector */}
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 shrink">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
                  <Radio className="w-4 h-4 text-white animate-pulse" />
                </div>

                <div className="min-w-0 flex flex-col justify-center">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs sm:text-sm md:text-base tracking-tight text-white whitespace-nowrap">
                      Quick Service
                    </span>
                    <span className="text-[9px] font-mono font-bold tracking-wider text-emerald-400 bg-emerald-500/15 px-1.5 py-0.2 rounded border border-emerald-500/30 flex items-center gap-1 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>LIVE</span>
                    </span>
                  </div>

                  {/* Location Selector Button */}
                  <button
                    onClick={() => {
                      setEditingAddress(customer.savedAddresses.find(a => a.isDefault) || customer.savedAddresses[0] || null);
                      setIsAddressModalOpen(true);
                    }}
                    className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] text-slate-400 hover:text-amber-300 transition-colors cursor-pointer text-left truncate"
                    title="Click to edit address or use GPS"
                  >
                    <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 shrink-0" />
                    <span className="truncate max-w-[85px] xs:max-w-[120px] sm:max-w-[180px] md:max-w-[240px]">
                      {customer.savedAddresses.find(a => a.isDefault)?.address.split(',')[0] || 'Sector 62, Noida'}
                    </span>
                    <span className="text-[9px] text-amber-400 underline font-semibold shrink-0">Edit</span>
                  </button>
                </div>
              </div>

              {/* Active Booking status pill (Visible on large screens) */}
              {activeBooking && (
                <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs shrink-0">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="font-semibold truncate max-w-[220px]">
                    Order #{activeBooking.id}: {activeBooking.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              )}

              {/* Right Wing: Clean, Spaced, Mobile-Friendly Actions */}
              <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">

                {/* 1. Share App Link */}
                <button
                  onClick={() => {
                    setShareModalTab('customer');
                    setIsShareModalOpen(true);
                  }}
                  className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-sm shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer shrink-0"
                  title="Share Live App Link via WhatsApp or QR"
                >
                  <Share2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span className="hidden xs:inline">Share</span>
                </button>

                {/* 2. Phone OTP Button */}
                <button
                  onClick={() => openPhoneAuth('customer')}
                  className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm active:scale-95 transition-all cursor-pointer shrink-0"
                  title="Quick Phone OTP Verification"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                  <span>OTP</span>
                </button>

                {/* 3. Install App (PWA) Button */}
                <PWAInstallButton variant="compact" />

                {/* 4. Customer Login / Account Button */}
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                    customer.isLoggedIn
                      ? 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30'
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold'
                  }`}
                  title={customer.isLoggedIn ? `Logged in as ${customer.name}` : 'Login with Phone & OTP'}
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="hidden sm:inline">
                    {customer.isLoggedIn ? (customer.name.split(' ')[0] || 'Account') : 'Login'}
                  </span>
                  <span className="sm:hidden">
                    {customer.isLoggedIn ? 'User' : 'Login'}
                  </span>
                </button>

                {/* 5. Desktop-Only Extended Buttons (Aadhaar & Partner) */}
                <div className="hidden lg:flex items-center gap-1.5">
                  {customer.isAadhaarVerified ? (
                    <button
                      onClick={() => setIsAadhaarModalOpen(true)}
                      className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                      title="Aadhaar Verified"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Verified</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsAadhaarModalOpen(true)}
                      className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-all cursor-pointer"
                      title="Verify Aadhaar for ₹200 bonus"
                    >
                      <Fingerprint className="w-3.5 h-3.5 text-amber-400" />
                      <span>KYC +₹200</span>
                    </button>
                  )}

                  <button
                    onClick={() => setViewMode('partner')}
                    className={`relative flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      availableOpenJobs.length > 0
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 ring-2 ring-amber-300 animate-pulse'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <HardHat className="w-3.5 h-3.5 text-amber-400" />
                    <span>Partner</span>
                    {availableOpenJobs.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                    )}
                  </button>
                </div>

                {/* 6. More Options Dropdown Menu (For Mobile & Tablet Cleanliness) */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMobileMenuOpen(prev => !prev)}
                    className="p-1.5 sm:p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors cursor-pointer flex items-center justify-center relative shrink-0"
                    title="More actions & options"
                    aria-label="More actions"
                  >
                    <MoreVertical className="w-4 h-4 text-slate-300" />
                    {availableOpenJobs.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
                    )}
                  </button>

                  {/* Dropdown Panel */}
                  {mobileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-2xl z-50 space-y-1 animate-in fade-in zoom-in-95">
                      <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 flex items-center justify-between">
                        <span>Quick Navigation</span>
                        <span className="text-amber-400">Hub</span>
                      </div>

                      {/* Partner Terminal Link */}
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setViewMode('partner');
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-white hover:bg-slate-800 transition-colors text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                            <HardHat className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="block font-bold">Partner / Worker App</span>
                            <span className="text-[10px] text-slate-400">Accept jobs & earn daily</span>
                          </div>
                        </div>
                        {availableOpenJobs.length > 0 && (
                          <span className="text-[9px] font-mono font-bold bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded-full">
                            {availableOpenJobs.length} New
                          </span>
                        )}
                      </button>

                      {/* Download Real APK */}
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setViewMode('download');
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-white hover:bg-slate-800 transition-colors text-left cursor-pointer"
                      >
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                          <Download className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="block font-bold">Download Real APK</span>
                          <span className="text-[10px] text-slate-400">Android & iOS standalone packages</span>
                        </div>
                      </button>

                      {/* Aadhaar e-KYC */}
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setIsAadhaarModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-white hover:bg-slate-800 transition-colors text-left cursor-pointer"
                      >
                        <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                          <Fingerprint className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="block font-bold">Aadhaar e-KYC Status</span>
                          <span className="text-[10px] text-emerald-400">
                            {customer.isAadhaarVerified ? 'Verified Account' : 'Get ₹200 Wallet Bonus'}
                          </span>
                        </div>
                      </button>

                      {/* Frame Simulator Toggle */}
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setDeviceFrame(deviceFrame === 'mobile' ? 'responsive' : 'mobile');
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors text-left cursor-pointer"
                      >
                        <div className="w-6 h-6 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center">
                          {deviceFrame === 'mobile' ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <span className="block font-bold">Layout View Mode</span>
                          <span className="text-[10px] text-slate-400">
                            {deviceFrame === 'mobile' ? 'Switch to Fluid Full Width' : 'Switch to Mobile Phone Frame'}
                          </span>
                        </div>
                      </button>

                      {/* Staff & Admin Access */}
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setStaffModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-left cursor-pointer border-t border-slate-800 mt-1"
                      >
                        <div className="w-6 h-6 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="block font-bold">Staff & Admin Login</span>
                          <span className="text-[10px] text-slate-500">Security passcode required</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* 2. PARTNER / WORKER VIEW HEADER */}
          {/* ========================================================================= */}
          {viewMode === 'partner' && (
            <>
              {/* Back to Customer App & Partner Title */}
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
                <button
                  onClick={() => setViewMode('customer')}
                  className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors shrink-0"
                  title="Return to Customer App"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Customer</span>
                </button>

                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <HardHat className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-1.5 truncate">
                      <span className="truncate">Partner Terminal</span>
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded border border-emerald-500/20 shrink-0">
                        DUTY
                      </span>
                    </h2>
                  </div>
                </div>
              </div>

              {/* Partner Actions (Clean & Spaced) */}
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                {/* Share Link for Partner */}
                <button
                  onClick={() => {
                    setShareModalTab('partner');
                    setIsShareModalOpen(true);
                  }}
                  className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-sm shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer shrink-0"
                  title="Share Partner Link"
                >
                  <Share2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span className="hidden xs:inline">Share</span>
                </button>

                {/* Partner OTP Login */}
                <button
                  onClick={() => openPhoneAuth('partner')}
                  className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm active:scale-95 transition-all cursor-pointer shrink-0"
                  title="Partner Phone OTP"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                  <span>OTP</span>
                </button>

                {/* Install App Button */}
                <PWAInstallButton variant="compact" />

                {/* Download Hub */}
                <button
                  onClick={() => setViewMode('download')}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  title="Download Partner APK"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>APK</span>
                </button>
              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* 3. ADMIN & DEVELOPER VIEW HEADER */}
          {/* ========================================================================= */}
          {viewMode === 'admin' && (
            <div className="flex items-center justify-between w-full gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <button
                  onClick={() => setViewMode('customer')}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors shrink-0"
                  title="Return to Customer App"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Customer App</span>
                </button>

                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                    Operations Console
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {activeSosCount > 0 && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-rose-500/20 border border-rose-500/40 text-rose-300 animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>SOS ({activeSosCount})</span>
                  </div>
                )}

                <PWAInstallButton variant="compact" />

                <button
                  onClick={() => setViewMode('partner')}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                >
                  <HardHat className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Partner</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. DOWNLOAD APPS VIEW HEADER */}
          {/* ========================================================================= */}
          {viewMode === 'download' && (
            <div className="flex items-center justify-between w-full gap-2">
              <button
                onClick={() => setViewMode('customer')}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Customer App</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs font-extrabold text-white truncate">
                <Download className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">Download Center</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setViewMode('partner')}
                  className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                >
                  <HardHat className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Partner App</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </header>

      {/* Staff / Admin Passcode Modal */}
      {staffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Staff & Operations Portal</h3>
              </div>
              <button 
                onClick={() => setStaffModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Administrative controls, live dispatch supervision, regulatory compliance, and developer APK build tools are restricted to authorized personnel.
            </p>

            <form onSubmit={handleAdminAccess} className="space-y-3 pt-1">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Enter Security PIN <span className="text-slate-500 font-normal">(Default: 1234 or leave blank)</span>
                </label>
                <input
                  type="password"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="••••"
                  maxLength={6}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-center text-base font-mono tracking-widest text-white focus:outline-none focus:border-amber-500"
                  autoFocus
                />
              </div>

              {pinError && (
                <p className="text-[11px] text-rose-400">{pinError}</p>
              )}

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStaffModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20"
                >
                  Enter Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Live App Modal */}
      <ShareLiveModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        defaultTab={shareModalTab}
      />
    </>
  );
};
