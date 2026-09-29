import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Smartphone, 
  HardHat, 
  QrCode, 
  MessageCircle,
  Sparkles,
  Send,
  Users
} from 'lucide-react';

interface ShareLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'customer' | 'partner';
}

export const ShareLiveModal: React.FC<ShareLiveModalProps> = ({ 
  isOpen, 
  onClose,
  defaultTab = 'customer'
}) => {
  const [activeTab, setActiveTab] = useState<'customer' | 'partner'>(defaultTab);
  const [copiedLink, setCopiedLink] = useState<'customer' | 'partner' | null>(null);
  const [customerQr, setCustomerQr] = useState('');
  const [partnerQr, setPartnerQr] = useState('');

  // Use the live public URL if on domain, fallback to current origin
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-zl3z2vkjmue2m5mycaq3y4-916858960689.asia-southeast1.run.app';
  const customerLink = `${origin}/#/customer`;
  const partnerLink = `${origin}/#/partner`;

  useEffect(() => {
    QRCode.toDataURL(customerLink, { width: 200, margin: 2, color: { dark: '#020617', light: '#ffffff' } })
      .then(setCustomerQr)
      .catch(() => {});

    QRCode.toDataURL(partnerLink, { width: 200, margin: 2, color: { dark: '#020617', light: '#ffffff' } })
      .then(setPartnerQr)
      .catch(() => {});
  }, [customerLink, partnerLink]);

  if (!isOpen) return null;

  const handleCopy = (type: 'customer' | 'partner', url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(type);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const handleWhatsAppCustomer = () => {
    const text = `Namaste! 🙏 QuickService app live hai. Yahan se electrician, plumber, AC service ya home cleaning 10-15 minute mein direct book karein:\n${customerLink}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleWhatsAppPartner = () => {
    const text = `Namaste! 🛠️ QuickService Partner app join karein, real-time booking orders accept karein aur daily income kamayein:\n${partnerLink}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleNativeShare = async (type: 'customer' | 'partner') => {
    const isCust = type === 'customer';
    const title = isCust ? 'QuickService - Customer App' : 'QuickService - Partner & Worker App';
    const text = isCust 
      ? 'Book verified home services in minutes on QuickService' 
      : 'Accept instant bookings and earn daily with QuickService Partner';
    const url = isCust ? customerLink : partnerLink;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {}
    } else {
      handleCopy(type, url);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <span>App Live Share Center</span>
              <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                LIVE
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Customers aur Partners ko direct WhatsApp ya link se app bhejein
            </p>
          </div>
        </div>

        {/* Tab Switcher: Customer vs Partner */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('customer')}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'customer'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Customers ke liye</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('partner')}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'partner'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HardHat className="w-4 h-4" />
            <span>Partners / Workers ke liye</span>
          </button>
        </div>

        {/* Content for Customer */}
        {activeTab === 'customer' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-200 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Customer App Direct Link:</strong> Is link se customer bina kisi setup ke direct browser ya mobile par home services book kar sakte hain.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-950 rounded-2xl border border-slate-800">
              {customerQr ? (
                <div className="p-2 bg-white rounded-2xl shrink-0 shadow-lg">
                  <img src={customerQr} alt="Customer App QR" className="w-28 h-28" />
                  <span className="text-[9px] text-slate-700 font-mono block text-center mt-1 font-bold">
                    Scan Mobile Camera
                  </span>
                </div>
              ) : null}

              <div className="space-y-2 flex-1 w-full min-w-0">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                  Customer App URL:
                </span>
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-amber-300 truncate select-all">
                  {customerLink}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleCopy('customer', customerLink)}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                  >
                    {copiedLink === 'customer' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleWhatsAppCustomer}
                    className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-600/20"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>WhatsApp Bhejein</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleNativeShare('customer')}
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Customer Ko Share Karein (All Apps)</span>
            </button>
          </div>
        )}

        {/* Content for Partner */}
        {activeTab === 'partner' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-200 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong>Partner / Employee App Direct Link:</strong> Is link se worker/technician direct duty terminal khol sakta hai, online hoke instant booking accept kar sakta hai aur earnings dekh sakta hai.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-950 rounded-2xl border border-slate-800">
              {partnerQr ? (
                <div className="p-2 bg-white rounded-2xl shrink-0 shadow-lg">
                  <img src={partnerQr} alt="Partner App QR" className="w-28 h-28" />
                  <span className="text-[9px] text-slate-700 font-mono block text-center mt-1 font-bold">
                    Scan Mobile Camera
                  </span>
                </div>
              ) : null}

              <div className="space-y-2 flex-1 w-full min-w-0">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                  Partner App URL:
                </span>
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 truncate select-all">
                  {partnerLink}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleCopy('partner', partnerLink)}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                  >
                    {copiedLink === 'partner' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleWhatsAppPartner}
                    className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-600/20"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>WhatsApp Bhejein</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleNativeShare('partner')}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Partner Ko Share Karein (All Apps)</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
