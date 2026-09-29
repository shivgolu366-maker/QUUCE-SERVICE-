import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import JSZip from 'jszip';
import { 
  Download, 
  Smartphone, 
  HardHat, 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  QrCode, 
  Package, 
  CheckCircle2, 
  Workflow, 
  ArrowRight,
  Info,
  X,
  Share2
} from 'lucide-react';
import { useQuickService } from '../../context/QuickServiceContext';
import { FLUTTER_PROJECT_FILES } from '../../data/flutterFilesData';

interface AppDownloadHubProps {
  onClose?: () => void;
}

export const AppDownloadHub: React.FC<AppDownloadHubProps> = ({ onClose }) => {
  const { setViewMode } = useQuickService();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qrCustomer, setQrCustomer] = useState<string>('');
  const [qrPartner, setQrPartner] = useState<string>('');
  const [qrAdmin, setQrAdmin] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'customer' | 'partner' | 'admin'>('all');
  const [isZipping, setIsZipping] = useState(false);
  const [downloadMsg, setDownloadMsg] = useState('');

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://quickservice.app';
  const customerUrl = `${baseUrl}/#/customer`;
  const partnerUrl = `${baseUrl}/#/partner`;
  const adminUrl = `${baseUrl}/#/admin`;

  // PWABuilder pre-filled direct APK generator links
  const pwaCustomerUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(customerUrl)}`;
  const pwaPartnerUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(partnerUrl)}`;
  const pwaAdminUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(adminUrl)}`;

  useEffect(() => {
    QRCode.toDataURL(customerUrl, { width: 180, margin: 2, color: { dark: '#020617', light: '#ffffff' } })
      .then(url => setQrCustomer(url))
      .catch(() => {});

    QRCode.toDataURL(partnerUrl, { width: 180, margin: 2, color: { dark: '#020617', light: '#ffffff' } })
      .then(url => setQrPartner(url))
      .catch(() => {});

    QRCode.toDataURL(adminUrl, { width: 180, margin: 2, color: { dark: '#020617', light: '#ffffff' } })
      .then(url => setQrAdmin(url))
      .catch(() => {});
  }, [customerUrl, partnerUrl, adminUrl]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadZip = async (appName: string) => {
    try {
      setIsZipping(true);
      const zip = new JSZip();
      FLUTTER_PROJECT_FILES.forEach((file) => {
        zip.file(file.path, file.content);
      });
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `QuickService_${appName}_Flutter_Source.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsZipping(false);
      setDownloadMsg(`QuickService_${appName}_Flutter_Source.zip downloaded!`);
      setTimeout(() => setDownloadMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setIsZipping(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 overflow-y-auto">
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Official Download Center
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                3 Separate Standalone Apps
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Quick Service Mobile App Suite
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Customer, Delivery Partner, aur Operations Desk teeno ke liye <strong>alag-alag download aur direct install links</strong>. Android phone par direct 1-tap install karein ya Microsoft PWABuilder se signed APK download karein.
            </p>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {downloadMsg && (
          <div className="max-w-6xl mx-auto mt-4 p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{downloadMsg}</span>
          </div>
        )}
      </div>

      {/* 3 App Cards Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ========================================================================= */}
          {/* APP 1: CUSTOMER APP */}
          {/* ========================================================================= */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/30 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-amber-500 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                  APP 1 • CUSTOMER APP
                </span>
                <Smartphone className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
              </div>

              <h2 className="text-xl font-bold text-white mb-1">
                Quick Service — Customer
              </h2>
              <span className="text-[11px] font-mono text-slate-400 block mb-3">
                com.quickservice.customer
              </span>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Aam public aur customers ke liye app jahan se services book karein, grocery item list banayein, UPI QR se payment karein aur live runner track karein.
              </p>

              {/* QR Code preview */}
              <div className="p-3 bg-white rounded-2xl flex flex-col items-center justify-center my-4 mx-auto max-w-[170px] shadow-lg">
                {qrCustomer ? (
                  <img src={qrCustomer} alt="Customer App QR" className="w-32 h-32 object-contain" />
                ) : (
                  <div className="w-32 h-32 bg-slate-200 animate-pulse rounded" />
                )}
                <span className="text-[9px] font-bold font-mono text-slate-900 uppercase mt-1">
                  Customer App QR
                </span>
              </div>

              {/* Feature bullets */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Instant & Scheduled Multi-Service Booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Dynamic UPI QR & COD Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Live GPS Tracking with 4-Digit Start OTP</span>
                </div>
              </div>
            </div>

            {/* Actions for App 1 */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <a
                href={pwaCustomerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
              >
                <Package className="w-4 h-4" />
                <span>Download Customer Release APK</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setViewMode('customer')}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>Launch & 1-Tap Install (WebAPK)</span>
              </button>

              <button
                onClick={() => handleCopy('customer', customerUrl)}
                className="w-full py-2 px-3 rounded-xl text-[11px] font-mono text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-900 border border-slate-800/80 flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedId === 'customer' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'customer' ? 'Customer Link Copied!' : 'Copy Customer App Link'}</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* APP 2: PARTNER APP */}
          {/* ========================================================================= */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                  APP 2 • PARTNER APP
                </span>
                <HardHat className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>

              <h2 className="text-xl font-bold text-white mb-1">
                Quick Service — Partner
              </h2>
              <span className="text-[11px] font-mono text-slate-400 block mb-3">
                com.quickservice.partner
              </span>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Delivery partners aur service workers ke liye dedicated app jahan se Online/Offline duty karein, incoming masked leads accept karein aur earnings withdraw karein.
              </p>

              {/* QR Code preview */}
              <div className="p-3 bg-white rounded-2xl flex flex-col items-center justify-center my-4 mx-auto max-w-[170px] shadow-lg">
                {qrPartner ? (
                  <img src={qrPartner} alt="Partner App QR" className="w-32 h-32 object-contain" />
                ) : (
                  <div className="w-32 h-32 bg-slate-200 animate-pulse rounded" />
                )}
                <span className="text-[9px] font-bold font-mono text-slate-900 uppercase mt-1">
                  Partner App QR
                </span>
              </div>

              {/* Feature bullets */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Instant Online / Offline Duty Switch</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Masked Leads (Address unlocks on accept)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Cash Memo Memo & Daily IMPS Bank Payout</span>
                </div>
              </div>
            </div>

            {/* Actions for App 2 */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <a
                href={pwaPartnerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
              >
                <Package className="w-4 h-4" />
                <span>Download Partner Release APK</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setViewMode('partner')}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <HardHat className="w-4 h-4 text-emerald-400" />
                <span>Launch & 1-Tap Install (WebAPK)</span>
              </button>

              <button
                onClick={() => handleCopy('partner', partnerUrl)}
                className="w-full py-2 px-3 rounded-xl text-[11px] font-mono text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-900 border border-slate-800/80 flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedId === 'partner' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'partner' ? 'Partner Link Copied!' : 'Copy Partner App Link'}</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* APP 3: ADMIN DESK */}
          {/* ========================================================================= */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-indigo-500/30 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-indigo-500 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                  APP 3 • ADMIN DESK
                </span>
                <ShieldCheck className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>

              <h2 className="text-xl font-bold text-white mb-1">
                Quick Service — Admin Desk
              </h2>
              <span className="text-[11px] font-mono text-slate-400 block mb-3">
                com.quickservice.admin
              </span>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Operations managers aur supervisors ke liye dashboard: Live dispatch monitor, partner KYC approval, dynamic surge pricing aur emergency 24/7 SOS desk.
              </p>

              {/* QR Code preview */}
              <div className="p-3 bg-white rounded-2xl flex flex-col items-center justify-center my-4 mx-auto max-w-[170px] shadow-lg">
                {qrAdmin ? (
                  <img src={qrAdmin} alt="Admin App QR" className="w-32 h-32 object-contain" />
                ) : (
                  <div className="w-32 h-32 bg-slate-200 animate-pulse rounded" />
                )}
                <span className="text-[9px] font-bold font-mono text-slate-900 uppercase mt-1">
                  Admin App QR
                </span>
              </div>

              {/* Feature bullets */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Real-Time Dispatch Supervision & Map</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Partner KYC Document Approval System</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Surge Multiplier & Emergency SOS Desk</span>
                </div>
              </div>
            </div>

            {/* Actions for App 3 */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <a
                href={pwaAdminUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all"
              >
                <Package className="w-4 h-4" />
                <span>Download Admin Release APK</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setViewMode('admin')}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>Launch & 1-Tap Install (WebAPK)</span>
              </button>

              <button
                onClick={() => handleCopy('admin', adminUrl)}
                className="w-full py-2 px-3 rounded-xl text-[11px] font-mono text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-900 border border-slate-800/80 flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedId === 'admin' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'admin' ? 'Admin Link Copied!' : 'Copy Admin App Link'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* GitHub Actions 3-in-1 Cloud Release Notice */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Workflow className="w-5 h-5 text-sky-400" />
              <h3 className="font-bold text-white text-base">
                Automated GitHub Cloud Runner: 3 Standalone APKs
              </h3>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Humne <code className="text-sky-300 font-mono">.github/workflows/build-apk.yml</code> configure kar diya hai. Repo commit hote hi GitHub cloud runner automatically teeno APKs compile karke <strong>QuickService-Customer-release.apk</strong>, <strong>QuickService-Partner-release.apk</strong>, aur <strong>QuickService-Admin-release.apk</strong> provide karta hai.
            </p>
          </div>

          <button
            onClick={() => handleDownloadZip('AllApps')}
            disabled={isZipping}
            className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>{isZipping ? 'Generating ZIP...' : 'Download Full Flutter Source (.ZIP)'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
