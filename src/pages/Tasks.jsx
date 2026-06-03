import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { getTasks, addTask, updateTask, deleteTask, getMembers } from '../utils/api';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiCheckSquare, FiX, FiClock, FiUser } from 'react-icons/fi';

const Tasks = () => {
  const { t } = useLanguage();

  const [tasks,     setTasks]     = useState([]);
  const [members,   setMembers]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '', assignedTo: '', deadline: '', priority: 'medium'
  });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [tk, m] = await Promise.all([getTasks(), getMembers()]);
      setTasks(tk.data);
      setMembers(m.data);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await addTask(formData);
      setTasks([data, ...tasks]);
      toast.success('Task assigned! ✅');
      setShowModal(false);
      setFormData({ title: '', assignedTo: '', deadline: '', priority: 'medium' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleComplete = async (id) => {
    try {
      const { data } = await updateTask(id, { status: 'completed' });
      setTasks(tasks.map(t => t._id === id ? data : t));
      toast.success('Task completed! 🎉');
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(t => t._id !== id));
      toast.success('Deleted! 🗑️');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const pendingTasks   = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const priorityConfig = {
    high:   { color: 'from-red-500 to-orange-500',    bg: 'bg-red-50 dark:bg-red-900/20',     border: 'border-red-100 dark:border-red-800',     text: 'text-red-600 dark:text-red-400',     dot: 'bg-red-500'    },
    medium: { color: 'from-yellow-500 to-orange-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-100 dark:border-yellow-800', text: 'text-yellow-600 dark:text-yellow-400', dot: 'bg-yellow-500' },
    low:    { color: 'from-green-500 to-teal-500',    bg: 'bg-green-50 dark:bg-green-900/20',   border: 'border-green-100 dark:border-green-800',   text: 'text-green-600 dark:text-green-400',   dot: 'bg-green-500'  },
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
            {t('tasks')} ✅
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {pendingTasks.length} pending tasks
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg flex items-center gap-2"
        >
          <FiPlus size={16} />
          {t('addTask')}
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.03, y: -3 }}
          className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-5 border-2 border-orange-100 dark:border-orange-800 shadow-lg"
        >
          <p className="text-orange-600 dark:text-orange-400 text-xs font-bold mb-1">⏳ {t('pending')}</p>
          <p className="text-3xl font-extrabold text-orange-700 dark:text-orange-400">{pendingTasks.length}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.03, y: -3 }}
          className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-5 border-2 border-green-100 dark:border-green-800 shadow-lg"
        >
          <p className="text-green-600 dark:text-green-400 text-xs font-bold mb-1">✅ {t('completed')}</p>
          <p className="text-3xl font-extrabold text-green-700 dark:text-green-400">{completedTasks.length}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.03, y: -3 }}
          className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-5 border-2 border-purple-100 dark:border-purple-800 shadow-lg"
        >
          <p className="text-purple-600 dark:text-purple-400 text-xs font-bold mb-1">📊 Total</p>
          <p className="text-3xl font-extrabold text-purple-700 dark:text-purple-400">{tasks.length}</p>
        </motion.div>
      </div>

      {/* Pending Tasks Grid */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FiClock className="text-orange-500" />
          {t('pending')} ({pendingTasks.length})
        </h2>
        {pendingTasks.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            <FiCheckSquare size={40} className="mx-auto text-gray-300 dark:text-gray-700 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No pending tasks! 🎉</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingTasks.map((task, index) => {
              const config = priorityConfig[task.priority] || priorityConfig.medium;
              return (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`relative rounded-3xl p-5 border-2 ${config.bg} ${config.border} overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-3xl`}></div>

                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`w-3 h-3 rounded-full ${config.dot}`}
                      ></motion.div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full bg-white/60 dark:bg-gray-800/60 ${config.text}`}>
                        {t(task.priority)} priority
                      </span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleComplete(task._id)}
                      className="w-7 h-7 rounded-full border-2 border-purple-400 hover:bg-purple-500 hover:border-purple-500 transition-all flex items-center justify-center group/btn"
                    >
                      <FiCheckSquare size={14} className="text-purple-400 group-hover/btn:text-white" />
                    </motion.button>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-3 leading-tight">
                    {task.title}
                  </h3>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    {task.assignedTo && (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
                          <FiUser size={10} className="text-white" />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {task.assignedTo?.name || 'Unassigned'}
                        </span>
                      </div>
                    )}
                    {task.deadline && (
                      <div className="flex items-center gap-2">
                        <FiClock size={14} className="text-orange-500" />
                        <span className="text-sm text-orange-500 font-medium">
                          {new Date(task.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {task.assignedBy && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Assigned by {task.assignedBy?.name}
                      </p>
                    )}
                  </div>

                  {/* Delete button */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(task._id)}
                    className="w-full flex items-center justify-center gap-1 py-2 rounded-xl text-sm font-medium bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-100 dark:border-red-800 hover:bg-red-100"
                  >
                    <FiTrash2 size={14} />
                    {t('delete')}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiCheckSquare className="text-green-500" />
            {t('completed')} ({completedTasks.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedTasks.map((task, index) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="relative rounded-3xl p-5 border-2 bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <h3 className="font-medium text-gray-400 dark:text-gray-500 line-through">
                    {task.title}
                  </h3>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(task._id)}
                  className="w-full flex items-center justify-center gap-1 py-2 rounded-xl text-sm font-medium bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-100 dark:border-red-800"
                >
                  <FiTrash2 size={14} />
                  {t('delete')}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Add Task Modal */}
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
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('addTask')}
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
                    {t('taskTitle')}
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('assignedTo')}
                  </label>
                  <select
                    value={formData.assignedTo}
                    onChange={e => setFormData({...formData, assignedTo: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select member</option>
                    {members.map(m => (
                      <option key={m._id} value={m._id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('priority')}
                    </label>
                    <select
                      value={formData.priority}
                      onChange={e => setFormData({...formData, priority: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="low">{t('low')}</option>
                      <option value="medium">{t('medium')}</option>
                      <option value="high">{t('high')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('deadline')}
                    </label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={e => setFormData({...formData, deadline: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
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

export default Tasks;