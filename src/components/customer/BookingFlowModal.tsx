import React, { useState } from 'react';
import { useQuickService } from '../../context/QuickServiceContext';
import { ServiceItem, TaskAttachment, ChecklistItem } from '../../types';
import { AudioRecorder } from '../common/AudioRecorder';
import { ChecklistBuilder } from './ChecklistBuilder';
import { ServiceIllustration } from '../common/ServiceIllustration';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  Camera, 
  Tag, 
  Check, 
  ShieldCheck, 
  FileText, 
  Zap, 
  Image as ImageIcon,
  RotateCw,
  ShoppingBag,
  Receipt,
  Sparkles,
  Navigation,
  Edit2,
  Plus,
  Loader2
} from 'lucide-react';
import { detectCurrentLocationWithGps } from '../../utils/reverseGeocode';

interface BookingFlowModalProps {
  service: ServiceItem;
  selectedSubOptionId?: string;
  bookingType: 'instant' | 'scheduled';
  onClose: () => void;
  onOpenPayment: (bookingPayload: any, totalAmount: number) => void;
}

export const BookingFlowModal: React.FC<BookingFlowModalProps> = ({
  service,
  selectedSubOptionId,
  bookingType: initialType,
  onClose,
  onOpenPayment,
}) => {
  const { 
    customer, 
    coupons, 
    adminMetrics, 
    setIsAddressModalOpen, 
    setEditingAddress,
    saveCustomerAddress 
  } = useQuickService();

  const [bookingType, setBookingType] = useState<'instant' | 'scheduled'>(initialType);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(() => {
    return customer.savedAddresses.find(a => a.isDefault)?.id || customer.savedAddresses[0]?.id || 'addr-1';
  });
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsMessage, setGpsMessage] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceFreq, setRecurrenceFreq] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [scheduledDate, setScheduledDate] = useState('2026-09-29');
  const [scheduledTime, setScheduledTime] = useState('11:00 AM');
  const [taskDescription, setTaskDescription] = useState('');
  const [attachments, setAttachments] = useState<TaskAttachment[]>([]);
  const [couponCode, setCouponCode] = useState('QUICKFIRST');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('QUICKFIRST');

  // Checklist items if service supports checklist (Sabji Mandi, Kirana, Medicine, Errands)
  const isChecklistService = service.supportsChecklist || service.illustrationType === 'sabji' || service.illustrationType === 'kirana' || service.illustrationType === 'medicine';
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    if (service.illustrationType === 'sabji') {
      return [
        { id: '1', name: 'Aloo (Potato)', quantity: '2 kg', isPurchased: false, category: 'sabji' },
        { id: '2', name: 'Pyaaz (Onion)', quantity: '2 kg', isPurchased: false, category: 'sabji' },
        { id: '3', name: 'Tamatar (Tomato)', quantity: '1 kg', isPurchased: false, category: 'sabji' },
      ];
    } else if (service.illustrationType === 'kirana') {
      return [
        { id: '1', name: 'Amul Taza Doodh', quantity: '2 packets', isPurchased: false, category: 'kirana' },
        { id: '2', name: 'Aashirvaad Atta', quantity: '5 kg', isPurchased: false, category: 'kirana' },
      ];
    }
    return [];
  });

  // Sub option pricing
  const subOption = service.subOptions?.find(s => s.id === selectedSubOptionId);
  const baseFare = subOption ? subOption.price : service.basePrice;
  const surgeMultiplier = adminMetrics.surgeMultiplier;
  const surgeAmount = Math.round(baseFare * (surgeMultiplier - 1));
  let subTotal = baseFare + surgeAmount;

  // Recurring discount
  if (isRecurring) {
    subTotal = Math.round(subTotal * 0.8); // 20% discount on recurring
  }

  // Coupon discount calculation
  let discount = 0;
  if (appliedCoupon) {
    const c = coupons.find(cp => cp.code === appliedCoupon && cp.active);
    if (c && subTotal >= c.minOrder) {
      discount = Math.min(Math.round((subTotal * c.discountPercent) / 100), c.maxDiscount);
    }
  }

  const finalTotal = Math.max(0, subTotal - discount);

  const handleAudioRecorded = (audioAttachment: TaskAttachment | null) => {
    if (audioAttachment) {
      setAttachments(prev => [...prev.filter(a => a.type !== 'audio'), audioAttachment]);
    } else {
      setAttachments(prev => prev.filter(a => a.type !== 'audio'));
    }
  };

  const handleAddSamplePhoto = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&auto=format&fit=crop&q=80'
    ];
    const newPhoto: TaskAttachment = {
      type: 'photo',
      url: samplePhotos[attachments.filter(a => a.type === 'photo').length % samplePhotos.length],
      name: `issue_photo_${attachments.length + 1}.jpg`
    };
    setAttachments(prev => [...prev, newPhoto]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const currentAddress = customer.savedAddresses.find(a => a.id === selectedAddressId) || customer.savedAddresses[0];

  const handleDetectLiveGps = async () => {
    setIsDetectingGps(true);
    setGpsMessage('');
    try {
      const loc = await detectCurrentLocationWithGps();
      const newAddrId = `addr-gps-${Date.now()}`;
      const newAddressItem = {
        id: newAddrId,
        label: 'Other' as const,
        address: loc.address,
        coords: loc.coords,
        isDefault: false
      };
      saveCustomerAddress(newAddressItem);
      setSelectedAddressId(newAddrId);
      setGpsMessage(`📍 GPS Location detected: ${loc.area || loc.city}!`);
      setTimeout(() => setGpsMessage(''), 4000);
    } catch (err: any) {
      setGpsMessage(err.message || 'GPS location error');
    } finally {
      setIsDetectingGps(false);
    }
  };

  const handleApplyCoupon = (code: string) => {
    const found = coupons.find(c => c.code === code && c.active);
    if (found) {
      setAppliedCoupon(code);
      setCouponCode(code);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      service,
      selectedSubOptionId,
      bookingType,
      scheduledDate: bookingType === 'scheduled' ? scheduledDate : undefined,
      scheduledTime: bookingType === 'scheduled' ? scheduledTime : undefined,
      taskDescription: taskDescription.trim() || `Request for ${service.name}${subOption ? ` - ${subOption.name}` : ''}`,
      attachments,
      checklist: isChecklistService ? checklist : undefined,
      isRecurring,
      recurrenceFrequency: isRecurring ? recurrenceFreq : undefined,
      couponCode: appliedCoupon || undefined,
      address: currentAddress?.address,
      coords: currentAddress?.coords,
    };
    onOpenPayment(payload, finalTotal);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header with Visual Illustration */}
        <div className="px-5 py-4 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ServiceIllustration 
              type={service.illustrationType || service.category} 
              badgeTitle={service.badgeTitle}
              size="sm" 
            />
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Booking Details
              </h3>
              <p className="text-[11px] text-slate-400">
                {service.name} {subOption && `· ${subOption.name}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto no-scrollbar space-y-4 flex-1">
          
          {/* Dispatch Mode: Instant vs Scheduled */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <button
              type="button"
              onClick={() => setBookingType('instant')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                bookingType === 'instant' 
                  ? 'bg-amber-500 text-slate-950 shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Instant (15 mins)</span>
            </button>

            <button
              type="button"
              onClick={() => setBookingType('scheduled')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                bookingType === 'scheduled' 
                  ? 'bg-amber-500 text-slate-950 shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule Later</span>
            </button>
          </div>

          {/* Recurring Service Subscription Option */}
          <div className="p-3 bg-slate-800/50 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Repeat Booking Subscription</span>
              </span>
              <button
                type="button"
                onClick={() => setIsRecurring(!isRecurring)}
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border transition-colors ${
                  isRecurring 
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {isRecurring ? 'ACTIVE · SAVE 20%' : 'ENABLE REPEAT'}
              </button>
            </div>

            {isRecurring && (
              <div className="grid grid-cols-3 gap-1.5 pt-1 animate-in fade-in">
                {(['weekly', 'biweekly', 'monthly'] as const).map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setRecurrenceFreq(f)}
                    className={`py-1.5 text-[10px] rounded-lg font-semibold border transition-all ${
                      recurrenceFreq === f 
                        ? 'bg-amber-500 text-slate-950 border-amber-400' 
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                    }`}
                  >
                    {f === 'weekly' ? 'Weekly' : f === 'biweekly' ? 'Bi-Weekly' : 'Monthly'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Schedule Picker if scheduled */}
          {bookingType === 'scheduled' && (
            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-800/40 rounded-2xl border border-slate-800">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Date</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={e => setScheduledDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Time Slot</label>
                <select
                  value={scheduledTime}
                  onChange={e => setScheduledTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="09:00 AM">09:00 AM - 10:00 AM</option>
                  <option value="11:00 AM">11:00 AM - 12:00 PM</option>
                  <option value="02:00 PM">02:00 PM - 03:00 PM</option>
                  <option value="04:00 PM">04:00 PM - 05:00 PM</option>
                  <option value="06:00 PM">06:00 PM - 07:00 PM</option>
                </select>
              </div>
            </div>
          )}

          {/* Grocery & Sabji Mandi Item Checklist Builder */}
          {isChecklistService && (
            <ChecklistBuilder
              items={checklist}
              onChange={setChecklist}
              serviceType={service.illustrationType || 'sabji'}
            />
          )}

          {/* Service Address Strip with GPS Auto-detection & Edit option */}
          <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Service Delivery Location</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDetectLiveGps}
                  disabled={isDetectingGps}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Detect GPS location automatically"
                >
                  {isDetectingGps ? (
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                  ) : (
                    <Navigation className="w-2.5 h-2.5" />
                  )}
                  <span>{isDetectingGps ? 'Locating...' : '📍 Live GPS'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingAddress(currentAddress || null);
                    setIsAddressModalOpen(true);
                  }}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-2.5 h-2.5" />
                  <span>Edit</span>
                </button>
              </div>
            </div>

            {/* GPS Feedback Notice */}
            {gpsMessage && (
              <div className="text-[11px] font-medium text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 p-2 rounded-xl animate-in fade-in">
                {gpsMessage}
              </div>
            )}

            {/* Address Selector Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {customer.savedAddresses.map(a => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setSelectedAddressId(a.id)}
                  className={`text-[11px] px-2.5 py-1 rounded-xl font-semibold border transition-all cursor-pointer ${
                    selectedAddressId === a.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm font-bold'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {a.label} {a.isDefault && '★'}
                </button>
              ))}

              <button
                type="button"
                onClick={() => {
                  setEditingAddress(null);
                  setIsAddressModalOpen(true);
                }}
                className="text-[10px] px-2 py-1 rounded-xl font-bold bg-slate-800 text-amber-400 hover:text-amber-300 border border-slate-700 hover:border-amber-500/40 flex items-center gap-0.5 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>New</span>
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-snug bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              {currentAddress?.address || 'Sector 62, Noida'}
            </p>
          </div>

          {/* Task Description Textarea */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center justify-between">
              <span>Task Notes & Instructions</span>
              <span className="text-[10px] text-slate-500">Helps pro arrive prepared</span>
            </label>
            <textarea
              rows={2}
              value={taskDescription}
              onChange={e => setTaskDescription(e.target.value)}
              placeholder="e.g. Please choose fresh vegetables from morning Mandi, check milk expiry date..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Voice Note Audio Recorder */}
          <AudioRecorder 
            onAudioRecorded={handleAudioRecorded} 
            existingAttachment={attachments.find(a => a.type === 'audio')} 
          />

          {/* Photo Attachments */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">
                Attach Reference Photos (Prescription / Sample items)
              </label>
              <button
                type="button"
                onClick={handleAddSamplePhoto}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>+ Add Photo</span>
              </button>
            </div>

            {attachments.filter(a => a.type === 'photo').length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {attachments.filter(a => a.type === 'photo').map((att, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-800 group h-24">
                    <img 
                      src={att.url} 
                      alt="Task attachment" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(i)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-rose-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div 
                onClick={handleAddSamplePhoto}
                className="p-3 border border-dashed border-slate-700 rounded-xl text-center cursor-pointer hover:border-slate-500 transition-colors"
              >
                <span className="text-[11px] text-slate-400">
                  Tap to attach prescription or item photo (optional)
                </span>
              </div>
            )}
          </div>

          {/* Coupon Code Strip */}
          <div className="p-3 bg-slate-800/40 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>Offers & Coupons</span>
              </span>
              {appliedCoupon && (
                <span className="text-[10px] text-emerald-400 font-medium">
                  Applied! Saved ₹{discount}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 uppercase font-mono"
              />
              <button
                type="button"
                onClick={() => handleApplyCoupon(couponCode)}
                className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-white transition-colors"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Fare Summary Breakdown */}
          <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span>{isChecklistService ? 'Labor / Dispatch Fee (1 Hour)' : 'Base Service Fare'}</span>
              <span className="font-mono">₹{baseFare}</span>
            </div>
            {isRecurring && (
              <div className="flex items-center justify-between text-emerald-400">
                <span>Recurring Subscription Discount (20%)</span>
                <span className="font-mono">-₹{Math.round(baseFare * 0.2)}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex items-center justify-between text-emerald-400">
                <span>Coupon Discount ({appliedCoupon})</span>
                <span className="font-mono">-₹{discount}</span>
              </div>
            )}
            {isChecklistService && (
              <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-[10px] text-amber-400">
                <strong>Reimbursement Notice:</strong> Actual items purchased will be added to bill after runner uploads verified cash memo.
              </div>
            )}
            <div className="pt-2 border-t border-slate-700 flex items-center justify-between font-bold text-white text-sm">
              <span>Booking Total</span>
              <span className="font-mono text-amber-400 text-base">₹{finalTotal}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all"
          >
            <span>Proceed to Payment (₹{finalTotal})</span>
          </button>
        </form>

      </div>
    </div>
  );
};

