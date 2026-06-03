import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useVoice from '../../hooks/useVoice';
import { FiMenu, FiBell, FiSun, FiMoon, FiLogOut, FiUser, FiMic, FiMicOff } from 'react-icons/fi';

const Navbar = ({ onMenuClick }) => {
  const { user, logout }                    = useAuth();
  const { theme, toggleTheme }              = useTheme();
  const { language, toggleLanguage, t }     = useLanguage();
  const navigate                            = useNavigate();
  const { listening, startListening, supported } = useVoice();
  const [dropdownOpen, setDropdownOpen]     = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40">

      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
        >
          <FiMenu size={20} />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center neon-purple">
            <span className="text-white text-sm font-bold">🏠</span>
          </div>
          <span className="font-bold text-gray-800 dark:text-white hidden md:block">
            SmartHome
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">

        {/* Voice Button */}
        {supported && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={startListening}
            className={`p-2 rounded-lg transition-colors relative ${
              listening
                ? 'bg-red-500 text-white neon-pink'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {listening ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <FiMicOff size={20} />
              </motion.div>
            ) : (
              <FiMic size={20} />
            )}
            {listening && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping"></span>
            )}
          </motion.button>
        )}

        {/* Language Toggle */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleLanguage}
          className="px-3 py-1.5 rounded-lg text-sm font-medium bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
        >
          {language === 'en' ? 'தமிழ்' : 'EN'}
        </motion.button>

        {/* Theme Toggle */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
        </motion.button>

        {/* Notifications */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/notifications')}
          className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
        >
          <FiBell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </motion.button>

        {/* User Dropdown */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center neon-purple">
              <span className="text-white text-sm font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">
              {user?.name}
            </span>
          </motion.button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
              >
                <button
                  onClick={() => { navigate('/settings'); setDropdownOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <FiUser size={16} />
                  {t('settings')}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <FiLogOut size={16} />
                  {t('logout')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;