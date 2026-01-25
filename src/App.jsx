import { RouterProvider } from 'react-router-dom';
import routes from './router/routes';
import { UserProvider } from './contexts/UserContext';
import { CartProvider } from './contexts/CartContext';

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <RouterProvider router={routes} />
      </CartProvider>
    </UserProvider>
  );
}

export default App;