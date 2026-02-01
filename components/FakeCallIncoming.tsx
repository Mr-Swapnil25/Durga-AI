import React, { useState, useRef, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';

interface FakeCallIncomingProps {
  callerName: string;
  callerAvatar: string | null;
  onAnswer: () => void;
  onDecline: () => void;
}

// Web Audio API ringtone generator
const createRingtone = (): { start: () => void; stop: () => void } | null => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return null;

    const audioCtx = new AudioContext();
    let oscillator: OscillatorNode | null = null;
    let gainNode: GainNode | null = null;
    let isPlaying = false;
    let intervalId: NodeJS.Timeout | null = null;

    const playTone = () => {
      if (!isPlaying) return;
      
      oscillator = audioCtx.createOscillator();
      gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.frequency.value = 440; // A4 note
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.5);
      
      // Second tone (higher pitch)
      setTimeout(() => {
        if (!isPlaying) return;
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        
        osc2.frequency.value = 554; // C#5 note
        osc2.type = 'sine';
        
        gain2.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        
        osc2.start(audioCtx.currentTime);
        osc2.stop(audioCtx.currentTime + 0.5);
      }, 200);
    };

    return {
      start: () => {
        isPlaying = true;
        // Resume audio context if suspended
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        playTone();
        intervalId = setInterval(playTone, 2000);
      },
      stop: () => {
        isPlaying = false;
        if (intervalId) {
          clearInterval(intervalId);
        }
        if (oscillator) {
          try { oscillator.stop(); } catch (e) {}
        }
        audioCtx.close();
      }
    };
  } catch (e) {
    console.log('Web Audio API not available');
    return null;
  }
};

