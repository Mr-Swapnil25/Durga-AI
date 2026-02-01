import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface FakeCallActiveProps {
  callerName: string;
  callerAvatar: string | null;
  onEndCall: () => void;
}

const FakeCallActive: React.FC<FakeCallActiveProps> = ({
  callerName,
  callerAvatar,
  onEndCall,
}) => {
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [isKeypadVisible, setIsKeypadVisible] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  // Call duration timer
  useEffect(() => {
    startTimeRef.current = Date.now();
    
    const interval = setInterval(() => {
      setCallDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    // Prevent back navigation during call
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, '', window.location.href);
    };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      clearInterval(interval);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Format duration as MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const ControlButton: React.FC<{
    icon: string;
    label: string;
    active?: boolean;
    danger?: boolean;
    onClick: () => void;
  }> = ({ icon, label, active = false, danger = false, onClick }) => (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
    >
      <div 
        className={`w-[70px] h-[70px] rounded-full flex items-center justify-center transition-colors ${
          danger 
            ? 'bg-red-500 shadow-lg shadow-red-500/30' 
            : active 
              ? 'bg-white text-black' 
              : 'bg-white/20 backdrop-blur-sm'
        }`}
      >
        <span 
          className={`material-symbols-outlined text-[28px] ${
            danger ? 'text-white' : active ? 'text-black' : 'text-white'
          }`}
          style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
        >
          {icon}
        </span>
      </div>
      <span className="text-white/80 text-xs font-medium">{label}</span>
    </button>
  );

  // Keypad for "pressing" numbers during call
  const Keypad: React.FC = () => (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      className="absolute bottom-32 left-0 right-0 bg-black/90 backdrop-blur-xl rounded-t-3xl p-6 pb-8"
    >
      <div className="grid grid-cols-3 gap-4">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((key) => (
          <button
            key={key}
            className="h-16 rounded-full bg-white/10 text-white text-2xl font-medium hover:bg-white/20 active:scale-95 transition-all"
            onClick={() => {
              // Haptic feedback
              if ('vibrate' in navigator) {
                navigator.vibrate(30);
              }
            }}
          >
            {key}
          </button>
        ))}
      </div>
      <button
        onClick={() => setIsKeypadVisible(false)}
        className="w-full mt-4 py-3 text-white/60 hover:text-white transition-colors"
      >
        Hide
      </button>
    </motion.div>
  );

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black overflow-hidden flex flex-col"
      style={{ 
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-black" />

      {/* Top Section - Caller Info */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center pt-16 pb-8">
        {/* Small Avatar */}
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-800 shadow-xl mb-4 border-2 border-white/10">
          {callerAvatar ? (
            <img 
              src={callerAvatar} 
              alt={callerName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-white/50 text-4xl">person</span>
            </div>
          )}
        </div>

        {/* Caller Name */}
        <h1 className="text-white text-2xl font-semibold mb-2">{callerName}</h1>
        
        {/* Call Duration */}
        <motion.p 
          className="text-green-400 text-lg font-medium tracking-wider"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {formatDuration(callDuration)}
        </motion.p>
      </div>

      {/* Controls Section */}
      <div className="relative z-10 px-6 pb-12">
        {/* Control Grid */}
        <div className="grid grid-cols-3 gap-y-8 gap-x-4 mb-12">
          <ControlButton
            icon={isMuted ? 'mic_off' : 'mic'}
            label={isMuted ? 'Unmute' : 'Mute'}
            active={isMuted}
            onClick={() => setIsMuted(!isMuted)}
          />
          <ControlButton
            icon="dialpad"
            label="Keypad"
            onClick={() => setIsKeypadVisible(!isKeypadVisible)}
          />
          <ControlButton
            icon={isSpeaker ? 'volume_up' : 'volume_down'}
            label="Speaker"
            active={isSpeaker}
            onClick={() => setIsSpeaker(!isSpeaker)}
          />
          <ControlButton
            icon="add_call"
            label="Add Call"
            onClick={() => {}}
          />
          <ControlButton
            icon="videocam"
            label="FaceTime"
            onClick={() => {}}
          />
          <ControlButton
            icon="person"
            label="Contacts"
            onClick={() => {}}
          />
        </div>

        {/* End Call Button */}
        <div className="flex justify-center">
          <button
            onClick={onEndCall}
            className="w-[70px] h-[70px] rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/40 active:scale-95 transition-transform"
          >
            <span 
              className="material-symbols-outlined text-white text-[32px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              call_end
            </span>
          </button>
        </div>
      </div>

      {/* Keypad Overlay */}
      {isKeypadVisible && <Keypad />}

      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-white rounded-full opacity-40 z-20" />
    </div>
  );
};

export default FakeCallActive;
