import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { getAllRecipes, searchRecipe, addCustomRecipe, deleteCustomRecipe } from '../utils/api';
import toast from 'react-hot-toast';
import { FiSearch, FiPlus, FiTrash2, FiX } from 'react-icons/fi';

const Recipes = () => {
  const { t } = useLanguage();

  const [recipes,     setRecipes]     = useState([]);
  const [selected,    setSelected]    = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');
  const [showModal,   setShowModal]   = useState(false);
  const [searching,   setSearching]   = useState(false);

  const [formData, setFormData] = useState({
    name: '', category: 'other', ingredients: [
      { name: '', quantity: '', unit: 'units', category: 'other' }
    ]
  });

  useEffect(() => { fetchRecipes(); }, []);

  const fetchRecipes = async () => {
    try {
      const { data } = await getAllRecipes();
      setRecipes(data);
    } catch {
      toast.error('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) return;
    setSearching(true);
    try {
      const { data } = await searchRecipe(search);
      setSelected(data);
    } catch {
      toast.error('Recipe not found');
    } finally {
      setSearching(false);
    }
  };

  const handleAddCustom = async (e) => {
    e.preventDefault();
    try {
      const { data } = await addCustomRecipe(formData);
      setRecipes([...recipes, data]);
      toast.success('Custom recipe added! 🍳');
      setShowModal(false);
      setFormData({
        name: '', category: 'other', ingredients: [
          { name: '', quantity: '', unit: 'units', category: 'other' }
        ]
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDeleteCustom = async (id) => {
    try {
      await deleteCustomRecipe(id);
      setRecipes(recipes.filter(r => r._id !== id));
      toast.success('Deleted! 🗑️');
    } catch {
      toast.error('Cannot delete default recipes');
    }
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: '', quantity: '', unit: 'units', category: 'other' }]
    });
  };

  const updateIngredient = (index, field, value) => {
    const updated = formData.ingredients.map((ing, i) =>
      i === index ? { ...ing, [field]: value } : ing
    );
    setFormData({ ...formData, ingredients: updated });
  };

  const removeIngredient = (index) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index)
    });
  };

  const categoryIcon = (cat) => {
    if (cat === 'south indian')    return '🍛';
    if (cat === 'non vegetarian')  return '🍖';
    if (cat === 'breakfast')       return '🌅';
    if (cat === 'rice')            return '🍚';
    if (cat === 'bread')           return '🍞';
    return '🍳';
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
            {t('recipes')} 🍳
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {recipes.length} recipes available
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg flex items-center gap-2"
        >
          <FiPlus size={16} />
          {t('addCustomRecipe')}
        </motion.button>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder={t('searchRecipe')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSearch}
          disabled={searching}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium text-sm"
        >
          {searching ? '...' : t('search')}
        </motion.button>
      </div>

      {/* Selected Recipe Detail */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-purple-200 dark:border-purple-800"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {selected.name}
            </h2>
            <button
              onClick={() => setSelected(null)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
            >
              <FiX size={18} />
            </button>
          </div>

          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t('ingredients')}:
          </h3>
          <div className="space-y-2">
            {selected.ingredients.map((ing, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  ing.inStock === false
                    ? 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800'
                    : 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800'
                }`}
              >
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {ing.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {ing.quantity} {ing.unit}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    ing.inStock === false
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {ing.inStock === false ? '❌ Need to buy' : '✅ In stock'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe, index) => (
          <motion.div
            key={recipe._id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02, y: -3 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-800 cursor-pointer"
            onClick={() => {
              setSearch(recipe.name);
              setSelected(null);
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl shadow-lg">
                {categoryIcon(recipe.category)}
              </div>
              {recipe._id && !recipe.isDefault && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCustom(recipe._id);
                  }}
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <FiTrash2 size={14} />
                </motion.button>
              )}
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">{recipe.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize mb-3">{recipe.category}</p>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              {recipe.ingredients.length} ingredients
            </p>
          </motion.div>
        ))}
      </div>

      {/* Add Custom Recipe Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('addCustomRecipe')}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleAddCustom} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Recipe Name
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
                  <input
                    type="text"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    placeholder="e.g. south indian, breakfast"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('ingredients')}
                    </label>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={addIngredient}
                      className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1"
                    >
                      <FiPlus size={12} /> Add more
                    </motion.button>
                  </div>
                  <div className="space-y-2">
                    {formData.ingredients.map((ing, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Name"
                          value={ing.name}
                          onChange={e => updateIngredient(index, 'name', e.target.value)}
                          required
                          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                          type="number"
                          placeholder="Qty"
                          value={ing.quantity}
                          onChange={e => updateIngredient(index, 'quantity', e.target.value)}
                          required
                          className="w-16 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                          type="text"
                          placeholder="Unit"
                          value={ing.unit}
                          onChange={e => updateIngredient(index, 'unit', e.target.value)}
                          className="w-20 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        {formData.ingredients.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeIngredient(index)}
                            className="p-2 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <FiX size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
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

export default Recipes;