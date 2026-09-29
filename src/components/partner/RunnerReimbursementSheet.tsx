import React, { useState } from 'react';
import { Booking, ChecklistItem, BillReimbursement } from '../../types';
import { 
  Check, 
  Camera, 
  Receipt, 
  Upload, 
  DollarSign, 
  Calculator, 
  Sparkles, 
  CheckCircle2, 
  X,
  Clock
} from 'lucide-react';

interface RunnerReimbursementSheetProps {
  booking: Booking;
  onUpdateBooking: (updated: Partial<Booking>) => void;
}

export const RunnerReimbursementSheet: React.FC<RunnerReimbursementSheetProps> = ({
  booking,
  onUpdateBooking,
}) => {
  const [items, setItems] = useState<ChecklistItem[]>(booking.checklist || []);
  const [billAmount, setBillAmount] = useState<string>(
    booking.reimbursement?.totalItemsAmount ? booking.reimbursement.totalItemsAmount.toString() : ''
  );
  const [billPhotoUrl, setBillPhotoUrl] = useState<string | null>(
    booking.reimbursement?.billPhotoUrl || null
  );
  const [hoursSpent, setHoursSpent] = useState<number>(booking.hoursSpent || 1);
  const [memoNotes, setMemoNotes] = useState<string>(booking.reimbursement?.memoNotes || '');
  const [isSaved, setIsSaved] = useState(false);

  const hourlyLaborRate = booking.laborRate || 149; // Default runner hourly rate
  const parsedItemsCost = parseFloat(billAmount) || 0;
  const laborTotal = hourlyLaborRate * hoursSpent;
  const recalculatedTotal = laborTotal + parsedItemsCost;

  const toggleItemPurchased = (id: string) => {
    const updated = items.map(item => {
      if (item.id === id) {
        return { ...item, isPurchased: !item.isPurchased };
      }
      return item;
    });
    setItems(updated);
    onUpdateBooking({ checklist: updated });
  };

  const handleSimulatePhotoUpload = () => {
    const sampleBills = [
      'https://images.unsplash.com/photo-1554415707-9e4c07d30f35?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583521214690-73421a1829a9?w=500&auto=format&fit=crop&q=80'
    ];
    const picked = sampleBills[Math.floor(Math.random() * sampleBills.length)];
    setBillPhotoUrl(picked);
    if (!billAmount) {
      setBillAmount('285'); // realistic auto-detected bill amount from OCR simulation
    }
  };

  const handleSaveReimbursement = () => {
    const reimbursement: BillReimbursement = {
      billPhotoUrl: billPhotoUrl || undefined,
      billPhotoName: 'sabji_mandi_receipt.jpg',
      totalItemsAmount: parsedItemsCost,
      memoNotes: memoNotes || `Purchased from Sector 100 Mandi / Store`,
      uploadedAt: 'Just now',
      status: 'submitted',
    };

    onUpdateBooking({
      checklist: items,
      reimbursement,
      hoursSpent,
      totalAmount: recalculatedTotal,
      basePrice: laborTotal
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const purchasedCount = items.filter(i => i.isPurchased).length;

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-amber-400" />
          <div>
            <h4 className="text-xs font-bold text-white tracking-tight uppercase">
              Shopping Checklist & Bill Reimbursement
            </h4>
            <span className="text-[10px] text-slate-400">
              Purchased {purchasedCount} of {items.length} items
            </span>
          </div>
        </div>

        {booking.reimbursement?.status === 'submitted' && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
            BILL ATTACHED
          </span>
        )}
      </div>

      {/* Checklist items to tick */}
      <div className="space-y-1.5">
        <span className="text-[11px] text-slate-400 block font-medium">
          Tick items as you purchase them at Mandi / Store:
        </span>
        <div className="space-y-1 max-h-48 overflow-y-auto no-scrollbar">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleItemPurchased(item.id)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                item.isPurchased
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                  item.isPurchased 
                    ? 'bg-emerald-500 border-emerald-400 text-slate-950' 
                    : 'border-slate-600 bg-slate-900'
                }`}>
                  {item.isPurchased && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className={item.isPurchased ? 'line-through text-slate-400' : 'font-semibold'}>
                  {item.name}
                </span>
              </div>
              <span className="text-[11px] font-mono text-amber-400 font-semibold">
                {item.quantity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Cash Memo Photo Upload & Receipt Input */}
      <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-sky-400" />
            <span>Upload Cash Memo / Sabji Receipt</span>
          </span>
          <span className="text-[10px] text-slate-400">Required</span>
        </div>

        {billPhotoUrl ? (
          <div className="relative rounded-xl overflow-hidden border border-slate-700 h-28 bg-slate-900">
            <img src={billPhotoUrl} alt="Bill receipt" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-2">
              <span className="text-[10px] text-emerald-400 font-mono font-bold">
                ✓ Receipt Attached
              </span>
              <button
                type="button"
                onClick={() => setBillPhotoUrl(null)}
                className="text-[10px] text-slate-300 hover:text-white bg-slate-800/80 px-2 py-0.5 rounded"
              >
                Change Photo
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSimulatePhotoUpload}
            className="w-full py-3.5 px-4 rounded-xl border border-dashed border-slate-700 hover:border-slate-500 bg-slate-900/60 flex items-center justify-center gap-2 text-xs text-slate-300 hover:text-white transition-colors"
          >
            <Camera className="w-4 h-4 text-amber-400" />
            <span>Tap to Snap / Upload Shopkeeper Cash Memo</span>
          </button>
        )}

        {/* Amount Input */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Actual Items Cost (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs font-mono text-slate-500">₹</span>
              <input
                type="number"
                placeholder="285"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-7 pr-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Hours Spent
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="8"
                value={hoursSpent}
                onChange={(e) => setHoursSpent(parseFloat(e.target.value) || 1)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bill Calculation Formula */}
      <div className="p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl space-y-2 text-xs">
        <div className="flex items-center justify-between text-slate-300">
          <span>Labor Charge (₹{hourlyLaborRate} × {hoursSpent} hr)</span>
          <span className="font-mono text-white">₹{laborTotal}</span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span>Actual Items Bill Reimbursement</span>
          <span className="font-mono text-emerald-400 font-bold">+₹{parsedItemsCost}</span>
        </div>
        <div className="pt-2 border-t border-amber-500/30 flex items-center justify-between font-bold text-white">
          <span className="flex items-center gap-1 text-amber-300">
            <Calculator className="w-3.5 h-3.5" />
            <span>Total Customer Payable</span>
          </span>
          <span className="font-mono text-amber-400 text-base">₹{recalculatedTotal}</span>
        </div>
      </div>

      {/* Submit / Apply Button */}
      <button
        type="button"
        onClick={handleSaveReimbursement}
        disabled={!parsedItemsCost || !billPhotoUrl}
        className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
      >
        {isSaved ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-slate-950 stroke-[3]" />
            <span>Bill & Items Reimbursed!</span>
          </>
        ) : (
          <>
            <Receipt className="w-4 h-4" />
            <span>Save Cash Memo & Update Total Bill (₹{recalculatedTotal})</span>
          </>
        )}
      </button>
    </div>
  );
};
