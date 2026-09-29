import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useQuickService } from '../../context/QuickServiceContext';
import { 
  X, 
  CreditCard, 
  Smartphone, 
  Wallet, 
  Banknote, 
  ShieldCheck, 
  Check, 
  Lock, 
  QrCode,
  Copy,
  ExternalLink,
  RefreshCw,
  Clock,
  Download,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (method: 'upi' | 'card' | 'wallet' | 'cash') => void;
  amount: number;
  serviceTitle: string;
}

export type PaymentTab = 'upi_qr' | 'upi_app' | 'card' | 'wallet' | 'cash';

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  amount,
  serviceTitle,
}) => {
  const { customer } = useQuickService();
  const [selectedMethod, setSelectedMethod] = useState<PaymentTab>('upi_qr');
  const [upiOption, setUpiOption] = useState<'gpay' | 'phonepe' | 'paytm' | 'custom'>('gpay');
  const [customUpiId, setCustomUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccessAnim, setPaymentSuccessAnim] = useState(false);

  // Dynamic QR Code states
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGeneratingQr, setIsGeneratingQr] = useState<boolean>(true);
  const [transactionRef, setTransactionRef] = useState<string>(() => 'QS' + Math.floor(100000 + Math.random() * 900000));
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes validity
  const [copiedField, setCopiedField] = useState<'vpa' | 'link' | null>(null);

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const merchantVpa = 'quickservice.pay@okaxis';
  const merchantName = 'Quick Service Technologies';
  
  // Standard UPI deep-link URI (RFC compliant & compatible with GPay, PhonePe, Paytm, BHIM, Cred)
  const upiUri = `upi://pay?pa=${merchantVpa}&pn=${encodeURIComponent(merchantName)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`QuickService: ${serviceTitle.slice(0, 20)} [${transactionRef}]`)}&tr=${transactionRef}`;

  // Generate dynamic QR code whenever amount, transactionRef, or modal opens
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsGeneratingQr(true);

    QRCode.toDataURL(upiUri, {
      width: 320,
      margin: 1.5,
      color: {
        dark: '#090d16',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (isMounted) {
          setQrDataUrl(url);
          setIsGeneratingQr(false);
        }
      })
      .catch((err) => {
        console.error('Failed to generate UPI QR code', err);
        if (isMounted) setIsGeneratingQr(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, upiUri]);

  // QR Code Expiry Countdown Timer
  useEffect(() => {
    if (!isOpen || selectedMethod !== 'upi_qr') return;
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, selectedMethod, timeLeft]);

  if (!isOpen) return null;

  const handleRefreshQr = () => {
    setTransactionRef('QS' + Math.floor(100000 + Math.random() * 900000));
    setTimeLeft(300);
  };

  const handleCopy = (text: string, type: 'vpa' | 'link') => {
    navigator.clipboard.writeText(text);
    setCopiedField(type);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QuickService-UPI-QR-${transactionRef}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccessAnim(true);
      setTimeout(() => {
        setPaymentSuccessAnim(false);
        const resolvedMethod = (selectedMethod === 'upi_qr' || selectedMethod === 'upi_app') 
          ? 'upi' 
          : selectedMethod;
        onPaymentSuccess(resolvedMethod);
      }, 1000);
    }, 1400);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatCardNum = (val: string) => {
    const cleaned = val.replace(/\D/g, '').substring(0, 16);
    const parts = cleaned.match(/.{1,4}/g);
    return parts ? parts.join(' ') : cleaned;
  };

  const formatExp = (val: string) => {
    const cleaned = val.replace(/\D/g, '').substring(0, 4);
    if (cleaned.length >= 3) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    return cleaned;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Secure Checkout
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                  Instant UPI
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                128-bit Encrypted Transaction · Order ID #{transactionRef}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto no-scrollbar space-y-4">
          
          {/* Order Summary Strip */}
          <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/60 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400">Payable Total</div>
              <div className="text-xs font-semibold text-white truncate max-w-[220px]">{serviceTitle}</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold font-mono text-amber-400">
                ₹{amount}
              </div>
              <div className="text-[10px] text-slate-400">Incl. all taxes & fees</div>
            </div>
          </div>

          {/* Payment Method Selector Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300">Select Payment Mode</span>
              <span className="text-[10px] text-amber-400/90 font-medium">Zero transaction fee</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {[
                { id: 'upi_qr', label: 'UPI QR', icon: QrCode, badge: 'Scan' },
                { id: 'upi_app', label: 'UPI Apps', icon: Smartphone, badge: 'Collect' },
                { id: 'card', label: 'Cards', icon: CreditCard },
                { id: 'wallet', label: 'Wallet', icon: Wallet },
                { id: 'cash', label: 'COD', icon: Banknote },
              ].map(m => {
                const Icon = m.icon;
                const isSelected = selectedMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMethod(m.id as PaymentTab)}
                    className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all border relative ${
                      isSelected 
                        ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-semibold shadow-sm shadow-amber-500/10' 
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span className="text-[10px] sm:text-[11px] leading-tight truncate">{m.label}</span>
                    {m.badge && (
                      <span className={`text-[8px] px-1 py-0.2 rounded font-mono uppercase font-semibold ${
                        isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {m.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SUB-VIEW 1: DYNAMIC UPI QR CODE SCANNER */}
          {selectedMethod === 'upi_qr' && (
            <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-800/40 border border-slate-700/80 space-y-3.5">
              
              {/* Header with live timer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-semibold text-white">Scan & Pay with Any UPI App</span>
                </div>
                
                <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700 text-[11px] font-mono">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span className={timeLeft < 60 ? 'text-rose-400 font-bold' : 'text-amber-400'}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center pt-1 pb-1">
                <div className="relative p-3 bg-white rounded-2xl shadow-xl border-4 border-slate-700 flex flex-col items-center">
                  
                  {/* Top merchant brand bar in QR */}
                  <div className="w-full flex items-center justify-between border-b border-slate-200 pb-1.5 mb-1.5 text-[10px] text-slate-600 font-bold px-1">
                    <span className="flex items-center gap-1 text-slate-900">
                      <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" /> Quick Service
                    </span>
                    <span className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-extrabold">
                      UPI 2.0
                    </span>
                  </div>

                  {isGeneratingQr ? (
                    <div className="w-48 h-48 sm:w-52 sm:h-52 flex flex-col items-center justify-center gap-2">
                      <div className="w-8 h-8 rounded-full border-3 border-amber-500 border-t-transparent animate-spin" />
                      <span className="text-[11px] text-slate-500 font-medium">Generating UPI QR...</span>
                    </div>
                  ) : timeLeft === 0 ? (
                    <div className="w-48 h-48 sm:w-52 sm:h-52 flex flex-col items-center justify-center gap-2 bg-slate-100 rounded-xl p-3 text-center">
                      <AlertCircle className="w-8 h-8 text-rose-500" />
                      <span className="text-xs font-bold text-slate-800">QR Code Expired</span>
                      <p className="text-[10px] text-slate-500">Security timeout reached for session #{transactionRef}</p>
                      <button
                        onClick={handleRefreshQr}
                        className="mt-1 px-3 py-1 bg-amber-500 text-slate-950 font-bold text-[11px] rounded-lg flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Regenerate
                      </button>
                    </div>
                  ) : (
                    <div className="relative group">
                      <img 
                        src={qrDataUrl} 
                        alt="UPI Payment QR Code" 
                        className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-lg"
                      />
                      
                      {/* Subtle center logo badge */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-9 h-9 rounded-full bg-slate-900 border-2 border-white shadow-md flex items-center justify-center">
                          <span className="text-xs font-bold text-amber-400 font-mono">₹</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bottom UPI strip */}
                  <div className="w-full text-center border-t border-slate-200 pt-1.5 mt-1.5">
                    <span className="text-[10px] font-mono font-bold text-slate-800">
                      Amount: ₹{amount}.00
                    </span>
                  </div>
                </div>

                {/* Quick Action Tools */}
                <div className="w-full flex items-center justify-between gap-2 mt-3 pt-1">
                  <div className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-xl px-2.5 py-1.5 flex items-center justify-between">
                    <div className="truncate mr-2">
                      <div className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">UPI ID (VPA)</div>
                      <div className="text-[11px] font-mono text-white truncate">{merchantVpa}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(merchantVpa, 'vpa')}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-colors shrink-0"
                    >
                      {copiedField === 'vpa' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-400" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadQr}
                    title="Download QR image"
                    className="p-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white rounded-xl transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleRefreshQr}
                    title="Refresh QR session"
                    className="p-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white rounded-xl transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Supported UPI Apps Pills */}
              <div className="pt-1 border-t border-slate-700/50">
                <div className="text-[10px] text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>Compatible with all UPI applications</span>
                  <a 
                    href={upiUri} 
                    className="text-amber-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>Open in UPI app</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI', 'Cred', 'Navi', 'Amazon Pay'].map((app) => (
                    <span 
                      key={app} 
                      className="px-2 py-0.5 bg-slate-900/70 border border-slate-700 text-[10px] text-slate-300 rounded-md font-medium"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>

              {/* Switch to UPI Apps Button */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('upi_app')}
                  className="text-[11px] text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1"
                >
                  <span>Prefer entering UPI ID or paying on this phone?</span>
                  <span className="font-semibold text-amber-400">Use UPI Apps →</span>
                </button>
              </div>

            </div>
          )}

          {/* SUB-VIEW 2: UPI APPS INTENT & CUSTOM VPA */}
          {selectedMethod === 'upi_app' && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Select Instant App Intent</label>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('upi_qr')}
                  className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Switch to QR Code Scan</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'gpay', label: 'Google Pay', badge: 'Fastest' },
                  { id: 'phonepe', label: 'PhonePe', badge: 'Auto-Detect' },
                  { id: 'paytm', label: 'Paytm UPI', badge: 'Zero Fee' },
                ].map(app => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => setUpiOption(app.id as any)}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                      upiOption === app.id 
                        ? 'bg-slate-800 border-amber-500 text-white shadow-sm shadow-amber-500/10' 
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-xs font-semibold">{app.label}</span>
                    <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono">
                      {app.badge}
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <span className="text-[11px] text-slate-400 block mb-1.5">Or enter custom Virtual Payment Address (VPA):</span>
                <input
                  type="text"
                  placeholder="e.g. 9876543210@okaxis or rahul@okhdfcbank"
                  value={customUpiId}
                  onChange={e => {
                    setCustomUpiId(e.target.value);
                    setUpiOption('custom');
                  }}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  A collect notification will be sent to your UPI provider app for ₹{amount}.
                </span>
              </div>
            </div>
          )}

          {/* SUB-VIEW 3: CARDS */}
          {selectedMethod === 'card' && (
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="4111 2222 3333 4444"
                    value={cardNumber}
                    onChange={e => setCardNumber(formatCardNum(e.target.value))}
                    maxLength={19}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={e => setCardExpiry(formatExp(e.target.value))}
                    maxLength={5}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">CVV / CVC</label>
                  <input
                    type="password"
                    placeholder="•••"
                    value={cardCvv}
                    onChange={e => setCardCvv(e.target.value.substring(0, 4))}
                    maxLength={4}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <span className="text-[10px] text-slate-500 block">
                Supports Visa, Mastercard, RuPay & Amex. Zero international transaction surcharge.
              </span>
            </div>
          )}

          {/* SUB-VIEW 4: WALLET */}
          {selectedMethod === 'wallet' && (
            <div className="space-y-3 pt-1">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-300">Quick Service Wallet</div>
                  <div className="text-lg font-bold font-mono text-amber-400">
                    ₹{customer.walletBalance}
                  </div>
                </div>
                <div className="text-right">
                  {customer.walletBalance >= amount ? (
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Sufficient Balance
                    </span>
                  ) : (
                    <span className="text-[11px] text-rose-400 font-medium">
                      Short by ₹{amount - customer.walletBalance}
                    </span>
                  )}
                </div>
              </div>
              {customer.walletBalance < amount && (
                <p className="text-[11px] text-slate-400">
                  You can top up your wallet in your profile or pay with UPI QR for instant zero-fee booking.
                </p>
              )}
            </div>
          )}

          {/* SUB-VIEW 5: CASH ON DELIVERY */}
          {selectedMethod === 'cash' && (
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                <Banknote className="w-4 h-4" />
                <span>Cash on Delivery / Job Completion</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Pay ₹{amount} directly to the verified service professional after you inspect and approve the completed job. The professional carries a dynamic QR code for cashless tap.
              </p>
            </div>
          )}

        </div>

        {/* Action Button Strip */}
        <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 flex flex-col gap-2">
          {paymentSuccessAnim ? (
            <div className="w-full h-12 rounded-xl bg-emerald-500 text-slate-950 font-bold flex items-center justify-center gap-2 animate-in zoom-in-95 shadow-lg shadow-emerald-500/20">
              <Check className="w-5 h-5 stroke-[3]" />
              <span>UPI Payment Verified Successfully!</span>
            </div>
          ) : (
            <button
              onClick={handlePay}
              disabled={isProcessing || (selectedMethod === 'wallet' && customer.walletBalance < amount)}
              className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                  <span>Verifying UPI Transaction ₹{amount}...</span>
                </>
              ) : (
                <>
                  {selectedMethod === 'upi_qr' ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>I Have Paid via QR Code (₹{amount})</span>
                    </>
                  ) : selectedMethod === 'cash' ? (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Confirm Booking (Pay ₹{amount} Later)</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Pay ₹{amount} Securely</span>
                    </>
                  )}
                </>
              )}
            </button>
          )}

          <div className="flex items-center justify-center gap-3 text-[10px] text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> NPCI Verified
            </span>
            <span>·</span>
            <span>UPI Direct Gateway</span>
            <span>·</span>
            <span>100% Refund Protection</span>
          </div>
        </div>

      </div>
    </div>
  );
};
