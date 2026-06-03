import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { updatePreferences } from '../utils/api';
import toast from 'react-hot-toast';
import { FiSun, FiMoon, FiGlobe, FiUser, FiSave } from 'react-icons/fi';

const Settings = () => {
  const { user, fetchUser }            = useAuth();
  const { theme, toggleTheme }         = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [saving, setSaving]            = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePreferences({ language, theme });
      await fetchUser();
      toast.success(t('saveSettings') + ' ✅');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('settings')} ⚙️
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Manage your preferences
        </p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800"
      >
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FiUser className="text-purple-500" />
          Profile
        </h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center shadow-lg neon-purple">
            <span className="text-white text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-lg">{user?.name}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.phone}</p>
          </div>
        </div>
      </motion.div>

      {/* Theme Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800"
      >
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          {theme === 'dark' ? <FiMoon className="text-purple-500" /> : <FiSun className="text-yellow-500" />}
          {t('theme')}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => theme === 'dark' && toggleTheme()}
            className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
              theme === 'light'
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <FiSun size={20} className="text-yellow-500" />
            <span className="font-medium text-gray-900 dark:text-white">
              {t('lightMode')}
            </span>
            {theme === 'light' && (
              <span className="ml-auto text-purple-500 text-xs font-bold">✓</span>
            )}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => theme === 'light' && toggleTheme()}
            className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
              theme === 'dark'
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <FiMoon size={20} className="text-purple-500" />
            <span className="font-medium text-gray-900 dark:text-white">
              {t('darkMode')}
            </span>
            {theme === 'dark' && (
              <span className="ml-auto text-purple-500 text-xs font-bold">✓</span>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Language Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800"
      >
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FiGlobe className="text-cyan-500" />
          {t('language')}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => language === 'ta' && toggleLanguage()}
            className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
              language === 'en'
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <span className="text-2xl">🇬🇧</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {t('english')}
            </span>
            {language === 'en' && (
              <span className="ml-auto text-purple-500 text-xs font-bold">✓</span>
            )}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => language === 'en' && toggleLanguage()}
            className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
              language === 'ta'
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <span className="text-2xl">🇮🇳</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {t('tamil')}
            </span>
            {language === 'ta' && (
              <span className="ml-auto text-purple-500 text-xs font-bold">✓</span>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* App Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl p-6 text-white shadow-lg"
      >
        <h3 className="font-bold text-lg mb-2">SmartHome Management</h3>
        <p className="text-purple-100 text-sm mb-1">Version 1.0.0</p>
        <p className="text-purple-100 text-sm">
          Built with React, Node.js, MongoDB
        </p>
      </motion.div>

      {/* Save Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        disabled={saving}
        className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-600 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {saving ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <>
            <FiSave size={20} />
            {t('saveSettings')}
          </>
        )}
      </motion.button>

    </div>
  );
};

export default Settings;