import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SafeHaven {
  id: string;
  name: string;
  type: 'hospital' | 'police' | 'light' | 'metro' | 'shelter';
  position: { top: string; left: string };
}

interface RouteInfo {
  name: string;
  safetyScore: number;
  duration: string;
  distance: string;
  guardiansActive: number;
  totalGuardians: number;
}

interface CommunityMapProps {
  onBack?: () => void;
}

const CommunityMap: React.FC<CommunityMapProps> = ({ onBack }) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [selectedRoute] = useState<RouteInfo>({
    name: 'Via 5th Ave & Park St',
    safetyScore: 98,
    duration: '12 min',
    distance: '0.8 mi',
    guardiansActive: 5,
    totalGuardians: 5,
  });

  const safeHavens: SafeHaven[] = [
    { id: '1', name: 'City Hospital', type: 'hospital', position: { top: '38%', left: '55%' } },
    { id: '2', name: 'Well-lit Area', type: 'light', position: { top: '25%', left: '30%' } },
    { id: '3', name: 'Police Station', type: 'police', position: { top: '45%', left: '70%' } },
    { id: '4', name: 'Metro Station', type: 'metro', position: { top: '60%', left: '40%' } },
  ];

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLocating(false);
        },
        () => {
          setIsLocating(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setIsLocating(false);
    }
  }, []);

  const handleCenterLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLocating(false);
          if (navigator.vibrate) navigator.vibrate(50);
        },
        () => setIsLocating(false)
      );
    }
  };

  const handleStartNavigation = () => {
    setIsNavigating(true);
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    
    // Open Google Maps with walking directions
    if (userLocation) {
      const destination = 'Home';
      window.open(
        `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${encodeURIComponent(destination)}&travelmode=walking`,
        '_blank'
      );
    }
    
    setTimeout(() => setIsNavigating(false), 2000);
  };

  const getHavenIcon = (type: SafeHaven['type']) => {
    switch (type) {
      case 'hospital': return { icon: 'local_hospital', color: '#00f0ff', shadow: 'rgba(0,240,255,0.5)' };
      case 'police': return { icon: 'local_police', color: '#3b82f6', shadow: 'rgba(59,130,246,0.5)' };
      case 'light': return { icon: 'lightbulb', color: '#fbbf24', shadow: 'rgba(251,191,36,0.5)' };
      case 'metro': return { icon: 'subway', color: '#22c55e', shadow: 'rgba(34,197,94,0.5)' };
      case 'shelter': return { icon: 'home', color: '#a855f7', shadow: 'rgba(168,85,247,0.5)' };
      default: return { icon: 'place', color: '#00f0ff', shadow: 'rgba(0,240,255,0.5)' };
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#0f1115] overflow-hidden">
      {/* Map Background Layer */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        {/* Map Grid Texture */}
        <div 
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            backgroundSize: '40px 40px',
            backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          }}
        />
        
        {/* Dark Map Base Image */}
        <div 
          className="w-full h-full bg-cover bg-center opacity-40 mix-blend-luminosity grayscale"
          style={{
            backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDIcwA4MNfbpFT_r7r6bFeBzfr99f2Q5dsuyfL6mZ4OFOMblJe-VK8MIIeh3ZJ6Jz1Ixn6Xfqc_uWI-axpWv-IuIzMlPuQwTQe1f66VoVID8jRsqb7yVE8MP4V6_u8O_DO2jMXppaFa7u2idajX6N7smuzxFQCjBtsM0cEovgpSqlkUWtKbkG_QwCKVX1i2sNtEMquCtw0mP_ttRIT-PTP2jlY2weRJ2a-W54g5lCzl1pElmlCfnBtd8pMoP0MMoKPIRE6xTZq34x8F")',
          }}
        />

        {/* Danger Zones (Heatmap Blobs) */}
        <motion.div 
          className="absolute top-[30%] left-[20%] w-32 h-32 bg-[#ff2a2a]/30 rounded-full blur-3xl z-10"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div className="absolute bottom-[40%] right-[10%] w-48 h-48 bg-[#ff2a2a]/20 rounded-full blur-3xl z-10" />
        <div className="absolute top-[50%] left-[60%] w-24 h-24 bg-[#ff2a2a]/25 rounded-full blur-2xl z-10" />

        {/* Route Lines SVG */}
        <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none" style={{ filter: 'drop-shadow(0 0 8px rgba(0,240,255,0.8))' }}>
          {/* Safe Route Path */}
          <motion.path 
            d="M 180 700 C 200 600, 150 500, 220 400 S 300 300, 180 200 L 150 150" 
            fill="none" 
            stroke="#00f0ff" 
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="10 0"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          
          {/* Alternative Route (Faint) */}
          <path 
            d="M 180 700 C 100 600, 50 500, 100 300 S 150 200, 150 150" 
            fill="none" 
            stroke="#4b5563" 
            strokeWidth="2"
            strokeDasharray="4 4"
            className="opacity-40"
          />
          
          {/* Pulse Effect on User Location */}
          <circle cx="180" cy="700" r="12" fill="#00f0ff" fillOpacity="0.2">
            <animate attributeName="r" from="12" to="30" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="180" cy="700" r="6" fill="#00f0ff" stroke="white" strokeWidth="2" />
        </svg>

        {/* POI Markers */}
        {safeHavens.map((haven) => {
          const { icon, color, shadow } = getHavenIcon(haven.type);
          return (
            <motion.div
              key={haven.id}
              className="absolute flex flex-col items-center gap-1 z-30 transform -translate-x-1/2 cursor-pointer"
              style={{ top: haven.position.top, left: haven.position.left }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <div 
                className="flex items-center justify-center w-8 h-8 rounded-full backdrop-blur-sm"
                style={{ 
                  backgroundColor: `${color}20`,
                  border: `1px solid ${color}`,
                  boxShadow: `0 0 10px ${shadow}`,
                }}
              >
                <span className="material-symbols-outlined text-[16px]" style={{ color }}>{icon}</span>
              </div>
            </motion.div>
          );
        })}

        {/* Destination Pin */}
        <div className="absolute top-[140px] left-[150px] transform -translate-x-1/2 -translate-y-full z-30">
          <div className="relative flex flex-col items-center">
            <div className="px-3 py-1 mb-1 rounded-full bg-[#1a1a1a] border border-white/10 backdrop-blur-md shadow-lg">
              <span className="text-xs font-bold text-white whitespace-nowrap">Home</span>
            </div>
            <span 
              className="material-symbols-outlined text-primary text-4xl drop-shadow-lg"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              location_on
            </span>
          </div>
        </div>
      </div>

      {/* Header: Glassmorphic */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 pb-2 max-w-md mx-auto">
        <div className="flex items-center justify-between p-3 rounded-full bg-[#1a1a1a]/60 backdrop-blur-md border border-white/5 shadow-lg">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-white">arrow_back</span>
            </button>
            <h1 className="text-lg font-bold tracking-tight text-white uppercase drop-shadow-md font-orbitron">SAFE ROUTE AI</h1>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30">
            <span className="material-symbols-outlined text-primary text-[18px] animate-pulse">security</span>
            <span className="text-primary text-xs font-bold tracking-wide uppercase">Shield Active</span>
          </div>
        </div>
      </header>

      {/* Map Controls (Floating Right) */}
      <div className="absolute right-4 top-28 flex flex-col gap-3 z-40 max-w-md mx-auto">
        <motion.button 
          onClick={() => setShowLayers(!showLayers)}
          className={`w-12 h-12 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg transition-colors ${
            showLayers ? 'bg-cyber-cyan/20 border-cyber-cyan/30' : 'bg-[#1a1a1a]/80'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <span className={`material-symbols-outlined ${showLayers ? 'text-cyber-cyan' : 'text-white/80'}`}>layers</span>
        </motion.button>
        <motion.button 
          onClick={handleCenterLocation}
          className="w-12 h-12 rounded-full bg-[#1a1a1a]/80 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg"
          whileTap={{ scale: 0.95 }}
        >
          {isLocating ? (
            <div className="w-5 h-5 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className="material-symbols-outlined text-white/80">my_location</span>
          )}
        </motion.button>
      </div>

      {/* Layer Options Panel */}
      <AnimatePresence>
        {showLayers && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-20 top-28 z-40 p-3 rounded-xl bg-[#1a1a1a]/90 backdrop-blur-md border border-white/10 shadow-lg"
          >
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-bold">Layers</p>
            <div className="space-y-2">
              {['Danger Zones', 'Safe Havens', 'Guardians', 'Routes'].map((layer) => (
                <label key={layer} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-gray-800 border-gray-600 text-cyber-cyan focus:ring-cyber-cyan" />
                  <span className="text-white text-sm">{layer}</span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Content Wrapper */}
      <div className="absolute bottom-0 left-0 w-full z-50 flex flex-col justify-end pointer-events-none pb-24 max-w-md mx-auto">
        {/* Gradient overlay for readability at bottom */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none" />
        
        <div className="w-full px-4 pb-4 pointer-events-auto relative z-10">
          {/* Route Info Card */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full rounded-2xl bg-[#1a1a1a]/70 backdrop-blur-xl border border-white/10 shadow-lg overflow-hidden mb-4"
          >
            {/* Subtle Pattern Background */}
            <div 
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='24' height='40' viewBox='0 0 24 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40c5.523 0 10-4.477 10-10V10c0-5.523 4.477-10 10-10s10 4.477 10 10v20c0 5.523-4.477 10-10 10S0 35.523 0 30V10C0 4.477 4.477 0 10 0s10 4.477 10 10v20c0 5.523-4.477 10-10 10S0 35.523 0 30v-10z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
                backgroundSize: '20px 20px',
              }}
            />

            {/* Card Content */}
            <div className="p-5 relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-cyber-cyan text-sm font-bold tracking-widest uppercase">Safe Route Selected</span>
                    <span className="w-2 h-2 rounded-full bg-cyber-cyan shadow-[0_0_8px_#00f0ff]" />
                  </div>
                  <h3 className="text-xl font-bold text-white font-display">{selectedRoute.name}</h3>
                </div>
                <div className="flex flex-col items-end">
                  <span 
                    className="text-3xl font-bold text-cyber-cyan leading-none"
                    style={{ textShadow: '0 0 5px rgba(0,240,255,0.6)' }}
                  >
                    {selectedRoute.safetyScore}%
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mt-1">Safety Score</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3 border border-white/5">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{selectedRoute.duration}</p>
                    <p className="text-gray-400 text-xs">{selectedRoute.distance}</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3 border border-white/5">
                  <div 
                    className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary"
                    style={{ boxShadow: '0 0 8px rgba(244,37,37,0.3)' }}
                  >
                    <span className="material-symbols-outlined text-[18px]">group_add</span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{selectedRoute.guardiansActive}/{selectedRoute.totalGuardians} Active</p>
                    <p className="text-gray-400 text-xs">Guardians</p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <motion.button 
                onClick={handleStartNavigation}
                disabled={isNavigating}
                className="w-full relative overflow-hidden rounded-full h-14 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-600 transition-opacity" />
                <div className="relative z-10 flex items-center gap-2">
                  {isNavigating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-white font-bold text-lg tracking-wide uppercase font-display">Starting...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-white font-bold text-lg tracking-wide uppercase font-display">Start Navigation</span>
                      <span className="material-symbols-outlined text-white animate-pulse">navigation</span>
                    </>
                  )}
                </div>
                {/* Button Glow Effect */}
                <div className="absolute inset-0 rounded-full blur-md bg-primary/40 -z-10" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CommunityMap;