import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import useSocket from '../../hooks/useSocket';

const Layout = ({ children }) => {
  const { theme }         = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize socket connection for real-time updates
  useSocket();

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">

        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Navbar */}
          <Navbar onMenuClick={() => setSidebarOpen(true)} />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
};

export default Layout;