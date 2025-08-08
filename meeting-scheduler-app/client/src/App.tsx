import Dashboard from '@/components/pages/Dashboard';
import Login from '@/components/pages/Login';
import Register from '@/components/pages/Register';
import { useAuthContext } from '@/context/AuthContext';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

/**
 * Private Route
 * Protects the route from unauthorized access
 * @param {JSX.Element} children - The children to render
 * @returns {JSX.Element} The private route
 */
function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

/**
 * App
 * @returns {JSX.Element} The app
 */
export default function App(): JSX.Element {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
