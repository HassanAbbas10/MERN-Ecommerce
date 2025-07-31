import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Sidebar } from "./components/Sidebar"
import Dashboard from "./Pages/Dashboard"
import Products from "./Pages/Products"
import AddProduct from "./Pages/AddProduct"
import UpdateProduct from "./Pages/UpdateProduct"
import Orders from "./Pages/Orders"
import Customers from "./Pages/Customers"
import Analytics from "./Pages/Analytics"
import "./App.css"

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-white">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/update-product/:id" element={<UpdateProduct />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
