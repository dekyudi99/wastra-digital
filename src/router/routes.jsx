import { createBrowserRouter } from "react-router-dom";

// Imports
import Layout from '../components/Layout';
import loginShield from "./loader/loginShield";
import roleGuard from "./loader/roleGuard";

// Pages
import LandingPage from '../pages/LandingPage';
import ProductCatalog from '../pages/ProductCatalog';
import ProductDetail from '../pages/ProductDetail';
import ArtisanShop from '../pages/ArtisanShop';
import AdminDashboard from '../pages/AdminDashboard';
import AdminProductManagement from '../pages/AdminProductManagement';
import AuthOnboarding from '../pages/AuthOnboarding';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPassword from '../pages/ForgotPassword';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import OrderSuccess from '../pages/OrderSuccess';
import Notifications from '../pages/Notifications';
import ChatDetail from '../pages/ChatDetail';
import UserProfile from '../pages/UserProfile';
import OrderHistory from '../pages/OrderHistory';
import AddressManagement from '../pages/AddressManagement';
import ArtisanDashboard from '../pages/ArtisanDashboard';
import ArtisanProducts from '../pages/ArtisanProducts';
import ArtisanOrders from '../pages/ArtisanOrders';
import ArtisanProfile from '../pages/ArtisanProfile';
import OtpPage from '../pages/OtpPage';
import RouteNotFound from '../RouteNotFound';
import AiInsightPage from "../pages/AiInsightPage";
import AdminArtisanPage from "../pages/AdminArtisanPage";
import Upcoming from "../pages/Upcoming";
import ForgetPassword from "../pages/ForgetPassword";
import AfterForgetPassword from "../pages/AfterForgetPassword";
import SuccessChangePassword from "../pages/SuccessChangePassword";
import ListOrder from "../pages/ListOrder";
import OrderDetailStatus from "../pages/OrderDetailStatus";
import OrderDetail from "../pages/OrderDetail";
import PaymentSuccess from "../pages/PaymentSuccess";
import Withdrawal from "../pages/Withdrawal";
import OpenAi from "../pages/OpenAi";
import AdminActiveArtisanList from "../pages/AdminActiveArtisanList";

const routes = createBrowserRouter([
  { path: "chat/wastraAi", element:<OpenAi/>, loader: loginShield},
  { path: '/payment/success', element:<PaymentSuccess/>},
  {
    path: "/",
    element: <Layout />,
    errorElement: <RouteNotFound />,
    children: [
      // ================= PUBLIC ROUTES =================
      { index: true, element: <LandingPage /> },
      { path: "produk", element: <ProductCatalog /> },
      { path: "produk/:id", element: <ProductDetail /> },
      { path: "artisan/:id", element: <ArtisanShop /> },
      { path: "onboarding", element: <AuthOnboarding /> },
      { path: "masuk", element: <LoginPage /> },
      { path: "lupa-password", element: <ForgetPassword/>},
      { path: "daftar", element: <RegisterPage /> },
      { path: "lupa-password", element: <ForgotPassword /> },
      { path: "cek-email", element: <AfterForgetPassword /> },
      { path: "success/change-password", element: <SuccessChangePassword /> },
      { path: "otp", element: <OtpPage /> },
      { path: "keranjang", element: <Cart />, loader: roleGuard('customer') },

      { path: "checkout", element: <Checkout />, loader: roleGuard('customer')},
      { path: "order-success", element: <OrderSuccess />, loader: roleGuard('customer') },
      { path: "profil", element: <UserProfile /> },
      { path: "pesanan", element: <OrderHistory /> },
      { path: "alamat", element: <AddressManagement /> },
      { path: "notifications", element: <Notifications /> },
      { path: "chat/:conversationId", element:<ChatDetail /> },

      { path: "pesanan/list", element: <ListOrder/>, loader: loginShield},

      { path: "ai", element: <AiInsightPage />, loader: loginShield },

      { path: "upcoming", element: <Upcoming/>},

      { path: "pesanan/detail/:id", element: <OrderDetailStatus/>, loader: loginShield},
      { path: "pesanan/detail/unpaid/:id", element: <OrderDetail/>, loader: loginShield},

      // ================= ARTISAN ROUTES =================
      {
        path: "pengrajin",
        loader: roleGuard('artisan'), 
        children: [
          { index: true, element: <ArtisanDashboard /> },
          { path: "produk", element: <ArtisanProducts /> },
          { path: "produk/tambah", element: <ArtisanProducts /> },
          { path: "produk/:id", element: <ArtisanProducts /> },
          { path: "pesanan", element: <ArtisanOrders /> },
          { path: "pesanan/:id", element: <ArtisanOrders /> },
          { path: "profil", element: <ArtisanProfile /> },
          { path: "withdrawal", element: <Withdrawal /> },
        ]
      },

      // ================= ADMIN ROUTES =================
      {
        path: "admin",
        loader: roleGuard('admin'),
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "produk", element: <AdminProductManagement /> },
          { path: "pengrajin/daftar", element: <AdminArtisanPage /> },
          { path: "pengrajin/aktif", element: <AdminActiveArtisanList/> }
        ]
      },
    ]
  }
]);

export default routes;