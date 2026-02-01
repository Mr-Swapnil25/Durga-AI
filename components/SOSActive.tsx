import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

interface SOSActiveProps {
  onCancel: () => void;
}

// Waveform bar component for audio visualization
const WaveformBar: React.FC<{ delay: number }> = ({ delay }) => (
  <motion.div
    className="w-1 bg-red-500/50 rounded-full"
    animate={{ height: ['20%', '100%', '20%'] }}
    transition={{
      duration: 1,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: delay,
    }}
    style={{ minHeight: '4px' }}
  />
);

const SOSActive: React.FC<SOSActiveProps> = ({ onCancel }) => {
  const [countdown, setCountdown] = useState(5);
  const [isAlertSent, setIsAlertSent] = useState(false);
  const [sliderX, setSliderX] = useState(0);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const CORRECT_PIN = '1234'; // Default PIN for demo

  // Alert statuses
  const [alertStatuses, setAlertStatuses] = useState({
    guardians: { status: 'pending', count: 0, total: 5 },
    police: { status: 'pending' },
    evidence: { status: 'waiting' },
  });

  // Block back button and navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, '', window.location.href);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Escape, Back, and other navigation keys
      if (e.key === 'Escape' || e.key === 'Backspace' || e.key === 'Back') {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Push state to prevent back navigation
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown, true);

    // Request fullscreen for mobile lock effect
    const requestFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.log('Fullscreen not available');
      }
    };
    requestFullscreen();

    // Lock screen orientation
    try {
      if (screen.orientation && (screen.orientation as any).lock) {
        (screen.orientation as any).lock('portrait').catch(() => {});
      }
    } catch (err) {
      console.log('Orientation lock not available');
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown, true);
      
      // Exit fullscreen on cleanup
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0 && !isAlertSent) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isAlertSent) {
      setIsAlertSent(true);
      // Simulate sending alerts
      simulateAlertSequence();
    }
  }, [countdown, isAlertSent]);

  // Recording time counter
  useEffect(() => {
    if (isAlertSent) {
      const timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isAlertSent]);

  // Simulate alert sequence
  const simulateAlertSequence = () => {
    // Guardians notification
    let count = 0;
    const guardianInterval = setInterval(() => {
      count++;
      setAlertStatuses((prev) => ({
        ...prev,
        guardians: { ...prev.guardians, status: 'sending', count },
      }));
      if (count >= 5) {
        clearInterval(guardianInterval);
        setAlertStatuses((prev) => ({
          ...prev,
          guardians: { ...prev.guardians, status: 'sent', count: 5 },
        }));
      }
    }, 300);

    // Police dispatch
    setTimeout(() => {
      setAlertStatuses((prev) => ({
        ...prev,
        police: { status: 'dispatching' },
      }));
    }, 2000);

    // Evidence upload
    setTimeout(() => {
      setAlertStatuses((prev) => ({
        ...prev,
        evidence: { status: 'uploading' },
      }));
    }, 3500);
  };

  // Handle swipe to end emergency
  const handleDragEnd = (event: any, info: PanInfo) => {
    const sliderWidth = sliderRef.current?.offsetWidth || 300;
    const threshold = sliderWidth - 80; // Need to drag almost to the end
    
    if (info.offset.x >= threshold) {
      setShowPinModal(true);
    }
    setSliderX(0);
  };

  const handleDrag = (event: any, info: PanInfo) => {
    const sliderWidth = sliderRef.current?.offsetWidth || 300;
    const maxX = sliderWidth - 80;
    setSliderX(Math.min(Math.max(0, info.offset.x), maxX));
  };

  // Handle PIN verification
  const handlePinSubmit = () => {
    if (pin === CORRECT_PIN) {
      // Exit fullscreen
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      onCancel();
    } else {
      setPinError(true);
      setPin('');
      setTimeout(() => setPinError(false), 1000);
    }
  };

  const handlePinDigit = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        setTimeout(() => {
          if (newPin === CORRECT_PIN) {
            if (document.fullscreenElement) {
              document.exitFullscreen().catch(() => {});
            }
            onCancel();
          } else {
            setPinError(true);
            setPin('');
            setTimeout(() => setPinError(false), 1000);
          }
        }, 200);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Waveform delays for animation variety
  const waveformDelays = [0.1, 0.3, 0.5, 0.2, 0.4, 0.1, 0.6, 0.3, 0.5, 0.2, 0.4, 0.1, 0.3, 0.5, 0.2, 0.4, 0.1, 0.6, 0.3, 0.5];

  return (
    <>
      <style>{`
        @keyframes flashRed {
          0%, 100% { box-shadow: inset 0 0 30px rgba(244, 37, 37, 0.2); }
          50% { box-shadow: inset 0 0 100px rgba(244, 37, 37, 0.6); }
        }
        @keyframes pinPulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(244, 37, 37, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(244, 37, 37, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(244, 37, 37, 0); }
        }
        .animate-flash-red {
          animation: flashRed 2s infinite;
        }
        .pin-pulse {
          animation: pinPulse 1.5s infinite;
        }
        .shadow-neon-red {
          box-shadow: 0 0 20px rgba(244, 37, 37, 0.5), 0 0 60px rgba(244, 37, 37, 0.2);
        }
        .shadow-inner-red {
          box-shadow: inset 0 0 50px rgba(244, 37, 37, 0.3);
        }
      `}</style>

      <div 
        ref={containerRef}
        className="fixed inset-0 z-[9999] bg-[#050505] overflow-hidden touch-none select-none"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Main Container with Red Flash Animation */}
        <div className="relative flex flex-col w-full max-w-md mx-auto min-h-screen bg-[#050505] shadow-2xl overflow-hidden pb-8 animate-flash-red border-x border-red-900/20">
          
          {/* Inner Red Shadow Overlay */}
          <motion.div 
            className="absolute inset-0 pointer-events-none z-0 shadow-inner-red"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          
          {/* Top Radial Gradient */}
          <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_50%_-20%,_rgba(244,37,37,0.25),_transparent_70%)] pointer-events-none z-0" />

          {/* Header */}
          <header className="relative z-10 flex flex-col items-center pt-12 pb-6 px-6 text-center">
            {/* Emergency Active Badge */}
            <motion.div 
              className="flex items-center gap-2 mb-8 bg-red-500/10 px-4 py-2 rounded-full border border-red-500/30 backdrop-blur-sm"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span className="material-symbols-outlined text-primary">warning</span>
              <h1 className="text-primary font-orbitron text-lg font-bold tracking-widest drop-shadow-[0_0_10px_rgba(244,37,37,0.8)]">
                EMERGENCY ACTIVE
              </h1>
              <span className="material-symbols-outlined text-primary">warning</span>
            </motion.div>

            {/* Countdown Display */}
            <div className="flex flex-col items-center">
              <p className="text-gray-400 font-inter text-xs uppercase tracking-widest mb-2">
                {isAlertSent ? 'Alerts Dispatched' : 'Police/Guardians Alerted in'}
              </p>
              <div className="relative">
                <motion.span 
                  className="text-8xl font-orbitron font-black text-white leading-none tracking-tighter"
                  style={{ textShadow: '0 0 20px rgba(244, 37, 37, 0.5), 0 0 60px rgba(244, 37, 37, 0.2)' }}
                  key={countdown}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {isAlertSent ? '✓' : countdown.toString().padStart(2, '0')}
                </motion.span>
                {!isAlertSent && (
                  <span className="absolute top-2 -right-6 text-xl font-orbitron text-primary font-bold">s</span>
                )}
              </div>
            </div>

            {/* Cancel Button */}
            <button 
              onClick={() => setShowPinModal(true)}
              className="mt-6 px-8 py-3 rounded-full border border-gray-700 bg-gray-900/50 text-gray-400 font-inter text-xs tracking-widest hover:bg-gray-800 hover:text-white transition-all backdrop-blur-md flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">lock</span>
              CANCEL (PIN REQUIRED)
            </button>
          </header>

          {/* Main Content Section */}
          <section className="relative z-10 flex-1 w-full px-4 flex flex-col gap-4">
            {/* Live Map */}
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden border-2 border-red-900/50 shadow-neon-red group">
              {/* Map Background Image */}
              <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80">
                {/* Grid Overlay */}
                <div 
                  className="absolute inset-0" 
                  style={{
                    backgroundImage: 'linear-gradient(rgba(244,37,37,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(244,37,37,0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }}
                />
                
                {/* Simulated Map Streets */}
                <svg className="absolute inset-0 w-full h-full opacity-30">
                  <line x1="20%" y1="0" x2="20%" y2="100%" stroke="#444" strokeWidth="2" />
                  <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#444" strokeWidth="3" />
                  <line x1="80%" y1="0" x2="80%" y2="100%" stroke="#444" strokeWidth="2" />
                  <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#444" strokeWidth="2" />
                  <line x1="0" y1="60%" x2="100%" y2="60%" stroke="#444" strokeWidth="3" />
                  <line x1="0" y1="85%" x2="100%" y2="85%" stroke="#444" strokeWidth="2" />
                </svg>
              </div>

              {/* Grid Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(244,37,37,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(244,37,37,0.1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

              {/* Live Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/80 backdrop-blur border border-primary/40 px-3 py-1.5 rounded-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <span className="text-white font-inter text-[10px] font-bold tracking-wider uppercase">
                  Streaming Live Location
                </span>
              </div>

              {/* Center Location Pin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative flex items-center justify-center w-16 h-16 rounded-full pin-pulse bg-primary/20 border border-primary/50">
                  <div className="w-4 h-4 bg-primary rounded-full shadow-[0_0_20px_rgba(244,37,37,1)] border-2 border-white" />
                </div>
              </div>
            </div>

            {/* Live Audio Recording */}
            <div className="w-full bg-[#111] rounded-xl border border-[#222] p-4 flex items-center gap-4 shadow-lg">
              <motion.div 
                className="flex-shrink-0 w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center text-primary"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <span className="material-symbols-outlined">mic</span>
              </motion.div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-primary font-orbitron text-xs font-bold tracking-wider">LIVE AUDIO RECORDING</p>
                  <span className="text-gray-500 font-mono text-xs">{formatTime(recordingTime)}</span>
                </div>
                <div className="flex items-center gap-1 h-6 w-full overflow-hidden">
                  {waveformDelays.map((delay, index) => (
                    <WaveformBar key={index} delay={delay} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Alert Status Log */}
          <section className="px-6 py-6 mb-24 z-10">
            <h3 className="text-gray-500 font-orbitron text-xs tracking-widest mb-4 border-b border-gray-800 pb-2">
              ALERT STATUS LOG
            </h3>
            <div className="space-y-4">
              {/* Guardians Status */}
              <div className="flex items-center gap-4">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  alertStatuses.guardians.status === 'sent' 
                    ? 'bg-emerald-500/20' 
                    : 'bg-amber-500/20'
                }`}>
                  <span className={`material-symbols-outlined text-sm ${
                    alertStatuses.guardians.status === 'sent' 
                      ? 'text-emerald-500' 
                      : 'text-amber-500 animate-spin'
                  }`}>
                    {alertStatuses.guardians.status === 'sent' ? 'check' : 'progress_activity'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-inter text-sm font-semibold">
                    Guardians Notified ({alertStatuses.guardians.count}/{alertStatuses.guardians.total})
                  </p>
                  <p className="text-gray-500 text-[10px]">Location sent via SMS & WhatsApp</p>
                </div>
                <span className={`text-[10px] font-mono ${
                  alertStatuses.guardians.status === 'sent' ? 'text-emerald-500' : 'text-amber-500'
                }`}>
                  {alertStatuses.guardians.status === 'sent' ? 'SENT' : 'SENDING'}
                </span>
              </div>

              {/* Police Status */}
              <div className="flex items-center gap-4">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  alertStatuses.police.status === 'dispatching' 
                    ? 'bg-amber-500/20' 
                    : 'bg-gray-800'
                }`}>
                  <span className={`material-symbols-outlined text-sm ${
                    alertStatuses.police.status === 'dispatching' 
                      ? 'text-amber-500 animate-spin' 
                      : 'text-gray-500'
                  }`}>
                    {alertStatuses.police.status === 'dispatching' ? 'progress_activity' : 'schedule'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className={`font-inter text-sm font-semibold ${
                    alertStatuses.police.status === 'pending' ? 'text-gray-300' : 'text-white'
                  }`}>
                    Police Dispatching
                  </p>
                  <p className="text-gray-500 text-[10px]">Connecting to nearest control room...</p>
                </div>
                <span className={`text-[10px] font-mono ${
                  alertStatuses.police.status === 'dispatching' ? 'text-amber-500' : 'text-gray-600'
                }`}>
                  {alertStatuses.police.status === 'dispatching' ? '...' : 'WAIT'}
                </span>
              </div>

              {/* Evidence Status */}
              <div className={`flex items-center gap-4 ${
                alertStatuses.evidence.status === 'waiting' ? 'opacity-50' : ''
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  alertStatuses.evidence.status === 'uploading' 
                    ? 'bg-amber-500/20' 
                    : 'bg-gray-800'
                }`}>
                  <span className={`material-symbols-outlined text-sm ${
                    alertStatuses.evidence.status === 'uploading' 
                      ? 'text-amber-500 animate-spin' 
                      : 'text-gray-500'
                  }`}>
                    {alertStatuses.evidence.status === 'uploading' ? 'progress_activity' : 'cloud_upload'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className={`font-inter text-sm ${
                    alertStatuses.evidence.status === 'waiting' ? 'text-gray-300' : 'text-white font-semibold'
                  }`}>
                    Evidence Uploading to Cloud
                  </p>
                  <p className="text-gray-600 text-[10px]">
                    {alertStatuses.evidence.status === 'uploading' 
                      ? 'Uploading audio and location data...' 
                      : 'Waiting for network stability'}
                  </p>
                </div>
                <span className={`text-[10px] font-mono ${
                  alertStatuses.evidence.status === 'uploading' ? 'text-amber-500' : 'text-gray-600'
                }`}>
                  {alertStatuses.evidence.status === 'uploading' ? '...' : 'WAIT'}
                </span>
              </div>
            </div>
          </section>

          {/* Swipe to End Navigation */}
          <nav className="fixed bottom-0 left-0 w-full z-50 px-6 pb-8 pt-4 bg-gradient-to-t from-black via-black/90 to-transparent">
            <div 
              ref={sliderRef}
              className="relative h-16 w-full bg-[#1a1a1a] rounded-full border border-gray-800 flex items-center p-1 overflow-hidden shadow-2xl"
            >
              {/* Center Text */}
              <div className="absolute inset-0 flex items-center justify-center z-0">
                <motion.span 
                  className="text-gray-500 font-orbitron text-xs tracking-[0.2em] font-bold"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  SWIPE TO END EMERGENCY
                </motion.span>
              </div>

              {/* Chevron Arrows */}
              <div className="absolute inset-0 flex items-center justify-end px-6 opacity-30 pointer-events-none">
                <motion.span 
                  className="material-symbols-outlined text-white"
                  animate={{ opacity: [0.3, 1, 0.3], x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  chevron_right
                </motion.span>
                <motion.span 
                  className="material-symbols-outlined text-white"
                  animate={{ opacity: [0.3, 1, 0.3], x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.1 }}
                >
                  chevron_right
                </motion.span>
                <motion.span 
                  className="material-symbols-outlined text-white"
                  animate={{ opacity: [0.3, 1, 0.3], x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                >
                  chevron_right
                </motion.span>
              </div>

              {/* Draggable Button */}
              <motion.div
                className="h-14 w-20 bg-gradient-to-r from-red-600 to-red-500 rounded-full flex items-center justify-center shadow-lg relative z-10 cursor-grab active:cursor-grabbing border border-red-400/50"
                drag="x"
                dragConstraints={{ left: 0, right: (sliderRef.current?.offsetWidth || 300) - 80 }}
                dragElastic={0}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                animate={{ x: sliderX === 0 ? 0 : sliderX }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="material-symbols-outlined text-white">double_arrow</span>
              </motion.div>
            </div>
          </nav>
        </div>
      </div>

      {/* PIN Modal */}
      <AnimatePresence>
        {showPinModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black/95 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-sm bg-[#111] rounded-2xl border ${
                pinError ? 'border-red-500 animate-shake' : 'border-gray-800'
              } p-6`}
            >
              <h3 className="text-white font-orbitron text-lg font-bold text-center mb-2">
                ENTER PIN TO CANCEL
              </h3>
              <p className="text-gray-500 text-center text-sm mb-6">
                Enter your 4-digit security PIN
              </p>

              {/* PIN Display */}
              <div className="flex justify-center gap-4 mb-8">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full border-2 ${
                      pin.length > index
                        ? pinError ? 'bg-red-500 border-red-500' : 'bg-primary border-primary'
                        : 'border-gray-600'
                    } transition-all`}
                  />
                ))}
              </div>

              {/* Keypad */}
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del'].map((digit, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (digit === 'del') {
                        setPin(pin.slice(0, -1));
                      } else if (digit !== null) {
                        handlePinDigit(digit.toString());
                      }
                    }}
                    disabled={digit === null}
                    className={`h-14 rounded-xl font-orbitron text-xl font-bold transition-all ${
                      digit === null
                        ? 'invisible'
                        : digit === 'del'
                        ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-95'
                    }`}
                  >
                    {digit === 'del' ? (
                      <span className="material-symbols-outlined">backspace</span>
                    ) : (
                      digit
                    )}
                  </button>
                ))}
              </div>

              {/* Cancel Button */}
              <button
                onClick={() => {
                  setShowPinModal(false);
                  setPin('');
                }}
                className="w-full mt-6 py-3 text-gray-500 font-inter text-sm hover:text-white transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SOSActive;