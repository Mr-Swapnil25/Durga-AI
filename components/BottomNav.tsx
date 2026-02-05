import React from 'react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
  const isDashboard = currentView === ViewState.DASHBOARD;
  const isOps = currentView === ViewState.OPS;
  const isMap = currentView === ViewState.MAP;
  const isProfile = currentView === ViewState.PROFILE;
  const isAlerts = currentView === ViewState.ALERTS;

  return (
    <nav className="fixed bottom-0 left-0 w-full z-[2000]">
      <div className="absolute bottom-0 w-full h-24 bg-[#111] border-t border-[#222] rounded-t-[2.5rem] shadow-2xl flex items-center justify-around px-6">
        <button
          onClick={() => setView(ViewState.DASHBOARD)}
          className={`flex flex-col items-center gap-1 ${
            isDashboard ? 'text-cyber-cyan' : 'text-gray-500 hover:text-white transition-colors'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">grid_view</span>
          <span className="text-[9px] font-bold tracking-widest">HUB</span>
        </button>

        <button
          onClick={() => setView(ViewState.OPS)}
          className={`flex flex-col items-center gap-1 ${
            isOps ? 'text-cyber-cyan' : 'text-gray-500 hover:text-white transition-colors'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">group</span>
          <span className="text-[9px] font-bold tracking-widest">TEAM</span>
        </button>

        <div className="relative -top-8">
          <button
            onClick={() => setView(ViewState.MAP)}
            className={`w-16 h-16 rounded-full bg-[#1a1a1a] border-4 border-[#050505] flex items-center justify-center shadow-neon-red relative z-10 group ${
              isMap ? 'text-cyber-cyan' : 'text-primary'
            }`}
          >
            <div className="absolute inset-0 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors"></div>
            <span className="material-symbols-outlined text-3xl">shield</span>
          </button>
        </div>

        <button
          onClick={() => setView(ViewState.ALERTS)}
          className={`flex flex-col items-center gap-1 ${
            isAlerts ? 'text-cyber-cyan' : 'text-gray-500 hover:text-white transition-colors'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">notifications</span>
          <span className="text-[9px] font-bold tracking-widest">ALERTS</span>
        </button>

        <button
          onClick={() => setView(ViewState.PROFILE)}
          className={`flex flex-col items-center gap-1 ${
            isProfile ? 'text-cyber-cyan' : 'text-gray-500 hover:text-white transition-colors'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">settings</span>
          <span className="text-[9px] font-bold tracking-widest">SYS</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;