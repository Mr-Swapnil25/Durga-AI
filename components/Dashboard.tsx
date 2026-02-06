import React from 'react';
import { ViewState } from '../types';

interface DashboardProps {
  onTriggerSOS: () => void;
  setView: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onTriggerSOS, setView }) => {
  return (
    <div className="relative flex flex-col w-full max-w-md mx-auto min-h-screen bg-white dark:bg-deep-void shadow-2xl pb-24 overflow-y-auto no-scrollbar">
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_50%_-20%,_rgba(244,37,37,0.15),_transparent_70%)] pointer-events-none z-0"></div>
      <div className="absolute top-20 right-0 w-[300px] h-[300px] bg-[radial-gradient(circle_at_center,_rgba(0,240,255,0.05),_transparent_70%)] pointer-events-none z-0"></div>

      <header className="relative z-10 flex items-center justify-between px-6 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan to-transparent p-[2px] clip-hexagon">
              <div className="w-full h-full bg-gray-800 clip-hexagon">
                <img
                  alt="Profile"
                  className="w-full h-full object-cover"
                  data-alt="User profile photo in futuristic hexagon frame"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAl7WsbW9Vml9avxd2Ru0KWxYOw0mdI4y_0CIYltQR0CRX2gqNZD8et6MAsrq4UnjJ9VKe73CRuexTULgkYnh8tLEXS-c8TMJeEr_7mRx7m0ZjQOsGSelRjEWjpSHNpyNu6ghg9ym-nzieTHtYaylGe19Ty1I04hjLs7Kfq04902Tg1uW-C7X9r99o1IBWGBdoEeBV9-TocySPPqZjimq_fufbPGftkv9j0YdkiBQIQ05MZeJYaYJOX5ItQucBZ5IZgBqcixHHkZMpz"
                />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-white font-orbitron text-lg font-bold tracking-wider leading-none">DURGA</h2>
            <p className="text-gray-500 text-[10px] font-bold tracking-[0.2em] mt-1">PROTECT</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-cyan"></span>
            </span>
            <p className="text-cyber-cyan font-orbitron text-xs font-bold tracking-widest">SYSTEM ONLINE</p>
          </div>
          <div className="text-[#444] text-[10px] font-mono mt-1">PWR 84%</div>
        </div>
      </header>

      <section className="relative z-10 flex flex-col items-center justify-center py-8">
        <div className="relative group cursor-pointer">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full border border-primary/40 animate-pulse"></div>
          <button
            onClick={onTriggerSOS}
            className="relative w-48 h-48 rounded-full shadow-neon-red transition-transform active:scale-95 duration-100 flex items-center justify-center sos-button-gradient shadow-3d-glass border-4 border-[#331111]"
          >
            <div className="absolute inset-2 rounded-full border border-white/20"></div>
            <div className="flex flex-col items-center z-20">
              <span className="material-symbols-outlined text-white text-5xl mb-1 drop-shadow-md">emergency_share</span>
              <span className="text-white font-orbitron text-2xl font-black tracking-widest drop-shadow-md">SOS</span>
            </div>
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none"></div>
          </button>
        </div>
        <div className="mt-8 text-center space-y-2">
          <h1 className="text-white font-orbitron text-2xl font-bold tracking-wide">EMERGENCY TRIGGER</h1>
          <p className="text-gray-400 text-sm tracking-wide font-medium">TAP AND HOLD FOR HELP</p>
        </div>
      </section>

      <div className="px-6 mb-4">
        <div className="flex items-center justify-between bg-[#111] border border-[#222] rounded-xl p-3 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-emerald-500">verified_user</span>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider">Current Zone</p>
              <p className="text-white font-bold">Safe</p>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-[#333]"></div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-cyber-cyan">sensors</span>
            <div className="text-right">
              <p className="text-gray-400 text-xs uppercase tracking-wider">Sensor</p>
              <p className="text-white font-bold">Active</p>
            </div>
          </div>
        </div>
      </div>

      <section className="px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-orbitron text-sm tracking-wider">QUICK ACTIONS</h3>
          <span className="material-symbols-outlined text-gray-600 text-sm">grid_view</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setView(ViewState.FAKE_CALL)}
            className="group relative p-[1px] rounded-2xl bg-gradient-to-b from-cyber-cyan/50 to-transparent hover:from-cyber-cyan transition-colors duration-300"
          >
            <div className="relative h-full bg-[#0a0a0a] rounded-2xl p-4 flex flex-col gap-3 group-hover:bg-[#111] transition-colors">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-cyber-cyan/20 group-hover:text-cyber-cyan transition-colors text-white">
                <span className="material-symbols-outlined">call</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm">Fake Call</p>
                <p className="text-gray-500 text-[10px] mt-1">Simulate incoming</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setView(ViewState.OPS)}
            className="group relative p-[1px] rounded-2xl bg-gradient-to-b from-cyber-cyan/50 to-transparent hover:from-cyber-cyan transition-colors duration-300"
          >
            <div className="relative h-full bg-[#0a0a0a] rounded-2xl p-4 flex flex-col gap-3 group-hover:bg-[#111] transition-colors">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-cyber-cyan/20 group-hover:text-cyber-cyan transition-colors text-white">
                <span className="material-symbols-outlined">group</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm">Guardians</p>
                <p className="text-gray-500 text-[10px] mt-1">Manage circle</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => setView(ViewState.COVERT_RECORD)}
            className="group relative p-[1px] rounded-2xl bg-gradient-to-b from-purple-500/50 to-transparent hover:from-purple-500 transition-colors duration-300"
          >
            <div className="relative h-full bg-[#0a0a0a] rounded-2xl p-4 flex flex-col gap-3 group-hover:bg-[#111] transition-colors">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors text-white">
                <span className="material-symbols-outlined">mic</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm">Covert Record</p>
                <p className="text-gray-500 text-[10px] mt-1">Audio evidence</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => setView(ViewState.SAFE_ROUTE)}
            className="group relative p-[1px] rounded-2xl bg-gradient-to-b from-emerald-500/50 to-transparent hover:from-emerald-500 transition-colors duration-300"
          >
            <div className="relative h-full bg-[#0a0a0a] rounded-2xl p-4 flex flex-col gap-3 group-hover:bg-[#111] transition-colors">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors text-white">
                <span className="material-symbols-outlined">security</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm">Safe Route</p>
                <p className="text-gray-500 text-[10px] mt-1">Nearest haven</p>
              </div>
            </div>
          </button>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-orbitron text-sm tracking-wider">LIVE SURVEILLANCE</h3>
        </div>
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[#222]">
          <img
            alt="Map"
            className="w-full h-full object-cover opacity-60 grayscale"
            data-alt="Dark map interface showing city streets at night"
            data-location="Metropolis Center"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKTvpkBxuGg77PZTCEX6yUkoZmfKDpeRshmg0F8TtztOVS5Y4jfXh4FXCKFQIy5pBM-V234EqSP0IoT_UebXvjttXTYWHhP-aXcnjF8AQtQvVaXVpRkdgpsGrHQfW9ZGEfF89R9Yr94Wh7t5VY6pBRngNyvgiDr5eHBO5qA_9TMVrvjX81pxEqV-W9EcC0qD4f4IkLBe_edyYP1aYKdNvSGo5iUuRWOdun_bX6javo2NPZ1h5QrfpjP5N9FmPL8CRJaVPWpVzBmr-C"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="relative flex h-8 w-8 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-cyan opacity-40"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyber-cyan shadow-neon-cyan border-2 border-white"></span>
            </span>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-cyber-cyan/20 rounded-full"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;