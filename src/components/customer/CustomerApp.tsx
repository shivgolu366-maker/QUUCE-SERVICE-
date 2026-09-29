import React, { useState } from 'react';
import { CustomerHome } from './CustomerHome';
import { CustomerBookingsList } from './CustomerBookingsList';
import { CustomerProfile } from './CustomerProfile';
import { ServiceDetailModal } from './ServiceDetailModal';
import { BookingFlowModal } from './BookingFlowModal';
import { LiveTrackingView } from './LiveTrackingView';
import { RatingModal } from './RatingModal';
import { PaymentModal } from '../common/PaymentModal';
import { PackagesAndSubscriptions } from './PackagesAndSubscriptions';
import { CustomerLoginModal } from './CustomerLoginModal';
import { AadhaarVerificationModal } from './AadhaarVerificationModal';
import { useQuickService } from '../../context/QuickServiceContext';
import { ServiceItem } from '../../types';
import { Compass, CalendarCheck2, User, Radio, Layers, Sparkles } from 'lucide-react';

export const CustomerApp: React.FC = () => {
  const { 
    customer,
    activeBookingId, 
    setActiveBookingId, 
    activeBooking, 
    createBooking, 
    services,
    isLoginModalOpen,
    setIsLoginModalOpen,
    isAadhaarModalOpen,
    setIsAadhaarModalOpen
  } = useQuickService();

  const [activeTab, setActiveTab] = useState<'home' | 'packages' | 'bookings' | 'profile'>('home');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  
  // Booking custom flow
  const [bookingFlowData, setBookingFlowData] = useState<{
    service: ServiceItem;
    selectedSubOptionId?: string;
    bookingType: 'instant' | 'scheduled';
  } | null>(null);

  // Payment checkout modal
  const [paymentData, setPaymentData] = useState<{
    payload: any;
    totalAmount: number;
  } | null>(null);

  // Rating modal
  const [ratingBookingId, setRatingBookingId] = useState<string | null>(null);

  // Show live tracking view
  const [showLiveTracking, setShowLiveTracking] = useState(false);

  const handleSelectService = (service: ServiceItem) => {
    setSelectedService(service);
  };

  const handleProceedToBooking = (
    service: ServiceItem, 
    selectedSubOptionId: string | undefined, 
    bookingType: 'instant' | 'scheduled'
  ) => {
    setSelectedService(null);
    setBookingFlowData({ service, selectedSubOptionId, bookingType });
  };

  const handleOpenPayment = (payload: any, totalAmount: number) => {
    setPaymentData({ payload, totalAmount });
  };

  const handlePaymentSuccess = (method: 'upi' | 'card' | 'wallet' | 'cash') => {
    if (!paymentData) return;
    const finalPayload = {
      ...paymentData.payload,
      paymentMethod: method,
    };
    const newBookingId = createBooking(finalPayload);
    setPaymentData(null);
    setBookingFlowData(null);
    setShowLiveTracking(true);
  };

  const handleRebook = (serviceId: string) => {
    const s = services.find(x => x.id === serviceId);
    if (s) {
      setSelectedService(s);
    }
  };

  return (
    <div className="relative flex-1 flex flex-col bg-slate-950 text-white min-h-full">
      
      {/* Top Navigation Tabs (Explore, Passes, Bookings, Profile placed at the TOP) */}
      {!showLiveTracking && (
        <div className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3 py-2 shadow-md">
          <div className="grid grid-cols-4 gap-1.5 max-w-md mx-auto bg-slate-950/80 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center justify-center gap-1 py-2 px-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Explore</span>
            </button>

            <button
              onClick={() => setActiveTab('packages')}
              className={`flex items-center justify-center gap-1 py-2 px-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'packages'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Passes</span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`relative flex items-center justify-center gap-1 py-2 px-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <CalendarCheck2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Bookings</span>
              {activeBooking && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute -top-0.5 right-1" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`relative flex items-center justify-center gap-1 py-2 px-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <User className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Profile</span>
              {customer?.isAadhaarVerified && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute -top-0.5 right-1" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Primary Content View */}
      {showLiveTracking && activeBooking ? (
        <LiveTrackingView 
          onBack={() => setShowLiveTracking(false)} 
          onOpenRating={() => {
            setShowLiveTracking(false);
            setRatingBookingId(activeBooking.id);
          }}
        />
      ) : (
        <div className="flex-1 flex flex-col">
          {activeTab === 'home' && (
            <CustomerHome 
              onSelectService={handleSelectService}
              onOpenActiveTracking={() => setShowLiveTracking(true)}
              onOpenSubscriptions={() => setActiveTab('packages')}
            />
          )}

          {activeTab === 'packages' && (
            <PackagesAndSubscriptions />
          )}

          {activeTab === 'bookings' && (
            <CustomerBookingsList 
              onOpenTracking={(id) => {
                setActiveBookingId(id);
                setShowLiveTracking(true);
              }}
              onOpenRating={(id) => setRatingBookingId(id)}
              onRebook={handleRebook}
            />
          )}

          {activeTab === 'profile' && (
            <CustomerProfile />
          )}
        </div>
      )}

      {/* Modals */}
      {selectedService && (
        <ServiceDetailModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onProceedToBooking={handleProceedToBooking}
        />
      )}

      {bookingFlowData && (
        <BookingFlowModal
          service={bookingFlowData.service}
          selectedSubOptionId={bookingFlowData.selectedSubOptionId}
          bookingType={bookingFlowData.bookingType}
          onClose={() => setBookingFlowData(null)}
          onOpenPayment={handleOpenPayment}
        />
      )}

      {paymentData && (
        <PaymentModal
          isOpen={true}
          onClose={() => setPaymentData(null)}
          onPaymentSuccess={handlePaymentSuccess}
          amount={paymentData.totalAmount}
          serviceTitle={paymentData.payload.service.name}
        />
      )}

      {ratingBookingId && (
        <RatingModal
          isOpen={true}
          onClose={() => setRatingBookingId(null)}
          bookingId={ratingBookingId}
        />
      )}

      {/* Customer Login & Signup Modal */}
      <CustomerLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onOpenAadhaarVerification={() => setIsAadhaarModalOpen(true)}
      />

      {/* Aadhaar Verification & e-KYC Modal */}
      <AadhaarVerificationModal
        isOpen={isAadhaarModalOpen}
        onClose={() => setIsAadhaarModalOpen(false)}
      />

    </div>
  );
};
