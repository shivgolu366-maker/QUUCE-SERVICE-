import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import QRCode from 'qrcode';
import { 
  Download, 
  Terminal, 
  Check, 
  Copy, 
  FileCode, 
  FolderTree, 
  Smartphone, 
  ExternalLink, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Sparkles, 
  Info,
  QrCode,
  Package,
  Play,
  CheckCircle2,
  ArrowRight,
  Share2,
  Workflow,
  AlertCircle
} from 'lucide-react';
import { FLUTTER_PROJECT_FILES, FlutterProjectFile } from '../../data/flutterFilesData';

export const FlutterExportView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'direct_apk' | 'source_code'>('direct_apk');
  const [selectedFile, setSelectedFile] = useState<FlutterProjectFile>(FLUTTER_PROJECT_FILES[0]);
  const [copiedFile, setCopiedFile] = useState(false);
  const [copiedCommands, setCopiedCommands] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedWorkflow, setCopiedWorkflow] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  const currentAppUrl = typeof window !== 'undefined' ? window.location.origin : 'https://quickservice.app';
  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(currentAppUrl)}`;

  // Group files by category
  const categories = [
    { id: 'all', label: 'All Files' },
    { id: 'config', label: 'Project Config' },
    { id: 'android', label: 'Android Gradle & Manifest' },
    { id: 'lib', label: 'Core & Theme' },
    { id: 'models', label: 'Data Models' },
    { id: 'providers', label: 'State Providers' },
    { id: 'screens', label: 'Screens' },
  ];

  const [activeCategory, setActiveCategory] = useState('all');

  const filteredFiles = activeCategory === 'all' 
    ? FLUTTER_PROJECT_FILES 
    : FLUTTER_PROJECT_FILES.filter(f => f.category === activeCategory);

  // Generate mobile QR code for instant opening on phone
  useEffect(() => {
    QRCode.toDataURL(currentAppUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: '#020617',
        light: '#ffffff',
      },
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error('QR Gen error:', err));

    // Listen for PWA install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [currentAppUrl]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert(
        'To install directly on Android:\n\n1. Open this website in Google Chrome on your Android phone.\n2. Tap the ⋮ (three dots) menu at the top right.\n3. Tap "Install App" or "Add to Home screen".\n\nAndroid will package and install it as a native WebAPK!'
      );
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentAppUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyCommands = () => {
    const commands = `git clone <repo-url> quick_service\ncd flutter_project\nflutter pub get\nflutter build apk --release`;
    navigator.clipboard.writeText(commands);
    setCopiedCommands(true);
    setTimeout(() => setCopiedCommands(false), 2000);
  };

  const handleCopyWorkflow = () => {
    const workflowContent = `name: Build Android Release APK
