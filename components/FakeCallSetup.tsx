import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FakeCallSetupProps {
  onScheduleCall: (config: FakeCallConfig) => void;
  onBack: () => void;
}

export interface FakeCallConfig {
  callerName: string;
  callerAvatar: string | null;
  delaySeconds: number;
}

const DELAY_OPTIONS = [
  { label: 'Now', value: 0 },
  { label: '10s', value: 10 },
  { label: '30s', value: 30 },
  { label: '1m', value: 60 },
  { label: '5m', value: 300 },
];

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces',
];

const FakeCallSetup: React.FC<FakeCallSetupProps> = ({ onScheduleCall, onBack }) => {
  const [callerName, setCallerName] = useState('Mom');
  const [callerAvatar, setCallerAvatar] = useState<string | null>(DEFAULT_AVATARS[0]);
  const [selectedDelay, setSelectedDelay] = useState(10);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const delayScrollRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<number | null>(null);

  const handleSchedule = () => {
    onScheduleCall({
      callerName,
      callerAvatar,
      delaySeconds: selectedDelay,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCallerAvatar(reader.result as string);
        setShowAvatarPicker(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectedDelayIndex = DELAY_OPTIONS.findIndex(d => d.value === selectedDelay);

  const scrollToDelayIndex = (index: number) => {
    const container = delayScrollRef.current;
    if (!container) return;
    // Each item is 112px wide (w-28) + 24px gap (gap-6) = 136px total
    const itemWidth = 112;
    const gap = 24;
    const totalItemWidth = itemWidth + gap;
    const targetLeft = index * totalItemWidth;
    container.scrollTo({ left: targetLeft, behavior: 'smooth' });
  };

  useEffect(() => {
    // Center the initially selected option on mount
    setTimeout(() => scrollToDelayIndex(selectedDelayIndex), 100);
  }, []);

  const handleDelayScroll = () => {
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = window.setTimeout(() => {
      const container = delayScrollRef.current;
      if (!container) return;
      
      // Each item is 112px wide + 24px gap = 136px total
      const itemWidth = 112;
      const gap = 24;
      const totalItemWidth = itemWidth + gap;
      
      // Calculate which item is centered based on scroll position
      const index = Math.round(container.scrollLeft / totalItemWidth);
      const clampedIndex = Math.max(0, Math.min(DELAY_OPTIONS.length - 1, index));
      
      const newDelay = DELAY_OPTIONS[clampedIndex].value;
      if (newDelay !== selectedDelay) {
        setSelectedDelay(newDelay);
      }
    }, 50);
  };

  return (
    <div className="relative min-h-screen w-full max-w-md mx-auto bg-[#050505] flex flex-col overflow-y-auto no-scrollbar">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: 'linear-gradient(rgba(13, 185, 242, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(13, 185, 242, 0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Ambient Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-[#0db9f2]/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6 pt-8">
        <button 
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
        </button>
        <h2 className="text-sm font-bold tracking-[0.2em] text-white/90">ESCAPE ASSISTANT</h2>
        <div className="w-10" />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-4 flex flex-col gap-6 relative z-10">
        {/* Setup Card */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] backdrop-blur-xl p-6 shadow-xl shadow-black/50">
          <div className="flex flex-col gap-6">
            {/* Photo Picker */}
            <div className="flex flex-col items-center gap-3">
              <div 
                className="relative group cursor-pointer"
                onClick={() => setShowAvatarPicker(true)}
              >
                <div className="w-24 h-24 rounded-full bg-[#111] border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden transition-all group-hover:border-[#0db9f2]/50">
                  {callerAvatar ? (
                    <img 
                      src={callerAvatar} 
                      alt="Caller"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-white/30 text-3xl">person</span>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white text-2xl">edit</span>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#0db9f2] flex items-center justify-center text-black border-2 border-[#111]">
                  <span className="material-symbols-outlined text-sm font-bold">add</span>
                </div>
              </div>
              <span className="text-xs font-bold text-white/50 uppercase tracking-wider">Caller Avatar</span>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#0db9f2] uppercase tracking-wider pl-1">
                Caller Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={callerName}
                  onChange={(e) => setCallerName(e.target.value)}
                  placeholder="Ex: Boss, Mom..."
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:border-[#0db9f2] focus:ring-1 focus:ring-[#0db9f2] focus:outline-none transition-all font-display text-lg"
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white/30">edit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timer Section */}
        <div className="flex-1 flex flex-col justify-center py-4">
          <p className="text-center text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-6">
            Delay Protocol
          </p>

          {/* Delay Picker - Horizontal Slider */}
          <div className="relative h-32 flex items-center justify-center">
            {/* Blue Selection Box - Fixed in Center */}
            <div className="absolute w-28 h-28 rounded-2xl border-2 border-[#0db9f2] bg-[#0db9f2]/5 shadow-[0_0_30px_rgba(13,185,242,0.3)] z-0 pointer-events-none" />
            
            {/* Scrollable Options Container */}
            <div
              ref={delayScrollRef}
              onScroll={handleDelayScroll}
              className="relative z-10 w-full overflow-x-auto no-scrollbar scroll-smooth"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              <div className="flex items-center gap-6" style={{ paddingLeft: 'calc(50% - 56px)', paddingRight: 'calc(50% - 56px)' }}>
                {DELAY_OPTIONS.map((option, index) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSelectedDelay(option.value);
                      scrollToDelayIndex(index);
                    }}
                    className={`flex-shrink-0 w-28 h-28 flex items-center justify-center font-bold select-none transition-all duration-300 ${
                      selectedDelay === option.value
                        ? 'text-[#0db9f2] text-5xl scale-110 drop-shadow-[0_0_20px_rgba(13,185,242,1)]'
                        : 'text-white/30 text-2xl scale-100 hover:text-white/50'
                    }`}
                    style={{ 
                      scrollSnapAlign: 'center',
                      minWidth: '112px',
                      minHeight: '112px'
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-white/30 text-xs mt-4">Swipe to select delay</p>
        </div>

        {/* Action Button */}
        <div className="mt-auto pb-6">
          <button
            onClick={handleSchedule}
            disabled={!callerName.trim()}
            className="group relative w-full h-16 rounded-full overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity" />
            <div className="relative flex items-center justify-center gap-3 h-full">
              <span className="material-symbols-outlined text-black font-bold">lock_clock</span>
              <span className="text-black text-lg font-bold tracking-wider">SCHEDULE CALL</span>
            </div>
          </button>
        </div>
      </div>

      {/* Avatar Picker Modal */}
      <AnimatePresence>
        {showAvatarPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center"
            onClick={() => setShowAvatarPicker(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-md bg-[#111] rounded-t-3xl p-6 border-t border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6" />
              <h3 className="text-white font-bold text-lg mb-4">Choose Avatar</h3>
              
              {/* Default Avatars */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {DEFAULT_AVATARS.map((avatar, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCallerAvatar(avatar);
                      setShowAvatarPicker(false);
                    }}
                    className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all ${
                      callerAvatar === avatar ? 'border-[#0db9f2] scale-110' : 'border-transparent'
                    }`}
                  >
                    <img src={avatar} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 rounded-xl border border-white/20 text-white/70 hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">upload</span>
                Upload Custom Photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Cancel */}
              <button
                onClick={() => setShowAvatarPicker(false)}
                className="w-full py-4 mt-4 text-white/50 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FakeCallSetup;
