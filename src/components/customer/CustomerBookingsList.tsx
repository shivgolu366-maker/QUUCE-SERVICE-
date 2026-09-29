import React, { useState } from 'react';
import { useQuickService } from '../../context/QuickServiceContext';
import { Booking } from '../../types';
import { 
  Clock, 
  MapPin, 
  ChevronRight, 
  Star, 
  RotateCcw, 
  Receipt, 
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface CustomerBookingsListProps {
  onOpenTracking: (bookingId: string) => void;
  onOpenRating: (bookingId: string) => void;
  onRebook: (serviceId: string) => void;
}

export const CustomerBookingsList: React.FC<CustomerBookingsListProps> = ({
  onOpenTracking,
  onOpenRating,
  onRebook,
}) => {
  const { bookings } = useQuickService();
  const [tab, setTab] = useState<'active' | 'history'>('active');

  const activeBookings = bookings.filter(b => 
    ['searching', 'assigned', 'en_route', 'arrived', 'in_progress'].includes(b.status)
  );

  const pastBookings = bookings.filter(b => 
    ['completed', 'cancelled'].includes(b.status)
  );

  const displayed = tab === 'active' ? activeBookings : pastBookings;

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            My Service Bookings
          </h2>
          <p className="text-[11px] text-slate-400">
            Track active requests and service history
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
        <button
          onClick={() => setTab('active')}
          className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            tab === 'active' 
              ? 'bg-amber-500 text-slate-950 shadow-sm' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Active Bookings</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            tab === 'active' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-300'
          }`}>
            {activeBookings.length}
          </span>
        </button>

        <button
          onClick={() => setTab('history')}
          className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            tab === 'history' 
              ? 'bg-amber-500 text-slate-950 shadow-sm' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Past Services</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            tab === 'history' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-300'
          }`}>
            {pastBookings.length}
          </span>
        </button>
      </div>

      {/* Bookings List */}
      <div className="space-y-3 flex-1">
        {displayed.map((booking) => {
          const isActive = ['searching', 'assigned', 'en_route', 'arrived', 'in_progress'].includes(booking.status);
          return (
            <div
              key={booking.id}
              className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 hover:border-slate-700 transition-all shadow-md"
            >
              {/* Top row: Service Name, ID & Status Badge */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-white">
                      {booking.serviceName}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">
                      #{booking.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {booking.createdAt}
                    </span>
                    {booking.scheduledTime && (
                      <>
                        <span>·</span>
                        <span className="text-amber-400 font-medium">Slot: {booking.scheduledTime}</span>
                      </>
                    )}
                  </div>
                </div>

                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase font-semibold ${
                  booking.status === 'completed'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : booking.status === 'cancelled'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    : 'bg-amber-500/15 border-amber-500/40 text-amber-300 animate-pulse'
                }`}>
                  {booking.status.replace('_', ' ')}
                </span>
              </div>

              {/* Task Details Preview */}
              <p className="text-[11px] text-slate-300 line-clamp-1 bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                {booking.taskDescription}
              </p>

              {/* Assigned Partner Info (if assigned) */}
              {booking.partnerName && (
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                      <img 
                        src={booking.partnerAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pro'} 
                        alt={booking.partnerName} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="font-semibold text-white block leading-none">{booking.partnerName}</span>
                      <span className="text-[10px] text-slate-400">{booking.partnerVehicle || 'Partner'}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-amber-400">₹{booking.totalAmount}</span>
                    <span className="text-[10px] text-slate-400 block uppercase">{booking.paymentMethod}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                {isActive ? (
                  <button
                    onClick={() => onOpenTracking(booking.id)}
                    className="w-full h-9 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Track Live & Contact Partner</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    {booking.status === 'completed' && !booking.ratingGiven ? (
                      <button
                        onClick={() => onOpenRating(booking.id)}
                        className="h-8 px-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>Leave Review</span>
                      </button>
                    ) : booking.ratingGiven ? (
                      <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>Rated {booking.ratingGiven}★</span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500">Order Closed</span>
                    )}

                    <button
                      onClick={() => onRebook(booking.serviceId)}
                      className="h-8 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors border border-slate-700"
                    >
                      <RotateCcw className="w-3 h-3 text-slate-400" />
                      <span>Rebook</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {displayed.length === 0 && (
          <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 space-y-2">
            <p className="text-xs text-slate-400">
              {tab === 'active' ? 'No active bookings right now.' : 'No past bookings found.'}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