on:
  push:
    branches: [ main ]
  workflow_dispatch:
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.19.6'
          channel: 'stable'
      - run: cd flutter_project && flutter pub get
      - run: cd flutter_project && flutter build apk --release
      - uses: actions/upload-artifact@v4
        with:
          name: QuickService-Release-APK
          path: flutter_project/build/app/outputs/flutter-apk/app-release.apk`;
    navigator.clipboard.writeText(workflowContent);
    setCopiedWorkflow(true);
    setTimeout(() => setCopiedWorkflow(false), 2000);
  };

  const handleDownloadSingleFile = (file: FlutterProjectFile) => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Generate & Download ZIP bundle using JSZip
  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Add all project files into the zip archive
      FLUTTER_PROJECT_FILES.forEach((file) => {
        zip.file(file.path, file.content);
      });

      // Generate zip blob
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'quick_service_flutter_source_code.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsZipping(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to generate zip:', err);
      setIsZipping(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 overflow-y-auto">
      {/* Top Banner / Hero */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" />
                Direct Android APK & Installation
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Flutter 3.19+ & Android 14
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>Android Release APK & App Installation</span>
            </h1>
            <p className="mt-2 text-sm text-slate-400 max-w-2xl leading-relaxed">
              Get Quick Service directly onto your Android device. Choose between instant 1-tap installation (WebAPK), cloud-generated release APK via Microsoft PWABuilder, automated GitHub cloud compilation, or download the full Flutter project.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleInstallClick}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer active:scale-95"
            >
              <Smartphone className="w-4 h-4" />
              <span>{isInstalled ? 'App Installed' : '1-Tap Install on Android'}</span>
            </button>

            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Download className={`w-4 h-4 ${isZipping ? 'animate-bounce' : ''}`} />
              <span>{isZipping ? 'Zipping...' : 'Download Source (.ZIP)'}</span>
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="max-w-6xl mx-auto mt-4 p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>quick_service_flutter_source_code.zip</strong> successfully generated and downloaded!</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="max-w-6xl mx-auto mt-8 flex items-center gap-2 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('direct_apk')}
            className={`px-4 py-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'direct_apk'
                ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Direct APK & Instant Install Hub</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Recommended
            </span>
          </button>

          <button
            onClick={() => setActiveTab('source_code')}
            className={`px-4 py-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'source_code'
                ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Flutter Source Code & File Explorer</span>
          </button>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        
        {/* ========================================================================= */}
        {/* TAB 1: DIRECT APK & INSTANT INSTALL HUB */}
        {/* ========================================================================= */}
        {activeTab === 'direct_apk' && (
          <div className="space-y-8">
            
            {/* Informational Callout explaining Cloud Sandboxes vs Raw Binaries */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-slate-200 flex flex-col sm:flex-row items-start gap-4">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div className="text-xs sm:text-sm space-y-1.5 leading-relaxed">
                <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                  <span>How Direct Android APK Delivery Works</span>
                </h3>
                <p className="text-slate-300">
                  Because cloud development sandboxes execute isolated Node.js/Vite web runtimes (without hosting a 5GB+ Android NDK/SDK build farm on the fly), standalone compiled <code className="text-amber-300 font-mono">.apk</code> binary files are distributed using the <strong>3 automated instant cloud channels</strong> below.
                </p>
              </div>
            </div>

            {/* 3 Main Direct APK / Installation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* CARD 1: Microsoft PWABuilder (1-Click APK Generator) */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between hover:border-amber-500/40 transition-all group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      METHOD 1 • 1-CLICK CLOUD APK
                    </span>
                    <Package className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Microsoft PWABuilder APK Generator
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Microsoft’s official open-source tool packages this exact progressive web application into a compiled, signed Android <code className="text-amber-300 font-mono">.apk</code> and <code className="text-amber-300 font-mono">.aab</code> package ready for direct installation or Google Play Store submission.
                  </p>

                  <div className="space-y-2 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300 mb-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Generates signed Android <strong className="text-white">.apk</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Ready in ~30 seconds in the cloud</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>No Android Studio or Flutter needed</span>
                    </div>
                  </div>
                </div>

                <a
                  href={pwaBuilderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all"
                >
                  <span>Build & Download Release APK</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* CARD 2: Direct 1-Tap Android WebAPK */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/30 shadow-xl flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      METHOD 2 • FASTEST (1-TAP)
                    </span>
                    <Smartphone className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Direct Android WebAPK Install
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    When opened in Google Chrome or Edge on an Android phone, Android OS automatically creates and installs an official <strong className="text-white">WebAPK</strong> into the Android Package Manager with its own launcher icon, splash screen, and offline support.
                  </p>

                  <div className="space-y-2 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300 mb-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Installs natively on Android Home Screen</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Full screen (No browser address bar)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Instant updates without re-downloading</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleInstallClick}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>{isInstalled ? 'Installed as App' : 'Install on Android Phone'}</span>
                </button>
              </div>

              {/* CARD 3: GitHub Actions Automated Cloud Build */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between hover:border-sky-500/40 transition-all group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                      METHOD 3 • FREE CI/CD BUILD
                    </span>
                    <Workflow className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    GitHub Actions Cloud APK Builder
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    We have provided an automated <code className="text-sky-300 font-mono">.github/workflows/build-apk.yml</code> workflow in this repository. Push this project to GitHub, and GitHub runs Flutter build on high-speed servers to produce <code className="text-sky-300 font-mono">app-release.apk</code> with direct download links!
                  </p>

                  <div className="space-y-2 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300 mb-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Compiles pure Flutter release binary</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Free cloud compute runners</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Direct download under Actions &gt; Artifacts</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCopyWorkflow}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 transition-all cursor-pointer"
                >
                  {copiedWorkflow ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Workflow YAML Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy GitHub Actions YAML</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Mobile Scan & Direct Launch Section */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800/90 border border-slate-800 shadow-xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                
                <div className="flex-1 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Scan with Any Android Camera</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Open Directly on Your Phone in 3 Seconds
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    Point your Android smartphone camera or QR code scanner at the QR code. It will open this application instantly in Chrome or Samsung Internet, where you can tap <strong>"Install App"</strong> to download and run it directly as an Android application.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={handleCopyUrl}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                    >
                      {copiedUrl ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">URL Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy App URL: <span className="font-mono text-amber-400 ml-1 truncate max-w-[200px] inline-block align-bottom">{currentAppUrl}</span></span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* QR Code Card */}
                <div className="shrink-0 p-4 rounded-2xl bg-white shadow-2xl flex flex-col items-center justify-center text-center">
                  {qrCodeUrl ? (
                    <img 
                      src={qrCodeUrl} 
                      alt="Scan to open on Android" 
                      className="w-44 h-44 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-44 h-44 bg-slate-100 flex items-center justify-center rounded-lg">
                      <QrCode className="w-12 h-12 text-slate-400 animate-pulse" />
                    </div>
                  )}
                  <span className="mt-2 text-[11px] font-bold font-mono text-slate-900 uppercase tracking-wider">
                    Quick Service Android URL
                  </span>
                  <span className="text-[10px] text-slate-500 font-sans">
                    Scan with Android Camera
                  </span>
                </div>

              </div>
            </div>

            {/* Step-by-Step Android Installation Guide */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400" />
                <span>3 Simple Steps to Install on Any Android Device (Without Developer Tools)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center mb-2">
                    1
                  </div>
                  <h5 className="text-xs font-bold text-white">Open in Android Chrome</h5>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Scan the QR code above or paste the app link into Google Chrome on your Android phone.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center mb-2">
                    2
                  </div>
                  <h5 className="text-xs font-bold text-white">Tap "Install" or Menu ⋮</h5>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Chrome will prompt "Add Quick Service to Home Screen" or tap Chrome's 3-dot menu and select "Install app".
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center mb-2">
                    3
                  </div>
                  <h5 className="text-xs font-bold text-white">Launch Native WebAPK</h5>
                  <p className="text-[11px] text-slate-400 mt-1">
                    The app appears in your Android App Drawer with its own icon and launches full screen without any browser bar!
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: FLUTTER SOURCE CODE & FILE EXPLORER */}
        {/* ========================================================================= */}
        {activeTab === 'source_code' && (
          <div className="space-y-8">
            
            {/* Step-by-Step APK Build Guide Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Compiling Android Release APK via CLI</h2>
                    <p className="text-xs text-slate-400">Run these commands locally if you have the Flutter SDK installed on your machine</p>
                  </div>
                </div>
                <button
                  onClick={handleCopyCommands}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                >
                  {copiedCommands ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Terminal Commands</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-xs font-mono font-bold text-amber-400">STEP 1</span>
                  <h3 className="font-semibold text-xs text-white mt-1">Unzip Project</h3>
                  <p className="text-[11px] text-slate-400 mt-1">Extract the downloaded ZIP archive into any folder.</p>
                  <code className="block mt-2 text-[10px] font-mono text-slate-300 bg-slate-900 p-1.5 rounded truncate">unzip quick_service.zip</code>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-xs font-mono font-bold text-amber-400">STEP 2</span>
                  <h3 className="font-semibold text-xs text-white mt-1">Install Packages</h3>
                  <p className="text-[11px] text-slate-400 mt-1">Fetch all required Flutter plugins from pub.dev.</p>
                  <code className="block mt-2 text-[10px] font-mono text-slate-300 bg-slate-900 p-1.5 rounded truncate">flutter pub get</code>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-xs font-mono font-bold text-amber-400">STEP 3</span>
                  <h3 className="font-semibold text-xs text-white mt-1">Compile Release APK</h3>
                  <p className="text-[11px] text-slate-400 mt-1">Build the self-contained standalone Android APK.</p>
                  <code className="block mt-2 text-[10px] font-mono text-emerald-400 bg-slate-900 p-1.5 rounded truncate">flutter build apk --release</code>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-xs font-mono font-bold text-amber-400">STEP 4</span>
                  <h3 className="font-semibold text-xs text-white mt-1">Locate APK File</h3>
                  <p className="text-[11px] text-slate-400 mt-1">Your release APK will be generated ready to install.</p>
                  <code className="block mt-2 text-[10px] font-mono text-amber-300 bg-slate-900 p-1.5 rounded truncate" title="build/app/outputs/flutter-apk/app-release.apk">
                    build/.../app-release.apk
                  </code>
                </div>
              </div>
            </div>

            {/* Code Explorer Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: File Tree & Category Filter */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-2 mb-3">
                    <FolderTree className="w-4 h-4 text-amber-400" />
                    <h3 className="font-bold text-sm text-white">Flutter Project Structure</h3>
                  </div>

                  {/* Category Filter Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setActiveCategory(c.id)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                          activeCategory === c.id
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>

                  {/* File list */}
                  <div className="space-y-1 max-h-[460px] overflow-y-auto pr-1">
                    {filteredFiles.map((file) => {
                      const isSelected = selectedFile.path === file.path;
                      return (
                        <button
                          key={file.path}
                          onClick={() => setSelectedFile(file)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between ${
                            isSelected 
                              ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300 font-semibold' 
                              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                            <span className="truncate">{file.path}</span>
                          </div>
                          <span className="text-[9px] uppercase font-mono text-slate-500 px-1 py-0.5 rounded bg-slate-800">
                            {file.category}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Tips Box */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-200">
                    <Info className="w-4 h-4 text-amber-400" />
                    <span>APK Build Tips</span>
                  </div>
                  <p>• <strong>ABI Split</strong>: Run <code className="text-amber-300 font-mono text-[10px]">flutter build apk --split-per-abi</code> to reduce APK download size by ~60%.</p>
                  <p>• <strong>Google Maps</strong>: Put your real Google Maps API key in <code className="text-slate-300 font-mono text-[10px]">AndroidManifest.xml</code> under <code className="text-slate-300 font-mono text-[10px]">com.google.android.geo.API_KEY</code>.</p>
                  <p>• <strong>Target SDK</strong>: Built for Android 14 (API Level 34) with backward compatibility down to Android 5.0 (API Level 21).</p>
                </div>
              </div>

              {/* Right Column: Code Viewer */}
              <div className="lg:col-span-8 flex flex-col rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
                {/* Header of Code Viewer */}
                <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-white">{selectedFile.path}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{selectedFile.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadSingleFile(selectedFile)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                      title="Download single file"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-400" />
                      <span className="hidden sm:inline">Save File</span>
                    </button>

                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors"
                    >
                      {copiedFile ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-amber-400" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Code Content Window */}
                <div className="p-4 bg-slate-950 font-mono text-xs text-slate-300 overflow-x-auto max-h-[580px] overflow-y-auto leading-relaxed">
                  <pre>
                    <code>{selectedFile.content}</code>
                  </pre>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
