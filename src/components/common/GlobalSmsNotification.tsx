import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Check, Copy, Sparkles, Bell } from 'lucide-react';
import { playSmsNotificationSound } from '../../utils/audioNotify';

export interface SmsEventDetail {
  phone: string;
  otp: string;
  sender?: string;
  message?: string;
}

export const triggerAppSms = (phone: string, otp: string, sender = 'VK-QKSERV') => {
  const detail: SmsEventDetail = {
    phone,
    otp,
    sender,
    message: `Dear Customer, ${otp} is your QuickService verification OTP. Valid for 10 mins. Do not share.`
  };
  window.dispatchEvent(new CustomEvent('quick_service_sms', { detail }));

  // Try browser native Notification API if allowed
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(`💬 ${sender}`, {
        body: detail.message,
        icon: '/favicon.ico'
      });
    } catch (e) {}
  }
};

export const GlobalSmsNotification: React.FC = () => {
  const [notification, setNotification] = useState<SmsEventDetail | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleSmsEvent = (e: any) => {
      if (e.detail) {
        setNotification(e.detail);
        setCopied(false);
        playSmsNotificationSound();

        // Vibration on mobile if supported
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try {
            navigator.vibrate([100, 60, 100]);
          } catch (err) {}
        }
      }
    };

    window.addEventListener('quick_service_sms', handleSmsEvent);
    return () => window.removeEventListener('quick_service_sms', handleSmsEvent);
  }, []);

  // Auto-dismiss after 10 seconds
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      setNotification(null);
    }, 10000);
    return () => clearTimeout(timer);
  }, [notification]);

  if (!notification) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(notification.otp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside aria-label="Incoming SMS Alert" className="fixed top-2.5 left-2 right-2 sm:left-auto sm:right-4 sm:w-[390px] z-50 animate-in slide-in-from-top-4 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-xl border-2 border-emerald-500/50 rounded-3xl p-3.5 shadow-2xl text-white space-y-2.5 ring-1 ring-emerald-500/20">
        
        {/* Top OS Header Bar */}
        <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center shadow">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-extrabold text-[11px] tracking-wide text-white block">
                {notification.sender || 'VK-QKSERV'}
              </span>
              <span className="text-[9px] text-slate-400">Incoming SMS · Just now</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
              SIM 1
            </span>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* SMS Message Body */}
        <div className="text-xs space-y-1">
          <p className="text-slate-200 leading-relaxed font-sans">
            Dear Customer, your QuickService OTP is{' '}
            <strong className="font-mono text-sm font-extrabold text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30">
              {notification.otp}
            </strong>
            . Valid for 10 minutes. Do not share this OTP with anyone.
          </p>
          <p className="text-[10px] text-slate-400 font-mono">
            Sent to +91 {notification.phone}
          </p>
        </div>

        {/* Fast Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleCopy}
            className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Copied {notification.otp}!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code ({notification.otp})</span>
              </>
            )}
          </button>

          <button
            onClick={() => setNotification(null)}
            className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>

      </div>
    </aside>
  );
};
