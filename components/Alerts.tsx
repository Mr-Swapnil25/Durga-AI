import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Alert {
  id: string;
  type: 'danger' | 'warning' | 'info' | 'guardian';
  title: string;
  message: string;
  time: string;
  read: boolean;
  location?: string;
}

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'danger',
      title: 'DANGER ZONE ALERT',
      message: 'You are approaching a high-risk area. Stay vigilant and consider alternative routes.',
      time: '2 min ago',
      read: false,
      location: 'Sector 5, Block B',
    },
    {
      id: '2',
      type: 'guardian',
      title: 'Guardian Check-in',
      message: 'Mom requested a check-in. Tap to confirm you are safe.',
      time: '15 min ago',
      read: false,
    },
    {
      id: '3',
      type: 'warning',
      title: 'UNUSUAL ACTIVITY',
      message: 'Multiple SOS signals detected in your vicinity in the last hour.',
      time: '1 hour ago',
      read: true,
      location: 'Downtown Area',
    },
    {
      id: '4',
      type: 'info',
      title: 'System Update',
      message: 'DURGA protection systems have been updated with enhanced threat detection.',
      time: '3 hours ago',
      read: true,
    },
    {
      id: '5',
      type: 'guardian',
      title: 'Circle Update',
      message: 'Dad has joined your safety circle as a guardian.',
      time: '1 day ago',
      read: true,
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'danger':
        return { icon: 'warning', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' };
      case 'warning':
        return { icon: 'error', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
      case 'guardian':
        return { icon: 'group', color: 'text-cyber-cyan', bg: 'bg-cyber-cyan/10', border: 'border-cyber-cyan/30' };
      case 'info':
      default:
        return { icon: 'info', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' };
    }
  };

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const markAllRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const filteredAlerts = filter === 'unread' 
    ? alerts.filter(a => !a.read) 
    : alerts;

  const unreadCount = alerts.filter(a => !a.read).length;

  const handleCheckIn = (alertId: string) => {
    // Simulate check-in response
    markAsRead(alertId);
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  };

  return (
    <div className="relative min-h-screen w-full max-w-md mx-auto bg-[#050505] flex flex-col overflow-hidden pb-24">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-[radial-gradient(circle_at_50%_-10%,_rgba(244,37,37,0.1),_transparent_70%)] pointer-events-none z-0"></div>

      {/* Header */}
      <header className="relative z-10 px-6 pt-8 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="material-symbols-outlined text-primary">notifications_active</span>
            </div>
            <div>
              <h1 className="text-xl font-orbitron font-bold tracking-wider text-white">ALERTS</h1>
              <p className="text-gray-500 text-xs">{unreadCount} unread notifications</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button 
              onClick={markAllRead}
              className="text-cyber-cyan text-xs font-bold tracking-wider hover:text-white transition-colors"
            >
              MARK ALL READ
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider transition-all ${
              filter === 'all' 
                ? 'bg-white/10 text-white border border-white/20' 
                : 'text-gray-500 hover:text-white'
            }`}
          >
            ALL ({alerts.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider transition-all ${
              filter === 'unread' 
                ? 'bg-primary/20 text-primary border border-primary/30' 
                : 'text-gray-500 hover:text-white'
            }`}
          >
            UNREAD ({unreadCount})
          </button>
        </div>
      </header>

      {/* Alerts List */}
      <main className="flex-1 px-4 overflow-y-auto no-scrollbar">
        <AnimatePresence>
          {filteredAlerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-gray-600 text-3xl">notifications_off</span>
              </div>
              <p className="text-gray-500 text-sm">No alerts to show</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {filteredAlerts.map((alert, index) => {
                const { icon, color, bg, border } = getAlertIcon(alert.type);
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative rounded-2xl p-4 border ${border} ${bg} ${
                      !alert.read ? 'ring-1 ring-white/10' : 'opacity-70'
                    }`}
                    onClick={() => markAsRead(alert.id)}
                  >
                    {/* Unread Indicator */}
                    {!alert.read && (
                      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary animate-pulse" />
                    )}

                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center flex-shrink-0 border ${border}`}>
                        <span className={`material-symbols-outlined ${color}`}>{icon}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`text-sm font-bold ${color}`}>{alert.title}</h3>
                          <span className="text-[10px] text-gray-500">{alert.time}</span>
                        </div>
                        <p className="text-gray-400 text-xs leading-relaxed mb-2">
                          {alert.message}
                        </p>
                        {alert.location && (
                          <div className="flex items-center gap-1 text-gray-500 text-[10px]">
                            <span className="material-symbols-outlined text-xs">location_on</span>
                            {alert.location}
                          </div>
                        )}

                        {/* Action Buttons for Guardian Check-in */}
                        {alert.type === 'guardian' && !alert.read && alert.title.includes('Check-in') && (
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCheckIn(alert.id);
                              }}
                              className="flex-1 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
                            >
                              I'M SAFE
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteAlert(alert.id);
                              }}
                              className="px-3 py-2 rounded-lg bg-gray-800 text-gray-400 text-xs border border-gray-700 hover:border-gray-600 transition-colors"
                            >
                              <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Alerts;
