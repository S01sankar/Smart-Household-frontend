import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ size = 'md', text = 'Loading...' , fullScreen = false }) => {

  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const Spinner = () => (
    <div className="flex flex-col items-center justify-center gap-4">

      {/* Outer ring */}
      <div className="relative">
        <div className={`${sizes[size]} rounded-full border-4 border-purple-100 dark:border-purple-900`}></div>
        <div className={`absolute inset-0 ${sizes[size]} rounded-full border-4 border-t-purple-600 border-r-cyan-500 border-b-pink-500 border-l-transparent animate-spin`}></div>

        {/* Inner glow */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 opacity-20 animate-pulse"></div>

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg">🏠</span>
        </div>
      </div>

      {/* Floating dots */}
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 0.6,
              repeat:   Infinity,
              delay:    i * 0.2,
            }}
            className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
          />
        ))}
      </div>

      {text && (
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <Spinner />
    </div>
  );
};

export default Loader;