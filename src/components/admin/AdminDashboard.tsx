import React, { useState } from 'react';
import { useQuickService } from '../../context/QuickServiceContext';
import { Partner, Booking, ServiceItem, ServiceCategory } from '../../types';
import { 
  TrendingUp, 
  Users, 
  HardHat, 
  ShieldAlert, 
  Sliders, 
  Tag, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Check, 
  X, 
  DollarSign, 
  ArrowUpRight, 
  Search, 
  Clock, 
  MapPin, 
  FileText, 
  Calendar,
  Layers,
  Smartphone,
  ShieldCheck,
  Lock,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Percent,
  RefreshCw,
  Phone,
  Car,
  Ban,
  Unlock,
  Radio,
  ExternalLink
} from 'lucide-react';

type AdminTab = 'overview' | 'services' | 'commission' | 'bookings' | 'partners' | 'sos';

export const AdminDashboard: React.FC = () => {
  const { 
    partners, 
    bookings, 
    customer, 
    services,
    addService,
    updateServicePrice,
    deleteService,
    adminMetrics, 
    updateCommissionRate,
    verifyPartnerKYC,
    togglePartnerBlock,
    updateBookingStatusAdmin,
    emergencyAlerts,
    resolveEmergencyAlert,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin
  } = useQuickService();

  // Authentication State
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Bookings Filter & Search
  const [bookingFilter, setBookingFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [bookingSearch, setBookingSearch] = useState('');

  // Partners Filter & Search
  const [partnerFilter, setPartnerFilter] = useState<'all' | 'pending' | 'verified' | 'blocked'>('all');
  const [partnerSearch, setPartnerSearch] = useState('');

  // Services State: Add & Edit Modals
  const [serviceSearch, setServiceSearch] = useState('');
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [editingService, setEditingService] = useState<{ id: string; name: string; price: number } | null>(null);

  // New Service Form State
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState<ServiceCategory>('repairs');
  const [newServicePrice, setNewServicePrice] = useState('399');
  const [newServicePricingType, setNewServicePricingType] = useState<'fixed' | 'hourly'>('fixed');
  const [newServiceTime, setNewServiceTime] = useState('45');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceTag, setNewServiceTag] = useState('');

  // Commission Control State
  const [commissionInput, setCommissionInput] = useState(Math.round(adminMetrics.platformTakeRate * 100));
  const [commissionSavedMsg, setCommissionSavedMsg] = useState(false);

  // Handle Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(passcode);
    if (success) {
      setPasscode('');
      setLoginError('');
    } else {
      setLoginError('Incorrect Passcode. Default: 1234 or leave blank for demo access.');
    }
  };

  // If not authenticated, render Super Admin Login Screen
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 text-slate-950">
              <Lock className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Super Admin Console
            </h1>
            <p className="text-xs text-slate-400">
              Quick Service Operations & System Command Center
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Admin Passcode / PIN *
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setLoginError('');
                }}
                placeholder="Enter PIN (Default: 1234)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono tracking-widest text-center transition-colors"
                autoFocus
              />
              <span className="text-[10px] text-slate-500 block mt-1 text-center font-mono">
                Hint: Enter <strong className="text-amber-400 font-bold">1234</strong> or leave blank for instant demo access
              </span>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs text-center font-medium">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all cursor-pointer"
            >
              Unlock Super Admin Portal
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-500">
              Authorized Personnel & Operations Desk Only
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Calculate Overview Metrics
  const activeBookingsCount = bookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled').length;
  const completedBookingsCount = bookings.filter(b => b.status === 'completed').length;
  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalCommissionEarned = Math.round(totalRevenue * adminMetrics.platformTakeRate);
  const onlinePartnersCount = partners.filter(p => p.isOnline && !p.isBlocked).length;
  const pendingKYCPartners = partners.filter(p => p.kycStatus === 'pending' || p.kycDocs.some(d => d.status === 'pending'));

  // Filtered Bookings
  const filteredBookings = bookings.filter(b => {
    const matchesFilter = 
      bookingFilter === 'all' ? true :
      bookingFilter === 'active' ? (b.status !== 'completed' && b.status !== 'cancelled') :
      bookingFilter === 'completed' ? b.status === 'completed' :
      b.status === 'cancelled';

    const q = bookingSearch.toLowerCase();
    const matchesSearch = !q || 
      b.id.toLowerCase().includes(q) ||
      b.customerName.toLowerCase().includes(q) ||
      b.serviceName.toLowerCase().includes(q) ||
      (b.partnerName && b.partnerName.toLowerCase().includes(q));

    return matchesFilter && matchesSearch;
  });

  // Filtered Partners
  const filteredPartners = partners.filter(p => {
    const matchesFilter =
      partnerFilter === 'all' ? true :
      partnerFilter === 'pending' ? (p.kycStatus === 'pending' || p.kycDocs.some(d => d.status === 'pending')) :
      partnerFilter === 'verified' ? (p.kycStatus === 'verified' && !p.isBlocked) :
      p.isBlocked;

    const q = partnerSearch.toLowerCase();
    const matchesSearch = !q ||
      p.name.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.categoryName.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  // Filtered Services
  const filteredServices = services.filter(s => {
    const q = serviceSearch.toLowerCase();
    return !q || s.name.toLowerCase().includes(q) || s.categoryLabel.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
  });

  // Add Service Handler
  const handleAddServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    const newService: ServiceItem = {
      id: 'srv-' + Date.now(),
      name: newServiceName.trim(),
      category: newServiceCategory,
      categoryLabel: newServiceCategory.toUpperCase().replace('_', ' '),
      icon: 'Wrench',
      description: newServiceDesc.trim() || `Professional ${newServiceName.trim()} service at your doorstep.`,
      detailedSpecs: ['Standard verified tools', 'Certified technician', '30-day work warranty'],
      pricingType: newServicePricingType,
      basePrice: parseInt(newServicePrice, 10) || 299,
      estimatedTimeMinutes: parseInt(newServiceTime, 10) || 45,
      rating: 4.8,
      reviewsCount: 1,
      popularTag: newServiceTag.trim() || undefined
    };

    addService(newService);
    setIsAddServiceOpen(false);
    setNewServiceName('');
    setNewServiceDesc('');
    setNewServicePrice('399');
    setNewServiceTag('');
  };

  // Commission Update Handler
  const handleSaveCommission = (ratePercent: number) => {
    setCommissionInput(ratePercent);
    updateCommissionRate(ratePercent / 100);
    setCommissionSavedMsg(true);
    setTimeout(() => setCommissionSavedMsg(false), 2000);
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col min-h-screen">
      
      {/* Super Admin Top Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-white tracking-tight">
                Super Admin Operations
              </h1>
              <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                LIVE OPS
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Independent Operations, Pricing, Commission & Partner Hub
            </p>
          </div>
        </div>

        {/* Lock / Logout Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/30 transition-all cursor-pointer"
            title="Lock Admin Console"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lock / Sign Out</span>
          </button>
        </div>
      </header>

      {/* Admin Portal Navigation Tabs */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 py-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 max-w-7xl mx-auto">
          {[
            { id: 'overview', label: 'Overview Analytics', icon: TrendingUp },
            { id: 'services', label: `Services & Pricing (${services.length})`, icon: Sliders },
            { id: 'commission', label: `Commission Setting (${Math.round(adminMetrics.platformTakeRate * 100)}%)`, icon: Percent },
            { id: 'bookings', label: `Bookings Monitor (${bookings.length})`, icon: Calendar },
            { id: 'partners', label: `Partner Management (${partners.length})`, icon: HardHat },
            { id: 'sos', label: `SOS Desk (${emergencyAlerts.filter(a => a.status === 'active').length})`, icon: ShieldAlert },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Admin View Container */}
      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6 flex-1">

        {/* ========================================================================= */}
        {/* 1. OVERVIEW ANALYTICS TAB */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Top 5 Primary KPI Cards (User Requirement) */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              
              {/* 1. Total Active Bookings */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-1 relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="font-semibold uppercase tracking-wider text-[10px]">Active Bookings</span>
                  <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                  {activeBookingsCount}
                </div>
                <span className="text-[11px] text-amber-400 font-medium">In-flight / En route</span>
              </div>

              {/* 2. Total Customers */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="font-semibold uppercase tracking-wider text-[10px]">Total Customers</span>
                  <Users className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                  {1240 + (customer.isLoggedIn ? 1 : 0)}
                </div>
                <span className="text-[11px] text-emerald-400 font-medium">+14 new today</span>
              </div>

              {/* 3. Active Partners */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="font-semibold uppercase tracking-wider text-[10px]">Active Partners</span>
                  <HardHat className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">
                  {onlinePartnersCount} <span className="text-xs text-slate-400 font-sans">/ {partners.length}</span>
                </div>
                <span className="text-[11px] text-slate-400">Online & Ready</span>
              </div>

              {/* 4. Total Platform Revenue */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="font-semibold uppercase tracking-wider text-[10px]">Total Gross Revenue</span>
                  <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                  ₹{totalRevenue.toLocaleString()}
                </div>
                <span className="text-[11px] text-emerald-400 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" /> All bookings volume
                </span>
              </div>

              {/* 5. Total Platform Commission Earned */}
              <div className="p-4 bg-slate-900 border border-amber-500/30 rounded-3xl space-y-1 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent">
                <div className="flex items-center justify-between text-amber-300 text-xs">
                  <span className="font-bold uppercase tracking-wider text-[10px]">Commission Earned</span>
                  <Percent className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400">
                  ₹{totalCommissionEarned.toLocaleString()}
                </div>
                <span className="text-[11px] text-slate-300 font-mono font-bold">
                  {Math.round(adminMetrics.platformTakeRate * 100)}% Take Rate
                </span>
              </div>

            </div>

            {/* Quick Commission Adjuster & Recent Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2 Cols: Live Bookings Feed */}
              <div className="lg:col-span-2 p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>Recent Bookings Feed</span>
                  </h3>
                  <button 
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs text-amber-400 hover:underline font-semibold"
                  >
                    View All {bookings.length} Bookings →
                  </button>
                </div>

                <div className="space-y-2.5">
                  {bookings.slice(0, 6).map(b => (
                    <div 
                      key={b.id} 
                      className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-[11px] ${
                          b.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          #{b.id.slice(-3)}
                        </div>
                        <div>
                          <div className="font-bold text-white">{b.serviceName}</div>
                          <div className="text-[10px] text-slate-400">
                            Customer: {b.customerName} · Partner: {b.partnerName || 'Searching...'}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-bold text-white">₹{b.totalAmount}</div>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                          b.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' : 
                          b.status === 'cancelled' ? 'bg-rose-500/20 text-rose-300' :
                          'bg-amber-500/20 text-amber-300'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Col: Instant Commission Rate Controller */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Percent className="w-4 h-4 text-amber-400" />
                    <span>Commission Take-Rate</span>
                  </h3>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    {Math.round(adminMetrics.platformTakeRate * 100)}%
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Controls the percentage deducted from each customer order as platform revenue. Partner take-home is automatically adjusted.
                </p>

                {/* Quick Presets */}
                <div className="grid grid-cols-4 gap-2">
                  {[10, 15, 18, 20].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleSaveCommission(rate)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        Math.round(adminMetrics.platformTakeRate * 100) === rate
                          ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/25'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>

                {commissionSavedMsg && (
                  <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs text-center font-bold">
                    ✓ Commission updated to {Math.round(adminMetrics.platformTakeRate * 100)}%!
                  </div>
                )}

                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="text-slate-400 font-medium">On ₹1,000 Booking:</div>
                  <div className="flex justify-between text-slate-300">
                    <span>Platform Commission:</span>
                    <span className="font-mono font-bold text-amber-400">
                      ₹{Math.round(1000 * adminMetrics.platformTakeRate)} ({Math.round(adminMetrics.platformTakeRate * 100)}%)
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Partner Payout:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      ₹{1000 - Math.round(1000 * adminMetrics.platformTakeRate)} ({100 - Math.round(adminMetrics.platformTakeRate * 100)}%)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('commission')}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
                >
                  Configure Advanced Commission Tier →
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. SERVICES & PRICING MANAGEMENT TAB (User Requirement) */}
        {/* ========================================================================= */}
        {activeTab === 'services' && (
          <div className="space-y-5">
            
            {/* Action Bar: Search & Add New Service */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-3xl border border-slate-800">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  placeholder="Search services by title or category..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                onClick={() => setIsAddServiceOpen(true)}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add New Service (Nayi Service Jodein)</span>
              </button>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServices.map((service) => (
                <div 
                  key={service.id}
                  className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-3 flex flex-col justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.2 rounded uppercase">
                          {service.category}
                        </span>
                        <h4 className="text-sm font-bold text-white pt-1">
                          {service.name}
                        </h4>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-base font-extrabold font-mono text-emerald-400">
                          ₹{service.basePrice}
                        </div>
                        <span className="text-[10px] text-slate-400 block font-medium">
                          {service.pricingType === 'hourly' ? '/hour' : 'fixed base'}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2">
                      {service.description}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>~{service.estimatedTimeMinutes} mins duration</span>
                    </div>
                  </div>

                  {/* Actions: Edit Price & Delete */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setEditingService({ id: service.id, name: service.name, price: service.basePrice })}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Price</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${service.name}"?`)) {
                          deleteService(service.id);
                        }
                      }}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors cursor-pointer"
                      title="Delete Service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Service Modal */}
            {isAddServiceOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl text-white">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Plus className="w-4 h-4 text-amber-400" />
                      <span>Add New Service</span>
                    </h3>
                    <button onClick={() => setIsAddServiceOpen(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleAddServiceSubmit} className="space-y-3.5 text-xs">
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">Service Name *</label>
                      <input
                        type="text"
                        required
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                        placeholder="e.g. Geyser Installation & Service"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-300 font-bold block mb-1">Category *</label>
                        <select
                          value={newServiceCategory}
                          onChange={(e) => setNewServiceCategory(e.target.value as ServiceCategory)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                        >
                          <option value="repairs">Repairs / Plumber</option>
                          <option value="electric">Electrician</option>
                          <option value="appliances">AC & Appliances</option>
                          <option value="cleaning">Home Cleaning</option>
                          <option value="chores">Chores & Errands</option>
                          <option value="mobility">Driver & Mobility</option>
                          <option value="carpentry">Carpentry</option>
                          <option value="painting">Painting</option>
                          <option value="pest">Pest Control</option>
                          <option value="gardening">Gardening</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-300 font-bold block mb-1">Base Price (₹) *</label>
                        <input
                          type="number"
                          min={49}
                          max={50000}
                          required
                          value={newServicePrice}
                          onChange={(e) => setNewServicePrice(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-300 font-bold block mb-1">Pricing Type</label>
                        <select
                          value={newServicePricingType}
                          onChange={(e) => setNewServicePricingType(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-amber-400"
                        >
                          <option value="fixed">Fixed Price</option>
                          <option value="hourly">Hourly Rate</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-300 font-bold block mb-1">Est. Minutes</label>
                        <input
                          type="number"
                          min={10}
                          max={480}
                          value={newServiceTime}
                          onChange={(e) => setNewServiceTime(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-300 font-bold block mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={newServiceDesc}
                        onChange={(e) => setNewServiceDesc(e.target.value)}
                        placeholder="Brief summary of service coverage and inclusions"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold shadow-md cursor-pointer"
                      >
                        Create & Publish Service
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddServiceOpen(false)}
                        className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit Price Modal */}
            {editingService && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl text-white">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Update Service Price</span>
                    </h3>
                    <button onClick={() => setEditingService(null)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs text-slate-300 font-semibold">
                    {editingService.name}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 block font-medium">New Price (₹)</label>
                    <input
                      type="number"
                      min={10}
                      value={editingService.price}
                      onChange={(e) => setEditingService({ ...editingService, price: parseInt(e.target.value, 10) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-base font-bold font-mono text-emerald-400 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        updateServicePrice(editingService.id, editingService.price);
                        setEditingService(null);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-md cursor-pointer"
                    >
                      Save New Price
                    </button>
                    <button
                      onClick={() => setEditingService(null)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. COMMISSION & TAKE RATE SETTING TAB (User Requirement) */}
        {/* ========================================================================= */}
        {activeTab === 'commission' && (
          <div className="max-w-2xl mx-auto space-y-6">
            
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                    <Percent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">
                      Platform Commission Setting
                    </h3>
                    <p className="text-xs text-slate-400">
                      Auto-updates partner wallet deductions & earnings breakdown
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-extrabold font-mono text-amber-400">
                    {Math.round(adminMetrics.platformTakeRate * 100)}%
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">Active Take Rate</span>
                </div>
              </div>

              {/* Preset Rate Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  Quick Commission Presets:
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[10, 12, 15, 18, 20].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleSaveCommission(rate)}
                      className={`py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                        Math.round(adminMetrics.platformTakeRate * 100) === rate
                          ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/30 ring-2 ring-amber-400'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider for Custom Rate */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                  <span>Custom Commission Rate:</span>
                  <span className="font-mono text-amber-400 font-bold">{commissionInput}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={35}
                  value={commissionInput}
                  onChange={(e) => setCommissionInput(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>5% (Low fee)</span>
                  <span>20% (Standard)</span>
                  <span>35% (High take)</span>
                </div>
              </div>

              {commissionInput !== Math.round(adminMetrics.platformTakeRate * 100) && (
                <button
                  onClick={() => handleSaveCommission(commissionInput)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs shadow-md transition-all cursor-pointer"
                >
                  Apply & Save {commissionInput}% Rate Globally
                </button>
              )}

              {commissionSavedMsg && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs text-center font-bold">
                  ✓ Successfully saved! Partner terminals are now receiving {100 - Math.round(adminMetrics.platformTakeRate * 100)}% net payout.
                </div>
              )}

              {/* Interactive Calculation Simulator */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Live Dispatch Simulation
                </h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Customer Order Value:</span>
                    <span className="font-mono font-bold text-white">₹1,000</span>
                  </div>
                  <div className="flex justify-between text-amber-400">
                    <span>Platform Commission ({Math.round(adminMetrics.platformTakeRate * 100)}%):</span>
                    <span className="font-mono font-bold">₹{Math.round(1000 * adminMetrics.platformTakeRate)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 pt-1.5 border-t border-slate-800 font-bold">
                    <span>Partner Net Payout ({100 - Math.round(adminMetrics.platformTakeRate * 100)}%):</span>
                    <span className="font-mono text-sm">₹{1000 - Math.round(1000 * adminMetrics.platformTakeRate)}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. BOOKINGS MONITOR TAB (User Requirement) */}
        {/* ========================================================================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-3xl border border-slate-800">
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: `All (${bookings.length})` },
                  { id: 'active', label: `Live / In-flight (${activeBookingsCount})` },
                  { id: 'completed', label: `Completed (${completedBookingsCount})` },
                  { id: 'cancelled', label: `Cancelled` },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setBookingFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      bookingFilter === f.id
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  placeholder="Search customer, partner or ID..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Bookings Table / Cards */}
            <div className="space-y-3">
              {filteredBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-xs bg-slate-800 px-2.5 py-1 rounded-xl text-amber-400 border border-slate-700">
                        #{b.id}
                      </span>
                      <h4 className="text-sm font-bold text-white">{b.serviceName}</h4>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                        {b.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase ${
                        b.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        b.status === 'cancelled' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                      }`}>
                        {b.status.replace('_', ' ')}
                      </span>
                      <span className="text-sm font-extrabold font-mono text-white">
                        ₹{b.totalAmount}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {/* Customer Info */}
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Customer</span>
                      <div className="font-bold text-white">{b.customerName}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>{b.customerPhone}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">
                        {b.customerAddress}
                      </div>
                    </div>

                    {/* Assigned Partner */}
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Assigned Partner</span>
                      <div className="font-bold text-white">
                        {b.partnerName || 'Searching for nearest pro...'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {b.partnerId ? `ID: ${b.partnerId} · Rating ★ 4.9` : 'Unassigned'}
                      </div>
                      <div className="text-[10px] text-amber-400 font-mono">
                        Start OTP: {b.startOtp}
                      </div>
                    </div>

                    {/* Actions & Status Control */}
                    <div className="space-y-1.5 flex flex-col justify-end">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Admin Actions</span>
                      <div className="flex items-center gap-2">
                        {b.status !== 'completed' && b.status !== 'cancelled' && (
                          <button
                            onClick={() => updateBookingStatusAdmin(b.id, 'completed')}
                            className="flex-1 py-1.5 px-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-colors cursor-pointer"
                          >
                            Mark Completed
                          </button>
                        )}
                        {b.status !== 'cancelled' && (
                          <button
                            onClick={() => updateBookingStatusAdmin(b.id, 'cancelled')}
                            className="py-1.5 px-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredBookings.length === 0 && (
                <div className="p-8 text-center bg-slate-900 rounded-3xl border border-slate-800 text-xs text-slate-400">
                  No bookings found matching filter.
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. PARTNER & KYC MANAGEMENT TAB (User Requirement) */}
        {/* ========================================================================= */}
        {activeTab === 'partners' && (
          <div className="space-y-4">
            
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-3xl border border-slate-800">
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: `All Partners (${partners.length})` },
                  { id: 'pending', label: `Pending KYC (${pendingKYCPartners.length})` },
                  { id: 'verified', label: `Verified Active` },
                  { id: 'blocked', label: `Suspended / Blocked` },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setPartnerFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      partnerFilter === f.id
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={partnerSearch}
                  onChange={(e) => setPartnerSearch(e.target.value)}
                  placeholder="Search partner name or phone..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Partners Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredPartners.map((p) => (
                <div
                  key={p.id}
                  className={`p-5 rounded-3xl border space-y-4 transition-all ${
                    p.isBlocked 
                      ? 'bg-slate-900/60 border-rose-500/40 opacity-90'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Top Profile Summary */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={p.avatarUrl} 
                          alt={p.name} 
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-700" 
                        />
                        <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                          p.isBlocked ? 'bg-rose-500' : p.isOnline ? 'bg-emerald-400' : 'bg-slate-500'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{p.name}</h4>
                          {p.isBlocked && (
                            <span className="text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.2 rounded">
                              BLOCKED
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400">
                          {p.categoryName} · {p.experienceYears} Years Exp.
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {p.phone}
                        </div>
                      </div>
                    </div>

                    {/* Block / Unblock Account Action (User Requirement) */}
                    <button
                      onClick={() => togglePartnerBlock(p.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        p.isBlocked
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30'
                      }`}
                      title={p.isBlocked ? 'Unblock partner account' : 'Block partner account'}
                    >
                      {p.isBlocked ? (
                        <>
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Unblock</span>
                        </>
                      ) : (
                        <>
                          <Ban className="w-3.5 h-3.5" />
                          <span>Block Partner</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Partner Stats */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Rating</span>
                      <span className="font-bold text-amber-400 font-mono">★ {p.rating}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total Jobs</span>
                      <span className="font-bold text-white font-mono">{p.totalJobs}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Wallet</span>
                      <span className="font-bold text-emerald-400 font-mono">₹{p.walletBalance}</span>
                    </div>
                  </div>

                  {/* KYC Proof Approval Section (User Requirement) */}
                  <div className="space-y-2 pt-1 border-t border-slate-800">
                    <span className="text-xs font-bold text-slate-300 block">
                      KYC Documents & Verification:
                    </span>

                    <div className="space-y-2">
                      {p.kycDocs.map((doc, idx) => (
                        <div 
                          key={idx}
                          className="p-2.5 bg-slate-800/70 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs gap-2"
                        >
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              <span>{doc.label}</span>
                              <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                                doc.status === 'verified' ? 'bg-emerald-500/20 text-emerald-300' :
                                doc.status === 'rejected' ? 'bg-rose-500/20 text-rose-300' :
                                'bg-amber-500/20 text-amber-300'
                              }`}>
                                {doc.status}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              Doc No: {doc.docNumber || 'Uploaded by Partner'}
                            </div>
                          </div>

                          {/* Approve / Reject Buttons */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {doc.status !== 'verified' && (
                              <button
                                onClick={() => verifyPartnerKYC(p.id, doc.type, true)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-[11px] transition-colors cursor-pointer"
                              >
                                Approve
                              </button>
                            )}
                            {doc.status !== 'rejected' && (
                              <button
                                onClick={() => {
                                  const reason = prompt('Rejection reason:', 'Unclear document upload');
                                  if (reason) verifyPartnerKYC(p.id, doc.type, false, reason);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-semibold text-[11px] transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. EMERGENCY SOS DESK TAB */}
        {/* ========================================================================= */}
        {activeTab === 'sos' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  <span>24/7 Safety & Emergency SOS Center</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time panic signals broadcasted during live jobs
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-full">
                {emergencyAlerts.filter(a => a.status === 'active').length} Active Alerts
              </span>
            </div>

            <div className="space-y-3">
              {emergencyAlerts.map(alert => (
                <div 
                  key={alert.id}
                  className={`p-4 rounded-3xl border space-y-2.5 ${
                    alert.status === 'active' 
                      ? 'bg-rose-500/15 border-rose-500/50 shadow-lg shadow-rose-500/10' 
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      <span>SOS Incident #{alert.id} · Booking {alert.bookingId}</span>
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">{alert.timestamp}</span>
                  </div>

                  <div className="text-xs text-slate-200">
                    <div>Triggered By: <strong className="text-white">{alert.userName} ({alert.userPhone})</strong></div>
                    <div className="text-slate-400 mt-0.5">Location: {alert.location}</div>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 font-mono">
                    {alert.notes}
                  </p>

                  {alert.status === 'active' && (
                    <button
                      onClick={() => resolveEmergencyAlert(alert.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow cursor-pointer transition-colors"
                    >
                      Mark Emergency Resolved
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

    </div>
  );
};
