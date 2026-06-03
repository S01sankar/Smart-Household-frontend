import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  onClick,
  hover = false,
  glass = false,
  gradient = false,
  gradientFrom = 'from-purple-600',
  gradientTo = 'to-cyan-600',
  neon = false,
  padding = 'p-6',
}) => {

  const baseClass = `
    rounded-2xl border shadow-lg
    ${padding}
    ${glass
      ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-white/20 dark:border-gray-700/50'
      : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'
    }
    ${gradient
      ? `bg-gradient-to-r ${gradientFrom} ${gradientTo} border-none text-white`
      : ''
    }
    ${neon ? 'neon-purple' : ''}
    ${hover ? 'cursor-pointer' : ''}
    ${className}
  `;

  if (hover) {
    return (
      <motion.div
        whileHover={{ scale: 1.03, y: -5 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={baseClass}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={baseClass}
    >
      {children}
    </motion.div>
  );
};

export default Card;