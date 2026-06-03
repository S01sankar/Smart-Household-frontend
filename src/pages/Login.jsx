import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { login } from '../utils/api';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff, FiSun, FiMoon } from 'react-icons/fi';

const Login = () => {
  const navigate                            = useNavigate();
  const { loginUser }                       = useAuth();
  const { t, language, toggleLanguage }     = useLanguage();
  const { theme, toggleTheme }              = useTheme();
  const [formData, setFormData]             = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword]     = useState(false);
  const [loading, setLoading]               = useState(false);
  const [focused, setFocused]               = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await login(formData);
      loginUser(data.token, data.user);
      toast.success(`Welcome back ${data.user.name}! 👋`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const floatingItems = ['🛒','🥛','🍅','🥚','🧅','🍚','🧹','🥦','🍌','🧴'];

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex overflow-hidden h-screen">

        {/* Left Side — Animated Banner */}
        <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-purple-600 via-pink-500 to-cyan-500 overflow-hidden">

          {/* Animated blobs */}
          <motion.div
            animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full"
          />
          <motion.div
            animate={{ x: [0, -40, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full"
          />
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/5 rounded-full"
          />

          {/* Floating grocery icons */}
          {floatingItems.map((icon, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl"
              style={{
                left: `${10 + (i * 9)}%`,
                top:  `${10 + (i % 5) * 18}%`,
              }}
              animate={{
                y:       [0, -20, 0],
                rotate:  [0, 15, -15, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat:   Infinity,
                delay:    i * 0.2,
              }}
            >
              {icon}
            </motion.div>
          ))}

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-12 text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center w-full max-w-sm mx-auto"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-8xl mb-6"
              >
                🏠
              </motion.div>
              <h1 className="text-4xl font-extrabold mb-4">
                Welcome Back!
              </h1>
              <p className="text-white/80 text-lg mb-8 max-w-sm mx-auto">
                Your smart household assistant is waiting for you
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-3 justify-center max-w-xs mx-auto">
                {['🛒 Smart Grocery', '💰 Expense Track', '🔔 Alerts', '💬 Family Chat'].map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30"
                  >
                    {f}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side — Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">

          {/* Mobile background */}
          <div className="absolute inset-0 lg:hidden overflow-hidden">
            <motion.div
              animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute -top-20 -right-20 w-64 h-64 bg-purple-200 dark:bg-purple-900/20 rounded-full filter blur-3xl opacity-50"
            />
            <motion.div
              animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-200 dark:bg-cyan-900/20 rounded-full filter blur-3xl opacity-50"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-full max-w-md"
          >

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg">🏠</span>
                </div>
                <span className="font-extrabold text-xl bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                  SmartHome
                </span>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleLanguage}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                >
                  {language === 'en' ? 'தமிழ்' : 'EN'}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTheme}
                  className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
                </motion.button>
              </div>
            </div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                {t('login')} 👋
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                {t('dontHaveAccount')}{' '}
                <Link to="/register" className="text-purple-600 dark:text-purple-400 font-bold hover:underline">
                  {t('registerHere')}
                </Link>
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email or Phone */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  {t('email')} / {t('phone')}
                </label>
                <div className={`relative transition-all duration-200 ${focused === 'identifier' ? 'scale-[1.01]' : ''}`}>
                  <FiMail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focused === 'identifier' ? 'text-purple-500' : 'text-gray-400'}`} size={18} />
                  <input
                    type="text"
                    value={formData.identifier}
                    onChange={e => setFormData({...formData, identifier: e.target.value})}
                    onFocus={() => setFocused('identifier')}
                    onBlur={() => setFocused('')}
                    required
                    placeholder="Email or phone number"
                    className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 focus:outline-none ${
                      focused === 'identifier'
                        ? 'border-purple-500 shadow-lg shadow-purple-100 dark:shadow-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  {t('password')}
                </label>
                <div className={`relative transition-all duration-200 ${focused === 'password' ? 'scale-[1.01]' : ''}`}>
                  <FiLock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focused === 'password' ? 'text-purple-500' : 'text-gray-400'}`} size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused('')}
                    required
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-12 py-3.5 rounded-2xl border-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 focus:outline-none ${
                      focused === 'password'
                        ? 'border-purple-500 shadow-lg shadow-purple-100 dark:shadow-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl font-extrabold text-white bg-gradient-to-r from-purple-600 to-cyan-500 shadow-xl shadow-purple-200 dark:shadow-purple-900/30 hover:shadow-2xl transition-all disabled:opacity-50 text-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Signing in...
                    </div>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {t('login')} 🚀
                    </span>
                  )}
                </motion.button>
              </motion.div>

            </form>

            {/* Bottom note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6"
            >
              By signing in you agree to our terms of service 🔒
            </motion.p>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;