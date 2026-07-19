import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import {
  ShoppingBag,
  Search,
  User,
  MessageSquare,
  Heart,
  ShoppingCart,
  Menu,
  ChevronDown,
  X,
  Shield,
  Sun,
  Moon
} from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Hide navbar on product detail mobile view
  const isDetailPath = location.pathname.match(/^\/products\/[^/]+$/);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/products?search=${encodeURIComponent(q)}`);
      setMobileMenuOpen(false);
    } else {
      navigate('/products');
    }
  };

  return (
    <header className={`bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50 ${isDetailPath ? 'hidden md:block' : ''}`}>

      {/* Top Header Bar */}
      <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center justify-between gap-4">

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-10 h-10 bg-[#0D6EFD] rounded-md flex items-center justify-center text-white">
            <ShoppingBag size={22} className="stroke-[2.5]" />
          </div>
          <span className="text-2xl font-bold text-[#0D6EFD] tracking-tight">Quikart</span>
        </Link>

        {/* Search Bar — Desktop */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-[600px] border-2 border-[#0D6EFD] rounded-md overflow-hidden"
        >
          <input
            id="navbar-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 px-4 py-2 outline-none text-sm bg-gray-50"
          />
          <div className="border-l border-gray-300 bg-gray-50 flex items-center px-3 gap-1 text-sm text-gray-600 cursor-pointer hover:bg-gray-100 transition select-none">
            <span>All category</span>
            <ChevronDown size={14} />
          </div>
          <button
            id="navbar-search-btn"
            type="submit"
            className="bg-[#0D6EFD] text-white px-6 py-2 hover:bg-blue-700 transition font-medium text-sm flex items-center justify-center"
          >
            Search
          </button>
        </form>

        {/* Action Controls — Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <button onClick={toggleTheme} className="flex flex-col items-center text-gray-500 dark:text-slate-400 hover:text-[#0D6EFD] dark:hover:text-blue-400 transition" title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            <span className="text-xs mt-1 text-gray-500 dark:text-slate-400">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
          <Link to="/profile" className="flex flex-col items-center text-gray-500 dark:text-slate-400 hover:text-[#0D6EFD] transition">
            <User size={20} className="text-gray-600" />
            <span className="text-xs mt-1 text-gray-500">{user ? user.email?.split('@')[0] : 'Profile'}</span>
          </Link>
          <Link to="/messages" className="flex flex-col items-center text-gray-500 hover:text-[#0D6EFD] transition">
            <MessageSquare size={20} className="text-gray-600" />
            <span className="text-xs mt-1 text-gray-500">Message</span>
          </Link>
          <Link to="/orders" className="flex flex-col items-center text-gray-500 hover:text-[#0D6EFD] transition">
            <Heart size={20} className="text-gray-600" />
            <span className="text-xs mt-1 text-gray-500">Orders</span>
          </Link>
          <Link to="/cart" className="flex flex-col items-center text-gray-500 hover:text-[#0D6EFD] transition relative" id="cart-icon-desktop">
            <ShoppingCart size={20} className="text-gray-600" />
            <span className="text-xs mt-1 text-gray-500">My cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#0D6EFD] text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                {cartCount}
              </span>
            )}
          </Link>
          {user && (
            <Link
              to="/admin"
              className="flex flex-col items-center text-gray-500 hover:text-[#0D6EFD] transition"
              title="Admin Panel"
            >
              <Shield size={20} className="text-gray-600" />
              <span className="text-xs mt-1 text-gray-500">Admin</span>
            </Link>
          )}
          {user ? (
            <button
              id="logout-btn"
              onClick={logout}
              className="bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 px-3 py-1.5 rounded-md text-xs font-semibold transition"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              id="login-btn"
              className="bg-[#0D6EFD] text-white px-4 py-1.5 rounded-md text-xs font-semibold hover:bg-blue-700 transition"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-4">
          <Link to="/cart" className="text-gray-600 relative" id="cart-icon-mobile">
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#0D6EFD] text-white text-[9px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Secondary Sub-header Navigation — Desktop */}
      <div className="border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden md:block">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-slate-300">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 cursor-pointer hover:text-gray-900">
              <Menu size={18} />
              <span>All category</span>
            </div>
            <Link to="/products?search=offers" className="hover:text-gray-900">Hot offers</Link>
            <Link to="/products" className="hover:text-gray-900">Gift boxes</Link>
            <Link to="/products" className="hover:text-gray-900">Projects</Link>
            <Link to="/products" className="hover:text-gray-900">Menu item</Link>
            <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
              <span>Help</span>
              <ChevronDown size={14} />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
              <span>English, USD</span>
              <ChevronDown size={14} />
            </div>
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-gray-900">
              <span>Ship to</span>
              <span className="text-base leading-none">🇩🇪</span>
              <ChevronDown size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-4 shadow-inner dark:shadow-slate-900">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="flex border border-gray-300 rounded-md overflow-hidden bg-gray-50">
            <input
              id="mobile-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-3 py-2 outline-none text-sm bg-transparent"
            />
            <button type="submit" className="bg-[#0D6EFD] text-white px-4 flex items-center justify-center">
              <Search size={16} />
            </button>
          </form>

          {/* Theme Toggle (Mobile) */}
          <button onClick={toggleTheme} className="flex items-center gap-2 text-gray-700 dark:text-slate-300 font-medium py-2">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {/* Drawer Links */}
          <div className="flex flex-col gap-3 font-medium text-gray-700 dark:text-slate-300">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#0D6EFD]">Home</Link>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#0D6EFD]">All Products</Link>
            <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#0D6EFD]">
              My Cart {cartCount > 0 && <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full ml-1">{cartCount}</span>}
            </Link>
            <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#0D6EFD]">My Profile</Link>
            <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#0D6EFD]">Orders</Link>
            {user && (
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#0D6EFD] flex items-center gap-1.5">
                <Shield size={14} /> Admin Panel
              </Link>
            )}
            {user ? (
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="text-left text-red-600 hover:text-red-800 font-semibold"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-[#0D6EFD] font-semibold">
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
