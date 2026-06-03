import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { register } from '../utils/api';
import toast from 'react-hot-toast';
import {
  FiUser, FiMail, FiPhone, FiLock,
  FiEye, FiEyeOff, FiHome, FiSun, FiMoon,
  FiCheck
} from 'react-icons/fi';

const Register = () => {
  const navigate                        = useNavigate();
  const { loginUser }                   = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme }          = useTheme();

  const [step,         setStep]         = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [focused,      setFocused]      = useState('');

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '',
    password: '', confirmPassword: '', householdName: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    setLoading(true);
    try {
      const { data } = await register(formData);
      loginUser(data.token, data.user);
      toast.success(`Welcome ${data.user.name}! 🎉`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone) {
        toast.error('Please fill all fields');
        return;
      }
    }
    setStep(step + 1);
  };

  const floatingItems = ['🛒','🥛','🍅','🥚','🧅','🍚','🧹','🥦','🍌','🧴'];

  const inputClass = (field) => `w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 focus:outline-none ${
    focused === field
      ? 'border-purple-500 shadow-lg shadow-purple-100 dark:shadow-purple-900/20'
      : 'border-gray-200 dark:border-gray-700'
  }`;

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex overflow-hidden">

        {/* Left Side — Animated Banner */}
        <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 overflow-hidden">

          {/* Animated blobs */}
          <motion.div
            animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 9, repeat: Infinity }}
            className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full"
          />
          <motion.div
            animate={{ x: [0, -50, 0], y: [0, 50, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 11, repeat: Infinity }}
            className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full"
          />

          {/* Floating grocery icons */}
          {floatingItems.map((icon, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl"
              style={{
                left: `${8 + (i * 9)}%`,
                top:  `${8 + (i % 5) * 18}%`,
              }}
              animate={{
                y:       [0, -25, 0],
                rotate:  [0, 20, -20, 0],
                opacity: [0.2, 0.6, 0.2],
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
          <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-8xl mb-6"
              >
                🏠
              </motion.div>
              <h1 className="text-4xl font-extrabold mb-4">
                Join SmartHome!
              </h1>
              <p className="text-white/80 text-lg mb-8 max-w-sm">
                Set up your household and start managing smarter today
              </p>

              {/* Benefits */}
              <div className="space-y-3 text-left">
                {[
                  '✅ Free to use forever',
                  '🔔 Real-time WhatsApp alerts',
                  '👨‍👩‍👧 Family collaboration',
                  '🌐 Tamil & English support',
                  '🚨 Emergency alert system',
                  '💬 Household chat',
                ].map((benefit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-2 text-white/90 text-sm"
                  >
                    <span>{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side — Register Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative overflow-y-auto">

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
            className="relative w-full max-w-md py-6"
          >

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
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
            <div className="mb-6">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                {t('register')} 🎉
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                {t('alreadyHaveAccount')}{' '}
                <Link to="/login" className="text-purple-600 dark:text-purple-400 font-bold hover:underline">
                  {t('loginHere')}
                </Link>
              </p>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center gap-2 mb-8">
              {[1, 2].map((s) => (
                <React.Fragment key={s}>
                  <motion.div
                    animate={{ scale: step === s ? 1.1 : 1 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      step > s
                        ? 'bg-green-500 text-white'
                        : step === s
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}
                  >
                    {step > s ? <FiCheck size={14} /> : s}
                  </motion.div>
                  {s < 2 && (
                    <div className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                      step > s ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                  )}
                </React.Fragment>
              ))}
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                Step {step} of 2
              </span>
            </div>

            {/* Form Steps */}
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">

                {/* Step 1 — Personal Info */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        {t('name')}
                      </label>
                      <div className={`relative transition-all ${focused === 'name' ? 'scale-[1.01]' : ''}`}>
                        <FiUser className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focused === 'name' ? 'text-purple-500' : 'text-gray-400'}`} size={18} />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          onFocus={() => setFocused('name')}
                          onBlur={() => setFocused('')}
                          required
                          placeholder="Your full name"
                          className={inputClass('name')}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        {t('email')}
                      </label>
                      <div className={`relative transition-all ${focused === 'email' ? 'scale-[1.01]' : ''}`}>
                        <FiMail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focused === 'email' ? 'text-purple-500' : 'text-gray-400'}`} size={18} />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          onFocus={() => setFocused('email')}
                          onBlur={() => setFocused('')}
                          required
                          placeholder="your@email.com"
                          className={inputClass('email')}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        {t('phone')}
                      </label>
                      <div className={`relative transition-all ${focused === 'phone' ? 'scale-[1.01]' : ''}`}>
                        <FiPhone className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focused === 'phone' ? 'text-purple-500' : 'text-gray-400'}`} size={18} />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                          onFocus={() => setFocused('phone')}
                          onBlur={() => setFocused('')}
                          required
                          placeholder="9999999999"
                          className={inputClass('phone')}
                        />
                      </div>
                    </div>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={nextStep}
                      className="w-full py-4 rounded-2xl font-extrabold text-white bg-gradient-to-r from-purple-600 to-cyan-500 shadow-xl text-lg mt-2"
                    >
                      Next Step →
                    </motion.button>
                  </motion.div>
                )}

                {/* Step 2 — Password & Household */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        {t('householdName')}
                      </label>
                      <div className={`relative transition-all ${focused === 'household' ? 'scale-[1.01]' : ''}`}>
                        <FiHome className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focused === 'household' ? 'text-purple-500' : 'text-gray-400'}`} size={18} />
                        <input
                          type="text"
                          value={formData.householdName}
                          onChange={e => setFormData({...formData, householdName: e.target.value})}
                          onFocus={() => setFocused('household')}
                          onBlur={() => setFocused('')}
                          placeholder="My Home"
                          className={inputClass('household')}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        {t('password')}
                      </label>
                      <div className={`relative transition-all ${focused === 'password' ? 'scale-[1.01]' : ''}`}>
                        <FiLock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focused === 'password' ? 'text-purple-500' : 'text-gray-400'}`} size={18} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={e => setFormData({...formData, password: e.target.value})}
                          onFocus={() => setFocused('password')}
                          onBlur={() => setFocused('')}
                          required
                          placeholder="••••••••"
                          className={`${inputClass('password')} pr-12`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500"
                        >
                          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        {t('confirmPassword')}
                      </label>
                      <div className={`relative transition-all ${focused === 'confirm' ? 'scale-[1.01]' : ''}`}>
                        <FiLock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focused === 'confirm' ? 'text-purple-500' : 'text-gray-400'}`} size={18} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                          onFocus={() => setFocused('confirm')}
                          onBlur={() => setFocused('')}
                          required
                          placeholder="••••••••"
                          className={inputClass('confirm')}
                        />
                        {formData.confirmPassword && (
                          <div className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center ${
                            formData.password === formData.confirmPassword
                              ? 'bg-green-500'
                              : 'bg-red-500'
                          }`}>
                            <FiCheck size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setStep(1)}
                        className="flex-1 py-4 rounded-2xl font-bold border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        ← Back
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-4 rounded-2xl font-extrabold text-white bg-gradient-to-r from-purple-600 to-cyan-500 shadow-xl disabled:opacity-50 text-lg"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            Creating...
                          </div>
                        ) : (
                          `${t('register')} 🎉`
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;