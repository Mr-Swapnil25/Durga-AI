import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  type: 'system' | 'guardian' | 'ai' | 'user';
  sender?: string;
  avatar?: string;
  content: string;
  timestamp: string;
  alertLevel?: 'critical' | 'warning' | 'info';
}

interface Guardian {
  id: string;
  name: string;
  avatar: string;
  color: string;
  location?: { lat: number; lng: number };
}

interface EmergencyOpsProps {
  onMarkSafe: () => void;
}

const EmergencyOps: React.FC<EmergencyOpsProps> = ({ onMarkSafe }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [batteryLevel, setBatteryLevel] = useState(14);
  const [isRecording, setIsRecording] = useState(false);
  const [showSafeConfirm, setShowSafeConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const guardians: Guardian[] = [
    {
      id: '1',
      name: 'Dad',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      color: 'blue',
      location: { lat: 28.6139, lng: 77.2090 },
    },
    {
      id: '2',
      name: 'Mom',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces',
      color: 'purple',
    },
  ];

  // Initialize with system messages
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: '1',
        type: 'system',
        content: 'CRITICAL: SOS TRIGGERED VIA VOICE COMMAND.\nAudio Clip Recorded & Uploaded.',
        timestamp: formatTime(new Date()),
        alertLevel: 'critical',
      },
      {
        id: '2',
        type: 'system',
        content: 'Real-time location shared with 3 Guardians & DURGA Ops.',
        timestamp: formatTime(new Date()),
        alertLevel: 'info',
      },
      {
        id: '3',
        type: 'guardian',
        sender: 'Dad',
        avatar: guardians[0].avatar,
        content: 'I see your location. Calling the police now! Stay on the line.',
        timestamp: formatTime(new Date()),
      },
      {
        id: '4',
        type: 'ai',
        content: 'Closest Safe Zone is Sector 5 Police Station (0.4 miles).',
        timestamp: formatTime(new Date()),
      },
      {
        id: '5',
        type: 'guardian',
        sender: 'Mom',
        avatar: guardians[1].avatar,
        content: 'Are you safe to talk? We are driving towards you.',
        timestamp: formatTime(new Date()),
      },
    ];
    
    // Add messages with delay for animation effect
    initialMessages.forEach((msg, index) => {
      setTimeout(() => {
        setMessages(prev => [...prev, msg]);
      }, index * 500);
    });

    // Simulate battery drain
    const batteryInterval = setInterval(() => {
      setBatteryLevel(prev => Math.max(1, prev - 1));
    }, 30000);

    return () => clearInterval(batteryInterval);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: formatTime(new Date()),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Vibrate on send
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    // Simulate guardian response
    setTimeout(() => {
      const responses = [
        "Stay calm, we're on our way!",
        "Keep sharing your location. Help is coming.",
        "We can see you're moving. Stay in well-lit areas.",
        "Police have been notified. ETA 5 minutes.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'guardian',
        sender: 'Dad',
        avatar: guardians[0].avatar,
        content: randomResponse,
        timestamp: formatTime(new Date()),
      }]);
    }, 2000);
  };

  const handleCallMe = () => {
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
    // In a real app, this would trigger a call request to guardians
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'system',
      content: 'CALL REQUEST sent to all Guardians. Awaiting response...',
      timestamp: formatTime(new Date()),
      alertLevel: 'warning',
    }]);

    // Simulate response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'guardian',
        sender: 'Dad',
        avatar: guardians[0].avatar,
        content: '📞 Calling you now...',
        timestamp: formatTime(new Date()),
      }]);
    }, 1500);
  };

  const handleCamera = () => {
    fileInputRef.current?.click();
  };

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'system',
        content: 'EVIDENCE: Photo captured and uploaded to secure servers.',
        timestamp: formatTime(new Date()),
        alertLevel: 'info',
      }]);
    }
  };

  const handleNavigateToSafeZone = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    // Open Google Maps with directions
    window.open('https://www.google.com/maps/dir/?api=1&destination=police+station+near+me', '_blank');
  };

  const handleMarkSafe = () => {
    setShowSafeConfirm(true);
  };

  const confirmSafe = () => {
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'system',
      content: 'USER MARKED SAFE. Emergency mode deactivated. All guardians notified.',
      timestamp: formatTime(new Date()),
      alertLevel: 'info',
    }]);

    setTimeout(() => {
      onMarkSafe();
    }, 1500);
  };

  return (
    <div className="relative flex flex-col h-screen w-full max-w-md mx-auto bg-[#0b1212] overflow-hidden">
      {/* 1. LIVE MAP HEADER (Top 35%) */}
      <div className="relative w-full h-[35vh] flex-none z-10 border-b border-[#0df2f2]/20 shadow-2xl shadow-black">
        {/* Map Background */}
        <div className="absolute inset-0 bg-gray-900 w-full h-full overflow-hidden">
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(rgba(11,18,18,0.2) 2px, transparent 2px), linear-gradient(90deg, rgba(11,18,18,0.2) 2px, transparent 2px)',
              backgroundSize: '40px 40px',
            }}
          />
          
          {/* Victim Pin (Centered) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-[#0df2f2]/10 absolute animate-ping" />
            <div className="w-12 h-12 rounded-full bg-[#0df2f2]/20 absolute animate-pulse" />
            <div className="w-4 h-4 rounded-full bg-[#0df2f2] shadow-[0_0_15px_rgba(13,242,242,0.8)] border-2 border-white z-10" />
            <div className="mt-8 bg-black/80 text-[#0df2f2] text-[10px] px-2 py-0.5 rounded font-mono tracking-widest border border-[#0df2f2]/30 backdrop-blur-sm">
              YOU
            </div>
          </div>

          {/* Guardian Pin */}
          <motion.div 
            className="absolute top-1/3 left-1/3 flex flex-col items-center"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="material-symbols-outlined text-blue-400 text-2xl drop-shadow-lg">security</span>
            <span className="text-[9px] text-blue-200 font-mono bg-black/50 px-1 rounded">DAD</span>
          </motion.div>

          {/* Another Guardian Pin */}
          <motion.div 
            className="absolute top-2/3 right-1/4 flex flex-col items-center"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            <span className="material-symbols-outlined text-purple-400 text-2xl drop-shadow-lg">security</span>
            <span className="text-[9px] text-purple-200 font-mono bg-black/50 px-1 rounded">MOM</span>
          </motion.div>
        </div>

        {/* Top Overlay */}
        <div className="absolute inset-x-0 top-0 p-4 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
          {/* Live Tracking Badge */}
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded border border-[#0df2f2]/30">
            <div className="w-2 h-2 rounded-full bg-[#0df2f2] animate-pulse" />
            <span className="text-[#0df2f2] text-xs font-bold tracking-widest">LIVE TRACKING</span>
          </div>

          {/* Battery Warning */}
          <motion.div 
            className="flex items-center gap-2 bg-[#5c130e]/80 backdrop-blur-md px-3 py-1.5 rounded border border-[#ff3b30]"
            animate={{ boxShadow: ['0 0 0 0 rgba(255,59,48,0.4)', '0 0 0 10px rgba(255,59,48,0)', '0 0 0 0 rgba(255,59,48,0)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="material-symbols-outlined text-[#ff3b30] text-sm">battery_alert</span>
            <span className="text-[#ff3b30] text-xs font-bold tracking-widest font-mono">{batteryLevel}% CRITICAL</span>
          </motion.div>
        </div>

        {/* Bottom Map Gradient */}
        <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-[#0b1212] to-transparent pointer-events-none" />
      </div>

      {/* 2. OPS CHAT STREAM */}
      <div className="flex-1 overflow-y-auto w-full relative bg-[#0b1212] flex flex-col p-4 gap-4 pb-48">
        {/* Date Divider */}
        <div className="flex justify-center my-2">
          <span className="text-[10px] text-gray-500 font-mono bg-[#162020] px-2 py-1 rounded">
            TODAY, {formatTime(new Date())}
          </span>
        </div>

        {/* Messages */}
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {message.type === 'system' && (
                <div className="flex justify-center">
                  <div 
                    className={`rounded p-3 max-w-[95%] w-full flex items-start gap-3 shadow-lg ${
                      message.alertLevel === 'critical' 
                        ? 'bg-[#5c130e]/30 border border-[#ff3b30]/50 shadow-[0_0_20px_rgba(255,59,48,0.1)]'
                        : message.alertLevel === 'warning'
                        ? 'bg-[#ffcc00]/10 border border-[#ffcc00]/30'
                        : 'bg-[#283939]/40 border-l-2 border-[#0df2f2] backdrop-blur-sm'
                    }`}
                  >
                    <span className={`material-symbols-outlined shrink-0 mt-0.5 ${
                      message.alertLevel === 'critical' ? 'text-[#ff3b30]' : 
                      message.alertLevel === 'warning' ? 'text-[#ffcc00]' : 'text-[#0df2f2] text-sm'
                    }`}>
                      {message.alertLevel === 'critical' ? 'warning' : 
                       message.alertLevel === 'warning' ? 'notifications_active' : 'share_location'}
                    </span>
                    <div className="flex flex-col">
                      <span className={`text-[10px] font-mono font-bold tracking-wider mb-0.5 ${
                        message.alertLevel === 'critical' ? 'text-[#ff3b30]' : 
                        message.alertLevel === 'warning' ? 'text-[#ffcc00]' : 'text-[#0df2f2]'
                      }`}>
                        {message.alertLevel === 'critical' ? 'SYSTEM ALERT' : 
                         message.alertLevel === 'warning' ? 'NOTIFICATION' : 'AUTO-ACTION'} - {message.timestamp}
                      </span>
                      <p className="text-white text-sm font-mono leading-snug whitespace-pre-line">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {message.type === 'guardian' && (
                <div className="flex gap-3 max-w-[85%] self-start">
                  <div className={`w-8 h-8 rounded-full bg-${message.sender === 'Dad' ? 'blue' : 'purple'}-900 border border-${message.sender === 'Dad' ? 'blue' : 'purple'}-500/30 flex items-center justify-center shrink-0 overflow-hidden`}>
                    <img 
                      src={message.avatar} 
                      alt={message.sender}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={`text-xs ${message.sender === 'Dad' ? 'text-blue-300' : 'text-purple-300'} ml-1`}>
                      {message.sender} • {message.timestamp}
                    </span>
                    <div 
                      className="p-3 rounded-2xl rounded-tl-none text-white text-[15px] leading-snug shadow-lg"
                      style={{
                        background: 'rgba(30, 41, 59, 0.6)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                      }}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              )}

              {message.type === 'ai' && (
                <div className="flex justify-center w-full">
                  <div className="bg-[#0df2f2]/5 border border-[#0df2f2]/20 rounded-lg p-3 max-w-[90%] w-full flex items-center gap-3 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#0df2f2]" />
                    <div className="w-8 h-8 rounded-full bg-[#0df2f2]/20 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#0df2f2] text-lg">smart_toy</span>
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="text-[#0df2f2] text-[10px] font-mono tracking-widest mb-0.5">AI INTELLIGENCE</span>
                      <p className="text-gray-200 text-sm">
                        <span className="text-[#0df2f2]">Suggestion:</span> {message.content}
                      </p>
                    </div>
                    <button 
                      onClick={handleNavigateToSafeZone}
                      className="bg-[#0df2f2]/20 hover:bg-[#0df2f2]/30 text-[#0df2f2] p-2 rounded ml-auto transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">navigation</span>
                    </button>
                  </div>
                </div>
              )}

              {message.type === 'user' && (
                <div className="flex justify-end">
                  <div className="max-w-[80%] bg-[#0df2f2] text-black p-3 rounded-2xl rounded-tr-none text-[15px] leading-snug shadow-lg">
                    {message.content}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* 3. FIXED BOTTOM: QUICK RESPONSE BAR + INPUT */}
      <div className="fixed bottom-0 w-full max-w-md z-50 bg-[#0b1212]/95 backdrop-blur-xl border-t border-white/10 flex flex-col">
        {/* Quick Action Buttons */}
        <div className="grid grid-cols-5 gap-3 p-4 pb-2">
          {/* I'm Safe (Large) */}
          <button 
            onClick={handleMarkSafe}
            className="col-span-2 group relative overflow-hidden bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 rounded-lg p-3 flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">check_circle</span>
            <span className="text-xs font-bold tracking-wider">I'M SAFE</span>
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Call Me */}
          <button 
            onClick={handleCallMe}
            className="col-span-2 group relative overflow-hidden bg-[#ffcc00]/10 hover:bg-[#ffcc00]/20 border border-[#ffcc00]/50 text-[#ffcc00] rounded-lg p-3 flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">call</span>
            <span className="text-xs font-bold tracking-wider">CALL ME</span>
          </button>

          {/* Camera */}
          <button 
            onClick={handleCamera}
            className="col-span-1 group relative overflow-hidden bg-[#162020] hover:bg-white/10 border border-white/20 text-white rounded-lg p-3 flex flex-col items-center justify-center transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-2xl">photo_camera</span>
          </button>
        </div>

        {/* Chat Input */}
        <div className="px-4 pb-6 pt-2 w-full">
          <div className="relative flex items-center w-full">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message to guardians..."
              className="w-full bg-[#162020] border border-white/10 text-white text-sm rounded-full pl-5 pr-12 py-3 focus:outline-none focus:border-[#0df2f2]/50 focus:ring-1 focus:ring-[#0df2f2]/50 transition-all placeholder-gray-500"
            />
            <button 
              onClick={handleSendMessage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-[#0df2f2] rounded-full text-black hover:bg-white transition-colors"
            >
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleImageCapture}
        />
      </div>

      {/* Background Pulse Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[#ff3b30] mix-blend-overlay opacity-[0.02] animate-pulse" />

      {/* I'm Safe Confirmation Modal */}
      <AnimatePresence>
        {showSafeConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowSafeConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center"
              style={{
                background: 'linear-gradient(180deg, rgba(16,185,100,0.2) 0%, rgba(5,5,5,0.95) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(16,185,100,0.3)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-5xl text-emerald-400">verified_user</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Mark Yourself Safe?</h3>
              <p className="text-white/60 text-sm mb-6">
                This will end the emergency session and notify all your guardians that you are safe.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSafeConfirm(false)}
                  className="flex-1 py-3 rounded-full bg-white/5 text-white/70 font-bold hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSafe}
                  className="flex-1 py-3 rounded-full bg-emerald-500 text-white font-bold hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">check</span>
                  I'm Safe
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmergencyOps;
