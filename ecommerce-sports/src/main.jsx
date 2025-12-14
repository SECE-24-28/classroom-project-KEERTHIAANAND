import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

// Components (Pages)
import HomePage from './components/HomePage'
import ProductsPage from './components/ProductsPage'
import CartPage from './components/CartPage'
import OrdersPage from './components/OrdersPage'
import LoginPage from './components/LoginPage'
import AdminPage from './components/AdminPage'

// Protected Routes
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Route - Only logged in users */}
            <Route
                path="/orders"
                element={
                    <ProtectedRoute>
                        <OrdersPage />
                    </ProtectedRoute>
                }
            />

            {/* Admin Route - Only admin users */}
            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <AdminPage />
                    </AdminRoute>
                }
            />
        </Routes>
    </BrowserRouter>
)
