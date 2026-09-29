import React, { useState } from 'react';
import { ServiceItem } from '../../types';
import { ServiceIllustration } from '../common/ServiceIllustration';
import { 
  X, 
  Star, 
  Clock, 
  ShieldCheck, 
  Check, 
  Zap, 
  Calendar, 
  Wrench, 
  Sparkles, 
  Car, 
  ChevronRight,
  Receipt
} from 'lucide-react';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onProceedToBooking: (service: ServiceItem, selectedSubId: string | undefined, bookingType: 'instant' | 'scheduled') => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onProceedToBooking,
}) => {
  const [selectedSubOptionId, setSelectedSubOptionId] = useState<string | undefined>(
    service?.subOptions?.[0]?.id
  );

  if (!service) return null;

  const currentPrice = selectedSubOptionId && service.subOptions 
    ? (service.subOptions.find(s => s.id === selectedSubOptionId)?.price || service.basePrice)
    : service.basePrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="relative p-5 bg-gradient-to-b from-slate-800 to-slate-900 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <ServiceIllustration 
              type={service.illustrationType || service.category} 
              badgeTitle={service.badgeTitle}
              size="md" 
            />
            <div>
              <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                {service.categoryLabel}
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">
                {service.name}
              </h3>
              <div className="flex items-center gap-3 text-[11px] text-slate-300 mt-0.5">
                <span className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-current" /> {service.rating}
                </span>
                <span>·</span>
                <span>{service.reviewsCount} customer reviews</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto no-scrollbar space-y-5 flex-1">
          
          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Service Overview
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* Sub-Options / Tasks */}
          {service.subOptions && service.subOptions.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Select Specific Task
                </h4>
                <span className="text-[10px] text-amber-400">Transparent Pricing</span>
              </div>

              <div className="space-y-2">
                {service.subOptions.map((sub) => {
                  const isChecked = selectedSubOptionId === sub.id;
                  return (
                    <div
                      key={sub.id}
                      onClick={() => setSelectedSubOptionId(sub.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isChecked 
                          ? 'bg-amber-500/10 border-amber-500 text-white' 
                          : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isChecked ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-500'
                        }`}>
                          {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="text-xs font-semibold">{sub.name}</div>
                          <div className="text-[10px] text-slate-400">Est. {sub.timeEstimate}</div>
                        </div>
                      </div>

                      <div className="text-xs font-bold font-mono text-amber-400">
                        ₹{sub.price}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Inclusions & Quality Guarantees */}
          <div className="p-3.5 bg-slate-800/40 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Included With Every Booking</span>
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              {service.detailedSpecs.map((spec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <div>
              <span className="text-[10px] text-slate-400 block">Total Est. Fare</span>
              <span className="text-lg font-bold font-mono text-white">₹{currentPrice}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Partner reaches in ~15 mins
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onProceedToBooking(service, selectedSubOptionId, 'scheduled')}
              className="h-11 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Schedule Later</span>
            </button>

            <button
              onClick={() => onProceedToBooking(service, selectedSubOptionId, 'instant')}
              className="h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Book Now (Instant)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
