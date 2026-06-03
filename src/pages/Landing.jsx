import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon, FiArrowRight, FiCheck } from 'react-icons/fi';

const Landing = () => {
  const navigate                                = useNavigate();
  const { t, language, toggleLanguage }         = useLanguage();
  const { theme, toggleTheme }                  = useTheme();
  const [hoveredFeature, setHoveredFeature]     = useState(null);

  const features = [
    {
      icon:     '🛒',
      title:    t('feature1Title'),
      desc:     t('feature1Desc'),
      gradient: 'from-violet-600 to-purple-600',
      shadow:   'shadow-violet-200 dark:shadow-violet-900',
      bg:       'bg-violet-50 dark:bg-violet-900/20',
      border:   'border-violet-100 dark:border-violet-800',
    },
    {
      icon:     '💰',
      title:    t('feature2Title'),
      desc:     t('feature2Desc'),
      gradient: 'from-cyan-500 to-blue-600',
      shadow:   'shadow-cyan-200 dark:shadow-cyan-900',
      bg:       'bg-cyan-50 dark:bg-cyan-900/20',
      border:   'border-cyan-100 dark:border-cyan-800',
    },
    {
      icon:     '👨‍👩‍👧',
      title:    t('feature3Title'),
      desc:     t('feature3Desc'),
      gradient: 'from-emerald-500 to-teal-600',
      shadow:   'shadow-emerald-200 dark:shadow-emerald-900',
      bg:       'bg-emerald-50 dark:bg-emerald-900/20',
      border:   'border-emerald-100 dark:border-emerald-800',
    },
    {
      icon:     '📋',
      title:    t('feature4Title'),
      desc:     t('feature4Desc'),
      gradient: 'from-orange-500 to-red-500',
      shadow:   'shadow-orange-200 dark:shadow-orange-900',
      bg:       'bg-orange-50 dark:bg-orange-900/20',
      border:   'border-orange-100 dark:border-orange-800',
    },
    {
      icon:     '🍳',
      title:    t('feature5Title'),
      desc:     t('feature5Desc'),
      gradient: 'from-pink-500 to-rose-600',
      shadow:   'shadow-pink-200 dark:shadow-pink-900',
      bg:       'bg-pink-50 dark:bg-pink-900/20',
      border:   'border-pink-100 dark:border-pink-800',
    },
    {
      icon:     '📍',
      title:    t('feature6Title'),
      desc:     t('feature6Desc'),
      gradient: 'from-indigo-500 to-purple-600',
      shadow:   'shadow-indigo-200 dark:shadow-indigo-900',
      bg:       'bg-indigo-50 dark:bg-indigo-900/20',
      border:   'border-indigo-100 dark:border-indigo-800',
    },
    {
      icon:     '🚨',
      title:    'Emergency Center',
      desc:     'One tap sends WhatsApp alerts to all family members instantly',
      gradient: 'from-red-500 to-orange-600',
      shadow:   'shadow-red-200 dark:shadow-red-900',
      bg:       'bg-red-50 dark:bg-red-900/20',
      border:   'border-red-100 dark:border-red-800',
    },
    {
      icon:     '💬',
      title:    'Household Chat',
      desc:     'Real time chat between all household members with emoji support',
      gradient: 'from-teal-500 to-cyan-600',
      shadow:   'shadow-teal-200 dark:shadow-teal-900',
      bg:       'bg-teal-50 dark:bg-teal-900/20',
      border:   'border-teal-100 dark:border-teal-800',
    },
  ];

  const stats = [
    { value: '10+', label: 'Smart Features',  icon: '✨' },
    { value: '100%', label: 'Free to Use',    icon: '🎉' },
    { value: '2',   label: 'Languages',       icon: '🌐' },
    { value: '24/7', label: 'Smart Alerts',   icon: '🔔' },
  ];

  const benefits = [
    'Real-time WhatsApp notifications',
    'Tamil and English support',
    'Dark and Light mode',
    'Voice command support',
    'Location based alerts',
    'Family collaboration',
    'Emergency alert system',
    'Expense analytics charts',
  ];

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 overflow-x-hidden">

        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">🏠</span>
              </div>
              <div>
                <span className="font-extrabold text-xl bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                  SmartHome
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500 ml-1 hidden md:inline">
                  Management
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleLanguage}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-purple-100 to-cyan-100 dark:from-purple-900/50 dark:to-cyan-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
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
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                {t('login')}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
                className="px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg"
              >
                {t('getStarted')}
              </motion.button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">

          {/* Animated gradient blobs */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute -top-40 -right-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-20"
            />
            <motion.div
              animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-20"
            />
            <motion.div
              animate={{ x: [0, 30, 0], y: [0, -50, 0] }}
              transition={{ duration: 12, repeat: Infinity }}
              className="absolute top-1/2 left-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-20"
            />
          </div>

          {/* Floating grocery icons */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {['🥛', '🍅', '🥚', '🧅', '🍚', '🧹', '🥦', '🍌', '🧴', '🫙', '🍎', '🥕'].map((icon, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                style={{
                  left: `${5 + (i * 8)}%`,
                  top:  `${15 + (i % 4) * 20}%`,
                }}
                animate={{
                  y:       [0, -25, 0],
                  rotate:  [0, 15, -15, 0],
                  opacity: [0.15, 0.4, 0.15],
                }}
                transition={{
                  duration: 4 + i * 0.4,
                  repeat:   Infinity,
                  delay:    i * 0.3,
                }}
              >
                {icon}
              </motion.div>
            ))}
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-cyan-100 dark:from-purple-900/50 dark:to-cyan-900/50 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-sm font-medium mb-8"
              >
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                🚀 Smart Household Management System
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
                  {t('landingTitle')}
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
                {t('landingSubtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <motion.button
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/register')}
                  className="group px-8 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-2xl shadow-purple-200 dark:shadow-purple-900 flex items-center justify-center gap-2"
                >
                  {t('getStarted')}
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 rounded-2xl font-bold text-lg border-2 border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 backdrop-blur-sm"
                >
                  {t('login')} →
                </motion.button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-lg"
                  >
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-bold mb-4">
                ✨ Everything you need
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                All features in one
                <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent"> beautiful </span>
                platform
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                Everything your household needs to stay organized, connected and smart
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -8 }}
                  onHoverStart={() => setHoveredFeature(index)}
                  onHoverEnd={() => setHoveredFeature(null)}
                  className={`relative rounded-3xl p-6 border-2 ${feature.bg} ${feature.border} cursor-pointer overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl mb-4 shadow-lg ${feature.shadow} group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    {feature.desc}
                  </p>

                  {/* Arrow on hover */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: hoveredFeature === index ? 1 : 0, x: hoveredFeature === index ? 0 : -10 }}
                    className={`mt-4 text-sm font-bold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent flex items-center gap-1`}
                  >
                    Learn more <FiArrowRight size={14} />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 px-4 bg-gray-50 dark:bg-gray-950">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <span className="inline-block px-4 py-2 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 text-sm font-bold mb-4">
                  🎯 Why SmartHome?
                </span>
                <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
                  Everything your family needs in
                  <span className="bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent"> one app</span>
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-8">
                  SmartHome brings your entire household together with smart features, real-time alerts, and beautiful design.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {benefits.map((benefit, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center shrink-0">
                        <FiCheck size={12} className="text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                        {benefit}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { icon: '🛒', title: 'Smart Grocery',  value: '50+ items tracked',    gradient: 'from-purple-500 to-pink-500'   },
                  { icon: '💰', title: 'Budget Control', value: 'Monthly analytics',    gradient: 'from-cyan-500 to-blue-500'     },
                  { icon: '🚨', title: 'Emergency',      value: 'Instant WhatsApp',     gradient: 'from-red-500 to-orange-500'    },
                  { icon: '💬', title: 'Family Chat',    value: 'Real-time messages',   gradient: 'from-teal-500 to-emerald-500'  },
                  { icon: '📍', title: 'Location',       value: '100m store alerts',    gradient: 'from-indigo-500 to-purple-500' },
                  { icon: '🎤', title: 'Voice Control',  value: 'Hands-free commands',  gradient: 'from-pink-500 to-rose-500'     },
                ].map((card, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-5 text-white shadow-xl`}
                  >
                    <div className="text-3xl mb-2">{card.icon}</div>
                    <p className="font-bold text-sm">{card.title}</p>
                    <p className="text-white/70 text-xs mt-1">{card.value}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 rounded-3xl p-12 shadow-2xl overflow-hidden"
            >
              {/* Background pattern */}
              <div className="absolute inset-0 overflow-hidden">
                {['🏠', '🛒', '💰', '🔔', '👨‍👩‍👧'].map((icon, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-4xl opacity-10"
                    style={{ left: `${10 + i * 20}%`, top: `${20 + i * 10}%` }}
                    animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3 + i, repeat: Infinity }}
                  >
                    {icon}
                  </motion.div>
                ))}
              </div>

              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                  Ready to manage your home smarter?
                </h2>
                <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
                  Join families already using SmartHome to stay organized and connected
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/register')}
                    className="px-10 py-4 rounded-2xl font-extrabold text-lg bg-white text-purple-600 shadow-xl flex items-center justify-center gap-2"
                  >
                    {t('getStarted')} 🚀
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/login')}
                    className="px-10 py-4 rounded-2xl font-extrabold text-lg bg-white/20 text-white border-2 border-white/30"
                  >
                    {t('login')}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 px-4 bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
                  <span className="text-white text-sm">🏠</span>
                </div>
                <span className="font-extrabold text-lg bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                  SmartHome
                </span>
              </div>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                © 2025 SmartHome Management System. Built with ❤️ for Tamil families
              </p>
              <div className="flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleLanguage}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                >
                  {language === 'en' ? 'தமிழ்' : 'EN'}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTheme}
                  className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
                </motion.button>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default Landing;