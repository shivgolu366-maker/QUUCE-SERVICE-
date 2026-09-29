import React, { useState } from 'react';
import { useQuickService } from '../../context/QuickServiceContext';
import { 
  Star, 
  X, 
  Check, 
  Heart, 
  Download, 
  ShieldCheck, 
  ThumbsUp 
} from 'lucide-react';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  bookingId,
}) => {
  const { bookings, submitReview } = useQuickService();
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Punctual',
    'Cleaned up after work',
    'Polite & Professional'
  ]);
  const [comment, setComment] = useState('');
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const booking = bookings.find(b => b.id === bookingId);
  if (!isOpen || !booking) return null;

  const availableTags = [
    'Punctual',
    'Cleaned up after work',
    'Polite & Professional',
    'Fixed Issue Fast',
    'Accurate Diagnosis',
    'Fair Billing',
    'Followed Safety Norms'
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReview(booking.id, rating, selectedTags, comment);
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ThumbsUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Rate Your Experience
              </h3>
              <p className="text-[11px] text-slate-400">
                Booking #{booking.id} Complete
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto no-scrollbar space-y-4 flex-1">
          
          {/* Partner Highlight */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl mx-auto overflow-hidden border-2 border-amber-500/40 bg-slate-800 shadow-md">
              <img 
                src={booking.partnerAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Professional'} 
                alt={booking.partnerName || 'Partner'}
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="text-sm font-bold text-white">
              How was {booking.partnerName || 'your professional'}?
            </h4>
            <p className="text-[11px] text-slate-400">
              {booking.serviceName}
            </p>

            {/* 5-Star Selector */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110 active:scale-95"
                >
                  <Star 
                    className={`w-8 h-8 ${
                      star <= rating 
                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' 
                        : 'text-slate-700'
                    }`} 
                  />
                </button>
              ))}
            </div>
            <div className="text-xs font-semibold text-amber-400">
              {rating === 5 && 'Outstanding Work!'}
              {rating === 4 && 'Very Good Service'}
              {rating === 3 && 'Average'}
              {rating === 2 && 'Needs Improvement'}
              {rating === 1 && 'Disappointing'}
            </div>
          </div>

          {/* Compliment Tag Badges */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-slate-300 block">
              What did they do well?
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-medium'
                        : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Leave a Public Review (Optional)
            </label>
            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details of your experience to help the community..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Tip Partner */}
          <div className="p-3 bg-slate-800/50 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>Tip {booking.partnerName?.split(' ')[0] || 'Partner'}</span>
              </span>
              <span className="text-[10px] text-emerald-400">100% goes to partner</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[0, 20, 50, 100].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTipAmount(amt)}
                  className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                    tipAmount === amt
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  {amt === 0 ? 'None' : `₹${amt}`}
                </button>
              ))}
            </div>
          </div>

          {/* Invoice Summary Strip */}
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Service Total Paid</span>
              <span className="font-mono text-white">₹{booking.totalAmount}</span>
            </div>
            {tipAmount > 0 && (
              <div className="flex items-center justify-between text-amber-400">
                <span>Partner Tip</span>
                <span className="font-mono">+₹{tipAmount}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-slate-400 text-[11px] pt-1 border-t border-slate-800">
              <span>Payment Mode</span>
              <span className="font-mono uppercase">{booking.paymentMethod}</span>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitted}
            className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-emerald-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
          >
            {isSubmitted ? (
              <>
                <Check className="w-5 h-5 stroke-[3]" />
                <span>Thank You! Review Recorded</span>
              </>
            ) : (
              <span>Submit Rating & Feedback</span>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
