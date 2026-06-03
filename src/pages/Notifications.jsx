import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../utils/api';
import toast from 'react-hot-toast';
import { FiBell, FiTrash2, FiCheck, FiCheckCircle } from 'react-icons/fi';

const Notifications = () => {
  const { t } = useLanguage();

  const [notifications, setNotifications] = useState([]);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await getNotifications();
      setNotifications(data);
    } catch {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(notifications.map(n =>
        n._id === id ? { ...n, read: true } : n
      ));
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      toast.success('All marked as read! ✅');
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(notifications.filter(n => n._id !== id));
      toast.success('Deleted! 🗑️');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const typeIcon = (type) => {
    if (type === 'low-stock') return '📦';
    if (type === 'expiry')    return '⏰';
    if (type === 'budget')    return '💰';
    if (type === 'task')      return '✅';
    return '🔔';
  };

  const typeColor = (type) => {
    if (type === 'low-stock') return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10';
    if (type === 'expiry')    return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/10';
    if (type === 'budget')    return 'border-l-red-500 bg-red-50 dark:bg-red-900/10';
    if (type === 'task')      return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/10';
    return 'border-l-purple-500 bg-purple-50 dark:bg-purple-900/10';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {t('notifications')} 🔔
            {unreadCount > 0 && (
              <span className="text-sm px-2 py-0.5 rounded-full bg-red-500 text-white font-medium">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {unreadCount} unread notifications
          </p>
        </div>
        {unreadCount > 0 && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleMarkAllRead}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center gap-2"
          >
            <FiCheckCircle size={16} />
            {t('markAllRead')}
          </motion.button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            <FiBell size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">{t('noNotifications')}</p>
          </div>
        ) : (
          <AnimatePresence>
            {notifications.map((notif, index) => (
              <motion.div
                key={notif._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className={`relative border-l-4 rounded-2xl p-4 shadow-sm ${typeColor(notif.type)} ${
                  !notif.read ? 'ring-1 ring-purple-200 dark:ring-purple-800' : ''
                }`}
              >
                {/* Unread dot */}
                {!notif.read && (
                  <div className="absolute top-4 right-4 w-2 h-2 bg-purple-500 rounded-full"></div>
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{typeIcon(notif.type)}</span>
                    <div>
                      <p className={`text-sm ${
                        notif.read
                          ? 'text-gray-500 dark:text-gray-400'
                          : 'text-gray-900 dark:text-white font-medium'
                      }`}>
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {!notif.read && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleMarkRead(notif._id)}
                        className="p-1.5 rounded-lg text-purple-500 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                      >
                        <FiCheck size={14} />
                      </motion.button>
                    )}
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(notif._id)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <FiTrash2 size={14} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

    </div>
  );
};

export default Notifications;