import React, { useState, useEffect } from 'react';
import useLocation from '../hooks/useLocation';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getGroceries, getExpenseSummary, getTasks, getBills, getNotifications } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiDollarSign, FiCheckSquare,
  FiCreditCard, FiAlertTriangle, FiPackage,
  FiActivity
} from 'react-icons/fi';

const Dashboard = () => {
  const { user }    = useAuth();
  const { t }       = useLanguage();
  const navigate    = useNavigate();

  const [groceries,      setGroceries]      = useState([]);
  const [summary,        setSummary]        = useState(null);
  const [tasks,          setTasks]          = useState([]);
  const [bills,          setBills]          = useState([]);
  const [notifications,  setNotifications]  = useState([]);
  const [loading,        setLoading]        = useState(true);

  const floatingIcons = ['🥛','🍅','🥚','🧅','🍚','🧹','🥦','🍌','🧴','🫙','🍎','🥕'];
  const { nearbyStores, veryNearbyStores, shoppingList, myTasks, getCurrentLocation, loading: locationLoading } = useLocation();

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [g, s, tk, b, n] = await Promise.all([
        getGroceries(),
        getExpenseSummary(),
        getTasks(),
        getBills(),
        getNotifications()
      ]);
      setGroceries(g.data);
      setSummary(s.data);
      setTasks(tk.data);
      setBills(b.data);
      setNotifications(n.data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const lowItems      = groceries.filter(g => g.status === 'low');
  const emptyItems    = groceries.filter(g => g.status === 'empty');
  const pendingTasks  = tasks.filter(t => t.status === 'pending');
  const unpaidBills   = bills.filter(b => b.status === 'unpaid' || b.status === 'overdue');
  const unreadNotifs  = notifications.filter(n => !n.read);

  const today          = new Date();
  const threeDaysLater = new Date();
  threeDaysLater.setDate(today.getDate() + 3);
  const expiringItems  = groceries.filter(g =>
    g.expiryDate &&
    new Date(g.expiryDate) <= threeDaysLater &&
    new Date(g.expiryDate) >= today
  );

  const statsCards = [
    {
      title:    t('totalItems'),
      value:    groceries.length,
      icon:     <FiPackage size={24} />,
      color:    'from-violet-600 to-purple-600',
      bg:       'bg-violet-50 dark:bg-violet-900/20',
      border:   'border-violet-100 dark:border-violet-800',
      shadow:   'shadow-violet-100 dark:shadow-violet-900/20',
      iconBg:   'from-violet-500 to-purple-600',
      path:     '/groceries',
      emoji:    '🛒',
      trend:    `${lowItems.length} low stock`
    },
    {
      title:    t('totalExpenses'),
      value:    `₹${summary?.totalSpent || 0}`,
      icon:     <FiDollarSign size={24} />,
      color:    'from-cyan-500 to-blue-600',
      bg:       'bg-cyan-50 dark:bg-cyan-900/20',
      border:   'border-cyan-100 dark:border-cyan-800',
      shadow:   'shadow-cyan-100 dark:shadow-cyan-900/20',
      iconBg:   'from-cyan-500 to-blue-600',
      path:     '/expenses',
      emoji:    '💰',
      trend:    `₹${summary?.remaining || 0} remaining`
    },
    {
      title:    t('pendingTasks'),
      value:    pendingTasks.length,
      icon:     <FiCheckSquare size={24} />,
      color:    'from-emerald-500 to-teal-600',
      bg:       'bg-emerald-50 dark:bg-emerald-900/20',
      border:   'border-emerald-100 dark:border-emerald-800',
      shadow:   'shadow-emerald-100 dark:shadow-emerald-900/20',
      iconBg:   'from-emerald-500 to-teal-600',
      path:     '/tasks',
      emoji:    '✅',
      trend:    `${tasks.length - pendingTasks.length} completed`
    },
    {
      title:    t('unpaidBills'),
      value:    unpaidBills.length,
      icon:     <FiCreditCard size={24} />,
      color:    'from-orange-500 to-red-500',
      bg:       'bg-orange-50 dark:bg-orange-900/20',
      border:   'border-orange-100 dark:border-orange-800',
      shadow:   'shadow-orange-100 dark:shadow-orange-900/20',
      iconBg:   'from-orange-500 to-red-500',
      path:     '/bills',
      emoji:    '📋',
      trend:    `${bills.length - unpaidBills.length} paid`
    },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );

  return (
    <div className="space-y-6 relative">

      {/* Floating Background Icons */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {floatingIcons.map((icon, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-5 dark:opacity-10"
            style={{
              left:  `${5 + (i * 8)}%`,
              top:   `${10 + (i % 4) * 20}%`,
            }}
            animate={{
              y:       [0, -30, 0],
              rotate:  [0, 15, -15, 0],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat:   Infinity,
              delay:    i * 0.3,
            }}
          >
            {icon}
          </motion.div>
        ))}
      </div>

      {/* Glowing Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 dark:opacity-10 animate-float"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 dark:opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 dark:opacity-10 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-3xl p-6 md:p-8 overflow-hidden shadow-2xl neon-purple"
      >
        {/* Very Nearby Store Alert - within 100 meters */}
{veryNearbyStores.length > 0 && (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-4 shadow-lg relative z-10"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-3xl"
        >
          📍
        </motion.span>
        <div>
          <p className="font-bold text-white text-lg">
            You are {veryNearbyStores[0].distance}m from {veryNearbyStores[0].name}!
          </p>
          <p className="text-green-100 text-sm">
            🛒 {shoppingList.length} items to buy •
            ✅ {myTasks.length} pending tasks
          </p>
        </div>
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/groceries')}
        className="px-4 py-2 rounded-xl bg-white text-green-600 font-bold text-sm shadow-lg"
      >
        View List
      </motion.button>
    </div>

    {/* Shopping Items */}
    {shoppingList.length > 0 && (
      <div className="mt-3 pt-3 border-t border-green-400/30">
        <p className="text-green-100 text-xs font-medium mb-2">Items to buy:</p>
        <div className="flex flex-wrap gap-2">
          {shoppingList.slice(0, 6).map((item, i) => (
            <span
              key={i}
              className="text-xs bg-white/20 text-white px-2 py-1 rounded-full"
            >
              {item.name}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Pending Tasks */}
    {myTasks.length > 0 && (
      <div className="mt-3 pt-3 border-t border-green-400/30">
        <p className="text-green-100 text-xs font-medium mb-2">Your pending tasks:</p>
        <div className="flex flex-wrap gap-2">
          {myTasks.slice(0, 3).map((task, i) => (
            <span
              key={i}
              className="text-xs bg-white/20 text-white px-2 py-1 rounded-full"
            >
              ✅ {task.title}
            </span>
          ))}
        </div>
      </div>
    )}
  </motion.div>
)}

{/* Regular Nearby Store Alert */}
{veryNearbyStores.length === 0 && nearbyStores.length > 0 && shoppingList.length > 0 && (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl p-4 shadow-lg relative z-10"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-3xl">📍</span>
        <div>
          <p className="font-bold text-white">
            {nearbyStores[0].name} is {nearbyStores[0].distance}m away!
          </p>
          <p className="text-purple-100 text-sm">
            🛒 {shoppingList.length} items need to be purchased
          </p>
        </div>
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/groceries')}
        className="px-4 py-2 rounded-xl bg-white text-purple-600 font-bold text-sm shadow-lg"
      >
        {t('viewShoppingList')}
      </motion.button>
    </div>
    <div className="mt-3 flex flex-wrap gap-2">
      {shoppingList.slice(0, 5).map((item, i) => (
        <span
          key={i}
          className="text-xs bg-white/20 text-white px-2 py-1 rounded-full"
        >
          {item.name}
        </span>
      ))}
    </div>
  </motion.div>
)}
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-3xl"></div>

        {/* Animated wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="white"/>
          </svg>
        </div>

        {/* Floating icons inside banner */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {['🛒','🥛','🍅','🥚'].map((icon, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl opacity-20"
              style={{ right: `${8 + i * 12}%`, top: `${15 + i * 15}%` }}
              animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2 + i, repeat: Infinity }}
            >
              {icon}
            </motion.div>
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-300 text-xs font-medium">Live</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-2">
            {t('welcome')}, {user?.name} 👋
          </h1>
          <p className="text-purple-100 text-lg">
            {emptyItems.length + lowItems.length} {t('itemsNeedRestock')}
          </p>
          {unreadNotifs.length > 0 && (
            <p className="text-yellow-300 text-sm mt-1">
              🔔 {unreadNotifs.length} unread notifications
            </p>
          )}
          <div className="flex flex-wrap gap-3 mt-5">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/groceries')}
              className="px-5 py-2.5 rounded-xl bg-white text-purple-600 font-bold text-sm shadow-lg"
            >
              {t('restockAll')} 🛒
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/expenses')}
              className="px-5 py-2.5 rounded-xl bg-white/20 text-white font-bold text-sm border border-white/30 backdrop-blur-sm"
            >
              {t('expenses')} 💰
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/notifications')}
              className="px-5 py-2.5 rounded-xl bg-white/20 text-white font-bold text-sm border border-white/30 backdrop-blur-sm"
            >
              {t('notifications')} 🔔
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={getCurrentLocation}
              disabled={locationLoading}
              className="px-5 py-2.5 rounded-xl bg-white/20 text-white font-bold text-sm border border-white/30 backdrop-blur-sm flex items-center gap-2"
            >
              {locationLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : '📍'}
              Nearby Stores
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
  {statsCards.map((card, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.03, y: -8 }}
      onClick={() => navigate(card.path)}
      className={`relative rounded-3xl p-5 border-2 ${card.bg} ${card.border} cursor-pointer overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      {/* Background glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-3xl`}></div>

      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.iconBg} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {card.icon}
        </div>
        <span className="text-2xl">{card.emoji}</span>
      </div>

      {/* Value */}
      <p className={`text-2xl md:text-3xl font-extrabold bg-gradient-to-r ${card.color} bg-clip-text text-transparent mb-1`}>
        {card.value}
      </p>

      {/* Title */}
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {card.title}
      </p>

      {/* Trend */}
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
        {card.trend}
      </p>

      {/* Arrow */}
      <motion.div
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 0 }}
        whileHover={{ opacity: 1, x: 0 }}
        className={`absolute bottom-4 right-4 text-xs font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}
      >
        View →
      </motion.div>
    </motion.div>
  ))}
</div>

      {/* Whats Missing Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 relative z-10"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiAlertTriangle className="text-orange-500" />
            {t('whatsMissing')}
          </h2>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/groceries')}
            className="text-sm text-purple-600 dark:text-purple-400 font-medium hover:underline"
          >
            {t('restockAll')} →
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Empty Items */}
          <div className="bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm rounded-2xl p-4 border border-red-100 dark:border-red-800">
            <h3 className="font-bold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 bg-red-500 rounded-full inline-block"
              ></motion.span>
              {t('empty')} ({emptyItems.length})
            </h3>
            <div className="space-y-2">
              {emptyItems.length === 0 ? (
                <p className="text-sm text-red-400">All good! ✅</p>
              ) : (
                emptyItems.slice(0, 5).map(item => (
                  <div key={item._id} className="flex items-center justify-between">
                    <span className="text-sm text-red-700 dark:text-red-300">{item.name}</span>
                    <span className="text-xs bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300 px-2 py-0.5 rounded-full">
                      {t('empty')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Low Stock */}
          <div className="bg-yellow-50/80 dark:bg-yellow-900/20 backdrop-blur-sm rounded-2xl p-4 border border-yellow-100 dark:border-yellow-800">
            <h3 className="font-bold text-yellow-700 dark:text-yellow-400 mb-3 flex items-center gap-2">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 bg-yellow-500 rounded-full inline-block"
              ></motion.span>
              {t('lowStock')} ({lowItems.length})
            </h3>
            <div className="space-y-2">
              {lowItems.length === 0 ? (
                <p className="text-sm text-yellow-400">All good! ✅</p>
              ) : (
                lowItems.slice(0, 5).map(item => (
                  <div key={item._id} className="flex items-center justify-between">
                    <span className="text-sm text-yellow-700 dark:text-yellow-300">{item.name}</span>
                    <span className="text-xs bg-yellow-100 dark:bg-yellow-800 text-yellow-600 dark:text-yellow-300 px-2 py-0.5 rounded-full">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Expiring Soon */}
          <div className="bg-orange-50/80 dark:bg-orange-900/20 backdrop-blur-sm rounded-2xl p-4 border border-orange-100 dark:border-orange-800">
            <h3 className="font-bold text-orange-700 dark:text-orange-400 mb-3 flex items-center gap-2">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-orange-500 rounded-full inline-block"
              ></motion.span>
              {t('expiringSoon')} ({expiringItems.length})
            </h3>
            <div className="space-y-2">
              {expiringItems.length === 0 ? (
                <p className="text-sm text-orange-400">All good! ✅</p>
              ) : (
                expiringItems.slice(0, 5).map(item => (
                  <div key={item._id} className="flex items-center justify-between">
                    <span className="text-sm text-orange-700 dark:text-orange-300">{item.name}</span>
                    <span className="text-xs bg-orange-100 dark:bg-orange-800 text-orange-600 dark:text-orange-300 px-2 py-0.5 rounded-full">
                      {new Date(item.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </motion.div>

      {/* Budget Progress */}
      {summary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 relative z-10"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
            <FiDollarSign className="text-green-500" />
            {t('monthlyBudget')}
          </h2>

          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-500 dark:text-gray-400 text-sm">{t('totalSpent')}</span>
            <span className="font-bold text-gray-900 dark:text-white">
              ₹{summary.totalSpent} / ₹{summary.monthlyBudget}
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((summary.totalSpent / summary.monthlyBudget) * 100, 100)}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className={`h-full rounded-full relative overflow-hidden ${
                (summary.totalSpent / summary.monthlyBudget) > 0.9
                  ? 'bg-gradient-to-r from-red-500 to-red-600'
                  : (summary.totalSpent / summary.monthlyBudget) > 0.7
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                  : 'bg-gradient-to-r from-green-500 to-teal-500'
              }`}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </motion.div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <span className={`text-sm font-medium ${
              summary.remaining < 0 ? 'text-red-500' : 'text-green-500'
            }`}>
              {summary.remaining < 0 ? '⚠️ ' : '✅ '}
              {t('remaining')}: ₹{summary.remaining}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round((summary.totalSpent / summary.monthlyBudget) * 100)}% used
            </span>
          </div>
        </motion.div>
      )}

      {/* Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 relative z-10"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          <FiActivity className="text-purple-500" />
          Live Activity Feed
        </h2>
        <div className="space-y-3">
          {notifications.slice(0, 6).map((notif, index) => (
            <motion.div
              key={notif._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm"
            >
              <span className="text-xl">
                {notif.type === 'low-stock' ? '📦' :
                 notif.type === 'expiry'    ? '⏰' :
                 notif.type === 'budget'    ? '💰' :
                 notif.type === 'task'      ? '✅' : '🔔'}
              </span>
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300">{notif.message}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {new Date(notif.createdAt).toLocaleString()}
                </p>
              </div>
              {!notif.read && (
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-1 animate-pulse"></div>
              )}
            </motion.div>
          ))}
          {notifications.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-4">
              No recent activity
            </p>
          )}
        </div>
      </motion.div>

      {/* Recent Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 relative z-10"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiCheckSquare className="text-blue-500" />
            {t('tasks')}
          </h2>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/tasks')}
            className="text-sm text-purple-600 dark:text-purple-400 font-medium hover:underline"
          >
            View all →
          </motion.button>
        </div>

        <div className="space-y-3">
          {pendingTasks.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">
              No pending tasks! 🎉
            </p>
          ) : (
            pendingTasks.slice(0, 4).map((task, index) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    task.priority === 'high'   ? 'bg-red-500 animate-pulse' :
                    task.priority === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {task.title}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {task.assignedTo?.name || 'Unassigned'}
                </span>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

    </div>
  );
};

export default Dashboard;