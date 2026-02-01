import React, { useState } from 'react';
import { ViewState } from './types';
import Dashboard from './components/Dashboard';
import SOSActive from './components/SOSActive';
import CommunityMap from './components/CommunityMap';
import BottomNav from './components/BottomNav';
import FakeCallManager from './components/FakeCallManager';
import AddCircle from './components/AddCircle';
import MedicalID from './components/MedicalID';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [previousView, setPreviousView] = useState<ViewState>(ViewState.DASHBOARD);

  const handleViewChange = (view: ViewState) => {
    setPreviousView(currentView);
    setCurrentView(view);
  };

  const handleTriggerSOS = () => {
    setCurrentView(ViewState.SOS_ACTIVE);
  };

  const handleCancelSOS = () => {
    setCurrentView(ViewState.DASHBOARD);
  };

  const handleCloseFakeCall = () => {
    setCurrentView(ViewState.DASHBOARD);
  };

  // Render content based on current view
  const renderContent = () => {
    switch (currentView) {
      case ViewState.SOS_ACTIVE:
        return <SOSActive onCancel={handleCancelSOS} />;
      case ViewState.FAKE_CALL:
        return <FakeCallManager onClose={handleCloseFakeCall} />;
      case ViewState.MAP:
        return <CommunityMap />;
      case ViewState.OPS:
        return <AddCircle />;
      case ViewState.PROFILE:
        return <MedicalID />;
      case ViewState.DASHBOARD:
      default:
        return <Dashboard onTriggerSOS={handleTriggerSOS} setView={handleViewChange} />;
    }
  };

  // Check if we should hide navigation
  const hideNavigation = currentView === ViewState.SOS_ACTIVE || currentView === ViewState.FAKE_CALL;

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