import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FakeCallSetup, { FakeCallConfig } from './FakeCallSetup';
import FakeCallIncoming from './FakeCallIncoming';
import FakeCallActive from './FakeCallActive';

interface FakeCallManagerProps {
  onClose: () => void;
}

type CallState = 'setup' | 'waiting' | 'incoming' | 'active' | 'ended';

const FakeCallManager: React.FC<FakeCallManagerProps> = ({ onClose }) => {
  const [callState, setCallState] = useState<CallState>('setup');
  const [callConfig, setCallConfig] = useState<FakeCallConfig | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle scheduled call
  const handleScheduleCall = useCallback((config: FakeCallConfig) => {
    setCallConfig(config);
    
    if (config.delaySeconds === 0) {
      // Immediate call
      setCallState('incoming');
    } else {
      // Start countdown
      setCountdown(config.delaySeconds);
      setCallState('waiting');
    }
  }, []);

  // Countdown effect
  useEffect(() => {
    if (callState === 'waiting' && countdown > 0) {
      timerRef.current = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    } else if (callState === 'waiting' && countdown === 0) {
      // Trigger incoming call
      setCallState('incoming');
    }
  }, [callState, countdown]);

  // Handle answer call
  const handleAnswer = useCallback(() => {
    setCallState('active');
  }, []);

  // Handle decline or end call
  const handleEndCall = useCallback(() => {
    setCallState('ended');
    // Short delay before closing
    setTimeout(() => {
      onClose();
    }, 500);
  }, [onClose]);

  // Handle back from setup
  const handleBackFromSetup = useCallback(() => {
    onClose();
  }, [onClose]);

  // Cancel waiting
  const handleCancelWaiting = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setCallState('setup');
    setCountdown(0);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {callState === 'setup' && (
        <motion.div
          key="setup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999]"
        >
          <FakeCallSetup
            onScheduleCall={handleScheduleCall}
            onBack={handleBackFromSetup}
          />
        </motion.div>
      )}

      {callState === 'waiting' && (
        <motion.div
          key="waiting"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center"
        >
          {/* Background Grid */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: 'linear-gradient(rgba(13, 185, 242, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(13, 185, 242, 0.05) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 flex flex-col items-center">
            {/* Caller Avatar */}
            <div className="relative mb-8">
              <motion.div
                className="w-32 h-32 rounded-full overflow-hidden bg-gray-800 border-4 border-[#0db9f2]/30"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {callConfig?.callerAvatar ? (
                  <img 
                    src={callConfig.callerAvatar} 
                    alt={callConfig.callerName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white/50 text-5xl">person</span>
                  </div>
                )}
              </motion.div>
              
              {/* Pulsing rings */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[#0db9f2]"
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[#0db9f2]"
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              />
            </div>

            {/* Status Text */}
            <h2 className="text-white text-xl font-bold mb-2">{callConfig?.callerName}</h2>
            <p className="text-[#0db9f2] text-sm uppercase tracking-widest mb-8">Call Scheduled</p>

            {/* Countdown */}
            <div className="relative">
              <motion.div
                className="text-8xl font-bold text-white font-display"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{ textShadow: '0 0 30px rgba(13, 185, 242, 0.5)' }}
              >
                {countdown}
              </motion.div>
              <p className="text-center text-white/40 text-sm mt-2">seconds until call</p>
            </div>

            {/* Cancel Button */}
            <button
              onClick={handleCancelWaiting}
              className="mt-12 px-8 py-3 rounded-full border border-white/20 text-white/70 hover:bg-white/10 hover:text-white transition-all"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {callState === 'incoming' && callConfig && (
        <motion.div
          key="incoming"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <FakeCallIncoming
            callerName={callConfig.callerName}
            callerAvatar={callConfig.callerAvatar}
            onAnswer={handleAnswer}
            onDecline={handleEndCall}
          />
        </motion.div>
      )}

      {callState === 'active' && callConfig && (
        <motion.div
          key="active"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <FakeCallActive
            callerName={callConfig.callerName}
            callerAvatar={callConfig.callerAvatar}
            onEndCall={handleEndCall}
          />
        </motion.div>
      )}

      {callState === 'ended' && (
        <motion.div
          key="ended"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
        >
          <div className="text-center">
            <span className="material-symbols-outlined text-red-500 text-6xl mb-4">call_end</span>
            <p className="text-white/60 text-lg">Call Ended</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FakeCallManager;
