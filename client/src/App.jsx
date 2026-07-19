import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import UserLayout from './layouts/UserLayout';
import Home from './pages/user/Home';
import Cart from './pages/user/Cart';
import ProductList from './pages/user/ProductList';
import ProductDetail from './pages/user/ProductDetail';
import Login from './pages/user/Login';
import Dashboard from './pages/admin/Dashboard';

// Placeholder pages for future development
const Profile = () => (
  <div className="bg-white border border-gray-200 rounded-md p-8 text-center space-y-3">
    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center text-2xl">👤</div>
    <h2 className="text-xl font-bold text-gray-800">Profile</h2>
    <p className="text-gray-400 text-sm">User profile page coming soon</p>
  </div>
);

const Messages = () => (
  <div className="bg-white border border-gray-200 rounded-md p-8 text-center space-y-3">
    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center text-2xl">💬</div>
    <h2 className="text-xl font-bold text-gray-800">Messages</h2>
    <p className="text-gray-400 text-sm">Messaging feature coming soon</p>
  </div>
);

const Orders = () => (
  <div className="bg-white border border-gray-200 rounded-md p-8 text-center space-y-3">
    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center text-2xl">📦</div>
    <h2 className="text-xl font-bold text-gray-800">Orders</h2>
    <p className="text-gray-400 text-sm">Order history coming soon</p>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Login is public */}
            <Route path="/login" element={<Login />} />

            {/* User Layout Routes — all protected */}
            <Route path="/" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
              <Route index element={<Home />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/:id" element={<ProductDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="profile" element={<Profile />} />
              <Route path="messages" element={<Messages />} />
              <Route path="orders" element={<Orders />} />
            </Route>

            {/* Admin route — also protected */}
            <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

            {/* Redirect unknown routes to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
