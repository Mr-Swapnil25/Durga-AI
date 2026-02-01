import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MedicalData {
  name: string;
  id: string;
  dob: string;
  bloodGroup: string;
  allergies: string[];
  conditions: string[];
  medications: string[];
  avatar: string | null;
}

interface ICEContact {
  id: string;
  name: string;
  phone: string;
  initial: string;
}

const MedicalID: React.FC = () => {
  const [medicalData, setMedicalData] = useState<MedicalData>({
    name: 'User',
    id: '#DURGA-8821',
    dob: '12 Oct 1995',
    bloodGroup: 'O+',
    allergies: ['Penicillin', 'Peanuts'],
    conditions: ['Asthma', 'Diabetes'],
    medications: ['Insulin'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces',
  });

  const [iceContacts, setIceContacts] = useState<ICEContact[]>([
    { id: '1', name: 'Mom', phone: '+91 98765 43210', initial: 'M' },
    { id: '2', name: 'Dad', phone: '+91 91234 56789', initial: 'D' },
  ]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [editField, setEditField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleCall = (phone: string) => {
    // Vibrate on click
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    // Open phone dialer
    window.location.href = `tel:${phone.replace(/\s/g, '')}`;
  };

  const openEditModal = (field: string, currentValue: string) => {
    setEditField(field);
    setTempValue(currentValue);
    setShowEditModal(true);
  };

  const saveEdit = () => {
    if (!editField) return;

    switch (editField) {
      case 'name':
        setMedicalData({ ...medicalData, name: tempValue });
        break;
      case 'dob':
        setMedicalData({ ...medicalData, dob: tempValue });
        break;
      case 'bloodGroup':
        setMedicalData({ ...medicalData, bloodGroup: tempValue });
        break;
      case 'allergies':
        setMedicalData({ ...medicalData, allergies: tempValue.split(',').map(s => s.trim()).filter(Boolean) });
        break;
      case 'conditions':
        setMedicalData({ ...medicalData, conditions: tempValue.split(',').map(s => s.trim()).filter(Boolean) });
        break;
      case 'medications':
        setMedicalData({ ...medicalData, medications: tempValue.split(',').map(s => s.trim()).filter(Boolean) });
        break;
    }
    setShowEditModal(false);
    setEditField(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMedicalData({ ...medicalData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateQRData = () => {
    return JSON.stringify({
      name: medicalData.name,
      id: medicalData.id,
      bloodGroup: medicalData.bloodGroup,
      allergies: medicalData.allergies,
      conditions: medicalData.conditions,
      medications: medicalData.medications,
      iceContacts: iceContacts.map(c => ({ name: c.name, phone: c.phone })),
    });
  };

  return (
    <div className="relative min-h-screen w-full max-w-md mx-auto bg-[#050505] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full max-w-md bg-[#050505]/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0db9f2]" style={{ fontSize: '28px' }}>health_and_safety</span>
            <h1 className="text-xl font-bold tracking-widest text-white">MEDICAL ID</h1>
          </div>
          <button className="text-white/70 hover:text-white transition-colors">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
        {/* Meta Status */}
        <div className="px-4 pb-3 flex items-center justify-center">
          <div className="flex items-center gap-2 bg-[#0db9f2]/10 px-3 py-1 rounded-full border border-[#0db9f2]/20">
            <div className="h-2 w-2 rounded-full bg-[#0db9f2] animate-pulse"></div>
            <p className="text-[#0db9f2] text-xs font-bold tracking-wider uppercase">System Online</p>
          </div>
        </div>
      </header>

      {/* Spacer for Header */}
      <div className="h-28"></div>

      {/* Main Content Scroll Area */}
      <main className="flex-1 px-4 pb-32 overflow-y-auto no-scrollbar">
        {/* ID Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-xl bg-[#121212] border border-white/10 shadow-[0_0_15px_rgba(13,185,242,0.1)] mb-6"
        >
          {/* Decorative Cyber Line */}
          <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-[#0db9f2] to-transparent"></div>
          
          <div className="p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex gap-4 items-center">
                {/* Avatar */}
                <div 
                  className="h-16 w-16 rounded-lg bg-gray-700 bg-center bg-cover border-2 border-white/20 cursor-pointer hover:border-[#0db9f2]/50 transition-colors"
                  style={{ backgroundImage: medicalData.avatar ? `url('${medicalData.avatar}')` : undefined }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {!medicalData.avatar && (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-white/40">person</span>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                
                {/* User Details */}
                <div>
                  <h2 
                    className="text-2xl font-bold text-white leading-tight cursor-pointer hover:text-[#0db9f2] transition-colors"
                    onClick={() => openEditModal('name', medicalData.name)}
                  >
                    {medicalData.name}
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">{medicalData.id}</p>
                  <p 
                    className="text-gray-400 text-sm cursor-pointer hover:text-white transition-colors"
                    onClick={() => openEditModal('dob', medicalData.dob)}
                  >
                    DOB: {medicalData.dob}
                  </p>
                </div>
              </div>
              
              {/* QR Code Button */}
              <button 
                onClick={() => setShowQRModal(true)}
                className="flex items-center justify-center h-10 w-10 rounded bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
              >
                <span className="material-symbols-outlined text-white">qr_code_2</span>
              </button>
            </div>
            
            <div className="h-px w-full bg-white/10"></div>
            
            {/* Blood Type Badge Area */}
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => openEditModal('bloodGroup', medicalData.bloodGroup)}
            >
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Blood Group</span>
              <div className="flex items-center gap-2">
                {/* Pulsing effect container */}
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <div className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded text-red-500 font-bold text-lg tracking-widest">
                  {medicalData.bloodGroup}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Vital Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Allergies (High Importance) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-2 rounded-xl bg-[#121212] border border-red-500/30 p-4 relative overflow-hidden cursor-pointer hover:border-red-500/50 transition-colors"
            onClick={() => openEditModal('allergies', medicalData.allergies.join(', '))}
          >
            <div className="absolute right-0 top-0 p-3 opacity-20">
              <span className="material-symbols-outlined text-red-500" style={{ fontSize: '48px' }}>warning</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-red-500 text-sm">allergies</span>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Allergies</h3>
              </div>
              <p className="text-red-500 font-bold text-lg leading-tight">
                {medicalData.allergies.length > 0 ? medicalData.allergies.join(', ') : 'None listed'}
              </p>
            </div>
          </motion.div>

          {/* Conditions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl bg-[#121212] border border-white/10 p-4 flex flex-col justify-between cursor-pointer hover:border-[#0db9f2]/30 transition-colors"
            onClick={() => openEditModal('conditions', medicalData.conditions.join(', '))}
          >
            <div className="mb-3">
              <span className="material-symbols-outlined text-[#0db9f2] mb-2">monitor_heart</span>
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Conditions</h3>
              <p className="text-white font-medium text-base">
                {medicalData.conditions.length > 0 ? medicalData.conditions.join(', ') : 'None'}
              </p>
            </div>
          </motion.div>

          {/* Medications */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl bg-[#121212] border border-white/10 p-4 flex flex-col justify-between cursor-pointer hover:border-[#0db9f2]/30 transition-colors"
            onClick={() => openEditModal('medications', medicalData.medications.join(', '))}
          >
            <div className="mb-3">
              <span className="material-symbols-outlined text-[#0db9f2] mb-2">medication</span>
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Medications</h3>
              <p className="text-white font-medium text-base">
                {medicalData.medications.length > 0 ? medicalData.medications.join(', ') : 'None'}
              </p>
            </div>
          </motion.div>
        </div>

        {/* ICE Contacts Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-white text-sm font-bold uppercase tracking-wider">ICE Contacts</h3>
          <span className="text-xs text-gray-500">In Case of Emergency</span>
        </div>

        {/* ICE List */}
        <div className="flex flex-col gap-3">
          {iceContacts.map((contact, index) => (
            <motion.div 
              key={contact.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-xl bg-[#121212] border border-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-white font-bold text-xs border border-white/10">
                  {contact.initial}
                </div>
                <div>
                  <p className="text-white font-bold text-base">{contact.name}</p>
                  <p className="text-gray-500 text-xs font-mono">{contact.phone}</p>
                </div>
              </div>
              <button 
                onClick={() => handleCall(contact.phone)}
                className="h-10 w-10 rounded-full bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-500 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined">call</span>
              </button>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Floating Action Button (FAB) */}
      <button 
        onClick={() => setShowEditModal(true)}
        className="fixed bottom-28 right-6 z-40 h-14 w-14 rounded-full bg-[#0db9f2] text-[#050505] shadow-[0_0_20px_rgba(13,185,242,0.4)] flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>edit</span>
      </button>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4 capitalize">
                Edit {editField?.replace(/([A-Z])/g, ' $1').trim() || 'Profile'}
              </h3>

              {editField === 'bloodGroup' ? (
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {BLOOD_GROUPS.map((bg) => (
                    <button
                      key={bg}
                      onClick={() => setTempValue(bg)}
                      className={`py-2 rounded-lg font-bold transition-all ${
                        tempValue === bg
                          ? 'bg-red-500 text-white'
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mb-6">
                  <input
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    placeholder={`Enter ${editField}...`}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-[#0db9f2] focus:ring-1 focus:ring-[#0db9f2] focus:outline-none transition-all"
                  />
                  {(editField === 'allergies' || editField === 'conditions' || editField === 'medications') && (
                    <p className="text-white/40 text-xs mt-2">Separate multiple items with commas</p>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 rounded-full bg-white/5 text-white/70 font-bold hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="flex-1 py-3 rounded-full bg-[#0db9f2] text-black font-bold hover:opacity-90 transition-opacity"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setShowQRModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Medical ID QR Code</h3>
              
              {/* QR Code Placeholder */}
              <div className="w-48 h-48 mx-auto bg-white rounded-xl p-4 mb-4 flex items-center justify-center">
                <div className="w-full h-full border-4 border-[#0db9f2] rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#0db9f2]" style={{ fontSize: '64px' }}>qr_code_2</span>
                </div>
              </div>
              
              <p className="text-white/60 text-sm mb-4">
                Scan this code to view emergency medical information
              </p>
              
              <div className="bg-[#0a0a0a] rounded-xl p-3 mb-4">
                <p className="text-xs text-gray-500 mb-1">Contains:</p>
                <p className="text-white text-sm">{medicalData.name} • {medicalData.bloodGroup} • {medicalData.allergies.length} allergies</p>
              </div>

              <button
                onClick={() => setShowQRModal(false)}
                className="w-full py-3 rounded-full bg-[#0db9f2] text-black font-bold hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MedicalID;
