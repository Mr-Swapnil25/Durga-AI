import React, { useState, useEffect } from 'react';
import { ViewState } from './types';
import Dashboard from './components/Dashboard';
import SOSActive from './components/SOSActive';
import BottomNav from './components/BottomNav';
import FakeCallManager from './components/FakeCallManager';
import AddCircle from './components/AddCircle';
import MedicalID from './components/MedicalID';
import EmergencyOps from './components/EmergencyOps';
import PermissionsSetup from './components/PermissionsSetup';
import Alerts from './components/Alerts';
import CovertRecord from './components/CovertRecord';
import SafeRoute from './components/SafeRoute';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [previousView, setPreviousView] = useState<ViewState>(ViewState.DASHBOARD);
  const [hasCompletedSetup, setHasCompletedSetup] = useState<boolean>(() => {
    // Check localStorage for setup completion
    return localStorage.getItem('durga_setup_complete') === 'true';
  });

  // Show permissions setup on first launch
  useEffect(() => {
    if (!hasCompletedSetup) {
      setCurrentView(ViewState.PERMISSIONS_SETUP);
    }
  }, [hasCompletedSetup]);

  const handleSetupComplete = () => {
    localStorage.setItem('durga_setup_complete', 'true');
    setHasCompletedSetup(true);
    setCurrentView(ViewState.DASHBOARD);
  };

  const handleSetupSkip = () => {
    localStorage.setItem('durga_setup_complete', 'true');
    setHasCompletedSetup(true);
    setCurrentView(ViewState.DASHBOARD);
  };

  const handleViewChange = (view: ViewState) => {
    setPreviousView(currentView);
    setCurrentView(view);
  };

  const handleTriggerSOS = () => {
    setCurrentView(ViewState.SOS_ACTIVE);
  };

  const handleCancelSOS = () => {
    // After SOS is cancelled (PIN entered), go to Emergency OPS Center
    setCurrentView(ViewState.EMERGENCY_OPS);
  };

  const handleMarkSafe = () => {
    // When user marks themselves safe, return to Dashboard
    setCurrentView(ViewState.DASHBOARD);
  };

  const handleCloseFakeCall = () => {
    setCurrentView(ViewState.DASHBOARD);
  };

  // Render content based on current view
  const renderContent = () => {
    switch (currentView) {
      case ViewState.PERMISSIONS_SETUP:
        return <PermissionsSetup onComplete={handleSetupComplete} onSkip={handleSetupSkip} />;
      case ViewState.SOS_ACTIVE:
        return <SOSActive onCancel={handleCancelSOS} />;
      case ViewState.EMERGENCY_OPS:
        return <EmergencyOps onMarkSafe={handleMarkSafe} />;
      case ViewState.FAKE_CALL:
        return <FakeCallManager onClose={handleCloseFakeCall} />;
      case ViewState.OPS:
        return <AddCircle />;
      case ViewState.PROFILE:
        return <MedicalID />;
      case ViewState.ALERTS:
        return <Alerts />;
      case ViewState.COVERT_RECORD:
        return <CovertRecord />;
      case ViewState.SAFE_ROUTE:
        return <SafeRoute />;
      case ViewState.DASHBOARD:
      default:
        return <Dashboard onTriggerSOS={handleTriggerSOS} setView={handleViewChange} />;
    }
  };

  // Check if we should hide navigation
  const hideNavigation = currentView === ViewState.SOS_ACTIVE || currentView === ViewState.FAKE_CALL || currentView === ViewState.EMERGENCY_OPS || currentView === ViewState.PERMISSIONS_SETUP;

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen w-screen text-slate-900 dark:text-white font-display overflow-hidden flex flex-col selection:bg-primary selection:text-white">
      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation - Hidden when SOS or FakeCall is active */}
      {!hideNavigation && (
        <BottomNav currentView={currentView} setView={handleViewChange} />
      )}
    </div>
  );
};

export default App;