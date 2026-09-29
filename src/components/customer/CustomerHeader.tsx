import React from 'react';
import { useQuickService } from '../../context/QuickServiceContext';
import { 
  Radio, 
  MapPin, 
  Smartphone, 
  ShieldCheck, 
  Fingerprint 
} from 'lucide-react';

export const CustomerHeader: React.FC = () => {
  const { 
    customer, 
    activeBooking,
    setIsLoginModalOpen, 
    setIsAadhaarModalOpen,
    setIsAddressModalOpen,
    setEditingAddress 
  } = useQuickService();

  const defaultAddress = customer.savedAddresses.find(a => a.isDefault) || customer.savedAddresses[0];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2">
        
        {/* Brand Wordmark & Location */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
            <Radio className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 font-extrabold text-sm sm:text-base tracking-tight text-white leading-tight">
              <span>Quick Service</span>
              <span className="text-[9px] font-mono font-bold tracking-wide text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                LIVE
              </span>
            </div>
            <button
              onClick={() => {
                setEditingAddress(defaultAddress || null);
                setIsAddressModalOpen(true);
              }}
              className="flex items-center gap-1 text-[11px] text-slate-400 font-medium hover:text-amber-300 transition-colors cursor-pointer text-left"
              title="Click to edit address or use GPS"
            >
              <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate max-w-[120px] sm:max-w-[200px]">
                {defaultAddress?.address.split(',')[0] || 'Sector 62, Noida'}
              </span>
              <span className="text-[9px] text-amber-400 underline ml-0.5 shrink-0">Edit</span>
            </button>
          </div>
        </div>

        {/* Active Booking status pill */}
        {activeBooking && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-semibold">Order #{activeBooking.id}: {activeBooking.status.replace('_', ' ').toUpperCase()}</span>
          </div>
        )}

        {/* Customer Actions: Login & Aadhaar KYC */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

          {/* Customer Login / Account Button */}
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              customer.isLoggedIn
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold shadow-sm'
            }`}
            title={customer.isLoggedIn ? `Logged in as ${customer.name}` : 'Login with Phone Number'}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">
              {customer.isLoggedIn ? (customer.name.split(' ')[0] || 'My Account') : 'Customer Login'}
            </span>
            <span className="sm:hidden">
              {customer.isLoggedIn ? 'Account' : 'Login'}
            </span>
          </button>
          
          {/* Aadhaar Verified Status / Incentive */}
          {customer.isAadhaarVerified ? (
            <button
              onClick={() => setIsAadhaarModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all cursor-pointer"
              title="Aadhaar e-KYC Verified Customer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Aadhaar Verified</span>
              <span className="sm:hidden">Verified</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAadhaarModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 transition-all cursor-pointer"
              title="Verify Aadhaar to get ₹200 wallet reward"
            >
              <Fingerprint className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Verify Aadhaar (+₹200)</span>
              <span className="sm:hidden">KYC (+₹200)</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
