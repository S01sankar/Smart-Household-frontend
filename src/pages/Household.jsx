import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { getHousehold, updateBudget, joinHousehold, addGuest, removeGuest } from '../utils/api';
import toast from 'react-hot-toast';
import { FiUsers, FiCopy, FiUserPlus, FiTrash2, FiX } from 'react-icons/fi';

const Household = () => {
  const { t } = useLanguage();

  const [household,    setHousehold]    = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [showGuest,    setShowGuest]    = useState(false);
  const [showJoin,     setShowJoin]     = useState(false);
  const [budget,       setBudget]       = useState('');
  const [inviteCode,   setInviteCode]   = useState('');

  const [guestData, setGuestData] = useState({
    name: '', email: '', phone: '',
    password: '', daysAccess: 7
  });

  useEffect(() => { fetchHousehold(); }, []);

  const fetchHousehold = async () => {
    try {
      const { data } = await getHousehold();
      setHousehold(data);
      setBudget(data.monthlyBudget);
    } catch {
      toast.error('Failed to load household');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBudget = async () => {
    try {
      await updateBudget({ monthlyBudget: budget });
      toast.success('Budget updated! 💰');
      fetchHousehold();
    } catch {
      toast.error('Failed to update budget');
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      await joinHousehold({ inviteCode });
      toast.success('Joined household! 🏠');
      setShowJoin(false);
      fetchHousehold();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join');
    }
  };

  const handleAddGuest = async (e) => {
    e.preventDefault();
    try {
      await addGuest(guestData);
      toast.success('Guest added! 👤');
      setShowGuest(false);
      setGuestData({ name: '', email: '', phone: '', password: '', daysAccess: 7 });
      fetchHousehold();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add guest');
    }
  };

  const handleRemoveGuest = async (id) => {
    try {
      await removeGuest(id);
      toast.success('Guest removed! ✅');
      fetchHousehold();
    } catch {
      toast.error('Failed to remove guest');
    }
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(household.inviteCode);
    toast.success('Invite code copied! 📋');
  };

  const roleColor = (role) => {
    if (role === 'admin') return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    if (role === 'guest') return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
    return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('household')} 🏠
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {household?.members?.length} members
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowJoin(true)}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400"
          >
            {t('joinHousehold')}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowGuest(true)}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg flex items-center gap-2"
          >
            <FiUserPlus size={16} />
            {t('addGuest')}
          </motion.button>
        </div>
      </div>

      {/* Household Info */}
      {household && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-1">{household.name}</h2>
          <p className="text-purple-100 text-sm mb-4">
            {household.members?.length} members • Admin: {household.admin?.name}
          </p>

          <div className="flex items-center gap-3 bg-white/20 rounded-xl p-3">
            <div className="flex-1">
              <p className="text-xs text-purple-100 mb-1">{t('inviteCode')}</p>
              <p className="font-mono font-bold text-lg">{household.inviteCode}</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={copyInviteCode}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30"
            >
              <FiCopy size={18} />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Budget Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800"
      >
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">
          💰 {t('monthlyBudget')}
        </h3>
        <div className="flex gap-3">
          <input
            type="number"
            value={budget}
            onChange={e => setBudget(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleUpdateBudget}
            className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-600 shadow-lg"
          >
            {t('save')}
          </motion.button>
        </div>
      </motion.div>

      {/* Members List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden"
      >
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiUsers className="text-purple-500" />
            {t('members')} ({household?.members?.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {household?.members?.map((member, index) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                  <span className="text-white font-bold">
                    {member.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {member.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {member.email}
                  </p>
                  {member.isGuest && member.guestExpiresAt && (
                    <p className="text-xs text-orange-500">
                      Expires: {new Date(member.guestExpiresAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${roleColor(member.role)}`}>
                  {t(member.role)}
                </span>
                {member.isGuest && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRemoveGuest(member._id)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <FiTrash2 size={14} />
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Add Guest Modal */}
      <AnimatePresence>
        {showGuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('addGuest')}
                </h2>
                <button
                  onClick={() => setShowGuest(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleAddGuest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('name')}
                  </label>
                  <input
                    type="text"
                    value={guestData.name}
                    onChange={e => setGuestData({...guestData, name: e.target.value})}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    value={guestData.email}
                    onChange={e => setGuestData({...guestData, email: e.target.value})}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('phone')}
                  </label>
                  <input
                    type="tel"
                    value={guestData.phone}
                    onChange={e => setGuestData({...guestData, phone: e.target.value})}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('password')}
                  </label>
                  <input
                    type="password"
                    value={guestData.password}
                    onChange={e => setGuestData({...guestData, password: e.target.value})}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('daysAccess')}
                  </label>
                  <input
                    type="number"
                    value={guestData.daysAccess}
                    onChange={e => setGuestData({...guestData, daysAccess: e.target.value})}
                    min="1"
                    max="30"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowGuest(false)}
                    className="flex-1 py-3 rounded-xl font-medium border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    {t('cancel')}
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-600 shadow-lg"
                  >
                    {t('add')}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Join Household Modal */}
      <AnimatePresence>
        {showJoin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('joinHousehold')}
                </h2>
                <button
                  onClick={() => setShowJoin(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleJoin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('inviteCode')}
                  </label>
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={e => setInviteCode(e.target.value)}
                    required
                    placeholder="Enter invite code"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowJoin(false)}
                    className="flex-1 py-3 rounded-xl font-medium border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    {t('cancel')}
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-600 shadow-lg"
                  >
                    {t('joinHousehold')}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Household;