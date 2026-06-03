import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getEmergencies, triggerEmergency, resolveEmergency } from '../utils/api';
import toast from 'react-hot-toast';

const emergencyTypes = [
  { type: 'fire',    emoji: '🔥', label: 'Fire',          color: 'from-red-500 to-orange-500',    bg: 'bg-red-50 dark:bg-red-900/20',     border: 'border-red-200 dark:border-red-800' },
  { type: 'medical', emoji: '🚑', label: 'Medical',       color: 'from-pink-500 to-red-500',      bg: 'bg-pink-50 dark:bg-pink-900/20',   border: 'border-pink-200 dark:border-pink-800' },
  { type: 'gas',     emoji: '⚠️', label: 'Gas Leak',      color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800' },
  { type: 'power',   emoji: '⚡', label: 'Power Cut',     color: 'from-blue-500 to-indigo-500',   bg: 'bg-blue-50 dark:bg-blue-900/20',   border: 'border-blue-200 dark:border-blue-800' },
  { type: 'flood',   emoji: '🌊', label: 'Flood',         color: 'from-cyan-500 to-blue-500',     bg: 'bg-cyan-50 dark:bg-cyan-900/20',   border: 'border-cyan-200 dark:border-cyan-800' },
  { type: 'other',   emoji: '🚨', label: 'Other',         color: 'from-purple-500 to-pink-500',   bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800' },
];

const Emergency = () => {
  const { t }    = useLanguage();
  const { user } = useAuth();

  const [emergencies,   setEmergencies]   = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [triggering,    setTriggering]    = useState(false);
  const [showConfirm,   setShowConfirm]   = useState(false);
  const [selectedType,  setSelectedType]  = useState(null);
  const [message,       setMessage]       = useState('');
  const [countdown,     setCountdown]     = useState(0);

  useEffect(() => { fetchEmergencies(); }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (countdown === 0 && triggering) {
      handleConfirmEmergency();
    }
  }, [countdown, triggering]);

  const fetchEmergencies = async () => {
    try {
      const { data } = await getEmergencies();
      setEmergencies(data);
    } catch {
      toast.error('Failed to load emergencies');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectType = (type) => {
    setSelectedType(type);
    setShowConfirm(true);
    setMessage('');
  };

  const handleTrigger = () => {
    setTriggering(true);
    setCountdown(3);
  };

  const handleConfirmEmergency = async () => {
    if (!selectedType) return;
    try {
      // Get location
      let location = null;
      if ('geolocation' in navigator) {
        await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              location = {
                latitude:  pos.coords.latitude,
                longitude: pos.coords.longitude
              };
              resolve();
            },
            () => resolve()
          );
        });
      }

      const { data } = await triggerEmergency({
        type: selectedType.type,
        message,
        location
      });

      setEmergencies([data, ...emergencies]);
      toast.error(`🚨 Emergency alert sent to all members!`, {
        duration: 5000,
        style: {
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          color:      '#fff',
        }
      });

      setShowConfirm(false);
      setSelectedType(null);
      setMessage('');
      setTriggering(false);
      setCountdown(0);
    } catch {
      toast.error('Failed to trigger emergency');
      setTriggering(false);
      setCountdown(0);
    }
  };

  const handleResolve = async (id) => {
    try {
      const { data } = await resolveEmergency(id);
      setEmergencies(emergencies.map(e => e._id === id ? data : e));
      toast.success('Emergency resolved! ✅');
    } catch {
      toast.error('Failed to resolve emergency');
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setSelectedType(null);
    setMessage('');
    setTriggering(false);
    setCountdown(0);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          🚨 Emergency Center
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Instantly alert all household members in case of emergency
        </p>
      </div>

      {/* Emergency Banner */}
      <motion.div
        animate={{ boxShadow: ['0 0 20px rgba(239,68,68,0.3)', '0 0 40px rgba(239,68,68,0.6)', '0 0 20px rgba(239,68,68,0.3)'] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-6 text-white"
      >
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-5xl"
          >
            🚨
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold mb-1">Emergency Alert System</h2>
            <p className="text-red-100 text-sm">
              One tap sends WhatsApp alerts to all {user?.name}'s household members instantly
            </p>
          </div>
        </div>
      </motion.div>

      {/* Emergency Type Buttons */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Select Emergency Type:
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {emergencyTypes.map((emergency, index) => (
            <motion.button
              key={emergency.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectType(emergency)}
              className={`p-5 rounded-2xl border-2 ${emergency.bg} ${emergency.border} flex flex-col items-center gap-3 shadow-lg`}
            >
              <span className="text-4xl">{emergency.emoji}</span>
              <span className="font-bold text-gray-900 dark:text-white text-sm">
                {emergency.label}
              </span>
              <div className={`w-full py-2 rounded-xl bg-gradient-to-r ${emergency.color} text-white text-xs font-bold text-center`}>
                Alert All Members
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Emergency History */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-bold text-gray-900 dark:text-white">
            Emergency History
          </h3>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {emergencies.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl">✅</span>
              <p className="text-gray-500 dark:text-gray-400 mt-3">
                No emergencies recorded. Stay safe! 🙏
              </p>
            </div>
          ) : (
            emergencies.map((emergency, index) => (
              <motion.div
                key={emergency._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {emergencyTypes.find(e => e.type === emergency.type)?.emoji || '🚨'}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm capitalize">
                      {emergency.type} Emergency
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      By {emergency.triggeredBy?.name} • {new Date(emergency.createdAt).toLocaleString('en-IN')}
                    </p>
                    {emergency.message && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                        {emergency.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    emergency.status === 'active'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {emergency.status === 'active' ? '🔴 Active' : '✅ Resolved'}
                  </span>
                  {emergency.status === 'active' && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleResolve(emergency._id)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-green-500 text-white font-medium"
                    >
                      Resolve
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {showConfirm && selectedType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="text-center mb-6">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  {selectedType.emoji}
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedType.label} Emergency
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  This will send WhatsApp alerts to ALL household members immediately!
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Message (optional)
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Add more details about the emergency..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {triggering && countdown > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center mb-4"
                >
                  <div className="text-6xl font-bold text-red-500 mb-2">
                    {countdown}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Sending emergency alert in {countdown} seconds...
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancel}
                    className="mt-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium"
                  >
                    Cancel
                  </motion.button>
                </motion.div>
              )}

              {!triggering && (
                <div className="flex gap-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancel}
                    className="flex-1 py-3 rounded-xl font-medium border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleTrigger}
                    className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-red-500 to-orange-500 shadow-lg"
                  >
                    🚨 Send Alert!
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Emergency;