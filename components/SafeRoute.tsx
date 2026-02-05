import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SafePlace {
  id: string;
  name: string;
  type: 'police' | 'hospital' | 'shelter' | 'public';
  distance: string;
  address: string;
  isOpen: boolean;
  rating?: number;
}

const SafeRoute: React.FC = () => {
  const [isLocating, setIsLocating] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<SafePlace | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [safePlaces] = useState<SafePlace[]>([
    {
      id: '1',
      name: 'Central Police Station',
      type: 'police',
      distance: '0.5 km',
      address: 'Sector 17, Main Road',
      isOpen: true,
    },
    {
      id: '2',
      name: 'City Hospital Emergency',
      type: 'hospital',
      distance: '0.8 km',
      address: 'Medical Complex, Block C',
      isOpen: true,
    },
    {
      id: '3',
      name: "Women's Safety Hub",
      type: 'shelter',
      distance: '1.2 km',
      address: 'Community Center, Phase 2',
      isOpen: true,
    },
    {
      id: '4',
      name: 'Metro Station',
      type: 'public',
      distance: '0.3 km',
      address: 'Junction Point',
      isOpen: true,
    },
    {
      id: '5',
      name: '24/7 Pharmacy',
      type: 'public',
      distance: '0.4 km',
      address: 'Market Area, Shop 12',
      isOpen: true,
    },
  ]);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLocating(false);
        },
        (error) => {
          console.error('Location error:', error);
          setLocationError('Unable to get your location. Please enable location services.');
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
      setIsLocating(false);
    }
  }, []);

  const getPlaceIcon = (type: SafePlace['type']) => {
    switch (type) {
      case 'police':
        return { icon: 'local_police', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' };
      case 'hospital':
        return { icon: 'local_hospital', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' };
      case 'shelter':
        return { icon: 'home', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' };
      case 'public':
      default:
        return { icon: 'storefront', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
    }
  };

  const navigateToPlace = (place: SafePlace) => {
    if (userLocation) {
      // Open Google Maps with directions
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${encodeURIComponent(place.address)}&travelmode=walking`;
      window.open(url, '_blank');
    } else {
      // Open just the location in Maps
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`;
      window.open(url, '_blank');
    }
  };

  const shareLocation = async () => {
    if (userLocation && navigator.share) {
      try {
        await navigator.share({
          title: 'My Current Location',
          text: 'I am sharing my current location with you for safety.',
          url: `https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}`,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full max-w-md mx-auto bg-[#050505] flex flex-col overflow-hidden pb-24">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(circle_at_50%_-10%,_rgba(34,197,94,0.15),_transparent_70%)] pointer-events-none z-0"></div>

      {/* Header */}
      <header className="relative z-10 px-6 pt-8 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <span className="material-symbols-outlined text-emerald-400">security</span>
            </div>
            <div>
              <h1 className="text-xl font-orbitron font-bold tracking-wider text-white">SAFE ROUTE</h1>
              <p className="text-gray-500 text-xs">Find nearest safe havens</p>
            </div>
          </div>
          {userLocation && (
            <button
              onClick={shareLocation}
              className="w-10 h-10 rounded-xl bg-cyber-cyan/10 flex items-center justify-center border border-cyber-cyan/20 hover:bg-cyber-cyan/20 transition-colors"
            >
              <span className="material-symbols-outlined text-cyber-cyan">share_location</span>
            </button>
          )}
        </div>
      </header>

      {/* Location Status */}
      <div className="px-6 mb-4">
        <div className="p-4 rounded-xl bg-[#111] border border-gray-800">
          <div className="flex items-center gap-3">
            {isLocating ? (
              <>
                <div className="w-8 h-8 rounded-full bg-cyber-cyan/10 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
                </div>
                <div>
                  <p className="text-white text-sm font-bold">Locating you...</p>
                  <p className="text-gray-500 text-xs">Getting your current position</p>
                </div>
              </>
            ) : locationError ? (
              <>
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-500 text-sm">error</span>
                </div>
                <div>
                  <p className="text-red-400 text-sm font-bold">Location Error</p>
                  <p className="text-gray-500 text-xs">{locationError}</p>
                </div>
              </>
            ) : (
              <>
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-emerald-400 text-sm">my_location</span>
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                </div>
                <div>
                  <p className="text-emerald-400 text-sm font-bold">Location Active</p>
                  <p className="text-gray-500 text-xs">
                    {userLocation?.lat.toFixed(4)}, {userLocation?.lng.toFixed(4)}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Map Preview */}
      <div className="px-6 mb-4">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-800">
          {userLocation ? (
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${userLocation.lat},${userLocation.lng}&zoom=15`}
            />
          ) : (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
              <span className="text-gray-600">Map loading...</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Safe Places List */}
      <main className="flex-1 px-6 overflow-y-auto no-scrollbar">
        <h3 className="text-white font-orbitron text-sm tracking-wider mb-3">NEAREST SAFE PLACES</h3>
        
        <div className="space-y-3">
          <AnimatePresence>
            {safePlaces.map((place, index) => {
              const { icon, color, bg, border } = getPlaceIcon(place.type);
              
              return (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative rounded-2xl p-4 border ${border} ${bg} cursor-pointer hover:ring-1 hover:ring-white/10 transition-all`}
                  onClick={() => setSelectedPlace(selectedPlace?.id === place.id ? null : place)}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center border ${border}`}>
                      <span className={`material-symbols-outlined ${color}`}>{icon}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white text-sm font-bold truncate">{place.name}</h4>
                        {place.isOpen && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[8px] font-bold">
                            OPEN
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs truncate">{place.address}</p>
                    </div>

                    {/* Distance */}
                    <div className="text-right">
                      <p className={`${color} font-bold text-sm`}>{place.distance}</p>
                      <p className="text-gray-600 text-[10px]">away</p>
                    </div>
                  </div>

                  {/* Expanded Actions */}
                  <AnimatePresence>
                    {selectedPlace?.id === place.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 mt-4 border-t border-gray-800 flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateToPlace(place);
                            }}
                            className="flex-1 py-3 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors flex items-center justify-center gap-2"
                          >
                            <span className="material-symbols-outlined text-sm">directions_walk</span>
                            NAVIGATE
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (place.type === 'police') {
                                window.location.href = 'tel:100';
                              } else if (place.type === 'hospital') {
                                window.location.href = 'tel:108';
                              }
                            }}
                            className="px-4 py-3 rounded-xl bg-gray-800 text-gray-400 text-xs font-bold border border-gray-700 hover:border-gray-600 transition-colors flex items-center justify-center gap-2"
                          >
                            <span className="material-symbols-outlined text-sm">call</span>
                            CALL
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </main>

      {/* Emergency Call Button */}
      <div className="fixed bottom-28 left-0 right-0 max-w-md mx-auto px-6 z-20">
        <button
          onClick={() => window.location.href = 'tel:112'}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 text-white font-orbitron font-bold text-sm tracking-wider shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">emergency</span>
          EMERGENCY CALL (112)
        </button>
      </div>
    </div>
  );
};

export default SafeRoute;
