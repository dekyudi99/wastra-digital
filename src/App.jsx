import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './contexts/CartContext'
import { UserProvider } from './contexts/UserContext'
import Layout from './components/Layout'

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
import Wishlist from './pages/Wishlist'
import ForgotPassword from './pages/ForgotPassword'



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
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/onboarding" element={<AuthOnboarding />} />
              <Route path="/masuk" element={<LoginPage />} />
              <Route path="/daftar" element={<RegisterPage />} />
              <Route path="/lupa-password" element={<ForgotPassword />} />
              <Route path="/keranjang" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />

              {/* User Management Routes */}
              <Route path="/profil" element={<UserProfile />} />
              <Route path="/pesanan" element={<OrderHistory />} />
              <Route path="/alamat" element={<AddressManagement />} />
              <Route path="/wishlist" element={<Wishlist />} />

              {/* ✅ NOTIFIKASI */}
              <Route path="/notifications" element={<Notifications />} />

              {/* ✅ CHAT DETAIL */}
              <Route path="/chat/:sellerId" element={<ChatDetail />} />
            </Routes>
          </Layout>
        </CartProvider>
      </UserProvider>
    </Router>
  )
}

export default App
