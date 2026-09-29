import React from 'react';
import { useOnlineStatus } from '../../hooks/usePWAInstall';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto z-50 flex items-center gap-2.5 rounded-2xl bg-amber-500 text-slate-950 px-4 py-2.5 text-xs font-bold shadow-2xl animate-bounce">
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>Offline Mode — Cached Quick Service data is active</span>
      <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping ml-auto sm:ml-2" />
    </div>
  );
};
