import React from 'react';
import { QuickServiceProvider, useQuickService } from './context/QuickServiceContext';
import { HeaderNav } from './components/common/HeaderNav';
import { MobileFrame } from './components/common/MobileFrame';
import { CustomerApp } from './components/customer/CustomerApp';
import { PartnerApp } from './components/partner/PartnerApp';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AppDownloadHub } from './components/common/AppDownloadHub';
import { CallingModal } from './components/common/CallingModal';
import { ChatModal } from './components/common/ChatModal';
import { GlobalSmsNotification } from './components/common/GlobalSmsNotification';
import { AddressEditModal } from './components/common/AddressEditModal';
import { PhoneAuthModal } from './components/auth/PhoneAuthModal';
import { MobileLoginScreen } from './components/auth/MobileLoginScreen';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { PWAInstallBanner } from './components/pwa/PWAInstallBanner';
import { PortalSwitcher } from './components/common/PortalSwitcher';

const AppContent: React.FC = () => {
  const { 
    viewMode, 
    setViewMode, 
    deviceFrame,
    isAddressModalOpen,
    setIsAddressModalOpen,
    editingAddress,
    setEditingAddress,
    saveCustomerAddress,
    isPhoneAuthModalOpen,
    setIsPhoneAuthModalOpen,
    phoneAuthRole,
    isStandaloneApp,
    isMobileLoginOpen,
    setIsMobileLoginOpen
  } = useQuickService();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Role-based Top Navigation Header (Suppressed in Pure Standalone Mode) */}
      {!isStandaloneApp && <HeaderNav />}

      {/* Main View Area */}
      <main className="flex-1 flex flex-col">
        {/* 1. Public Customer Portal (Default Main View) */}
        {viewMode === 'customer' && (
          isStandaloneApp ? (
            <div className="flex-1 flex flex-col w-full max-w-2xl mx-auto min-h-screen">
              <CustomerApp />
            </div>
          ) : (
            <MobileFrame isResponsive={deviceFrame === 'responsive'}>
              <CustomerApp />
            </MobileFrame>
          )
        )}

        {/* 2. Partner / Worker Terminal */}
        {viewMode === 'partner' && (
          isStandaloneApp ? (
            <div className="flex-1 flex flex-col w-full max-w-2xl mx-auto min-h-screen">
              <PartnerApp />
            </div>
          ) : (
            <MobileFrame isResponsive={deviceFrame === 'responsive'}>
              <PartnerApp />
            </MobileFrame>
          )
        )}

        {/* 3. Operations & Developer Console (Includes APK & Source Hub) */}
        {(viewMode === 'admin' || viewMode === 'blueprint' || viewMode === 'flutter') && (
          <AdminDashboard />
        )}

        {/* 4. Standalone 3-App Ready-to-Download Hub */}
        {viewMode === 'download' && (
          <AppDownloadHub onClose={() => setViewMode('customer')} />
        )}
      </main>

      {/* Direct Portal Route Switcher (Discrete hidden toggle for ?mode=customer, ?mode=partner, ?mode=admin) */}
      <PortalSwitcher />

      {/* Global In-App Masked Call & Chat Overlays */}
      <CallingModal />
      <ChatModal />

      {/* Global Realistic OS SMS Alert Banner */}
      <GlobalSmsNotification />

      {/* Global Address Editor with GPS Auto-detection */}
      <AddressEditModal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          setEditingAddress(null);
        }}
        existingAddress={editingAddress}
        onSave={(newAddr) => {
          saveCustomerAddress(newAddr);
        }}
      />

      {/* Global Phone OTP Authentication Modal (Firebase Web SDK Logic) */}
      <PhoneAuthModal
        isOpen={isPhoneAuthModalOpen}
        onClose={() => setIsPhoneAuthModalOpen(false)}
        defaultRole={phoneAuthRole}
      />

      {/* Dedicated Production Firebase Mobile Login Screen */}
      <MobileLoginScreen
        isOpen={isMobileLoginOpen}
        onClose={() => setIsMobileLoginOpen(false)}
        defaultRole={phoneAuthRole}
      />

      {/* PWA In-App Install Prompt Banner for Public Visitors */}
      <PWAInstallBanner />

      {/* PWA Offline Connection Indicator */}
      <OfflineIndicator />
    </div>
  );
};

export default function App() {
  return (
    <QuickServiceProvider>
      <AppContent />
    </QuickServiceProvider>
  );
}
