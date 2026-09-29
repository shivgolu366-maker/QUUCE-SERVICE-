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

const AppContent: React.FC = () => {
  const { 
    viewMode, 
    setViewMode, 
    deviceFrame,
    isAddressModalOpen,
    setIsAddressModalOpen,
    editingAddress,
    setEditingAddress,
    saveCustomerAddress
  } = useQuickService();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Role-based Top Navigation Header */}
      <HeaderNav />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col">
        {/* 1. Public Customer Portal (Default Main View) */}
        {viewMode === 'customer' && (
          <MobileFrame isResponsive={deviceFrame === 'responsive'}>
            <CustomerApp />
          </MobileFrame>
        )}

        {/* 2. Partner / Worker Terminal */}
        {viewMode === 'partner' && (
          <MobileFrame isResponsive={deviceFrame === 'responsive'}>
            <PartnerApp />
          </MobileFrame>
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
