import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Compass, LocateFixed, Shield } from 'lucide-react';

interface LiveMapProps {
  partnerCoords?: [number, number];
  customerCoords?: [number, number];
  partnerName?: string;
  partnerVehicle?: string;
  etaMinutes?: number;
  status?: string;
  heightClass?: string;
}

export const LiveMap: React.FC<LiveMapProps> = ({
  partnerName = 'Partner',
  partnerVehicle = 'Two-Wheeler',
  etaMinutes = 8,
  status = 'en_route',
  heightClass = 'h-64'
}) => {
  // Simulated progress along path (0 to 100%)
  const [routeProgress, setRouteProgress] = useState(35);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (status === 'en_route') {
      const interval = setInterval(() => {
        setRouteProgress(prev => {
          if (prev >= 90) return 90;
          return prev + 1.5;
        });
      }, 3000);
      return () => clearInterval(interval);
    } else if (status === 'arrived' || status === 'in_progress') {
      setRouteProgress(96);
    }
  }, [status]);

  // Interpolated partner position along SVG bezier path:
  // Route goes from (80, 240) -> (140, 180) -> (210, 190) -> (280, 100) -> (330, 80)
  const t = routeProgress / 100;
  // Calculate approximate position along path
  const partnerX = 60 + t * 250 + Math.sin(t * Math.PI * 2) * 15;
  const partnerY = 220 - t * 150 + Math.cos(t * Math.PI) * 10;

  return (
    <div className={`relative w-full ${heightClass} bg-slate-950 overflow-hidden border-b border-slate-800 select-none`}>
      {/* Map Canvas - Stylized Vector Map */}
      <svg 
        className="w-full h-full transition-transform duration-300"
        viewBox="0 0 400 300" 
        preserveAspectRatio="xMidYMid slice"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <defs>
          {/* Subtle grid pattern for city blocks */}
          <pattern id="city-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="#090d16" />
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#131c2e" strokeWidth="0.8" />
          </pattern>

          {/* Glowing animated dash route */}
          <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Base background blocks */}
        <rect width="400" height="300" fill="url(#city-grid)" />

        {/* River / Park features */}
        <path 
          d="M -20 280 Q 80 240 180 290 T 420 270" 
          fill="none" 
          stroke="#0f2638" 
          strokeWidth="28" 
          strokeLinecap="round" 
        />
        {/* City Green Area */}
        <rect x="230" y="160" width="70" height="55" rx="12" fill="#082218" opacity="0.7" />
        <text x="245" y="190" fill="#10b981" fontSize="8" opacity="0.4" fontFamily="sans-serif">Central Green</text>

        {/* Secondary Roads */}
        <path d="M 0 70 L 400 70" stroke="#1e293b" strokeWidth="6" />
        <path d="M 0 160 L 400 160" stroke="#1e293b" strokeWidth="8" />
        <path d="M 0 240 L 400 240" stroke="#1e293b" strokeWidth="6" />
        <path d="M 120 0 L 120 300" stroke="#1e293b" strokeWidth="6" />
        <path d="M 220 0 L 220 300" stroke="#1e293b" strokeWidth="7" />
        <path d="M 320 0 L 320 300" stroke="#1e293b" strokeWidth="7" />

        {/* Main Highway Express Corridor */}
        <path d="M 20 280 C 100 220, 180 200, 340 70" stroke="#334155" strokeWidth="12" fill="none" strokeLinecap="round" />
        <path d="M 20 280 C 100 220, 180 200, 340 70" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 6" fill="none" />

        {/* Active GPS Route Path */}
        <path 
          d="M 60 220 C 120 200, 190 190, 240 140 S 310 100, 330 80" 
          stroke="#3b82f6" 
          strokeWidth="5" 
          strokeLinecap="round" 
          fill="none" 
          opacity="0.85"
        />
        <path 
          d="M 60 220 C 120 200, 190 190, 240 140 S 310 100, 330 80" 
          stroke="#93c5fd" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeDasharray="6 8"
          fill="none" 
        >
          <animate attributeName="stroke-dashoffset" values="0;-28" dur="1.2s" repeatCount="indefinite" />
        </path>

        {/* Customer Destination Marker at (330, 80) */}
        <g transform="translate(330, 80)">
          {/* Beacon pulse circle */}
          <circle r="18" fill="#3b82f6" opacity="0.15">
            <animate attributeName="r" values="8;22" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle r="7" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" filter="url(#glow)" />
          {/* Pin Label */}
          <rect x="-44" y="-32" width="88" height="20" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <text x="0" y="-18" fill="#f8fafc" fontSize="9" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
            Your Location
          </text>
        </g>

        {/* Partner Moving Marker */}
        <g transform={`translate(${partnerX}, ${partnerY})`}>
          {/* Aura ring */}
          <circle r="16" fill="#f59e0b" opacity="0.2">
            <animate attributeName="r" values="8;20" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0" dur="1.5s" repeatCount="indefinite" />
          </circle>
          {/* Pin Body */}
          <circle r="10" fill="#f59e0b" stroke="#ffffff" strokeWidth="2.5" />
          {/* Inner icon (navigation arrow) */}
          <path d="M 0 -4 L 3 3 L 0 1.5 L -3 3 Z" fill="#0f172a" />
          {/* Partner Tag */}
          <rect x="-38" y="14" width="76" height="18" rx="5" fill="#0f172a" stroke="#f59e0b" strokeWidth="0.8" opacity="0.95" />
          <text x="0" y="26" fill="#fbbf24" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            {partnerName.split(' ')[0]} (En Route)
          </text>
        </g>
      </svg>

      {/* Floating HUD: Live Status & ETA pill */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-lg">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
            <span>{status === 'arrived' ? 'Partner Arrived' : `${etaMinutes} mins away`}</span>
            <span className="text-slate-400 font-normal">·</span>
            <span className="text-[11px] text-amber-400 font-mono">1.8 km</span>
          </div>
          <span className="text-[10px] text-slate-400 truncate max-w-[170px]">
            {partnerVehicle}
          </span>
        </div>
      </div>

      {/* Floating Map Controls */}
      <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-1.5">
        <button
          onClick={() => setZoomLevel(prev => (prev === 1 ? 1.25 : 1))}
          className="w-8 h-8 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/80 flex items-center justify-center text-slate-200 hover:text-white hover:bg-slate-800 transition-colors shadow-md"
          title="Zoom Map"
        >
          <Compass className="w-4 h-4 text-slate-300" />
        </button>
        <button
          onClick={() => {
            setZoomLevel(1);
            setRouteProgress(45);
          }}
          className="w-8 h-8 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/80 flex items-center justify-center text-slate-200 hover:text-white hover:bg-slate-800 transition-colors shadow-md"
          title="Recenter on Partner"
        >
          <LocateFixed className="w-4 h-4 text-amber-400" />
        </button>
      </div>

      {/* Security verification watermark pill */}
      <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-[10px] text-slate-400">
        <Shield className="w-3 h-3 text-emerald-400" />
        <span>Encrypted GPS Beacon</span>
      </div>
    </div>
  );
};
