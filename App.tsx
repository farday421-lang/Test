import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Landing } from './pages/Landing';
import { AuthPage } from './pages/Auth';
import { Builder } from './pages/Builder';
import { PortfolioView } from './pages/Portfolio';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const DashboardRedirect = () => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Navigate to="/builder" /> : <Navigate to="/login" />;
}

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/signup" element={<AuthPage />} />
              <Route path="/p/:username" element={<PortfolioView />} />

              {/* Protected Routes */}
              <Route 
                path="/builder" 
                element={
                  <ProtectedRoute>
                    <Builder />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                    <ProtectedRoute>
                        <Navigate to="/builder" replace />
                    </ProtectedRoute>
                } 
               />
               
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;