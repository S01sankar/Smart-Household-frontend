import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

// Pages
import Landing       from './pages/Landing';
import Login         from './pages/Login';
import Register      from './pages/Register';
import Dashboard     from './pages/Dashboard';
import Groceries     from './pages/Groceries';
import Expenses      from './pages/Expenses';
import Tasks         from './pages/Tasks';
import Bills         from './pages/Bills';
import Recipes       from './pages/Recipes';
import Household     from './pages/Household';
import Notifications from './pages/Notifications';
import Emergency     from './pages/Emergency';
import Chat          from './pages/Chat';
import Settings      from './pages/Settings';

// Layout
import Layout from './components/layout/Layout';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 to-cyan-900">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-400"></div>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 to-cyan-900">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-400"></div>
    </div>
  );
  return !user ? children : <Navigate to="/dashboard" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/"              element={<Landing />} />
      <Route path="/login"         element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register"      element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/dashboard"     element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/groceries"     element={<ProtectedRoute><Layout><Groceries /></Layout></ProtectedRoute>} />
      <Route path="/expenses"      element={<ProtectedRoute><Layout><Expenses /></Layout></ProtectedRoute>} />
      <Route path="/tasks"         element={<ProtectedRoute><Layout><Tasks /></Layout></ProtectedRoute>} />
      <Route path="/bills"         element={<ProtectedRoute><Layout><Bills /></Layout></ProtectedRoute>} />
      <Route path="/recipes"       element={<ProtectedRoute><Layout><Recipes /></Layout></ProtectedRoute>} />
      <Route path="/household"     element={<ProtectedRoute><Layout><Household /></Layout></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Layout><Notifications /></Layout></ProtectedRoute>} />
      <Route path="/emergency"     element={<ProtectedRoute><Layout><Emergency /></Layout></ProtectedRoute>} />
      <Route path="/chat"          element={<ProtectedRoute><Layout><Chat /></Layout></ProtectedRoute>} />
      <Route path="/settings"      element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#1e1b4b',
                  color:      '#fff',
                  border:     '1px solid rgba(139, 92, 246, 0.3)',
                },
              }}
            />
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;