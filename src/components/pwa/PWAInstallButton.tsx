import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, Share, PlusSquare, CheckCircle2, X, Apple, Sparkles } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'primary' | 'compact' | 'outline' | 'banner';
  showLabel?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'primary',
  showLabel = true,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showDirectGuide, setShowDirectGuide] = useState(false);

  // If already installed and running standalone
  if (isInstalled) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold ${className}`}>
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
        <span className="hidden sm:inline">Installed</span>
      </span>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setShowDirectGuide(true);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      setShowDirectGuide(true);
    }
  };

  // Compact variant for header or navbar
  if (variant === 'compact') {
    return (
      <>
        <button
          onClick={handleInstallClick}
          className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm shrink-0 ${
            isInstallable
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/20 active:scale-95'
              : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
          } ${className}`}
          title="Install Quick Service on your Android, iOS, or Desktop home screen"
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          {showLabel && (
            <>
              <span className="hidden md:inline">Install App</span>
              <span className="md:hidden">Install</span>
            </>
          )}
        </button>

        {showIOSModal && <IOSInstallModal onClose={() => setShowIOSModal(false)} />}
        {showDirectGuide && <GeneralInstallGuideModal onClose={() => setShowDirectGuide(false)} />}
      </>
    );
  }

  // Outline variant
  if (variant === 'outline') {
    return (
      <>
        <button
          onClick={handleInstallClick}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 transition-all cursor-pointer ${className}`}
        >
          <Download className="w-4 h-4 shrink-0" />
          <span>Install Web App (PWA)</span>
        </button>

        {showIOSModal && <IOSInstallModal onClose={() => setShowIOSModal(false)} />}
        {showDirectGuide && <GeneralInstallGuideModal onClose={() => setShowDirectGuide(false)} />}
      </>
    );
  }

  // Primary variant
  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer ${className}`}
      >
        <Smartphone className="w-4 h-4 shrink-0" />
        <span>Install App on Phone</span>
        <span className="text-[10px] font-mono uppercase bg-slate-950/20 px-1.5 py-0.5 rounded text-slate-950 font-bold ml-0.5">
          PWA
        </span>
      </button>

      {showIOSModal && <IOSInstallModal onClose={() => setShowIOSModal(false)} />}
      {showDirectGuide && <GeneralInstallGuideModal onClose={() => setShowDirectGuide(false)} />}
    </>
  );
};

const IOSInstallModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white">
              <Apple className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Install on iPhone / iPad</h3>
              <p className="text-[11px] text-slate-400">Add to Home Screen in 2 steps</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 py-1">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
              1
            </div>
            <div className="text-xs text-slate-200">
              Tap the <strong className="text-white">Share</strong> button <Share className="w-3.5 h-3.5 inline mx-1 text-amber-400" /> at the bottom or top of Safari toolbar.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
              2
            </div>
            <div className="text-xs text-slate-200">
              Scroll down and tap <strong className="text-white">Add to Home Screen</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-amber-400" />.
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Launches in full-screen native standalone mode with instant startup!</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

const GeneralInstallGuideModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Install Quick Service App</h3>
              <p className="text-[11px] text-slate-400">Direct Home Screen Installation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5 text-xs text-slate-300">
          <p className="leading-relaxed">
            This Progressive Web App (PWA) can be installed directly without visiting app stores:
          </p>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>🤖 Android / Chrome:</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Tap the Chrome menu (⋮) in the top-right and select <strong className="text-amber-400">Install app</strong> or <strong className="text-amber-400">Add to Home screen</strong>.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>🍎 iPhone / iPad (Safari):</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Tap the Share button and select <strong className="text-amber-400">Add to Home Screen</strong>.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>💻 Desktop / Edge / Chrome:</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Click the install icon in your browser address bar on the right.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
