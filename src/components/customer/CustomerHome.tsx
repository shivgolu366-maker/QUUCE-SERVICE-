import React, { useState } from 'react';
import { useQuickService } from '../../context/QuickServiceContext';
import { ServiceItem, ServiceCategory } from '../../types';
import { SERVICE_CATEGORIES } from '../../data/mockData';
import { ServiceIllustration } from '../common/ServiceIllustration';
import { 
  MapPin, 
  Search, 
  Star, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight,
  Tag,
  Wrench,
  Car,
  Home,
  CheckCircle2,
  Layers,
  ShoppingBag,
  Receipt,
  Fingerprint,
  LogIn,
  Award,
  Navigation,
  Flame,
  Smartphone
} from 'lucide-react';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

interface CustomerHomeProps {
  onSelectService: (service: ServiceItem) => void;
  onOpenActiveTracking: () => void;
  onOpenSubscriptions?: () => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({ 
  onSelectService,
  onOpenActiveTracking,
  onOpenSubscriptions
}) => {
  const { 
    customer, 
    services, 
    activeBooking, 
    coupons,
    setIsLoginModalOpen, 
    setIsAadhaarModalOpen,
    setIsAddressModalOpen,
    setEditingAddress,
    openPhoneAuth
  } = useQuickService();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const defaultAddress = customer.savedAddresses.find(a => a.isDefault) || customer.savedAddresses[0];

  const filteredServices = services.filter(s => {
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col space-y-4 pb-20">
      
      {/* Top Bar: Address, Greeting & Login / Aadhaar Badge */}
      <div className="px-4 pt-2">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => {
              setEditingAddress(defaultAddress || null);
              setIsAddressModalOpen(true);
            }}
            className="flex items-center gap-2 text-left group cursor-pointer hover:opacity-90 transition-opacity"
            title="Edit Address / Locate with GPS"
          >
            <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-white tracking-tight">{defaultAddress?.label || 'Home'}</span>
                <span className="text-[10px] text-amber-300 font-semibold bg-amber-500/15 px-1.5 py-0.2 rounded border border-amber-500/30 flex items-center gap-0.5">
                  <Navigation className="w-2.5 h-2.5" />
                  <span>GPS / Edit</span>
                </span>
                {customer.isAadhaarVerified && (
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20 flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Aadhaar Verified</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[170px] sm:max-w-xs group-hover:text-amber-200 transition-colors">
                {defaultAddress?.address}
              </p>
            </div>
          </button>

          <div className="flex items-center gap-2">
            {(!customer.isLoggedIn && !customer.phone) ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openPhoneAuth('customer')}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-all cursor-pointer"
                  title="Phone OTP Authentication (Firebase Verified)"
                >
                  <Flame className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Phone OTP</span>
                </button>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700"
                >
                  <LogIn className="w-3 h-3" />
                  <span>Login</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-2 text-right group cursor-pointer"
                title="Click to Switch Customer or Edit Profile"
              >
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-bold text-white leading-tight">
                    {customer.name?.split(' ')[0] || 'Customer'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {customer.phone ? customer.phone.slice(-4) : 'Login'}
                  </div>
                </div>
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden group-hover:border-amber-400 transition-colors">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(customer.name)}&backgroundColor=b6e3f4`} 
                      alt={customer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {customer.isAadhaarVerified && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-1 ring-slate-900" />
                  )}
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Aadhaar Verification Callout Banner (If not yet verified) */}
      {!customer.isAadhaarVerified && (
        <div className="px-4">
          <div 
            onClick={() => setIsAadhaarModalOpen(true)}
            className="p-3 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-emerald-500/10 border border-amber-500/30 hover:border-amber-400 rounded-2xl cursor-pointer transition-all shadow-md flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
                <Fingerprint className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">Verify Aadhaar ID</span>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/15 px-1.5 py-0.2 rounded border border-amber-500/20 font-mono">
                    +₹200 CASH
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Earn ₹200 free wallet bonus & unlock verified customer badge
                </p>
              </div>
            </div>

            <button
              type="button"
              className="px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 font-bold text-[11px] shrink-0 group-hover:bg-amber-400 transition-colors shadow-sm"
            >
              Verify
            </button>
          </div>
        </div>
      )}

      {/* PWA Home Screen Installation & Offline Ready Banner */}
      <div className="px-4">
        <div className="p-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">Install Quick Service App</span>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 font-mono font-bold px-1.5 py-0.2 rounded">PWA</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                Add to your phone home screen for 1-tap instant booking & offline access
              </p>
            </div>
          </div>
          <PWAInstallButton variant="compact" />
        </div>
      </div>

      {/* Search Input */}
      <div className="px-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plumber, cleaning, electrician, driver..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 shadow-inner"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Active Ongoing Order Tracker Banner */}
      {activeBooking && (
        <div className="px-4">
          <div 
            onClick={onOpenActiveTracking}
            className="p-3.5 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 border border-amber-500/40 rounded-2xl cursor-pointer hover:border-amber-400 transition-all shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center">
                  <Wrench className="w-5 h-5" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-ping" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <span>{activeBooking.serviceName}</span>
                  <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded font-mono">
                    {activeBooking.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  {activeBooking.partnerName ? `${activeBooking.partnerName.split(' ')[0]} is arriving (${activeBooking.etaMinutes || 8} min)` : 'Matching nearest professional...'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-400">
              <span>Track</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* Hero Promotional Banner */}
      <div className="px-4">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-600 to-orange-700 p-5 text-white shadow-xl">
          <div className="relative z-10 max-w-[70%]">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/30 backdrop-blur-sm text-[10px] font-semibold tracking-wide text-amber-200 mb-2">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Instant Dispatch Guarantee</span>
            </div>
            <h2 className="text-lg font-extrabold tracking-tight leading-tight text-white mb-1">
              Expert Repairs & Chores at Doorstep
            </h2>
            <p className="text-xs text-amber-100/90 leading-relaxed mb-3">
              30-minute arrival guarantee with background-verified technicians.
            </p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded-lg bg-white/20 backdrop-blur-sm text-[11px] font-mono font-bold">
                CODE: QUICKFIRST
              </span>
              <span className="text-[10px] text-amber-100">Save 20% today</span>
            </div>
          </div>

          {/* Decorative graphic background */}
          <div className="absolute -right-4 -bottom-6 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute right-3 bottom-3 opacity-20 pointer-events-none">
            <ShieldCheck className="w-24 h-24 text-white" />
          </div>
        </div>
      </div>

      {/* Subscriptions & Packages Quick Banner */}
      <div className="px-4">
        <div 
          onClick={onOpenSubscriptions}
          className="p-3.5 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-amber-500/10 border border-emerald-500/30 hover:border-emerald-400/60 rounded-2xl cursor-pointer transition-all shadow-md flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <span>Service Packages & Subscriptions</span>
                <span className="text-[9px] font-mono text-emerald-300 bg-emerald-500/20 px-1.5 py-0.2 rounded font-semibold">
                  SAVE UP TO 40%
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Weekly house cleaning passes, daily chef plans & bundled moving packages
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400 group-hover:translate-x-0.5 transition-transform">
            <span>Explore</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">
            Services Categories
          </h3>
          <span className="text-[11px] text-slate-500">12 Verified Services</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {SERVICE_CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 ${
                  isSelected 
                    ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/10' 
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-400'
                }`}>
                  {cat.id === 'repairs' && <Wrench className="w-4 h-4" />}
                  {cat.id === 'chores' && <Sparkles className="w-4 h-4" />}
                  {cat.id === 'mobility' && <Car className="w-4 h-4" />}
                </div>
                <div>
                  <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                    {cat.shortLabel}
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5 truncate">
                    {cat.id === 'repairs' ? '5 Pros' : cat.id === 'chores' ? '4 Pros' : '3 Pros'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Services List / Cards */}
      <div className="px-4 space-y-3">
        <div className="flex items-center justify-between pt-1">
          <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">
            {selectedCategory === 'all' ? 'All Popular Services' : SERVICE_CATEGORIES.find(c => c.id === selectedCategory)?.label}
          </h3>
          <span className="text-[11px] text-amber-400 font-medium">Fixed Upfront Rates</span>
        </div>

        <div className="space-y-2.5">
          {filteredServices.map(service => (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className="p-3.5 bg-slate-900 border border-slate-800/90 hover:border-slate-700 rounded-2xl transition-all cursor-pointer flex flex-col gap-2.5 hover:shadow-lg group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <ServiceIllustration 
                    type={service.illustrationType || service.category} 
                    badgeTitle={service.badgeTitle}
                    size="md" 
                  />
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                        {service.name}
                      </h4>
                      {service.popularTag && (
                        <span className="text-[9px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                          {service.popularTag}
                        </span>
                      )}
                      {service.supportsChecklist && (
                        <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                          <Receipt className="w-2.5 h-2.5" />
                          <span>Checklist & Memo Bill</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-bold font-mono text-amber-400">
                    ₹{service.basePrice}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {service.pricingType === 'hourly' ? '/hour' : 'base fare'}
                  </div>
                </div>
              </div>

              {/* Service Metadata Footer */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-amber-400 font-medium">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-mono">{service.rating}</span>
                    <span className="text-slate-400 text-[10px]">({service.reviewsCount})</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{service.estimatedTimeMinutes} min</span>
                  </div>
                </div>

                <button 
                  type="button"
                  className="flex items-center gap-1 text-xs font-semibold text-amber-400 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {filteredServices.length === 0 && (
            <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800">
              <p className="text-xs text-slate-400">No services match "{searchQuery}"</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-2 text-xs text-amber-400 underline font-medium"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Safety & Trust Banner */}
      <div className="px-4 pt-2">
        <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>The Quick Service Quality Promise</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Govt. Verified ID & PCC</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>₹10,000 Damage Insurance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>30-Day Work Warranty</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Masked Relay Calling</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
