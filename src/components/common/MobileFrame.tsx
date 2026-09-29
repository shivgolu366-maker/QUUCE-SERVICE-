import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  title?: string;
  isResponsive?: boolean;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children, isResponsive = false }) => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  if (isResponsive) {
    return (
      <div className="w-full max-w-2xl mx-auto min-h-[calc(100vh-3.5rem)] bg-slate-950 text-slate-100 shadow-2xl pb-12 border-x border-slate-800">
        {children}
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-8 flex justify-center items-center min-h-[calc(100vh-3.5rem)] bg-slate-950/60 p-2 sm:p-4">
      {/* Outer Phone Shell */}
      <div className="relative w-full max-w-[410px] h-[840px] bg-slate-900 rounded-[50px] p-3 shadow-[0_0_60px_-15px_rgba(0,0,0,0.8)] border-4 border-slate-700/80 ring-1 ring-white/10 flex flex-col overflow-hidden">
        
        {/* Hardware details: Side buttons simulation */}
        <div className="absolute -left-[7px] top-28 w-[3px] h-9 bg-slate-600 rounded-l-sm" />
        <div className="absolute -left-[7px] top-40 w-[3px] h-12 bg-slate-600 rounded-l-sm" />
        <div className="absolute -left-[7px] top-56 w-[3px] h-12 bg-slate-600 rounded-l-sm" />
        <div className="absolute -right-[7px] top-36 w-[3px] h-16 bg-slate-600 rounded-r-sm" />

        {/* Screen Bezel */}
        <div className="relative w-full h-full bg-slate-950 rounded-[40px] overflow-hidden flex flex-col border border-slate-800/80 shadow-inner">
          
          {/* iOS / Android Status Bar */}
          <div className="h-10 w-full px-7 flex items-center justify-between z-40 bg-slate-950 text-white select-none">
            {/* Clock */}
            <span className="text-xs font-semibold tracking-tight">{currentTime || '09:41'}</span>

            {/* Dynamic Island / Camera Notch */}
            <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center gap-1.5 border border-white/5 shadow-inner">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-950" />
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1.5 text-slate-300">
              <Signal className="w-3 h-3 text-slate-200" />
              <Wifi className="w-3 h-3 text-slate-200" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-mono font-medium">96%</span>
                <BatteryMedium className="w-3.5 h-3.5 text-slate-200" />
              </div>
            </div>
          </div>

          {/* App Screen Content Scrollable Container */}
          <div className="relative flex-1 overflow-y-auto no-scrollbar flex flex-col bg-slate-950">
            {children}
          </div>

          {/* Home Indicator bar */}
          <div className="h-5 w-full bg-slate-950 flex items-center justify-center z-40 pointer-events-none pb-1">
            <div className="w-32 h-1 bg-slate-700/80 rounded-full" />
          </div>

        </div>
      </div>
    </div>
  );
};
