import React, { useState } from 'react';
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
  Lock,
  ExternalLink,
  MapPin,
  Clock,
  Download,
  Fingerprint,
  UserCheck,
  Flame
} from 'lucide-react';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

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
    setIsPhoneAuthModalOpen
  } = useQuickService();

  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState('');

  const activeSosCount = emergencyAlerts.filter(a => a.status === 'active').length;

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
      <header className="sticky top-0 z-50 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          
          {/* ========================================================================= */}
          {/* 1. CUSTOMER VIEW HEADER (Clean, 100% Commercial Public Customer Experience) */}
          {/* ========================================================================= */}
          {viewMode === 'customer' && (
            <>
              {/* Brand Wordmark & Location */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-amber-500/20">
                  <Radio className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-extrabold text-base sm:text-lg tracking-tight text-white">
                    <span>Quick Service</span>
                    <span className="text-[10px] font-mono font-bold tracking-wide text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      LIVE
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setEditingAddress(customer.savedAddresses.find(a => a.isDefault) || customer.savedAddresses[0] || null);
                      setIsAddressModalOpen(true);
                    }}
                    className="flex items-center gap-1 text-[11px] text-slate-400 font-medium -mt-0.5 hover:text-amber-300 transition-colors cursor-pointer text-left"
                    title="Click to edit address or use GPS"
                  >
                    <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate max-w-[130px] sm:max-w-none">
                      {customer.savedAddresses.find(a => a.isDefault)?.address.split(',')[0] || 'Sector 62, Noida'}
                    </span>
                    <span className="text-[9px] text-amber-400 underline ml-0.5">Edit</span>
                  </button>
                </div>
              </div>

              {/* Active Booking status pill (Customer only) */}
              {activeBooking && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="font-semibold">Order #{activeBooking.id}: {activeBooking.status.replace('_', ' ').toUpperCase()}</span>
                </div>
              )}

              {/* Right Side Actions for Customer */}
              <div className="flex items-center gap-2 sm:gap-2.5">

                {/* Firebase Phone OTP Authentication Modal Trigger */}
                <button
                  onClick={() => openPhoneAuth('customer')}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm transition-all cursor-pointer"
                  title="Phone OTP Authentication (Firebase Verified Logic)"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                  <span className="hidden sm:inline">Phone OTP</span>
                  <span className="sm:hidden">OTP</span>
                </button>

                {/* Direct PWA Install Button */}
                <PWAInstallButton variant="compact" />

                {/* Customer Login / Account Button (Direct Phone + 6-digit OTP Auth) */}
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    customer.isLoggedIn
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold shadow-sm'
                  }`}
                  title={customer.isLoggedIn ? `Logged in as ${customer.name}` : 'Login with 10-Digit Phone & 6-Digit SMS OTP'}
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden md:inline">
                    {customer.isLoggedIn ? (customer.name.split(' ')[0] || 'My Account') : 'Customer Login'}
                  </span>
                  <span className="md:hidden">
                    {customer.isLoggedIn ? 'Account' : 'Login'}
                  </span>
                </button>
                
                {/* Customer Account & Aadhaar Status Indicator */}
                {customer.isAadhaarVerified ? (
                  <button
                    onClick={() => setIsAadhaarModalOpen(true)}
                    className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all cursor-pointer"
                    title="Aadhaar e-KYC Verified Customer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden lg:inline">Aadhaar Verified</span>
                    <span className="lg:hidden">Verified</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsAadhaarModalOpen(true)}
                    className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 transition-all cursor-pointer"
                    title="Verify Aadhaar to get ₹200 wallet reward"
                  >
                    <Fingerprint className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden lg:inline">Verify Aadhaar (+₹200)</span>
                    <span className="lg:hidden">Aadhaar KYC</span>
                  </button>
                )}

                {/* Direct Download & Real APK Button */}
                <button
                  onClick={() => setViewMode('download')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
                  title="Direct Download Customer & Partner APKs & 1-Tap Mobile Install"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download Real APK</span>
                  <span className="sm:hidden">Real APK</span>
                </button>

                {/* Frame Simulator Toggle */}
                <button
                  onClick={() => setDeviceFrame(deviceFrame === 'mobile' ? 'responsive' : 'mobile')}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/60 transition-colors"
                  title={deviceFrame === 'mobile' ? 'Expand to fluid responsive layout' : 'Switch to mobile phone frame simulator'}
                >
                  {deviceFrame === 'mobile' ? (
                    <>
                      <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                      <span className="hidden lg:inline">Fluid</span>
                    </>
                  ) : (
                    <>
                      <Minimize2 className="w-3.5 h-3.5 text-slate-400" />
                      <span className="hidden lg:inline">Frame</span>
                    </>
                  )}
                </button>

                {/* Partner Login Link with Live Dispatch Alert Badge */}
                <button
                  onClick={() => setViewMode('partner')}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    availableOpenJobs.length > 0
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/25 ring-2 ring-amber-400 animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-amber-500/40'
                  }`}
                  title="Switch to Service Partner Terminal"
                >
                  <HardHat className={`w-3.5 h-3.5 ${availableOpenJobs.length > 0 ? 'text-slate-950' : 'text-amber-400'}`} />
                  <span className="hidden md:inline">
                    {availableOpenJobs.length > 0 ? `Partner (${availableOpenJobs.length} Booking 🔔)` : 'Partner Login'}
                  </span>
                  <span className="md:hidden">
                    {availableOpenJobs.length > 0 ? `Partner (${availableOpenJobs.length})` : 'Partner'}
                  </span>
                  {availableOpenJobs.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                  )}
                </button>

                {/* Staff / Admin Access Button */}
                <button
                  onClick={() => setStaffModalOpen(true)}
                  className="flex items-center gap-1 p-2 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-medium bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
                  title="Staff & Admin Portal Login"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Staff</span>
                </button>

              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* 2. PARTNER / WORKER VIEW HEADER */}
          {/* ========================================================================= */}
          {viewMode === 'partner' && (
            <>
              {/* Back to Customer App & Partner Title */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode('customer')}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors"
                  title="Return to Customer App"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Customer App</span>
                </button>

                <div className="h-4 w-px bg-slate-800 hidden sm:block" />

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <HardHat className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                      <span>Partner Terminal</span>
                      <span className="text-[10px] font-mono text-slate-400 hidden md:inline">
                        ID: {activePartner.id}
                      </span>
                    </h2>
                  </div>
                </div>
              </div>

              {/* Partner Duty Status & Actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                
                {/* Partner Phone OTP Button */}
                <button
                  onClick={() => openPhoneAuth('partner')}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm transition-all cursor-pointer"
                  title="Partner Phone OTP Login"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                  <span className="hidden sm:inline">Partner OTP</span>
                  <span className="sm:hidden">OTP</span>
                </button>

                {/* Direct PWA Install Button */}
                <PWAInstallButton variant="compact" />

                {/* Download Apps Button */}
                <button
                  onClick={() => setViewMode('download')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Partner APK</span>
                </button>

                {/* Active Partner Pill */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs">
                  <div className={`w-2 h-2 rounded-full ${activePartner.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                  <span className="text-white font-medium">{activePartner.name}</span>
                  <span className="text-amber-400 font-mono text-[11px]">★ {activePartner.rating}</span>
                </div>

                {/* Frame simulator toggle */}
                <button
                  onClick={() => setDeviceFrame(deviceFrame === 'mobile' ? 'responsive' : 'mobile')}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/60 transition-colors"
                >
                  {deviceFrame === 'mobile' ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                </button>

                {/* Switch to Admin */}
                <button
                  onClick={() => setViewMode('admin')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Admin</span>
                </button>

              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* 3. ADMIN & DEVELOPER VIEW HEADER */}
          {/* ========================================================================= */}
          {viewMode === 'admin' && (
            <>
              {/* Back to Customer App & Admin Title */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode('customer')}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors"
                  title="Return to Customer App"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Customer View</span>
                </button>

                <div className="h-4 w-px bg-slate-800 hidden sm:block" />

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                      <span>Admin & Operations Console</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                        ROOT
                      </span>
                    </h2>
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                
                {/* Direct PWA Install Button */}
                <PWAInstallButton variant="compact" />

                {/* Download 3 Apps button */}
                <button
                  onClick={() => setViewMode('download')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download 3 Apps</span>
                </button>

                {/* Emergency Alert Indicator */}
                {activeSosCount > 0 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/20 border border-rose-500/40 text-rose-300 animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>SOS: {activeSosCount} Active</span>
                  </div>
                )}

                {/* Quick Link to Partner Terminal */}
                <button
                  onClick={() => setViewMode('partner')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                >
                  <HardHat className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Partner Terminal</span>
                </button>

              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* 4. DOWNLOAD 3 APPS VIEW HEADER */}
          {/* ========================================================================= */}
          {viewMode === 'download' && (
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => setViewMode('customer')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← Back to Customer App</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>3 Standalone Apps Download Hub</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('partner')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
                >
                  <HardHat className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Partner View</span>
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
                className="text-slate-400 hover:text-white text-xs"
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
    </>
  );
};
