import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import ProductCatalog from './pages/ProductCatalog'
import ProductDetail from './pages/ProductDetail'
import ArtisanProfile from './pages/ArtisanProfile'
import AdminDashboard from './pages/AdminDashboard'
import AuthOnboarding from './pages/AuthOnboarding'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  return (
    <Router>
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
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

