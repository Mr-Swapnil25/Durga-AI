import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewState } from '../types';
import { Phone, Users, Navigation, AlertTriangle } from 'lucide-react';

interface DashboardProps {
  onTriggerSOS: () => void;
  setView: (view: ViewState) => void;
}

// Card Component moved outside to prevent re-creation on render
const QuickActionCard = ({ title, icon: Icon, color, onClick }: any) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`relative group overflow-hidden glass-panel p-4 rounded-xl flex flex-col items-center justify-center gap-3 border border-white/5 hover:border-${color}/50 transition-colors`}
  >
    <div className={`absolute inset-0 bg-${color}/5 opacity-0 group-hover:opacity-100 transition-opacity`} />
    <Icon size={28} className={`text-${color} drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]`} />
    <span className="font-space text-xs tracking-wider text-gray-300">{title}</span>
  </motion.button>
);

const Dashboard: React.FC<DashboardProps> = ({ onTriggerSOS, setView }) => {
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const pressInterval = useRef<number | null>(null);

  // Handle Press and Hold logic
  const startPress = () => {
    setIsPressing(true);
    let p = 0;
    // Using window.setInterval explicitly for browser environment
    pressInterval.current = window.setInterval(() => {
      p += 2; // Speed of fill
      if (p >= 100) {
        if (pressInterval.current) clearInterval(pressInterval.current);
        onTriggerSOS();
        setProgress(0);
        setIsPressing(false);
      } else {
        setProgress(p);
      }
    }, 20);
  };

  const endPress = () => {
    setIsPressing(false);
    if (pressInterval.current) clearInterval(pressInterval.current);
    setProgress(0);
  };

  return (
    <div className="h-full flex flex-col px-6 pt-8 pb-24 relative overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-orbitron font-bold text-white tracking-wider">
            DURGA<span className="text-durga-red">.AI</span>
          </h1>
          <p className="text-xs font-space text-cyber-cyan/60 tracking-[0.2em] uppercase mt-1">
            System Online • Protected
          </p>
        </div>
        <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
           <img src="https://picsum.photos/40/40" alt="Profile" className="w-full h-full rounded-full opacity-80" />
        </div>
      </div>

      {/* Grid Background Effect */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:20px_20px] opacity-[0.03] pointer-events-none" />

      {/* Main SOS Trigger */}
      <div className="flex-1 flex flex-col items-center justify-center relative my-4">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Outer Pulsing Rings */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full border border-durga-red/30"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute inset-4 rounded-full border border-durga-red/50"
          />
          
          {/* Progress Ring (SVG) */}
          <svg className="absolute inset-0 w-full h-full rotate-[-90deg] pointer-events-none z-20">
             <circle
               cx="128"
               cy="128"
               r="124"
               stroke="#E63946"
               strokeWidth="4"
               fill="transparent"
               strokeDasharray="779" // 2 * pi * 124
               strokeDashoffset={779 - (779 * progress) / 100}
               className="transition-all duration-75 ease-linear"
             />
          </svg>

          {/* The Button */}
          <motion.button
            onMouseDown={startPress}
            onMouseUp={endPress}
            onMouseLeave={endPress}
            onTouchStart={startPress}
            onTouchEnd={endPress}
            whileTap={{ scale: 0.95 }}
            className="w-48 h-48 rounded-full bg-gradient-to-b from-[#1a0505] to-black border-2 border-durga-red shadow-[0_0_30px_rgba(230,57,70,0.4)] flex flex-col items-center justify-center z-10 active:shadow-[0_0_50px_rgba(230,57,70,0.8)] transition-shadow"
          >
            <AlertTriangle size={48} className="text-durga-red mb-2 drop-shadow-[0_0_5px_#E63946]" />
            <span className="font-orbitron font-bold text-2xl text-white tracking-widest neon-text-red">SOS</span>
            <span className="text-[10px] text-durga-red/60 font-space mt-1">HOLD 3 SEC</span>
          </motion.button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4 mt-auto">
        <QuickActionCard 
          title="Safe Route" 
          icon={Navigation} 
          color="cyber-cyan" 
          onClick={() => setView(ViewState.MAP)}
        />
        <QuickActionCard 
          title="Fake Call" 
          icon={Phone} 
          color="guardian-purple" 
          onClick={() => console.log("Fake call triggered")}
        />
        <QuickActionCard 
          title="Guardians" 
          icon={Users} 
          color="white" 
          onClick={() => console.log("Guardians list")}
        />
      </div>
    </div>
  );
};

export default Dashboard;