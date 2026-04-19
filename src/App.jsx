import './App.css'
import Comp from './Comp'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './Login';
import Register from './Register';
import AdminDashboard from './AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {


  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
        
        {/* Protected Reviewer Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={["reviewer"]}>
              <Comp />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Admin Dashboard */}
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
