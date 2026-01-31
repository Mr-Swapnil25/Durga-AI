import React from 'react';
import { ViewState } from '../types';
import { Shield, Map, Radio, User } from 'lucide-react';

interface BottomNavProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
  const navItems = [
    { view: ViewState.DASHBOARD, icon: Shield, label: 'CMD' },
    { view: ViewState.MAP, icon: Map, label: 'MAP' },
    { view: ViewState.OPS, icon: Radio, label: 'OPS' },
    { view: ViewState.PROFILE, icon: User, label: 'ID' },
  ];

  return (
    // Z-Index increased to 2000 to ensure it floats above Leaflet layers (which can go up to 1000)
    <div className="fixed bottom-0 left-0 w-full z-[2000] pointer-events-auto">
      {/* HUD Line Decoration */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyber-cyan/50 to-transparent"></div>
      
      {/* Navbar Container */}
      <div className="px-6 pb-6 pt-4 flex justify-between items-end bg-[#050505]/95 backdrop-blur-xl border-t border-white/5 shadow-[0_-5px_20px_rgba(0,0,0,0.8)]">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.label}
              onClick={() => setView(item.view)}
              className={`flex flex-col items-center gap-1 transition-all duration-300 relative ${
                isActive ? 'text-cyber-cyan -translate-y-2' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {/* Active Background Glow */}
              {isActive && (
                <div className="absolute inset-0 bg-cyber-cyan/20 blur-xl rounded-full scale-150 opacity-50" />
              )}
              
              <item.icon 
                size={24} 
                className={`relative z-10 ${isActive ? 'drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]' : ''}`} 
              />
              <span className="text-[10px] font-orbitron tracking-widest relative z-10">{item.label}</span>
              
              {isActive && (
                <div className="w-1 h-1 bg-cyber-cyan rounded-full mt-1 shadow-[0_0_5px_#00F0FF] relative z-10" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;