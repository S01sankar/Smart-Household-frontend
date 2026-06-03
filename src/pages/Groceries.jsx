import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import {
  getGroceries, addGrocery, updateGrocery,
  deleteGrocery, restockAll
} from '../utils/api';
import toast from 'react-hot-toast';
import {
  FiPlus, FiSearch, FiEdit2, FiTrash2,
  FiShoppingCart, FiX
} from 'react-icons/fi';

const categories = ['vegetables','fruits','dairy','grains','snacks','cleaning','other'];

const Groceries = () => {
  const { t } = useLanguage();

  const [groceries,    setGroceries]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [showModal,    setShowModal]    = useState(false);
  const [editItem,     setEditItem]     = useState(null);
  const [search,       setSearch]       = useState('');
  const [filterCat,    setFilterCat]    = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    name: '', category: 'other', quantity: '',
    unit: 'units', minThreshold: 1, price: '',
    purchaseDate: '', expiryDate: ''
  });

  useEffect(() => { fetchGroceries(); }, []);

  const fetchGroceries = async () => {
    try {
      const { data } = await getGroceries();
      setGroceries(data);
    } catch {
      toast.error('Failed to load groceries');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        const { data } = await updateGrocery(editItem._id, formData);
        setGroceries(groceries.map(g => g._id === editItem._id ? data : g));
        toast.success('Grocery updated! ✅');
      } else {
        const { data } = await addGrocery(formData);
        setGroceries([data, ...groceries]);
        toast.success('Grocery added! 🛒');
      }
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteGrocery(id);
      setGroceries(groceries.filter(g => g._id !== id));
      toast.success('Deleted! 🗑️');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleRestock = async () => {
    try {
      const { data } = await restockAll();
      toast.success(`${data.length} items need restocking! 🛒`);
    } catch {
      toast.error('Failed to get restock list');
    }
  };

  const openEdit = (item) => {
    setEditItem(item);
    setFormData({
      name:         item.name,
      category:     item.category,
      quantity:     item.quantity,
      unit:         item.unit,
      minThreshold: item.minThreshold,
      price:        item.price,
      purchaseDate: item.purchaseDate?.split('T')[0] || '',
      expiryDate:   item.expiryDate?.split('T')[0]   || ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditItem(null);
    setFormData({
      name: '', category: 'other', quantity: '',
      unit: 'units', minThreshold: 1, price: '',
      purchaseDate: '', expiryDate: ''
    });
  };

  const filtered = groceries.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = filterCat    === 'all' || g.category === filterCat;
    const matchStatus = filterStatus === 'all' || g.status   === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const statusColor = (status) => {
    if (status === 'empty') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    if (status === 'low')   return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
  };

  const categoryIcon = (category) => {
    if (category === 'vegetables') return '🥦';
    if (category === 'fruits')     return '🍎';
    if (category === 'dairy')      return '🥛';
    if (category === 'grains')     return '🌾';
    if (category === 'snacks')     return '🍪';
    if (category === 'cleaning')   return '🧹';
    return '📦';
  };

  const categoryBg = (category) => {
    if (category === 'vegetables') return 'bg-green-100 dark:bg-green-900/30';
    if (category === 'fruits')     return 'bg-orange-100 dark:bg-orange-900/30';
    if (category === 'dairy')      return 'bg-blue-100 dark:bg-blue-900/30';
    if (category === 'grains')     return 'bg-yellow-100 dark:bg-yellow-900/30';
    if (category === 'snacks')     return 'bg-pink-100 dark:bg-pink-900/30';
    if (category === 'cleaning')   return 'bg-cyan-100 dark:bg-cyan-900/30';
    return 'bg-purple-100 dark:bg-purple-900/30';
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
            {t('groceries')} 🛒
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {groceries.length} items total
          </p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleRestock}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800"
          >
            {t('restockAll')} 🔄
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg flex items-center gap-2"
          >
            <FiPlus size={16} />
            {t('addGrocery')}
          </motion.button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 border border-green-100 dark:border-green-800">
          <p className="text-green-600 dark:text-green-400 text-xs font-bold mb-1">✅ {t('inStock')}</p>
          <p className="text-3xl font-extrabold text-green-700 dark:text-green-400">
            {groceries.filter(g => g.status === 'in-stock').length}
          </p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-4 border border-yellow-100 dark:border-yellow-800">
          <p className="text-yellow-600 dark:text-yellow-400 text-xs font-bold mb-1">⚠️ {t('lowStock')}</p>
          <p className="text-3xl font-extrabold text-yellow-700 dark:text-yellow-400">
            {groceries.filter(g => g.status === 'low').length}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 border border-red-100 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400 text-xs font-bold mb-1">❌ {t('empty')}</p>
          <p className="text-3xl font-extrabold text-red-700 dark:text-red-400">
            {groceries.filter(g => g.status === 'empty').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder={t('search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Categories</option>
          {categories.map(c => (
            <option key={c} value={c}>{t(c)}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Status</option>
          <option value="in-stock">{t('inStock')}</option>
          <option value="low">{t('lowStock')}</option>
          <option value="empty">{t('empty')}</option>
        </select>
      </div>

      {/* Grocery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`relative rounded-3xl p-5 border-2 overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300 ${
                item.status === 'empty'
                  ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800'
                  : item.status === 'low'
                  ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-100 dark:border-yellow-800'
                  : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'
              }`}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-3xl ${
                item.status === 'empty' ? 'bg-gradient-to-br from-red-500 to-orange-500'    :
                item.status === 'low'   ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
                'bg-gradient-to-br from-purple-500 to-cyan-500'
              }`}></div>

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${categoryBg(item.category)}`}>
                    {categoryIcon(item.category)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{item.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{t(item.category)}</p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${statusColor(item.status)}`}>
                  {item.status === 'in-stock' ? '✅ ' + t('inStock') :
                   item.status === 'low'      ? '⚠️ ' + t('lowStock') :
                   '❌ ' + t('empty')}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-2 text-center border border-gray-100 dark:border-gray-700">
                  <p className="text-lg font-extrabold text-gray-900 dark:text-white">
                    {item.quantity}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.unit}</p>
                </div>
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-2 text-center border border-gray-100 dark:border-gray-700">
                  <p className="text-lg font-extrabold text-gray-900 dark:text-white">
                    ₹{item.price}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t('price')}</p>
                </div>
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-2 text-center border border-gray-100 dark:border-gray-700">
                  <p className="text-lg font-extrabold text-gray-900 dark:text-white">
                    {item.minThreshold}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Min</p>
                </div>
              </div>

              {/* Stock bar */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: item.status === 'empty' ? '2%' :
                                     item.status === 'low'   ? '25%' : '100%' }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-2 rounded-full ${
                      item.status === 'empty' ? 'bg-red-500'    :
                      item.status === 'low'   ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                  ></motion.div>
                </div>
              </div>

              {item.expiryDate && (
                <p className={`text-xs mb-3 flex items-center gap-1 ${
                  new Date(item.expiryDate) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                    ? 'text-red-500'
                    : 'text-orange-500'
                }`}>
                  ⏰ Expires: {new Date(item.expiryDate).toLocaleDateString()}
                </p>
              )}

              {/* Action buttons */}
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openEdit(item)}
                  className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg"
                >
                  <FiEdit2 size={14} />
                  {t('update')}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(item._id)}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-100 dark:border-red-800 hover:bg-red-100"
                >
                  <FiTrash2 size={14} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <FiShoppingCart size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No groceries found</p>
        </div>
      )}

      {/* Add/Edit Modal */}
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
                  {editItem ? t('update') : t('addGrocery')}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('groceryName')}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('quantity')}
                    </label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={e => setFormData({...formData, quantity: e.target.value})}
                      required
                      min="0"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('unit')}
                    </label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={e => setFormData({...formData, unit: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('price')} (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      min="0"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('minThreshold')}
                    </label>
                    <input
                      type="number"
                      value={formData.minThreshold}
                      onChange={e => setFormData({...formData, minThreshold: e.target.value})}
                      min="0"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('purchaseDate')}
                    </label>
                    <input
                      type="date"
                      value={formData.purchaseDate}
                      onChange={e => setFormData({...formData, purchaseDate: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('expiryDate')}
                    </label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-3 rounded-xl font-medium border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    {t('cancel')}
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-500 shadow-lg"
                  >
                    {editItem ? t('update') : t('add')}
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

export default Groceries;