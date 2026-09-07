import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar, ActiveTab } from './components/Navbar';
import { MobileShell } from './components/mobile/MobileShell';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ArchitectureViewer } from './components/docs/ArchitectureViewer';
import { CallModal } from './components/modals/CallModal';
import { NotificationToast } from './components/modals/NotificationToast';

function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('MOBILE_APP');
  const [isMobileFullscreen, setIsMobileFullscreen] = useState(false);
  const { activeCall, endCall } = useApp();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-rose-600 selection:text-white">
      {/* Top App Bar & View Switcher */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileFullscreen={isMobileFullscreen}
        setIsMobileFullscreen={setIsMobileFullscreen}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-start w-full">
        {activeTab === 'MOBILE_APP' && <MobileShell />}
        {activeTab === 'ADMIN_PANEL' && <AdminDashboard />}
        {activeTab === 'ARCHITECTURE_CODE' && <ArchitectureViewer />}
      </main>

      {/* Active Call Dialer / Masked Calling Modal */}
      {activeCall && (
        <CallModal
          donor={activeCall.donor}
          isMasked={activeCall.isMasked}
          onClose={endCall}
        />
      )}

      {/* Real-time Emergency SOS Push Notification Toast */}
      <NotificationToast />

      {/* Persistent Legal Disclaimer Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-4 px-6 text-center text-xs text-neutral-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 माँ अम्बा मुफ़्त रक्तदान नेटवर्क (Maa Amba Free Blood Donation Network). 100% स्वैच्छिक एवं नि:शुल्क सेवा।
          </span>
          <span className="text-neutral-400">
            DPDP अधिनियम 2023 एवं औषधि व प्रसाधन सामग्री अधिनियम के पूर्णतः अनुरूप।
          </span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
