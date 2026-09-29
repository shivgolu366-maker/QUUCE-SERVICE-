import React, { useState, useEffect } from 'react';
import { useQuickService } from '../../context/QuickServiceContext';
import { Booking } from '../../types';
import { LiveMap } from '../common/LiveMap';
import { RunnerReimbursementSheet } from './RunnerReimbursementSheet';
import { PartnerLoginModal } from './PartnerLoginModal';
import { PartnerProfileEditModal } from './PartnerProfileEditModal';
import { PartnerDailyEarningsChart } from './PartnerDailyEarningsChart';
import { 
  Power, 
  MapPin, 
  Navigation, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Wallet, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Check, 
  Clock, 
  DollarSign, 
  ArrowUpRight, 
  Upload, 
  KeyRound,
  Play,
  RotateCcw,
  Receipt,
  Users,
  Sparkles,
  Radio,
  Edit2,
  LogIn,
  LogOut,
  BadgeCheck,
  Smartphone,
  Flame
} from 'lucide-react';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

export const PartnerApp: React.FC = () => {
  const { 
    partners,
    activePartnerId,
    setActivePartnerId,
    activePartner, 
    togglePartnerOnline, 
    bookings, 
    availableOpenJobs,
    incomingJobOffer, 
    acceptIncomingJob, 
    rejectIncomingJob, 
    updateJobStatus, 
    withdrawPartnerEarnings,
    updateBookingReimbursement,
    startCall,
    openChat,
    triggerEmergencySOS,
    adminMetrics,
    isPartnerLoggedIn,
    setIsPartnerLoggedIn,
    logoutPartner,
    isPartnerLoginModalOpen,
    setIsPartnerLoginModalOpen,
    isPartnerEditModalOpen,
    setIsPartnerEditModalOpen,
    openPhoneAuth
  } = useQuickService();

  const [activeTab, setActiveTab] = useState<'duty' | 'wallet' | 'kyc'>('duty');
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('2000');
  const [withdrawSuccess, setWithdrawSuccess] = useState('');
  const [incomingCountdown, setIncomingCountdown] = useState(30);
  const [dispatchToast, setDispatchToast] = useState<{ message: string; type: 'success' | 'warning' } | null>(null);

  const handleAcceptJob = (bookingId: string, partnerEmployeeId?: string) => {
    if (partnerEmployeeId && partnerEmployeeId !== activePartnerId) {
      setActivePartnerId(partnerEmployeeId);
    }
    const res = acceptIncomingJob(bookingId);
    if (res.success) {
      setDispatchToast({ message: res.message || 'Booking assigned to you!', type: 'success' });
    } else {
      setDispatchToast({ message: res.message || 'Already claimed by another employee!', type: 'warning' });
    }
    setTimeout(() => setDispatchToast(null), 5000);
  };

  // Active assigned job for this partner
  const currentAssignedJob = bookings.find(
    b => b.partnerId === activePartner.id && ['assigned', 'en_route', 'arrived', 'in_progress'].includes(b.status)
  );

  // Incoming offer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (incomingJobOffer) {
      setIncomingCountdown(30);
      timer = setInterval(() => {
        setIncomingCountdown(prev => {
          if (prev <= 1) {
            rejectIncomingJob(incomingJobOffer.id);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [incomingJobOffer]);

  const handleStartJob = () => {
    if (!currentAssignedJob) return;
    const res = updateJobStatus(currentAssignedJob.id, 'in_progress', otpInput.trim());
    if (!res.success) {
      setOtpError(res.message || 'Invalid OTP');
    } else {
      setOtpError('');
      setOtpInput('');
    }
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseInt(withdrawAmount, 10);
    if (amt > 0 && amt <= activePartner.walletBalance) {
      withdrawPartnerEarnings(amt);
      setWithdrawSuccess(`Transferred ₹${amt} to HDFC Bank A/C ending in 4102!`);
      setTimeout(() => {
        setWithdrawSuccess('');
        setWithdrawModal(false);
      }, 1500);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white min-h-full pb-20 select-none">
      
      {/* Top Header Bar */}
      <div className="px-3 sm:px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden border border-amber-500/40">
              <img 
                src={activePartner.avatarUrl} 
                alt={activePartner.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
              activePartner.isOnline ? 'bg-emerald-400' : 'bg-slate-500'
            }`} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Employee selector dropdown to test multiple partners */}
              <select
                value={activePartner.id}
                onChange={(e) => setActivePartnerId(e.target.value)}
                className="bg-slate-800/90 text-white font-bold text-xs rounded-lg px-2 py-0.5 border border-slate-700/80 focus:outline-none focus:border-amber-500 cursor-pointer"
                title="Switch Employee Profile"
              >
                {partners.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name.split(' ')[0]} ({p.categoryName.split(' ')[0]})
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-amber-400 font-mono">
                ★ {activePartner.rating}
              </span>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                KYC ✓
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate max-w-[150px]">
              {activePartner.name} · {activePartner.categoryName}
            </p>
          </div>
        </div>

        {/* Action Controls: Edit Details, Login/Switch, Online Toggle */}
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
          {/* Firebase Phone OTP Trigger */}
          <button
            onClick={() => openPhoneAuth('partner')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 transition-colors cursor-pointer"
            title="Firebase Phone OTP Authentication"
          >
            <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="hidden sm:inline">Phone OTP</span>
            <span className="sm:hidden">OTP</span>
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton variant="compact" />

          {/* Edit Partner Details Button (User Requirement) */}
          <button
            onClick={() => setIsPartnerEditModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 transition-colors cursor-pointer"
            title="Edit Partner Name, Phone, Proof & Account Details"
          >
            <Edit2 className="w-3 h-3" />
            <span className="hidden sm:inline">Edit Details</span>
            <span className="sm:hidden">Edit</span>
          </button>

          {/* Login with Proof & Phone Button */}
          <button
            onClick={() => setIsPartnerLoginModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            title="Login with Phone Number & Identity Proof"
          >
            <LogIn className="w-3 h-3 text-emerald-400" />
            <span className="hidden sm:inline">Partner Login</span>
            <span className="sm:hidden">Login</span>
          </button>

          {/* Online / Offline Toggle Switch */}
          <button
            onClick={togglePartnerOnline}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
              activePartner.isOnline 
                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/10' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{activePartner.isOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Dispatch Toast Banner */}
      {dispatchToast && (
        <div className={`px-4 py-2 text-xs font-bold flex items-center justify-between animate-in slide-in-from-top-2 border-b ${
          dispatchToast.type === 'success' 
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
        }`}>
          <span>{dispatchToast.message}</span>
          <button onClick={() => setDispatchToast(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Primary Partner View Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Tab 1: Duty & Navigation */}
        {activeTab === 'duty' && (
          <div className="flex-1 flex flex-col space-y-4">
            
            {/* Real-time Open Bookings Dispatch Banner (Always visible when a job is waiting) */}
            {availableOpenJobs.length > 0 && (
              <div className="mx-3 sm:mx-4 mt-3 p-3 sm:p-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 rounded-3xl text-slate-950 shadow-2xl border-2 border-amber-300 animate-in slide-in-from-top-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
                    <span className="text-xs font-black tracking-wider uppercase">
                      🚨 New Booking Received ({availableOpenJobs.length} Waiting)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-black bg-slate-950 text-amber-400 px-2 py-0.5 rounded-full border border-amber-400/40">
                    ⚡ First-To-Accept Gets It!
                  </span>
                </div>

                <div className="bg-slate-950/95 text-white p-3 rounded-2xl border border-amber-400/40 space-y-2 shadow-inner">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded">
                          #{availableOpenJobs[0].id}
                        </span>
                        <span className="text-xs font-extrabold text-white truncate">
                          {availableOpenJobs[0].serviceName}
                        </span>
                      </div>
                      
                      <div className="text-[11px] text-slate-300 flex items-center gap-1 mt-1 truncate">
                        <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate">{availableOpenJobs[0].customerAddress}</span>
                      </div>

                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Customer: {availableOpenJobs[0].customerName} · {availableOpenJobs[0].customerPhone}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 block">Your Earning</span>
                      <span className="text-sm font-black font-mono text-emerald-400">
                        ₹{Math.round(availableOpenJobs[0].totalAmount * (1 - adminMetrics.platformTakeRate))}
                      </span>
                    </div>
                  </div>

                  {/* Multi-employee race buttons */}
                  <div className="pt-2 border-t border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-amber-300 font-bold">
                        ⚡ Jo Employee pehle Accept karega usko booking milegi:
                      </span>
                      <span className="text-slate-400 font-mono">1 Click Accept</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {partners.slice(0, 3).map(p => (
                        <button
                          key={p.id}
                          onClick={() => handleAcceptJob(availableOpenJobs[0].id, p.id)}
                          className={`py-2 px-2 rounded-xl text-[11px] font-black flex items-center justify-center gap-1 shadow-md transition-all active:scale-95 cursor-pointer ${
                            activePartner.id === p.id 
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 ring-2 ring-emerald-300' 
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                          }`}
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Accept: {p.name.split(' ')[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* If currently assigned to a job */}
            {currentAssignedJob ? (
              <div className="flex-1 flex flex-col">
                
                {/* Live Navigation Map */}
                <LiveMap 
                  partnerName={activePartner.name}
                  partnerVehicle={activePartner.vehicleInfo}
                  etaMinutes={currentAssignedJob.etaMinutes}
                  status={currentAssignedJob.status}
                  heightClass="h-56"
                />

                <div className="p-4 space-y-3.5 flex-1">
                  
                  {/* Job Header & Customer Card */}
                  <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase font-semibold">
                            {currentAssignedJob.status.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            #{currentAssignedJob.id}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">
                          {currentAssignedJob.serviceName}
                        </h4>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">Your Earning</span>
                        <span className="text-base font-bold font-mono text-emerald-400">
                          ₹{Math.round(currentAssignedJob.totalAmount * (1 - adminMetrics.platformTakeRate))}
                        </span>
                      </div>
                    </div>

                    {/* Customer Info Strip */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                          <span>{currentAssignedJob.customerName}</span>
                          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20 flex items-center gap-0.5">
                            <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                            <span>Aadhaar Verified</span>
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                          <span className="truncate max-w-[180px]">{currentAssignedJob.customerAddress}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openChat(currentAssignedJob.id)}
                          className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 flex items-center justify-center border border-slate-700"
                          title="Chat with Customer"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => startCall(
                            currentAssignedJob.customerName,
                            currentAssignedJob.customerPhone,
                            'https://api.dicebear.com/7.x/avataaars/svg?seed=AaravMalhotra',
                            'customer',
                            currentAssignedJob.id
                          )}
                          className="w-9 h-9 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow"
                          title="Call Customer (Masked)"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Task notes / Audio instruction */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                      <span className="text-slate-500 font-medium block text-[10px]">Customer Notes:</span>
                      <p className="mt-0.5">{currentAssignedJob.taskDescription}</p>
                    </div>
                  </div>

                  {/* Actions depending on stage */}
                  {currentAssignedJob.status === 'assigned' && (
                    <button
                      onClick={() => updateJobStatus(currentAssignedJob.id, 'en_route')}
                      className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Start Navigation / En Route</span>
                    </button>
                  )}

                  {currentAssignedJob.status === 'en_route' && (
                    <button
                      onClick={() => updateJobStatus(currentAssignedJob.id, 'arrived')}
                      className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>I Have Arrived At Customer Location</span>
                    </button>
                  )}

                  {currentAssignedJob.status === 'arrived' && (
                    <div className="p-4 bg-slate-900 rounded-2xl border border-amber-500/40 space-y-3">
                      <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                        <KeyRound className="w-4 h-4" />
                        <span>Enter Customer Start-Job 4-Digit OTP</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Ask customer for their 4-digit security code to verify arrival and initiate bill clock. (Hint: Customer OTP is <span className="font-mono text-amber-400">{currentAssignedJob.startOtp}</span>)
                      </p>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          maxLength={4}
                          value={otpInput}
                          onChange={e => setOtpInput(e.target.value)}
                          placeholder="4-digit OTP"
                          className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-center text-sm font-mono font-bold text-white tracking-widest focus:outline-none focus:border-amber-500"
                        />
                        <button
                          onClick={handleStartJob}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                        >
                          Verify & Start Work
                        </button>
                      </div>
                      {otpError && (
                        <p className="text-[11px] text-rose-400">{otpError}</p>
                      )}
                    </div>
                  )}

                  {/* Runner Grocery & Sabji Mandi Checklist with Bill Reimbursement */}
                  {currentAssignedJob.checklist && currentAssignedJob.checklist.length > 0 && (
                    <RunnerReimbursementSheet
                      booking={currentAssignedJob}
                      onUpdateBooking={(data) => updateBookingReimbursement(currentAssignedJob.id, data)}
                    />
                  )}

                  {currentAssignedJob.status === 'in_progress' && (
                    <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 space-y-3">
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Work is Active / In Progress</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Perform service according to Quick Service quality standards. Collect post-work signature or inspect before completing.
                      </p>
                      <button
                        onClick={() => updateJobStatus(currentAssignedJob.id, 'completed')}
                        className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Complete Job & Collect Payment</span>
                      </button>
                    </div>
                  )}

                </div>
              </div>
            ) : (
              /* Idle Standby Screen / Available Bookings Pool */
              <div className="p-4 space-y-4 flex-1 flex flex-col justify-start">
                {activePartner.isOnline ? (
                  availableOpenJobs.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                            Incoming Bookings Pool ({availableOpenJobs.length})
                          </h4>
                        </div>
                        <span className="text-[10px] text-amber-300 font-bold bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                          ⚡ First-Come, First-Served
                        </span>
                      </div>

                      <div className="p-2.5 bg-amber-500/10 border border-amber-500/25 rounded-2xl text-[11px] text-amber-200">
                        🔔 Jo employee sabse pehle <strong>Accept</strong> karega, booking turant usko mil jayegi!
                      </div>

                      <div className="space-y-3">
                        {availableOpenJobs.map(job => {
                          const guaranteedEarning = Math.round(job.totalAmount * (1 - adminMetrics.platformTakeRate));
                          return (
                            <div 
                              key={job.id} 
                              className="p-4 bg-slate-900 border-2 border-amber-500/40 rounded-3xl space-y-3 shadow-lg shadow-amber-500/5 relative overflow-hidden"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                                      #{job.id}
                                    </span>
                                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                      {job.bookingType === 'instant' ? '⚡ Instant' : '📅 Scheduled'}
                                    </span>
                                  </div>
                                  <h4 className="text-sm font-bold text-white mt-1">
                                    {job.serviceName}
                                  </h4>
                                  <div className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5 flex-wrap">
                                    <span>Customer: {job.customerName}</span>
                                    {job.customerAadhaarVerified && (
                                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20 flex items-center gap-0.5">
                                        <ShieldCheck className="w-2.5 h-2.5" />
                                        <span>Aadhaar Verified</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-[10px] text-slate-400 block">Your Earning</span>
                                  <span className="text-base font-extrabold font-mono text-emerald-400">
                                    ₹{guaranteedEarning}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                                  <span className="truncate max-w-[180px]">{job.customerAddress.split(',')[0]}</span>
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {job.createdAt || 'Just now'}
                                </span>
                              </div>

                              <button
                                onClick={() => handleAcceptJob(job.id)}
                                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                              >
                                <Check className="w-4 h-4 stroke-[3]" />
                                <span>⚡ Accept Job (Pehle Accept Karein)</span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-4 relative overflow-hidden my-auto">
                      {/* Radar pulse ring */}
                      <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" />
                        <div className="absolute inset-3 rounded-full bg-emerald-500/20" />
                        <div className="w-16 h-16 rounded-full bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                          <Navigation className="w-8 h-8 animate-pulse" />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-white">
                          Radar Active: Waiting For New Bookings
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                          Jab koi customer kisi bhi app/tab se booking karega, yahan instant notification aayegi.
                        </p>
                      </div>

                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800/80 rounded-full border border-slate-700 text-[11px] text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>GPS Ping Active · 0 Pending Dispatches</span>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="p-8 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-4 my-auto">
                    <div className="w-16 h-16 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-slate-500">
                      <Power className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        You Are Currently Offline
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                        Toggle the switch at top to go Online and start receiving high-paying instant bookings.
                      </p>
                    </div>
                    <button
                      onClick={togglePartnerOnline}
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-colors cursor-pointer"
                    >
                      Go Online Now
                    </button>
                  </div>
                )}

                {/* Today's Quick Summary Banner */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Today's Earnings</span>
                    <span className="text-lg font-bold font-mono text-emerald-400">
                      ₹{activePartner.todayEarnings}
                    </span>
                  </div>
                  <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Jobs Completed</span>
                    <span className="text-lg font-bold font-mono text-white">
                      3 Completed
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Wallet & Earnings */}
        {activeTab === 'wallet' && (
          <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
            
            {/* Balance Card */}
            <div className="p-5 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/30 rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Withdrawable Balance</span>
                  <span className="text-2xl font-bold font-mono text-white">
                    ₹{activePartner.walletBalance}
                  </span>
                </div>
                <button
                  onClick={() => setWithdrawModal(true)}
                  disabled={activePartner.walletBalance <= 0}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Withdraw</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-500/20 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">This Week's Total</span>
                  <span className="font-mono font-semibold text-emerald-400">₹{activePartner.weeklyEarnings}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Lifetime Bookings</span>
                  <span className="font-mono font-semibold text-white">{activePartner.totalJobs} jobs</span>
                </div>
              </div>
            </div>

            {/* Daily Earnings Trend Chart (Last 7 Days) */}
            <PartnerDailyEarningsChart partner={activePartner} bookings={bookings} />

            {/* Bank Account Info */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Primary Payout Bank</span>
                <span className="text-[11px] text-slate-400 font-mono">HDFC Bank · A/C **4102</span>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono font-semibold">
                VERIFIED
              </span>
            </div>

            {/* Payout History Ledger */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Recent Completed Jobs & Payouts
              </h4>

              <div className="space-y-2">
                {[
                  { id: 'QS-82104', title: 'Plumbing Tap Repair', date: 'Yesterday, 4:30 PM', earned: 399, status: 'Settled' },
                  { id: 'QS-81099', title: 'Bathroom Descaling Fix', date: 'Sep 26, 11:15 AM', earned: 449, status: 'Settled' },
                  { id: 'QS-79810', title: 'Water Tank Pressure Check', date: 'Sep 25, 03:00 PM', earned: 342, status: 'Settled' },
                ].map((item, i) => (
                  <div key={i} className="p-2.5 bg-slate-800/60 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-white">{item.title}</div>
                      <div className="text-[10px] text-slate-400">{item.date} · #{item.id}</div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-400">+₹{item.earned}</span>
                      <span className="text-[9px] text-slate-500 block">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 3: KYC Documents */}
        {activeTab === 'kyc' && (
          <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
            
            {/* KYC Status Badge */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Verification & KYC Status</span>
                <span className="text-[11px] text-slate-400">Government Identity Proof Approved</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                ACTIVE PARTNER
              </span>
            </div>

            {/* Partner Profile Overview Card (User Requirement: Details Edit Option) */}
            <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <img src={activePartner.avatarUrl} alt={activePartner.name} className="w-10 h-10 rounded-full object-cover border border-amber-500/40" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{activePartner.name}</h4>
                    <p className="text-[11px] text-slate-400">{activePartner.categoryName} · {activePartner.experienceYears} Years Exp.</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPartnerEditModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Registered Phone</span>
                  <span className="font-mono font-semibold text-white">{activePartner.phone}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Vehicle Information</span>
                  <span className="font-mono font-semibold text-white truncate block">{activePartner.vehicleInfo || 'Motorcycle'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Instant Payout UPI</span>
                  <span className="font-mono font-semibold text-emerald-400 truncate block">{activePartner.upiId || 'partner@paytm'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Operational City</span>
                  <span className="font-semibold text-white truncate block">{activePartner.city || 'Noida NCR'}</span>
                </div>
              </div>

              {activePartner.skills && activePartner.skills.length > 0 && (
                <div className="pt-1">
                  <span className="text-[10px] text-slate-400 block mb-1">Approved Trade Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {activePartner.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Document Cards */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs px-1">
                <span className="font-bold text-slate-300">Verified KYC Documents</span>
                <span className="text-[10px] text-slate-500">{activePartner.kycDocs.length} Approved</span>
              </div>
              {activePartner.kycDocs.map((doc, i) => (
                <div 
                  key={i}
                  className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-white">{doc.label}</span>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                      doc.status === 'verified'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {doc.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                    <span className="font-mono">Doc #{doc.docNumber}</span>
                    <span>Uploaded {doc.uploadedAt}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions Footer in KYC */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setIsPartnerEditModalOpen(true)}
                className="py-2.5 px-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile Details</span>
              </button>

              <button
                onClick={() => setIsPartnerLoginModalOpen(true)}
                className="py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                <span>Switch / Login</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Incoming Job Request Push Modal */}
      {incomingJobOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in zoom-in-95">
          <div className="w-full max-w-sm bg-slate-900 border-2 border-amber-500 rounded-3xl p-5 space-y-4 shadow-2xl relative overflow-hidden">
            
            {/* Top countdown timer bar */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span>New Job Request!</span>
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-white">
                {incomingCountdown}s
              </span>
            </div>

            {/* Job Details Preview (Masked for Privacy until Accepted) */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase font-semibold">
                  New Lead
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  #{incomingJobOffer.id}
                </span>
              </div>
              <h3 className="text-base font-bold text-white">
                {incomingJobOffer.serviceName}
              </h3>
              <p className="text-xs text-slate-400 italic">
                🔒 Specific service notes & customer flat details unlocked upon acceptance
              </p>
            </div>

            {/* Masked Location & Contact Strip */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Distance</span>
                <span className="font-mono text-amber-400">~1.8 km (8-10 min away)</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Area / Sector</span>
                <span className="font-semibold text-white">Sector 100, Noida</span>
              </div>
              <div className="flex items-center justify-between text-slate-300 text-[11px]">
                <span>Customer Profile</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Aadhaar Verified Citizen</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300 text-[11px]">
                <span>Customer Phone</span>
                <span className="text-amber-400/90 font-mono flex items-center gap-1">
                  🔒 +91 98201 •••••
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300 text-[11px]">
                <span>Exact Address</span>
                <span className="text-slate-400 italic text-[10px]">
                  Revealed on Accept
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300 font-bold pt-2 border-t border-slate-800">
                <span>Guaranteed Earning</span>
                <span className="font-mono text-emerald-400 text-sm">
                  ₹{Math.round(incomingJobOffer.totalAmount * (1 - adminMetrics.platformTakeRate))}
                </span>
              </div>
            </div>

            <div className="p-2 bg-amber-500/15 border border-amber-500/30 rounded-xl text-[11px] text-amber-300 font-semibold text-center">
              ⚡ First-Come, First-Served: Sabse pehle Accept karne wale employee ko booking milegi!
            </div>

            {/* Accept / Reject Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => rejectIncomingJob(incomingJobOffer.id)}
                className="h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Decline</span>
              </button>

              <button
                onClick={() => handleAcceptJob(incomingJobOffer.id)}
                className="h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 animate-pulse cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>⚡ Accept Job Now</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Cashout / Withdraw Modal */}
      {withdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Instant Bank Transfer</h3>
              <button onClick={() => setWithdrawModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Enter Amount (Max ₹{activePartner.walletBalance})</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">₹</span>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(e.target.value)}
                    max={activePartner.walletBalance}
                    min={100}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                Payout will be instantly deposited via IMPS to HDFC Bank A/C **4102. Zero transaction charges.
              </div>

              {withdrawSuccess ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl text-center">
                  {withdrawSuccess}
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Confirm Payout
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Fixed Bottom Tab Bar for Partner */}
      <div className="sticky bottom-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-md border-t border-slate-800">
        <div className="grid grid-cols-3 items-center h-16 px-4">
          <button
            onClick={() => setActiveTab('duty')}
            className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
              activeTab === 'duty' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Navigation className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">Duty & Nav</span>
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
              activeTab === 'wallet' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wallet className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">Earnings</span>
          </button>

          <button
            onClick={() => setActiveTab('kyc')}
            className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
              activeTab === 'kyc' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">KYC Docs</span>
          </button>
        </div>
      </div>

      {/* Partner Details Edit Modal (User Requirement) */}
      <PartnerProfileEditModal
        isOpen={isPartnerEditModalOpen}
        onClose={() => setIsPartnerEditModalOpen(false)}
      />

      {/* Partner Login with Phone Number & Identity Proof Modal (User Requirement) */}
      <PartnerLoginModal
        isOpen={isPartnerLoginModalOpen}
        onClose={() => setIsPartnerLoginModalOpen(false)}
      />

    </div>
  );
};
