import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Video, Radio, BellOff } from 'lucide-react';

interface SOSActiveProps {
  onCancel: () => void;
}

const SOSActive: React.FC<SOSActiveProps> = ({ onCancel }) => {
  const [timeLeft, setTimeLeft] = useState(5);
  const [isLive, setIsLive] = useState(false);
  
  // Countdown Timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsLive(true);
      // Here you would trigger the actual API call to backend
    }
  }, [timeLeft]);

  // Handle slide to cancel
  const [sliderValue, setSliderValue] = useState(0);
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setSliderValue(val);
    if (val > 90) {
      onCancel();
    }
  };

  const emergencyColor = isLive ? 'bg-durga-red' : 'bg-orange-600';

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col ${isLive ? 'bg-black' : 'bg-[#1a0505]'}`}>
      
      {/* Flashing Overlay */}
      <motion.div 
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="absolute inset-0 bg-durga-red pointer-events-none"
      />

      {/* Header Info */}
      <div className="relative z-10 pt-12 px-6">
         <div className="flex justify-between items-start">
           <div>
             <h2 className="text-3xl font-orbitron font-black text-white italic">
               {isLive ? 'ALERT SENT' : 'SENDING ALERT'}
             </h2>
             <p className="font-space font-mono text-durga-red mt-1">
               ID: #SOS-882-ALPHA
             </p>
           </div>
           {isLive && (
             <div className="flex items-center gap-2 bg-durga-red/20 px-3 py-1 rounded border border-durga-red text-durga-red animate-pulse">
               <Radio size={16} />
               <span className="text-xs font-bold font-orbitron">LIVE</span>
             </div>
           )}
         </div>
      </div>

      {/* Camera Feed Simulation */}
      <div className="flex-1 relative m-6 rounded-2xl overflow-hidden border border-white/10 bg-gray-900">
        {/* Placeholder for Camera */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <span className="text-gray-600 font-orbitron text-xl">CAMERA FEED ACQUIRING...</span>
        </div>
        
        {/* Mock HUD Overlay */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          <div className="flex justify-between text-xs font-mono text-cyber-cyan/70">
            <span>REC: 00:{isLive ? '12' : '00'}</span>
            <span>BAT: 84%</span>
          </div>
          <div className="flex gap-4 justify-center pb-4">
             <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur border border-white/20 flex items-center justify-center">
               <Mic className="text-white animate-pulse" size={20} />
             </div>
             <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur border border-white/20 flex items-center justify-center">
               <Video className="text-white" size={20} />
             </div>
          </div>
        </div>
      </div>

      {/* Countdown or Status */}
      <div className="relative z-10 px-6 pb-12">
        {!isLive ? (
          <div className="text-center mb-8">
             <h3 className="text-6xl font-orbitron font-bold text-white mb-2">{timeLeft}</h3>
             <p className="text-gray-400 font-space text-sm">SECONDS TO AUTO-CONFIRM</p>
          </div>
        ) : (
          <div className="text-center mb-8 p-4 bg-durga-red/10 border border-durga-red/30 rounded-lg">
             <p className="text-durga-red font-bold font-orbitron">
               GUARDIANS NOTIFIED: 12<br/>
               POLICE DISPATCHED
             </p>
          </div>
        )}

        {/* Slide to Cancel */}
        <div className="relative h-16 rounded-full bg-gray-900/80 border border-white/10 overflow-hidden group">
          <div 
            className="absolute left-0 top-0 bottom-0 bg-white/10 transition-all duration-75 ease-out"
            style={{ width: `${sliderValue}%` }}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={handleSliderChange}
            onTouchEnd={() => setSliderValue(0)}
            onMouseUp={() => setSliderValue(0)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <span className="font-space font-bold tracking-widest text-gray-500 group-hover:text-white transition-colors">
              {isLive ? 'SLIDE TO DISABLE' : 'SLIDE TO CANCEL FALSE ALARM'}
            </span>
          </div>
          <div 
            className="absolute top-1 bottom-1 w-14 bg-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-75 ease-out pointer-events-none z-10"
            style={{ left: `calc(${sliderValue}% - ${sliderValue * 0.5}px + 4px)` }}
          >
            <BellOff size={20} className="text-black" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOSActive;