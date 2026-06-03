// Format currency in Indian Rupees
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style:    'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format date
  export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day:   'numeric',
      month: 'short',
      year:  'numeric',
    });
  };
  
  // Format date and time
  export const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      day:    'numeric',
      month:  'short',
      year:   'numeric',
      hour:   '2-digit',
      minute: '2-digit',
    });
  };
  
  // Get days until expiry
  export const getDaysUntilExpiry = (expiryDate) => {
    const today  = new Date();
    const expiry = new Date(expiryDate);
    const diff   = expiry - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };
  
  // Get expiry status color
  export const getExpiryColor = (expiryDate) => {
    const days = getDaysUntilExpiry(expiryDate);
    if (days <= 0)  return 'text-red-500';
    if (days <= 3)  return 'text-orange-500';
    if (days <= 7)  return 'text-yellow-500';
    return 'text-green-500';
  };
  
  // Get stock status color
  export const getStockColor = (status) => {
    if (status === 'empty')    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    if (status === 'low')      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
  };
  
  // Get priority color
  export const getPriorityColor = (priority) => {
    if (priority === 'high')   return 'text-red-500 bg-red-50 dark:bg-red-900/20';
    if (priority === 'medium') return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
    return 'text-green-500 bg-green-50 dark:bg-green-900/20';
  };
  
  // Get bill status color
  export const getBillStatusColor = (status) => {
    if (status === 'paid')    return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    if (status === 'overdue') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
  };
  
  // Get category icon
  export const getCategoryIcon = (category) => {
    const icons = {
      vegetables: '🥦',
      fruits:     '🍎',
      dairy:      '🥛',
      grains:     '🌾',
      snacks:     '🍪',
      cleaning:   '🧹',
      utility:    '💡',
      other:      '📦',
    };
    return icons[category] || '📦';
  };
  
  // Get bill category icon
  export const getBillCategoryIcon = (category) => {
    const icons = {
      electricity: '⚡',
      water:       '💧',
      gas:         '🔥',
      internet:    '🌐',
      rent:        '🏠',
      other:       '📋',
    };
    return icons[category] || '📋';
  };
  
  // Calculate budget percentage
  export const getBudgetPercentage = (spent, budget) => {
    if (!budget) return 0;
    return Math.min(Math.round((spent / budget) * 100), 100);
  };
  
  // Get budget color
  export const getBudgetColor = (percentage) => {
    if (percentage >= 90) return 'from-red-500 to-red-600';
    if (percentage >= 70) return 'from-yellow-500 to-orange-500';
    return 'from-green-500 to-teal-500';
  };
  
  // Truncate text
  export const truncateText = (text, maxLength = 30) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  // Get greeting based on time
  export const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };
  
  // Get Tamil greeting based on time
  export const getTamilGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'காலை வணக்கம்';
    if (hour < 17) return 'மதிய வணக்கம்';
    return 'மாலை வணக்கம்';
  };
  
  // Check if item is expiring soon
  export const isExpiringSoon = (expiryDate) => {
    const days = getDaysUntilExpiry(expiryDate);
    return days <= 3 && days >= 0;
  };
  
  // Check if item is expired
  export const isExpired = (expiryDate) => {
    return getDaysUntilExpiry(expiryDate) < 0;
  };
  
  // Generate random color for charts
  export const chartColors = [
    '#8b5cf6',
    '#06b6d4',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#ec4899',
    '#6366f1',
    '#14b8a6',
  ];
  
  // Format phone number
  export const formatPhone = (phone) => {
    if (!phone) return '';
    return phone.replace(/(\d{5})(\d{5})/, '$1 $2');
  };
  
  // Capitalize first letter
  export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };