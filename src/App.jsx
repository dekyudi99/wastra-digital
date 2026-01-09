import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './contexts/CartContext'
import { UserProvider } from './contexts/UserContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import { USER_ROLES } from './utils/authRoles'

import LandingPage from './pages/LandingPage'
import ProductCatalog from './pages/ProductCatalog'
import ProductDetail from './pages/ProductDetail'
import ArtisanProfile from './pages/ArtisanProfile'
import AdminDashboard from './pages/AdminDashboard'
import AuthOnboarding from './pages/AuthOnboarding'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Notifications from './pages/Notifications'
import ChatDetail from './pages/ChatDetail'
import UserProfile from './pages/UserProfile'
import OrderHistory from './pages/OrderHistory'
import AddressManagement from './pages/AddressManagement'
import ForgotPassword from './pages/ForgotPassword'
import ArtisanDashboard from './pages/ArtisanDashboard'
import ArtisanProducts from './pages/ArtisanProducts'
import ArtisanOrders from './pages/ArtisanOrders'
import ArtisanProfilePage from './pages/ArtisanProfile'



function App() {
  return (
    <Router>
      <UserProvider>
        <CartProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/produk" element={<ProductCatalog />} />
              <Route path="/produk/:id" element={<ProductDetail />} />
              <Route path="/artisan/:id" element={<ArtisanProfile />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireRole={USER_ROLES.ADMIN}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="/onboarding" element={<AuthOnboarding />} />
              <Route path="/masuk" element={<LoginPage />} />
              <Route path="/daftar" element={<RegisterPage />} />
              <Route path="/lupa-password" element={<ForgotPassword />} />
              
              {/* Protected Routes - Require Login */}
              <Route 
                path="/keranjang" 
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/checkout" 
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/order-success" 
                element={
                  <ProtectedRoute>
                    <OrderSuccess />
                  </ProtectedRoute>
                } 
              />

              {/* User Management Routes - Require Login */}
              <Route 
                path="/profil" 
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/pesanan" 
                element={
                  <ProtectedRoute>
                    <OrderHistory />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/alamat" 
                element={
                  <ProtectedRoute>
                    <AddressManagement />
                  </ProtectedRoute>
                } 
              />

              {/* ✅ NOTIFIKASI - Require Login */}
              <Route 
                path="/notifications" 
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                } 
              />

              {/* ✅ CHAT DETAIL - Require Login */}
              <Route 
                path="/chat/:sellerId" 
                element={
                  <ProtectedRoute>
                    <ChatDetail />
                  </ProtectedRoute>
                } 
              />

              {/* ✅ PENGRAJIN ROUTES - Require Login & Artisan Role */}
              <Route 
                path="/pengrajin" 
                element={
                  <ProtectedRoute requireRole={USER_ROLES.ARTISAN}>
                    <ArtisanDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/pengrajin/produk" 
                element={
                  <ProtectedRoute requireRole={USER_ROLES.ARTISAN}>
                    <ArtisanProducts />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/pengrajin/produk/tambah" 
                element={
                  <ProtectedRoute requireRole={USER_ROLES.ARTISAN}>
                    <ArtisanProducts />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/pengrajin/produk/:id" 
                element={
                  <ProtectedRoute requireRole={USER_ROLES.ARTISAN}>
                    <ArtisanProducts />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/pengrajin/pesanan" 
                element={
                  <ProtectedRoute requireRole={USER_ROLES.ARTISAN}>
                    <ArtisanOrders />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/pengrajin/pesanan/:id" 
                element={
                  <ProtectedRoute requireRole={USER_ROLES.ARTISAN}>
                    <ArtisanOrders />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/pengrajin/profil" 
                element={
                  <ProtectedRoute requireRole={USER_ROLES.ARTISAN}>
                    <ArtisanProfilePage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Layout>
        </CartProvider>
      </UserProvider>
    </Router>
  )
}

export default App