const FakeCallIncoming: React.FC<FakeCallIncomingProps> = ({
  callerName,
  callerAvatar,
  onAnswer,
  onDecline,
}) => {
  const [sliderX, setSliderX] = useState(0);
  const [isVibrating, setIsVibrating] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  const ringtoneRef = useRef<{ start: () => void; stop: () => void } | null>(null);

  // Play ringtone and vibrate on mount
  useEffect(() => {
    // Create and start ringtone
    ringtoneRef.current = createRingtone();
    if (ringtoneRef.current) {
      ringtoneRef.current.start();
    }

    // Vibration pattern (like phone ringing)
    const vibratePattern = () => {
      if ('vibrate' in navigator && isVibrating) {
        navigator.vibrate([500, 200, 500, 200, 500]);
      }
    };

    vibratePattern();
    const vibrationInterval = setInterval(vibratePattern, 2000);

    // Prevent back navigation
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, '', window.location.href);
    };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    // Prevent closing
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Stop ringtone
      if (ringtoneRef.current) {
        ringtoneRef.current.stop();
        ringtoneRef.current = null;
      }
      // Stop vibration
      if ('vibrate' in navigator) {
        navigator.vibrate(0);
      }
      clearInterval(vibrationInterval);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isVibrating]);

  // Handle slide to answer
  const handleDragEnd = (event: any, info: PanInfo) => {
    const sliderWidth = sliderRef.current?.offsetWidth || 300;
    const threshold = sliderWidth - 100;

    if (info.offset.x >= threshold) {
      setIsVibrating(false);
      if (ringtoneRef.current) {
        ringtoneRef.current.stop();
      }
      onAnswer();
    } else {
      setSliderX(0);
    }
  };

  const handleDrag = (event: any, info: PanInfo) => {
    const sliderWidth = sliderRef.current?.offsetWidth || 300;
    const maxX = sliderWidth - 80;
    setSliderX(Math.min(Math.max(0, info.offset.x), maxX));
  };

  const handleDecline = () => {
    setIsVibrating(false);
    if (ringtoneRef.current) {
      ringtoneRef.current.stop();
    }
    if ('vibrate' in navigator) {
      navigator.vibrate(0);
    }
    onDecline();
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black overflow-hidden"
      style={{ 
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      {/* Wallpaper Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 blur-md scale-110 brightness-75"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Caller Info */}
      <div className="relative z-10 pt-20 pb-8 flex flex-col items-center">
        {/* Avatar with pulsing ring */}
        <motion.div 
          className="relative mb-6"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-800 shadow-2xl border-4 border-white/10">
            {callerAvatar ? (
              <img 
                src={callerAvatar} 
                alt={callerName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-white/50 text-5xl">person</span>
              </div>
            )}
          </div>
          {/* Pulsing ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-green-400/50"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>

        {/* Caller Name */}
        <h1 className="text-white text-4xl font-semibold leading-tight tracking-tight mb-2">
          {callerName}
        </h1>
        <p className="text-white/60 text-lg font-normal tracking-wide">
          mobile
        </p>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Controls Area */}
      <div className="relative z-10 px-8 pb-8 flex flex-col gap-12">
        {/* Utility Row */}
        <div className="flex justify-between px-8">
          <button className="flex flex-col items-center gap-2 active:opacity-70 transition-opacity">
            <div className="w-[60px] h-[60px] rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[28px]">alarm</span>
            </div>
            <span className="text-white text-xs font-medium">Remind Me</span>
          </button>
          <button className="flex flex-col items-center gap-2 active:opacity-70 transition-opacity">
            <div className="w-[60px] h-[60px] rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[28px]">message</span>
            </div>
            <span className="text-white text-xs font-medium">Message</span>
          </button>
        </div>

        {/* Slide to Answer */}
        <div 
          ref={sliderRef}
          className="relative w-full h-[80px] flex items-center"
        >
          {/* Track Background */}
          <div className="absolute inset-0 bg-white/5 rounded-full backdrop-blur-sm" />

          {/* Shimmer Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <motion.span 
              className="text-[17px] font-normal tracking-wide"
              style={{
                background: 'linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.4) 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
              animate={{ backgroundPosition: ['0% center', '200% center'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              slide to answer
            </motion.span>
          </div>

          {/* Chevron Arrows */}
          <div className="absolute right-6 flex items-center opacity-30 pointer-events-none">
            <motion.span 
              className="material-symbols-outlined text-white text-xl"
              animate={{ opacity: [0.3, 1, 0.3], x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              chevron_right
            </motion.span>
            <motion.span 
              className="material-symbols-outlined text-white text-xl -ml-2"
              animate={{ opacity: [0.3, 1, 0.3], x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.1 }}
            >
              chevron_right
            </motion.span>
            <motion.span 
              className="material-symbols-outlined text-white text-xl -ml-2"
              animate={{ opacity: [0.3, 1, 0.3], x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            >
              chevron_right
            </motion.span>
          </div>

          {/* Slider Knob */}
          <motion.div
            className="absolute left-1 w-[72px] h-[72px] bg-white rounded-full flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing z-20"
            style={{
              boxShadow: '0 0 20px rgba(74, 222, 128, 0.5)',
            }}
            drag="x"
            dragConstraints={{ left: 0, right: (sliderRef.current?.offsetWidth || 300) - 80 }}
            dragElastic={0}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            animate={{ 
              x: sliderX === 0 ? 0 : sliderX,
              boxShadow: [
                '0 0 0 0 rgba(74, 222, 128, 0.7)',
                '0 0 0 15px rgba(74, 222, 128, 0)',
                '0 0 0 0 rgba(74, 222, 128, 0)',
              ]
            }}
            transition={{
              boxShadow: { duration: 1.5, repeat: Infinity }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span 
              className="material-symbols-outlined text-green-600 text-[32px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              call
            </span>
          </motion.div>
        </div>

        {/* Decline Button */}
        <div className="flex items-center justify-center pb-4">
          <button 
            onClick={handleDecline}
            className="flex flex-col items-center gap-2 opacity-90 hover:opacity-100 active:scale-95 transition-all"
          >
            <div className="w-[60px] h-[60px] rounded-full bg-red-500 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-red-500/30">
              <span 
                className="material-symbols-outlined text-white text-[32px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                call_end
              </span>
            </div>
            <span className="text-white text-xs font-medium">Decline</span>
          </button>
        </div>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-white rounded-full opacity-40 z-20" />
    </div>
  );
};

export default FakeCallIncoming;
