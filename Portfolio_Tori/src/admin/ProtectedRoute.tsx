import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('adminToken');
  return token === 'admin-logged-in' ? children : <Navigate to="/login" />;
}