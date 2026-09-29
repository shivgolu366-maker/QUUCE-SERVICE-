import React from 'react';
import { useQuickService } from '../../context/QuickServiceContext';
import { Mic, MicOff, Volume2, VolumeX, PhoneOff, ShieldCheck } from 'lucide-react';

export const CallingModal: React.FC = () => {
  const { callState, endCall, toggleMute, toggleSpeaker } = useQuickService();

  if (!callState.isOpen) return null;

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Mask middle digits of phone number
  const maskPhone = (phone: string) => {
    if (phone.length < 8) return '+91 98*** 4210';
    return phone.slice(0, 6) + '*****' + phone.slice(-3);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-6 border border-slate-800 text-center shadow-2xl relative overflow-hidden flex flex-col items-center">
        
        {/* Top Masked Privacy Marker */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[11px] text-emerald-400 font-medium mb-6">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Number Masked for Privacy</span>
        </div>

        {/* Contact Avatar with Animated Pulse Rings */}
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-slate-800 p-1 border-2 border-amber-500/40 shadow-xl overflow-hidden">
            <img 
              src={callState.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Professional'} 
              alt={callState.partnerOrUserName}
              className="w-full h-full object-cover"
            />
          </div>
          {callState.status === 'calling' && (
            <div className="absolute inset-0 rounded-full border-2 border-amber-400 animate-ping opacity-30 pointer-events-none" />
          )}
        </div>

        {/* Contact Name & Role */}
        <h3 className="text-xl font-bold text-white tracking-tight mb-1">
          {callState.partnerOrUserName}
        </h3>
        <p className="text-xs text-slate-400 mb-2">
          {callState.role === 'partner' ? 'Service Professional' : 'Customer'}
        </p>

        {/* Masked Relay Number */}
        <div className="text-xs font-mono text-amber-400/90 bg-slate-800/60 px-3 py-1 rounded-md border border-slate-700/50 mb-6">
          {maskPhone(callState.phoneNumber)}
        </div>

        {/* Call Status / Timer */}
        <div className="text-sm font-medium mb-8">
          {callState.status === 'calling' ? (
            <div className="flex items-center justify-center gap-2 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Dialing via Secure Relay...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-mono text-base">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{formatDuration(callState.durationSeconds)}</span>
            </div>
          )}
        </div>

        {/* In-Call Actions */}
        <div className="flex items-center justify-center gap-5 w-full mb-4">
          {/* Mute */}
          <button
            onClick={toggleMute}
            className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
              callState.isMuted 
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {callState.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            <span className="text-[10px]">{callState.isMuted ? 'Muted' : 'Mute'}</span>
          </button>

          {/* End Call */}
          <button
            onClick={endCall}
            className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 active:scale-95 transition-transform"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          {/* Speaker */}
          <button
            onClick={toggleSpeaker}
            className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
              callState.isSpeaker 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {callState.isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            <span className="text-[10px]">{callState.isSpeaker ? 'Speaker' : 'Earpiece'}</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-500 mt-2">
          Calls are routed through an encrypted PBX proxy without disclosing personal SIM numbers.
        </p>
      </div>
    </div>
  );
};
