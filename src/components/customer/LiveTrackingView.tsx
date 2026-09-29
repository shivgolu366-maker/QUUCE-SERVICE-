import React, { useState } from 'react';
import { useQuickService } from '../../context/QuickServiceContext';
import { LiveMap } from '../common/LiveMap';
import { 
  ArrowLeft, 
  Phone, 
  MessageSquare, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Star, 
  KeyRound, 
  AlertTriangle,
  Play,
  RotateCcw,
  FileText
} from 'lucide-react';

interface LiveTrackingViewProps {
  onBack: () => void;
  onOpenRating: () => void;
}

export const LiveTrackingView: React.FC<LiveTrackingViewProps> = ({ 
  onBack,
  onOpenRating
}) => {
  const { 
    activeBooking, 
    cancelBooking, 
    startCall, 
    openChat, 
    triggerEmergencySOS,
    updateJobStatus,
    setViewMode
  } = useQuickService();

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [sosSent, setSosSent] = useState(false);

  if (!activeBooking) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-xs text-slate-400">No active service booking found.</p>
        <button 
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-white"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const steps = [
    { id: 'searching', label: 'Matching Pro' },
    { id: 'assigned', label: 'Pro Assigned' },
    { id: 'en_route', label: 'En Route' },
    { id: 'arrived', label: 'At Doorstep' },
    { id: 'in_progress', label: 'Work In Progress' },
    { id: 'completed', label: 'Completed' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === activeBooking.status);

  const handleSos = () => {
    triggerEmergencySOS(activeBooking.id, 'customer');
    setSosSent(true);
    setTimeout(() => setSosSent(false), 5000);
  };

  // Simulation shortcut to advance status for testing
  const advanceStatus = () => {
    if (activeBooking.status === 'searching') {
      updateJobStatus(activeBooking.id, 'assigned');
    } else if (activeBooking.status === 'assigned') {
      updateJobStatus(activeBooking.id, 'en_route');
    } else if (activeBooking.status === 'en_route') {
      updateJobStatus(activeBooking.id, 'arrived');
    } else if (activeBooking.status === 'arrived') {
      updateJobStatus(activeBooking.id, 'in_progress', activeBooking.startOtp);
    } else if (activeBooking.status === 'in_progress') {
      updateJobStatus(activeBooking.id, 'completed');
      onOpenRating();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white min-h-full pb-20">
      
      {/* Top Header */}
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between z-20">
        <div className="flex items-center gap-2.5">
          <button 
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="text-xs font-bold text-white tracking-tight">
              Live Service Tracking
            </h3>
            <span className="text-[10px] text-amber-400 font-mono">
              Booking #{activeBooking.id}
            </span>
          </div>
        </div>

        {/* SOS Panic Button */}
        <button
          onClick={handleSos}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 text-xs font-bold transition-colors"
          title="Emergency 24x7 SOS Support"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span>SOS</span>
        </button>
      </div>

      {/* SOS Alert Notification Toast */}
      {sosSent && (
        <div className="mx-4 mt-2 p-3 bg-rose-600/90 text-white rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Emergency alert triggered! 24/7 Safety Desk is coordinating with nearest patrol.</span>
        </div>
      )}

      {/* Interactive Vector Map with Route & Live Markers */}
      <LiveMap 
        partnerName={activeBooking.partnerName}
        partnerVehicle={activeBooking.partnerVehicle}
        etaMinutes={activeBooking.etaMinutes}
        status={activeBooking.status}
        heightClass="h-56"
      />

      {/* Tracking Sheet Body */}
      <div className="p-4 space-y-4 flex-1">
        
        {/* Status Stepper Progression */}
        <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white">Status</span>
            <span className="text-amber-400 font-semibold font-mono text-[11px] uppercase">
              {activeBooking.status.replace('_', ' ')}
            </span>
          </div>

          <div className="relative flex items-center justify-between">
            <div className="absolute left-2 right-2 top-3 h-0.5 bg-slate-800 -z-0" />
            <div 
              className="absolute left-2 top-3 h-0.5 bg-amber-500 -z-0 transition-all duration-500"
              style={{ width: `${Math.min(100, (currentStepIndex / (steps.length - 1)) * 100)}%` }}
            />
            {steps.map((st, i) => {
              const isPassed = i <= currentStepIndex;
              const isCurrent = i === currentStepIndex;
              return (
                <div key={st.id} className="relative z-10 flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    isPassed 
                      ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400/30' 
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className={`text-[8px] mt-1 tracking-tight text-center max-w-[48px] ${
                    isCurrent ? 'text-amber-400 font-bold' : isPassed ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick simulator helper button */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[10px] text-slate-500">Live Simulation Mode:</span>
            {activeBooking.status !== 'completed' ? (
              <button
                onClick={advanceStatus}
                className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Simulate Next Step &rarr;</span>
              </button>
            ) : (
              <button
                onClick={onOpenRating}
                className="text-[10px] text-emerald-400 font-bold underline"
              >
                Rate & Review Professional &rarr;
              </button>
            )}
          </div>
        </div>

        {/* Start Security OTP Card */}
        {activeBooking.status !== 'completed' && (
          <div className="p-3.5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent rounded-2xl border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Start Job Security Code</span>
                <span className="text-[10px] text-slate-400">Share with partner only after arrival</span>
              </div>
            </div>
            <div className="px-3 py-1.5 bg-slate-900 rounded-xl border border-amber-500/40 text-amber-400 font-mono font-extrabold text-lg tracking-widest shadow-inner">
              {activeBooking.startOtp}
            </div>
          </div>
        )}

        {/* Live Broadcast Dispatch Waiting Card (when searching for employee) */}
        {activeBooking.status === 'searching' && (
          <div className="p-4 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent rounded-2xl border border-amber-500/40 space-y-2.5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span>Broadcasting to Nearby Partner Employees...</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                LIVE DISPATCH
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Aapki booking sabhi online employees ko bhej di gayi hai. Jo employee sabse pehle <strong>Accept</strong> karega, use assign ho jayegi!
            </p>
            <div className="pt-1 flex items-center gap-2">
              <button
                onClick={() => setViewMode('partner')}
                className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer active:scale-95"
              >
                <span>👷 Partner App Mein Jaakar Booking Accept Karein &rarr;</span>
              </button>
            </div>
          </div>
        )}

        {/* Assigned Partner Profile Card */}
        {activeBooking.partnerName && (
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 overflow-hidden border border-amber-500/30">
                    <img 
                      src={activeBooking.partnerAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Professional'} 
                      alt={activeBooking.partnerName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[9px] font-bold">
                    ✓
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-white">
                      {activeBooking.partnerName}
                    </h4>
                    <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded font-medium">
                      KYC Verified
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Star className="w-3 h-3 fill-current" /> {activeBooking.partnerRating || 4.9}
                    </span>
                    <span>·</span>
                    <span className="truncate max-w-[130px]">{activeBooking.partnerVehicle}</span>
                  </div>
                </div>
              </div>

              {/* Call & Chat Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openChat(activeBooking.id)}
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 flex items-center justify-center transition-colors border border-slate-700"
                  title="In-App Chat"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>

                <button
                  onClick={() => startCall(
                    activeBooking.partnerName || 'Partner',
                    activeBooking.partnerPhone || '+91 98765 43210',
                    activeBooking.partnerAvatar || '',
                    'partner',
                    activeBooking.id
                  )}
                  className="w-10 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center transition-colors shadow-md shadow-emerald-500/20"
                  title="Masked Phone Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Task Description Preview */}
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] text-slate-300">
              <span className="text-slate-500 font-medium block text-[10px]">Your Task Notes:</span>
              <p className="line-clamp-2 mt-0.5">{activeBooking.taskDescription}</p>
            </div>
          </div>
        )}

        {/* Shopping Checklist Live Status (if checklist exists) */}
        {activeBooking.checklist && activeBooking.checklist.length > 0 && (
          <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Live Shopping Checklist</span>
              </span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-semibold">
                {activeBooking.checklist.filter(i => i.isPurchased).length} / {activeBooking.checklist.length} Purchased
              </span>
            </div>

            <div className="space-y-1 max-h-36 overflow-y-auto no-scrollbar">
              {activeBooking.checklist.map((item) => (
                <div
                  key={item.id}
                  className={`p-2 rounded-xl border flex items-center justify-between text-xs ${
                    item.isPurchased 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${
                      item.isPurchased ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {item.isPurchased ? '✓' : '•'}
                    </span>
                    <span className={item.isPurchased ? 'line-through text-slate-400' : 'font-medium'}>
                      {item.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Cash memo photo & items reimbursement summary */}
            {activeBooking.reimbursement?.billPhotoUrl && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 mt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-sky-400" />
                    <span>Shopkeeper Cash Memo Attached</span>
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">
                    +₹{activeBooking.reimbursement.totalItemsAmount}
                  </span>
                </div>

                <div className="relative rounded-lg overflow-hidden border border-slate-800 h-24 bg-slate-900">
                  <img 
                    src={activeBooking.reimbursement.billPhotoUrl} 
                    alt="Verified Mandi Memo" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 left-2 text-[9px] font-mono text-white bg-black/70 px-1.5 py-0.2 rounded">
                    Verified Memo Stamp
                  </div>
                </div>

                <p className="text-[10px] text-slate-400">
                  Formula applied: (Labor ₹{activeBooking.laborRate || 149} × {activeBooking.hoursSpent || 1} hr) + Actual Items (₹{activeBooking.reimbursement.totalItemsAmount}) = <strong className="text-amber-400 font-mono">₹{activeBooking.totalAmount}</strong>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Order Details & Bill Summary */}
        <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span>Service</span>
            <span className="font-semibold text-white">{activeBooking.serviceName}</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Payment Mode</span>
            <span className="font-mono uppercase text-amber-400">{activeBooking.paymentMethod} ({activeBooking.paymentStatus})</span>
          </div>
          <div className="flex items-center justify-between font-bold text-white pt-1.5 border-t border-slate-800">
            <span>Amount</span>
            <span className="text-amber-400 font-mono text-sm">₹{activeBooking.totalAmount}</span>
          </div>
        </div>

        {/* Cancel Booking Action (if not in progress or completed) */}
        {['searching', 'assigned', 'en_route'].includes(activeBooking.status) && (
          <div className="text-center pt-1">
            {!showCancelDialog ? (
              <button
                onClick={() => setShowCancelDialog(true)}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium transition-colors"
              >
                Need to cancel this booking?
              </button>
            ) : (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl space-y-2 text-left animate-in fade-in">
                <span className="text-xs font-semibold text-rose-300 block">Cancel Booking?</span>
                <p className="text-[11px] text-slate-400">
                  Free cancellation before partner arrives. Are you sure you want to proceed?
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => cancelBooking(activeBooking.id)}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                  >
                    Yes, Cancel
                  </button>
                  <button
                    onClick={() => setShowCancelDialog(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium"
                  >
                    Keep Booking
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
