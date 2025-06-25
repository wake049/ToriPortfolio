import './App.css'
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../src/admin/LoginPage';
import ProtectedRoute from '../src/admin/ProtectedRoute';
import AdminDashboard from '../src/admin/AdminDashboard';
import HomePage from '../src/Homepage'; // your main site




function App() {
   return (
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
  );    
}

export default App;


