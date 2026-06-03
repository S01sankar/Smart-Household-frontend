import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome, FiShoppingCart, FiDollarSign, FiCheckSquare,
  FiCreditCard, FiBook, FiUsers, FiBell, FiSettings,
  FiLogOut, FiX, FiAlertTriangle, FiMessageCircle
} from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose }) => {
  const { t }      = useLanguage();
  const { logout } = useAuth();
  const navigate   = useNavigate();

  const menuItems = [
    { path: '/dashboard',     icon: <FiHome size={20} />,          label: t('dashboard'),     color: 'text-purple-500' },
    { path: '/groceries',     icon: <FiShoppingCart size={20} />,  label: t('groceries'),     color: 'text-cyan-500'   },
    { path: '/expenses',      icon: <FiDollarSign size={20} />,    label: t('expenses'),      color: 'text-green-500'  },
    { path: '/tasks',         icon: <FiCheckSquare size={20} />,   label: t('tasks'),         color: 'text-blue-500'   },
    { path: '/bills',         icon: <FiCreditCard size={20} />,    label: t('bills'),         color: 'text-orange-500' },
    { path: '/recipes',       icon: <FiBook size={20} />,          label: t('recipes'),       color: 'text-pink-500'   },
    { path: '/household',     icon: <FiUsers size={20} />,         label: t('household'),     color: 'text-indigo-500' },
    { path: '/chat',          icon: <FiMessageCircle size={20} />, label: 'Chat',             color: 'text-teal-500'   },
    { path: '/emergency',     icon: <FiAlertTriangle size={20} />, label: 'Emergency',        color: 'text-red-500'    },
    { path: '/notifications', icon: <FiBell size={20} />,          label: t('notifications'), color: 'text-yellow-500' },
    { path: '/settings',      icon: <FiSettings size={20} />,      label: t('settings'),      color: 'text-gray-500'   },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center neon-purple">
            <span className="text-white text-lg">🏠</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-800 dark:text-white text-lg">SmartHome</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Management System</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg neon-purple'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <span className={item.color}>{item.icon}</span>
            <span className="font-medium text-sm">{item.label}</span>
            {item.path === '/emergency' && (
              <span className="ml-auto w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
            {item.path === '/chat' && (
              <span className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <FiLogOut size={20} />
          <span className="font-medium text-sm">{t('logout')}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 z-50 md:hidden shadow-2xl"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <FiX size={20} />
              </button>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;