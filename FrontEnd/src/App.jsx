import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Sidebar } from "./components/Sidebar"
import Dashboard from "./Pages/Dashboard"
import Products from "./Pages/Products"
import AddProduct from "./Pages/AddProduct"
import UpdateProduct from "./Pages/UpdateProduct"
import Orders from "./Pages/Orders"
import Customers from "./Pages/Customers"
import Analytics from "./Pages/Analytics"
import CustomizationManagement from "./Pages/CustomizationManagement"
import Login from "./Pages/Login"
import Signup from "./Pages/Signup"
import { AuthProvider, useAuth } from "./context/AuthContext"
import "./App.css"

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Main Admin Layout
const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/update-product/:id" element={<UpdateProduct />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/customization-management" element={<CustomizationManagement />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected admin routes */}
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
