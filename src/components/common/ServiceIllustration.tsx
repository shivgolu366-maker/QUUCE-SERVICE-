import React from 'react';
import { 
  ShoppingBag, 
  Car, 
  Box, 
  Pill, 
  Sparkles, 
  Wrench, 
  Zap, 
  Hammer, 
  Tv, 
  Paintbrush, 
  Shirt, 
  UtensilsCrossed, 
  UserCheck, 
  HardHat, 
  Clock, 
  Bike,
  ShieldCheck,
  Check
} from 'lucide-react';

interface ServiceIllustrationProps {
  type?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  badgeTitle?: string;
}

export const ServiceIllustration: React.FC<ServiceIllustrationProps> = ({
  type = 'general',
  className = '',
  size = 'md',
  badgeTitle
}) => {
  // SVG illustrations designed cleanly without broken external URLs
  const renderVisual = () => {
    switch (type) {
      case 'sabji':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-tr from-emerald-600/30 to-green-500/20 text-emerald-400">
            <svg viewBox="0 0 64 64" className="w-4/5 h-4/5 drop-shadow-md" fill="none">
              {/* Basket */}
              <path d="M12 28 C12 28, 16 52, 32 52 C48 52, 52 28, 52 28 Z" fill="#15803d" opacity="0.3" stroke="#22c55e" strokeWidth="2.5" />
              <path d="M10 28 L54 28" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
              <path d="M22 28 C22 14, 42 14, 42 28" stroke="#86efac" strokeWidth="2" strokeDasharray="3 3" />
              {/* Vegetables: Carrot, Tomato, Leaf */}
              <circle cx="26" cy="24" r="8" fill="#ef4444" stroke="#f87171" strokeWidth="1.5" />
              <path d="M26 16 L28 12" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
              <path d="M36 26 L46 16 L49 19 L39 29 Z" fill="#f97316" stroke="#ea580c" strokeWidth="1.5" />
              <circle cx="34" cy="22" r="7" fill="#84cc16" opacity="0.9" />
              {/* Leaf detail */}
              <path d="M22 16 Q20 10 15 12 Q20 18 22 16" fill="#22c55e" />
            </svg>
            <span className="absolute bottom-1 right-1 text-[8px] font-bold font-mono px-1 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
              FRESH
            </span>
          </div>
        );

      case 'kirana':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-tr from-amber-600/30 to-yellow-500/20 text-amber-400">
            <svg viewBox="0 0 64 64" className="w-4/5 h-4/5 drop-shadow-md" fill="none">
              {/* Grocery Bag */}
              <path d="M16 22 L18 52 C18 54, 46 54, 46 52 L48 22 Z" fill="#b45309" opacity="0.3" stroke="#f59e0b" strokeWidth="2.5" />
              <path d="M24 22 C24 14, 40 14, 40 22" stroke="#fde68a" strokeWidth="2.5" strokeLinecap="round" />
              {/* Milk bottle & bread popping out */}
              <rect x="22" y="10" width="8" height="15" rx="2" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
              <rect x="24" y="8" width="4" height="3" rx="1" fill="#38bdf8" />
              <rect x="33" y="14" width="9" height="12" rx="3" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
              {/* Cart / Store Stamp */}
              <circle cx="32" cy="38" r="6" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />
            </svg>
            <span className="absolute bottom-1 right-1 text-[8px] font-bold font-mono px-1 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30">
              KIRANA
            </span>
          </div>
        );

      case 'medicine':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-tr from-rose-600/30 to-pink-500/20 text-rose-400">
            <svg viewBox="0 0 64 64" className="w-4/5 h-4/5 drop-shadow-md" fill="none">
              {/* First Aid Cross Badge */}
              <rect x="14" y="14" width="36" height="36" rx="10" fill="#be123c" opacity="0.25" stroke="#f43f5e" strokeWidth="2" />
              <path d="M32 20 L32 44 M20 32 L44 32" stroke="#fda4af" strokeWidth="4" strokeLinecap="round" />
              {/* Capsule Pill overlay */}
              <g transform="translate(36, 34) rotate(-35)">
                <rect x="0" y="0" width="16" height="8" rx="4" fill="#3b82f6" stroke="#60a5fa" strokeWidth="1" />
                <rect x="8" y="0" width="8" height="8" rx="0" fill="#f43f5e" />
              </g>
            </svg>
            <span className="absolute bottom-1 right-1 text-[8px] font-bold font-mono px-1 py-0.2 rounded bg-rose-950/80 text-rose-300 border border-rose-500/30">
              Rx PHARMA
            </span>
          </div>
        );

      case 'courier':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-tr from-sky-600/30 to-blue-500/20 text-sky-400">
            <svg viewBox="0 0 64 64" className="w-4/5 h-4/5 drop-shadow-md" fill="none">
              {/* Isometric Parcel Box */}
              <path d="M32 12 L50 22 L32 32 L14 22 Z" fill="#0284c7" opacity="0.4" stroke="#38bdf8" strokeWidth="2" />
              <path d="M14 22 L14 42 L32 52 L32 32 Z" fill="#0369a1" opacity="0.3" stroke="#38bdf8" strokeWidth="2" />
              <path d="M50 22 L50 42 L32 52 L32 32 Z" fill="#0284c7" opacity="0.5" stroke="#38bdf8" strokeWidth="2" />
              {/* Tape */}
              <path d="M23 17 L41 27 M32 32 L32 52" stroke="#fde047" strokeWidth="2" />
              {/* Speed Lines */}
              <path d="M8 28 L4 28 M9 35 L5 35" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="absolute bottom-1 right-1 text-[8px] font-bold font-mono px-1 py-0.2 rounded bg-sky-950/80 text-sky-300 border border-sky-500/30">
              EXPRESS
            </span>
          </div>
        );

      case 'labor':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-tr from-orange-600/30 to-amber-500/20 text-orange-400">
            <svg viewBox="0 0 64 64" className="w-4/5 h-4/5 drop-shadow-md" fill="none">
              {/* Worker Hard Hat & Tools */}
              <path d="M18 30 C18 18, 46 18, 46 30 Z" fill="#f59e0b" opacity="0.4" stroke="#fbbf24" strokeWidth="2.5" />
              <path d="M14 30 L50 30" stroke="#fcd34d" strokeWidth="3" strokeLinecap="round" />
              <rect x="29" y="16" width="6" height="14" fill="#f59e0b" rx="2" />
              {/* Crossed Wrench & Hammer */}
              <path d="M20 48 L44 36" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M44 48 L20 36" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="32" cy="42" r="3" fill="#ea580c" />
            </svg>
            <span className="absolute bottom-1 right-1 text-[8px] font-bold font-mono px-1 py-0.2 rounded bg-orange-950/80 text-orange-300 border border-orange-500/30">
              HOURLY
            </span>
          </div>
        );

      case 'pickdrop':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-tr from-indigo-600/30 to-blue-500/20 text-indigo-400">
            <svg viewBox="0 0 64 64" className="w-4/5 h-4/5 drop-shadow-md" fill="none">
              {/* Car & Pin */}
              <path d="M14 38 L20 28 C21 26, 43 26, 44 28 L50 38 L52 45 C52 46, 12 46, 12 45 Z" fill="#4338ca" opacity="0.35" stroke="#818cf8" strokeWidth="2" />
              <circle cx="22" cy="46" r="4" fill="#1e1b4b" stroke="#a5b4fc" strokeWidth="2" />
              <circle cx="42" cy="46" r="4" fill="#1e1b4b" stroke="#a5b4fc" strokeWidth="2" />
              {/* Walking Person or Pin */}
              <path d="M32 10 C28 10, 25 13, 25 17 C25 23, 32 30, 32 30 C32 30, 39 23, 39 17 C39 13, 36 10, 32 10 Z" fill="#6366f1" stroke="#c7d2fe" strokeWidth="1.5" />
              <circle cx="32" cy="17" r="2.5" fill="#ffffff" />
            </svg>
            <span className="absolute bottom-1 right-1 text-[8px] font-bold font-mono px-1 py-0.2 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-500/30">
              CHAUFFEUR
            </span>
          </div>
        );

      case 'plumber':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-tr from-cyan-600/30 to-blue-500/20 text-cyan-400">
            <svg viewBox="0 0 64 64" className="w-4/5 h-4/5 drop-shadow-md" fill="none">
              <path d="M18 20 L36 20 L36 44 L46 44" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
              <path d="M36 20 L48 10 L52 14 L40 24" stroke="#0ea5e9" strokeWidth="3" />
              <path d="M36 48 C36 48, 30 54, 30 56 C30 59, 36 60, 36 60 C36 60, 42 59, 42 56 C42 54, 36 48, 36 48 Z" fill="#06b6d4" />
            </svg>
          </div>
        );

      case 'electrician':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-tr from-amber-600/30 to-yellow-500/20 text-amber-400">
            <svg viewBox="0 0 64 64" className="w-4/5 h-4/5 drop-shadow-md" fill="none">
              <path d="M34 10 L18 34 L32 34 L28 54 L46 28 L32 28 Z" fill="#eab308" opacity="0.4" stroke="#facc15" strokeWidth="2.5" strokeLinejoin="round" />
            </svg>
          </div>
        );

      case 'cleaning':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-tr from-teal-600/30 to-emerald-500/20 text-teal-400">
            <svg viewBox="0 0 64 64" className="w-4/5 h-4/5 drop-shadow-md" fill="none">
              <path d="M20 44 L38 18" stroke="#2dd4bf" strokeWidth="3" strokeLinecap="round" />
              <path d="M14 48 L26 40 L22 36 L10 44 Z" fill="#0d9488" stroke="#14b8a6" strokeWidth="1.5" />
              <circle cx="44" cy="20" r="4" fill="#99f6e4" opacity="0.6" />
              <circle cx="36" cy="34" r="2.5" fill="#99f6e4" opacity="0.8" />
            </svg>
          </div>
        );

      default:
        return (
          <div className="w-full h-full flex items-center justify-center bg-slate-800 text-amber-400">
            <Wrench className="w-6 h-6" />
          </div>
        );
    }
  };

  const sizeClasses = {
    sm: 'w-10 h-10 rounded-xl',
    md: 'w-14 h-14 rounded-2xl',
    lg: 'w-20 h-20 rounded-3xl',
    hero: 'w-full h-32 rounded-3xl'
  };

  return (
    <div className={`relative overflow-hidden border border-white/10 shrink-0 shadow-inner group-hover:scale-105 transition-transform ${sizeClasses[size]} ${className}`}>
      {renderVisual()}
      {badgeTitle && (
        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[8px] font-semibold text-white tracking-tight">
          {badgeTitle}
        </div>
      )}
    </div>
  );
};
