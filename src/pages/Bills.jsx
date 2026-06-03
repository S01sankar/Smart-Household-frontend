import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { getBills, addBill, deleteBill, markBillAsPaid } from '../utils/api';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiCreditCard, FiX, FiCheck } from 'react-icons/fi';

const categories = ['electricity','water','gas','internet','rent','other'];

const Bills = () => {
  const { t } = useLanguage();

  const [bills,     setBills]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '', amount: '', dueDate: '',
    category: 'electricity', isRecurring: false,
    recurringDay: '', notes: ''
  });

  useEffect(() => { fetchBills(); }, []);

  const fetchBills = async () => {
    try {
      const { data } = await getBills();
      setBills(data);
    } catch {
      toast.error('Failed to load bills');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await addBill(formData);
      setBills([data, ...bills]);
      toast.success('Bill added! 📋');
      setShowModal(false);
      setFormData({
        name: '', amount: '', dueDate: '',
        category: 'electricity', isRecurring: false,
        recurringDay: '', notes: ''
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBill(id);
      setBills(bills.filter(b => b._id !== id));
      toast.success('Deleted! 🗑️');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      const { data } = await markBillAsPaid(id);
      setBills(bills.map(b => b._id === id ? data : b));
      toast.success('Bill marked as paid! ✅');
    } catch {
      toast.error('Failed to update bill');
    }
  };

  const categoryConfig = {
    electricity: { icon: '⚡', gradient: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-100 dark:border-yellow-800' },
    water:       { icon: '💧', gradient: 'from-blue-500 to-cyan-500',     bg: 'bg-blue-50 dark:bg-blue-900/20',     border: 'border-blue-100 dark:border-blue-800'     },
    gas:         { icon: '🔥', gradient: 'from-red-500 to-orange-500',    bg: 'bg-red-50 dark:bg-red-900/20',       border: 'border-red-100 dark:border-red-800'       },
    internet:    { icon: '🌐', gradient: 'from-purple-500 to-indigo-500', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-100 dark:border-purple-800' },
    rent:        { icon: '🏠', gradient: 'from-green-500 to-teal-500',    bg: 'bg-green-50 dark:bg-green-900/20',   border: 'border-green-100 dark:border-green-800'   },
    other:       { icon: '📋', gradient: 'from-gray-500 to-gray-600',     bg: 'bg-gray-50 dark:bg-gray-900/20',     border: 'border-gray-100 dark:border-gray-800'     },
  };

  const unpaidBills  = bills.filter(b => b.status === 'unpaid');
  const overdueBills = bills.filter(b => b.status === 'overdue');
  const paidBills    = bills.filter(b => b.status === 'paid');

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
            {t('bills')} 📋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {unpaidBills.length + overdueBills.length} bills pending
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg flex items-center gap-2"
        >
          <FiPlus size={16} />
          {t('addBill')}
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.03, y: -3 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-5 border-2 border-yellow-100 dark:border-yellow-800 shadow-lg"
        >
          <p className="text-yellow-600 dark:text-yellow-400 text-xs font-bold mb-1">⏳ {t('unpaid')}</p>
          <p className="text-3xl font-extrabold text-yellow-700 dark:text-yellow-400">{unpaidBills.length}</p>
          <p className="text-xs text-yellow-500 mt-1">₹{unpaidBills.reduce((a, b) => a + b.amount, 0)}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.03, y: -3 }}
          className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-5 border-2 border-red-100 dark:border-red-800 shadow-lg"
        >
          <p className="text-red-600 dark:text-red-400 text-xs font-bold mb-1">🚨 {t('overdue')}</p>
          <p className="text-3xl font-extrabold text-red-700 dark:text-red-400">{overdueBills.length}</p>
          <p className="text-xs text-red-500 mt-1">₹{overdueBills.reduce((a, b) => a + b.amount, 0)}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.03, y: -3 }}
          className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-5 border-2 border-green-100 dark:border-green-800 shadow-lg"
        >
          <p className="text-green-600 dark:text-green-400 text-xs font-bold mb-1">✅ {t('paid')}</p>
          <p className="text-3xl font-extrabold text-green-700 dark:text-green-400">{paidBills.length}</p>
          <p className="text-xs text-green-500 mt-1">₹{paidBills.reduce((a, b) => a + b.amount, 0)}</p>
        </motion.div>
      </div>

      {/* Bills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bills.length === 0 ? (
          <div className="col-span-3 text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            <FiCreditCard size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No bills yet</p>
          </div>
        ) : (
          bills.map((bill, index) => {
            const config = categoryConfig[bill.category] || categoryConfig.other;
            return (
              <motion.div
                key={bill._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`relative rounded-3xl p-5 border-2 ${config.bg} ${config.border} overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-3xl`}></div>

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                      {config.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{bill.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{t(bill.category)}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                    bill.status === 'paid'    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    bill.status === 'overdue' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {bill.status === 'paid' ? '✅ ' : bill.status === 'overdue' ? '🚨 ' : '⏳ '}
                    {t(bill.status)}
                  </span>
                </div>

                {/* Amount */}
                <div className="mb-4">
                  <p className={`text-3xl font-extrabold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                    ₹{bill.amount}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                    📅 Due: {new Date(bill.dueDate).toLocaleDateString()}
                  </p>
                </div>

                {bill.isRecurring && (
                  <div className="mb-4">
                    <span className="text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-full border border-purple-100 dark:border-purple-800">
                      🔄 Recurring — Day {bill.recurringDay}
                    </span>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2">
                  {bill.status !== 'paid' && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleMarkPaid(bill._id)}
                      className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg"
                    >
                      <FiCheck size={14} />
                      {t('markAsPaid')}
                    </motion.button>
                  )}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(bill._id)}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-100 dark:border-red-800 hover:bg-red-100"
                  >
                    <FiTrash2 size={14} />
                  </motion.button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Add Bill Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('addBill')}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('billName')}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('billAmount')} (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={e => setFormData({...formData, amount: e.target.value})}
                      required
                      min="0"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('category')}
                    </label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {categories.map(c => (
                        <option key={c} value={c}>{t(c)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('dueDate')}
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={e => setFormData({...formData, dueDate: e.target.value})}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    checked={formData.isRecurring}
                    onChange={e => setFormData({...formData, isRecurring: e.target.checked})}
                    className="w-4 h-4 accent-purple-600"
                  />
                  <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Recurring monthly bill
                  </label>
                </div>

                {formData.isRecurring && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Recurring Day (1-31)
                    </label>
                    <input
                      type="number"
                      value={formData.recurringDay}
                      onChange={e => setFormData({...formData, recurringDay: e.target.value})}
                      min="1"
                      max="31"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('notes')}
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
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

    </div>
  );
};

export default Bills;