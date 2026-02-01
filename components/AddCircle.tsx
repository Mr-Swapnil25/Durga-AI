import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Guardian {
  id: string;
  name: string;
  phone: string;
  avatar: string | null;
  relation: string;
}

interface AddCircleProps {
  onBack?: () => void;
}

const SYSTEM_HELPLINES = [
  { id: 'police', name: 'Police Control Room', number: '100', icon: 'local_police' },
  { id: 'women', name: 'Women Helpline', number: '1091', icon: 'female' },
  { id: 'ambulance', name: 'Ambulance', number: '108', icon: 'ambulance' },
];

const RELATION_OPTIONS = ['PARENT', 'SIBLING', 'FRIEND', 'SPOUSE', 'OTHER'];

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces',
];

const AddCircle: React.FC<AddCircleProps> = ({ onBack }) => {
  const [guardians, setGuardians] = useState<Guardian[]>([
    {
      id: '1',
      name: 'Mom',
      phone: '+91 98XXX XXXXX',
      avatar: DEFAULT_AVATARS[0],
      relation: 'PARENT',
    },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [newGuardian, setNewGuardian] = useState({
    name: '',
    phone: '',
    relation: 'FRIEND',
    avatar: null as string | null,
  });
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_GUARDIANS = 5;

  const handleAddGuardian = () => {
    if (!newGuardian.name.trim() || !newGuardian.phone.trim()) return;
    
    const guardian: Guardian = {
      id: Date.now().toString(),
      name: newGuardian.name,
      phone: newGuardian.phone,
      avatar: newGuardian.avatar,
      relation: newGuardian.relation,
    };
    
    setGuardians([...guardians, guardian]);
    setNewGuardian({ name: '', phone: '', relation: 'FRIEND', avatar: null });
    setShowAddModal(false);
  };

  const handleRemoveGuardian = (id: string) => {
    setGuardians(guardians.filter(g => g.id !== id));
    setShowDeleteConfirm(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewGuardian({ ...newGuardian, avatar: reader.result as string });
        setShowAvatarPicker(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveActivate = () => {
    // Save guardians to localStorage or backend
    localStorage.setItem('guardians', JSON.stringify(guardians));
    // Show success feedback
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
    alert('Guardians saved successfully! SOS alerts will be sent to your circle.');
  };

  return (
    <div className="relative min-h-screen w-full max-w-md mx-auto bg-[#050505] flex flex-col overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at 50% 0%, rgba(76, 29, 149, 0.4) 0%, rgba(5, 5, 5, 0) 70%)'
      }} />
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at 100% 100%, rgba(30, 64, 175, 0.2) 0%, rgba(5, 5, 5, 0) 50%)'
      }} />

      {/* Header */}
      <header className="sticky top-0 z-50 mx-2 mt-2 px-4 py-3 flex items-center justify-between rounded-b-2xl shadow-lg"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 bg-primary/20 animate-pulse" style={{
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
            }} />
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces"
              alt="User"
              className="w-full h-full object-cover border-2 border-primary/50"
              style={{
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
              }}
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#050505]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] tracking-widest text-green-400 font-bold uppercase">System Online</span>
            <h1 className="text-base font-bold tracking-wider text-white">SETUP GUARDIANS</h1>
          </div>
        </div>
        <button className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined text-[20px]">settings</span>
        </button>
      </header>

      {/* Scrollable Main Content */}
      <main className="relative z-10 flex-1 overflow-y-auto no-scrollbar pb-40 pt-6 px-4">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-[#00f0ff]/20 animate-ping" />
            <div className="relative w-20 h-20 rounded-full border border-[#00f0ff]/50 bg-[#00f0ff]/5 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <span className="material-symbols-outlined text-4xl text-[#00f0ff] animate-pulse">radar</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center tracking-tight mb-2">ADD YOUR CIRCLE</h2>
          <p className="text-white/60 text-center text-sm max-w-[260px] leading-relaxed">
            Select up to {MAX_GUARDIANS} trusted contacts to receive SOS alerts instantly.
          </p>
        </div>

        {/* Guardian Slots */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center justify-between px-2 pb-1">
            <span className="text-xs font-semibold text-white/40 tracking-wider uppercase">
              Your Guardians ({guardians.length}/{MAX_GUARDIANS})
            </span>
            <span className="text-xs font-mono text-[#00f0ff]">SECURE</span>
          </div>

          {/* Filled Guardian Slots */}
          {guardians.map((guardian) => (
            <motion.div
              key={guardian.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="group relative flex items-center gap-4 p-3 rounded-2xl border-l-4 border-l-[#00f0ff] overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderLeftWidth: '4px',
                borderLeftColor: '#00f0ff',
                boxShadow: '0 0 15px rgba(0, 240, 255, 0.05)',
              }}
            >
              {/* Background texture */}
              <div className="absolute right-0 top-0 p-2 opacity-10">
                <span className="material-symbols-outlined text-6xl">shield</span>
              </div>
              
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-gray-800 border border-white/10 overflow-hidden">
                  {guardian.avatar ? (
                    <img src={guardian.avatar} alt={guardian.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/10">
                      <span className="material-symbols-outlined text-white/50">person</span>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#00f0ff] text-black text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                  {guardian.relation}
                </div>
              </div>
              
              <div className="flex-1 min-w-0 z-10">
                <h3 className="text-white font-bold text-lg leading-none mb-1">{guardian.name}</h3>
                <p className="text-white/50 text-sm font-mono tracking-wide">{guardian.phone}</p>
              </div>
              
              <button
                onClick={() => setShowDeleteConfirm(guardian.id)}
                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">remove_circle</span>
              </button>
            </motion.div>
          ))}

          {/* Empty Slots */}
          {Array.from({ length: MAX_GUARDIANS - guardians.length }).map((_, index) => (
            <button
              key={`empty-${index}`}
              onClick={() => setShowAddModal(true)}
              className="w-full group flex items-center gap-4 p-3 rounded-2xl border border-dashed border-white/20 bg-white/0 hover:bg-white/5 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#00f0ff]/50 transition-colors">
                <span className="material-symbols-outlined text-white/40 group-hover:text-[#00f0ff]">add</span>
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-white/80 font-medium text-base">Empty Slot</h3>
                <p className="text-[#00f0ff]/80 text-xs font-normal">Tap to add Guardian</p>
              </div>
            </button>
          ))}
        </div>

        {/* System Helplines */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between px-2 pb-1">
            <span className="text-xs font-semibold text-white/40 tracking-wider uppercase">System Helplines</span>
            <span className="material-symbols-outlined text-xs text-[#ffd700]">lock</span>
          </div>

          {SYSTEM_HELPLINES.map((helpline) => (
            <div
              key={helpline.id}
              className="flex items-center gap-4 p-3 rounded-2xl bg-[#110a0a] border border-white/5 opacity-80"
            >
              <div className="w-10 h-10 rounded-full bg-[#ffd700]/10 flex items-center justify-center text-[#ffd700]">
                <span className="material-symbols-outlined">{helpline.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium text-sm">{helpline.name}</h3>
                <p className="text-white/40 text-xs font-mono">{helpline.number}</p>
              </div>
              <span className="material-symbols-outlined text-white/20 text-lg">lock</span>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Action Area */}
      <div className="absolute bottom-0 left-0 w-full px-4 z-40 pb-6 pt-10" style={{
        background: 'linear-gradient(to top, #050505 60%, transparent)'
      }}>
        <button
          onClick={handleSaveActivate}
          disabled={guardians.length === 0}
          className="w-full relative overflow-hidden bg-gradient-to-r from-primary to-orange-600 text-white font-bold text-lg tracking-widest py-4 rounded-full shadow-[0_0_20px_rgba(230,55,61,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')"
          }} />
          <div className="relative z-10 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined animate-pulse">fingerprint</span>
            SAVE & ACTIVATE
          </div>
        </button>
      </div>

      {/* Add Guardian Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl p-6 shadow-2xl"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-6 text-center">Add Guardian</h3>
              
              {/* Avatar Picker */}
              <div className="flex justify-center mb-6">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => setShowAvatarPicker(true)}
                >
                  <div className="w-20 h-20 rounded-full bg-[#111] border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden transition-all group-hover:border-[#00f0ff]/50">
                    {newGuardian.avatar ? (
                      <img src={newGuardian.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-white/30 text-2xl">person</span>
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#00f0ff] flex items-center justify-center text-black border-2 border-[#111]">
                    <span className="material-symbols-outlined text-xs font-bold">add</span>
                  </div>
                </div>
              </div>

              {/* Name Input */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-[#00f0ff] uppercase tracking-wider mb-2">Name</label>
                <input
                  type="text"
                  value={newGuardian.name}
                  onChange={(e) => setNewGuardian({ ...newGuardian, name: e.target.value })}
                  placeholder="Enter name..."
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] focus:outline-none transition-all"
                />
              </div>

              {/* Phone Input */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-[#00f0ff] uppercase tracking-wider mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={newGuardian.phone}
                  onChange={(e) => setNewGuardian({ ...newGuardian, phone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] focus:outline-none transition-all font-mono"
                />
              </div>

              {/* Relation Selector */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-[#00f0ff] uppercase tracking-wider mb-2">Relation</label>
                <div className="flex flex-wrap gap-2">
                  {RELATION_OPTIONS.map((relation) => (
                    <button
                      key={relation}
                      onClick={() => setNewGuardian({ ...newGuardian, relation })}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        newGuardian.relation === relation
                          ? 'bg-[#00f0ff] text-black'
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {relation}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-full bg-white/5 text-white/70 font-bold hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddGuardian}
                  disabled={!newGuardian.name.trim() || !newGuardian.phone.trim()}
                  className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#00f0ff] to-[#0db9f2] text-black font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Guardian
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar Picker Modal */}
      <AnimatePresence>
        {showAvatarPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setShowAvatarPicker(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-md rounded-t-3xl p-6"
              style={{
                background: 'linear-gradient(180deg, rgba(20,20,20,0.98) 0%, rgba(10,10,10,0.98) 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6" />
              <h3 className="text-lg font-bold text-white mb-4">Choose Avatar</h3>
              
              <div className="grid grid-cols-4 gap-3 mb-4">
                {DEFAULT_AVATARS.map((avatar, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setNewGuardian({ ...newGuardian, avatar });
                      setShowAvatarPicker(false);
                    }}
                    className="w-full aspect-square rounded-full overflow-hidden border-2 border-white/10 hover:border-[#00f0ff] transition-colors"
                  >
                    <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 rounded-xl bg-white/5 border border-dashed border-white/20 text-white/70 font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">upload</span>
                Upload Custom Photo
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl text-red-400">warning</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Remove Guardian?</h3>
              <p className="text-white/60 text-sm mb-6">
                This person will no longer receive your SOS alerts.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-3 rounded-full bg-white/5 text-white/70 font-bold hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRemoveGuardian(showDeleteConfirm)}
                  className="flex-1 py-3 rounded-full bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddCircle;
