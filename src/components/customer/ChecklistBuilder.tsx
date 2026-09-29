import React, { useState } from 'react';
import { ChecklistItem } from '../../types';
import { Plus, Trash2, Check, ShoppingBag, Sparkles, Tag } from 'lucide-react';

interface ChecklistBuilderProps {
  items: ChecklistItem[];
  onChange: (items: ChecklistItem[]) => void;
  serviceType?: string;
}

export const ChecklistBuilder: React.FC<ChecklistBuilderProps> = ({
  items,
  onChange,
  serviceType = 'sabji'
}) => {
  const [itemName, setItemName] = useState('');
  const [itemQty, setItemQty] = useState('');

  const quickSuggestions = serviceType === 'sabji' 
    ? [
        { name: 'Aloo (Potato)', qty: '2 kg' },
        { name: 'Pyaaz (Onion)', qty: '2 kg' },
        { name: 'Tamatar (Tomato)', qty: '1 kg' },
        { name: 'Dhania & Mirchi', qty: '1 bunch' },
        { name: 'Palak (Spinach)', qty: '500 gm' },
        { name: 'Nimbu (Lemon)', qty: '4 pcs' },
      ]
    : serviceType === 'medicine'
    ? [
        { name: 'Crocin / Paracetamol', qty: '1 strip' },
        { name: 'Digene Antacid', qty: '1 bottle' },
        { name: 'Band-Aid Strips', qty: '1 pack' },
        { name: 'Dettol Antiseptic', qty: '100 ml' },
        { name: 'ORS Electrolyte', qty: '2 sachets' },
      ]
    : [
        { name: 'Amul Taza Doodh', qty: '2 packets' },
        { name: 'Aashirvaad Atta', qty: '5 kg' },
        { name: 'Tata Salt', qty: '1 packet' },
        { name: 'Fortune Mustard Oil', qty: '1 litre' },
        { name: 'Maggi Noodles', qty: '4-pack' },
        { name: 'Surf Excel Powder', qty: '1 kg' },
      ];

  const handleAddItem = (nameToAdd?: string, qtyToAdd?: string) => {
    const finalName = (nameToAdd || itemName).trim();
    const finalQty = (qtyToAdd || itemQty).trim() || '1 item';
    if (!finalName) return;

    const newItem: ChecklistItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: finalName,
      quantity: finalQty,
      isPurchased: false,
      category: serviceType as any
    };

    onChange([...items, newItem]);
    if (!nameToAdd) {
      setItemName('');
      setItemQty('');
    }
  };

  const handleRemoveItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  return (
    <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Shopping Item Checklist ({items.length} items)
          </h4>
        </div>
        <span className="text-[10px] text-amber-400 font-mono">
          Reimbursed on Actual Bill
        </span>
      </div>

      <p className="text-[11px] text-slate-400">
        Add required items & quantities. Your runner will purchase them, tick each item, and upload the cash memo for exact reimbursement.
      </p>

      {/* Input Row */}
      <div className="grid grid-cols-12 gap-2 pt-1">
        <div className="col-span-7">
          <input
            type="text"
            placeholder="Item (e.g. Aloo, Doodh)"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem())}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
        <div className="col-span-3">
          <input
            type="text"
            placeholder="Qty (2kg)"
            value={itemQty}
            onChange={(e) => setItemQty(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem())}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
        <div className="col-span-2">
          <button
            type="button"
            onClick={() => handleAddItem()}
            disabled={!itemName.trim()}
            className="w-full h-full rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold flex items-center justify-center transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Add Suggestions */}
      <div className="space-y-1 pt-1">
        <span className="text-[10px] text-slate-500 block">Tap quick-add suggestions:</span>
        <div className="flex flex-wrap gap-1.5 overflow-x-auto no-scrollbar">
          {quickSuggestions.map((sug, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleAddItem(sug.name, sug.qty)}
              className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors flex items-center gap-1"
            >
              <span>+ {sug.name}</span>
              <span className="text-amber-400 font-mono">({sug.qty})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Current Items List */}
      {items.length > 0 ? (
        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-400">
                  {index + 1}
                </span>
                <span className="font-semibold text-white">{item.name}</span>
                <span className="text-[11px] text-amber-400 font-mono bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                  {item.quantity}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveItem(item.id)}
                className="w-6 h-6 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 flex items-center justify-center transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-3 bg-slate-950/60 rounded-xl border border-dashed border-slate-800 text-center text-[11px] text-slate-500">
          No items added yet. Type an item above or tap a quick suggestion.
        </div>
      )}

      {/* Reimbursement Explanation Note */}
      <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-300 flex items-start gap-2">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
        <span>
          <strong>Total Bill Formula:</strong> (Hourly Labor Rate × Hours) + Actual Items Bill Cost from Mandi/Store. You only pay for exact items purchased with verifiable cash memo receipt.
        </span>
      </div>
    </div>
  );
};
