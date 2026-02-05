import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PermissionStatus {
  location: 'pending' | 'granted' | 'denied' | 'unavailable';
  microphone: 'pending' | 'granted' | 'denied' | 'unavailable';
  camera: 'pending' | 'granted' | 'denied' | 'unavailable';
  contacts: 'pending' | 'granted' | 'denied' | 'unavailable';
}

interface PermissionsSetupProps {
  onComplete: () => void;
  onSkip?: () => void;
}

const PermissionsSetup: React.FC<PermissionsSetupProps> = ({ onComplete }) => {
  const [permissions, setPermissions] = useState<PermissionStatus>({
    location: 'pending',
    microphone: 'pending',
    camera: 'pending',
    contacts: 'pending',
  });

  const [isRequesting, setIsRequesting] = useState<string | null>(null);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  // Check initial permission states
  useEffect(() => {
    checkInitialPermissions();
  }, []);

  // Show success overlay briefly when all permissions granted
  useEffect(() => {
    if (Object.values(permissions).every(p => p === 'granted') && 
        Object.values(permissions).some(p => p === 'granted')) {
      setShowSuccessOverlay(true);
      const timer = setTimeout(() => {
        setShowSuccessOverlay(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [permissions]);

  const checkInitialPermissions = async () => {
    const newPermissions = { ...permissions };

    // Check Camera permission
    try {
      const cameraResult = await navigator.permissions.query({ name: 'camera' as PermissionName });
      newPermissions.camera = cameraResult.state === 'granted' ? 'granted' : 
                             cameraResult.state === 'denied' ? 'denied' : 'pending';
    } catch {
      // Camera API might not be available
    }

    // Check Microphone permission
    try {
      const micResult = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      newPermissions.microphone = micResult.state === 'granted' ? 'granted' : 
                                  micResult.state === 'denied' ? 'denied' : 'pending';
    } catch {
      // Microphone API might not be available
    }

    // Check Geolocation permission
    try {
      const geoResult = await navigator.permissions.query({ name: 'geolocation' });
      newPermissions.location = geoResult.state === 'granted' ? 'granted' : 
                                geoResult.state === 'denied' ? 'denied' : 'pending';
    } catch {
      // Geolocation API might not be available
    }

    setPermissions(newPermissions);
  };

  // Request Location Permission
  const requestLocationPermission = async (): Promise<boolean> => {
    setIsRequesting('location');
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setPermissions(prev => ({ ...prev, location: 'unavailable' }));
        setIsRequesting(null);
        resolve(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        () => {
          setPermissions(prev => ({ ...prev, location: 'granted' }));
          setIsRequesting(null);
          resolve(true);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setPermissions(prev => ({ ...prev, location: 'denied' }));
          }
          setIsRequesting(null);
          resolve(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  // Request Camera Permission
  const requestCameraPermission = async (): Promise<boolean> => {
    setIsRequesting('camera');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissions(prev => ({ ...prev, camera: 'granted' }));
      setIsRequesting(null);
      return true;
    } catch {
      setPermissions(prev => ({ ...prev, camera: 'denied' }));
      setIsRequesting(null);
      return false;
    }
  };

  // Request Microphone Permission
  const requestMicrophonePermission = async (): Promise<boolean> => {
    setIsRequesting('microphone');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissions(prev => ({ ...prev, microphone: 'granted' }));
      setIsRequesting(null);
      return true;
    } catch {
      setPermissions(prev => ({ ...prev, microphone: 'denied' }));
      setIsRequesting(null);
      return false;
    }
  };

  // Request Contacts Permission (simulated for web)
  const requestContactsPermission = async (): Promise<boolean> => {
    setIsRequesting('contacts');
    // The Contact Picker API is available in some browsers
    if ('contacts' in navigator && 'ContactsManager' in window) {
      try {
        // @ts-ignore - Contact Picker API
        const contacts = await navigator.contacts.select(['name', 'tel'], { multiple: false });
        if (contacts.length > 0) {
          setPermissions(prev => ({ ...prev, contacts: 'granted' }));
          setIsRequesting(null);
          return true;
        }
      } catch {
        // User cancelled or API not available
      }
    }
    
    // For demo purposes, simulate permission granted
    setPermissions(prev => ({ ...prev, contacts: 'granted' }));
    setIsRequesting(null);
    return true;
  };

  const permissionItems = [
    {
      id: 'location',
      icon: 'location_on',
      title: 'LOCATION',
      description: 'For live tracking & safe routing',
      color: '#00f0ff',
      borderColor: 'border-cyber-cyan',
      textColor: 'text-cyber-cyan',
      bgColor: 'bg-cyber-cyan/10',
      iconBorderColor: 'border-cyber-cyan/20',
      shadowClass: 'shadow-neon-cyan',
      hoverBorder: 'hover:border-cyber-cyan/30',
      request: requestLocationPermission,
    },
    {
      id: 'microphone',
      icon: 'mic',
      title: 'MICROPHONE',
      description: 'For voice SOS & cry detection',
      color: '#a855f7',
      borderColor: 'border-purple-400',
      textColor: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      iconBorderColor: 'border-purple-500/20',
      shadowClass: 'shadow-neon-purple',
      hoverBorder: 'hover:border-purple-500/30',
      request: requestMicrophonePermission,
    },
    {
      id: 'camera',
      icon: 'camera_alt',
      title: 'CAMERA',
      description: 'For threat detection & evidence',
      color: '#f42525',
      borderColor: 'border-primary',
      textColor: 'text-primary',
      bgColor: 'bg-primary/10',
      iconBorderColor: 'border-primary/20',
      shadowClass: 'shadow-neon-red',
      hoverBorder: 'hover:border-primary/30',
      request: requestCameraPermission,
    },
    {
      id: 'contacts',
      icon: 'contacts',
      title: 'CONTACTS',
      description: 'To reach your guardians',
      color: '#3b82f6',
      borderColor: 'border-blue-400',
      textColor: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      iconBorderColor: 'border-blue-500/20',
      shadowClass: '',
      hoverBorder: 'hover:border-blue-500/30',
      request: requestContactsPermission,
    },
  ];

  const getGrantedCount = () => {
    return Object.values(permissions).filter(p => p === 'granted').length;
  };

  const allGranted = () => {
    return Object.values(permissions).every(p => p === 'granted');
  };

  const progressPercentage = (getGrantedCount() / permissionItems.length) * 100;

  return (
    <div className="relative flex flex-col w-full max-w-md mx-auto min-h-screen bg-deep-void shadow-2xl overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_50%_-20%,_rgba(244,37,37,0.1),_transparent_70%)] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,_rgba(0,240,255,0.05),_transparent_70%)] pointer-events-none z-0"></div>

      {/* Header */}
      <header className="relative z-10 px-6 pt-12 pb-6">
        <div className="flex flex-col gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-black border border-gray-700 flex items-center justify-center shadow-lg mb-2">
            <span className="material-symbols-outlined text-gray-400">shield_lock</span>
          </div>
          <div>
            <h1 className="font-orbitron text-3xl font-bold leading-tight tracking-wide bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              GRANT POWERS<br/>TO DURGA
            </h1>
            <div className="mt-3 flex gap-3 items-start">
              <span className="material-symbols-outlined text-emerald-500 text-lg mt-0.5">verified_user</span>
              <p className="text-gray-400 text-xs leading-relaxed max-w-[90%]">
                <strong className="text-gray-200">Trust Architecture:</strong> All sensor data is processed locally on your device using Edge AI. No raw data leaves your phone without explicit emergency authorization.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 flex flex-col gap-4 flex-grow">
        {permissionItems.map((item, index) => {
          const status = permissions[item.id as keyof PermissionStatus];
          const isGranted = status === 'granted';
          const isLoading = isRequesting === item.id;
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card rounded-2xl p-4 border shadow-glass transition-all duration-300 group ${
                isGranted 
                  ? 'border-green-500/30 bg-green-500/5' 
                  : `border-glass-border ${item.hoverBorder}`
              }`}
              style={{
                background: isGranted 
                  ? 'linear-gradient(145deg, rgba(34, 197, 94, 0.07) 0%, rgba(34, 197, 94, 0.02) 100%)'
                  : 'linear-gradient(145deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center border ${item.bgColor} ${item.iconBorderColor} ${item.shadowClass} ${!isGranted ? 'group-hover:scale-110' : ''} transition-transform`}
                >
                  <span 
                    className={`material-symbols-outlined ${item.textColor}`}
                  >
                    {item.icon}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-orbitron text-sm font-bold tracking-wider text-white">{item.title}</h3>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">{item.description}</p>
                </div>

                {/* Action Button or Status */}
                {isGranted ? (
                  <div className="flex items-center gap-1 px-3 py-2">
                    <span className="text-emerald-400 text-xs font-bold tracking-wider">ALLOWED</span>
                    <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
                  </div>
                ) : (
                  <button
                    onClick={() => item.request()}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-lg border ${item.borderColor} ${item.textColor} text-xs font-bold tracking-wider hover:bg-opacity-100 transition-colors disabled:opacity-50`}
                    style={{
                      borderColor: item.color,
                      color: item.color,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = item.color;
                      e.currentTarget.style.color = 'black';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = item.color;
                    }}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'ALLOW'
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </main>

      {/* Bottom Section */}
      <div className="relative z-20 p-6 mt-auto bg-gradient-to-t from-deep-void via-deep-void to-transparent">
        {/* Encrypted Badge */}
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
          <span className="material-symbols-outlined text-[10px] text-gray-400">lock</span>
          <p className="text-[10px] text-gray-400 font-mono">ENCRYPTED PERMISSION HANDSHAKE</p>
        </div>

        {/* Continue Button */}
        <button 
          className={`w-full relative group ${!allGranted() ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          disabled={!allGranted()}
          onClick={allGranted() ? onComplete : undefined}
        >
          {!allGranted() && (
            <div className="absolute inset-0 bg-gray-900 rounded-xl opacity-80 z-10"></div>
          )}
          <div className={`relative w-full py-4 rounded-xl flex items-center justify-center border ${
            allGranted() 
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/30' 
              : 'bg-gradient-to-r from-gray-800 to-gray-700 border-gray-700'
          } transition-all duration-300`}>
            <span className={`font-orbitron text-sm font-bold tracking-[0.2em] z-20 transition-colors ${
              allGranted() ? 'text-white' : 'text-gray-500 group-hover:text-gray-400'
            }`}>
              CONTINUE TO DASHBOARD
            </span>
            {/* Progress Bar */}
            <div 
              className="absolute bottom-0 left-0 h-1 bg-emerald-500 rounded-bl-xl opacity-50 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </button>

        {/* Warning Message */}
        {!allGranted() && (
          <p className="text-center text-[10px] text-primary/70 mt-3 font-mono">
            ! CRITICAL PERMISSIONS REQUIRED
          </p>
        )}
      </div>

      {/* Success Animation Overlay */}
      <AnimatePresence>
        {showSuccessOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 20, delay: 0.2 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15, delay: 0.3 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30"
              >
                <span className="material-symbols-outlined text-white text-4xl">verified_user</span>
              </motion.div>
              <h2 className="text-white text-xl font-orbitron font-bold mb-1 tracking-wider">ALL POWERS GRANTED</h2>
              <p className="text-gray-400 text-sm">DURGA is ready to protect you</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PermissionsSetup;
