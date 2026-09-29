import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Check, 
  Home, 
  Briefcase, 
  Compass, 
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import { detectCurrentLocationWithGps } from '../../utils/reverseGeocode';

export interface SavedAddressItem {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  address: string;
  coords: [number, number];
  isDefault: boolean;
  flatNo?: string;
  landmark?: string;
  city?: string;
  pincode?: string;
}

interface AddressEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingAddress?: SavedAddressItem | null;
  onSave: (address: SavedAddressItem) => void;
}

export const AddressEditModal: React.FC<AddressEditModalProps> = ({
  isOpen,
  onClose,
  existingAddress,
  onSave
}) => {
  const [label, setLabel] = useState<'Home' | 'Work' | 'Other'>(existingAddress?.label || 'Home');
  const [flatNo, setFlatNo] = useState(existingAddress?.flatNo || '');
  const [streetAddress, setStreetAddress] = useState(existingAddress?.address || '');
  const [landmark, setLandmark] = useState(existingAddress?.landmark || '');
  const [city, setCity] = useState(existingAddress?.city || 'Noida');
  const [pincode, setPincode] = useState(existingAddress?.pincode || '201301');
  const [coords, setCoords] = useState<[number, number]>(existingAddress?.coords || [28.5365, 77.3920]);
  const [isDefault, setIsDefault] = useState(existingAddress?.isDefault ?? true);
  
  // GPS state
  const [isLocating, setIsLocating] = useState(false);
  const [gpsSuccess, setGpsSuccess] = useState('');
  const [gpsError, setGpsError] = useState('');

  if (!isOpen) return null;

  const handleUseGps = async () => {
    setIsLocating(true);
    setGpsError('');
    setGpsSuccess('');

    try {
      const loc = await detectCurrentLocationWithGps();
      setCoords(loc.coords);
      setStreetAddress(loc.address);
      if (loc.city) setCity(loc.city);
      if (loc.postcode) setPincode(loc.postcode);
      setGpsSuccess(`📍 GPS Location Pin: ${loc.area || loc.city} detected!`);
      setTimeout(() => setGpsSuccess(''), 4000);
    } catch (err: any) {
      setGpsError(err.message || 'GPS location could not be fetched. Please enter manually.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streetAddress.trim()) {
      setGpsError('Kripya address enter karein ya GPS button dabayein');
      return;
    }

    const fullAddr = flatNo.trim() 
      ? `${flatNo.trim()}, ${streetAddress.trim()}`
      : streetAddress.trim();

    const savedItem: SavedAddressItem = {
      id: existingAddress?.id || `addr-${Date.now()}`,
      label,
      address: fullAddr,
      coords,
      isDefault,
      flatNo: flatNo.trim(),
      landmark: landmark.trim(),
      city: city.trim(),
      pincode: pincode.trim()
    };

    onSave(savedItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {existingAddress ? 'Edit Delivery Address' : 'Add New Address with GPS'}
              </h3>
              <p className="text-xs text-slate-400">
                Live GPS location se pata auto-detect karein
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 no-scrollbar">
          
          {/* GPS Auto-detect Button */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white">GPS Auto-Location</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Satellite Pin
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Aap abhi jahan rahte hain wahan ka exact address aur coordinates GPS se turant le aayein.
            </p>
            <button
              type="button"
              onClick={handleUseGps}
              disabled={isLocating}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all cursor-pointer active:scale-95 disabled:opacity-60"
            >
              {isLocating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Fetching Satellite GPS Location...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  <span>Use My Current Live GPS Location</span>
                </>
              )}
            </button>
            {gpsSuccess && (
              <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>{gpsSuccess}</span>
              </div>
            )}
            {gpsError && (
              <div className="text-[11px] font-semibold text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{gpsError}</span>
              </div>
            )}
          </div>

          {/* Label selector: Home / Work / Other */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Save Address As:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Home', icon: Home, label: 'Home' },
                { id: 'Work', icon: Briefcase, label: 'Work / Office' },
                { id: 'Other', icon: Compass, label: 'Other' },
              ].map(item => {
                const Icon = item.icon;
                const active = label === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLabel(item.id as any)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      active 
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Flat / House No. */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Flat / House / Floor No. & Building Name
            </label>
            <input
              type="text"
              value={flatNo}
              onChange={e => setFlatNo(e.target.value)}
              placeholder="e.g. Tower 4, Flat 1204, Lotus Boulevard"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Complete Street Address / Area */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Street, Society & Area Details *
            </label>
            <textarea
              rows={2}
              value={streetAddress}
              onChange={e => setStreetAddress(e.target.value)}
              placeholder="e.g. Sector 100, Near Amity University road, Noida"
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* City & Pincode Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                City / Region
              </label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="e.g. Noida / Delhi NCR"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Postal Pincode
              </label>
              <input
                type="text"
                value={pincode}
                onChange={e => setPincode(e.target.value)}
                placeholder="e.g. 201301"
                maxLength={6}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Default address toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isDefaultAddress"
              checked={isDefault}
              onChange={e => setIsDefault(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-700 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="isDefaultAddress" className="text-xs text-slate-300 cursor-pointer font-medium">
              Make this my Primary / Default Delivery Address
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer mt-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Save & Use Address (Pata Save Karein)</span>
          </button>

        </form>

      </div>
    </div>
  );
};
