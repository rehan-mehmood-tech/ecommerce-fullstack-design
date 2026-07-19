import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ShoppingCart, Star, Loader } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Countdown timer component for the Deals section
const CountdownTimer = () => {
  const [time, setTime] = useState({ d: 4, h: 13, m: 34, s: 56 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        let { d, h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; d--; }
        if (d < 0) return { d: 0, h: 0, m: 0, s: 0 };
        return { d, h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-2.5 mt-6">
      {[
        { val: String(time.d).padStart(2, '0'), label: 'Days' },
        { val: String(time.h).padStart(2, '0'), label: 'Hour' },
        { val: String(time.m).padStart(2, '0'), label: 'Min' },
        { val: String(time.s).padStart(2, '0'), label: 'Sec' }
      ].map((t, i) => (
        <div key={i} className="bg-[#606060] text-white w-[54px] h-[54px] flex flex-col items-center justify-center rounded-md">
          <span className="font-bold text-sm leading-none">{t.val}</span>
          <span className="text-[10px] opacity-75 mt-0.5">{t.label}</span>
        </div>
      ))}
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [dealsProducts, setDealsProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: 'Automobiles' },
    { name: 'Clothes and wear' },
    { name: 'Home interiors' },
    { name: 'Computer and tech', active: true },
    { name: 'Tools, equipments' },
    { name: 'Sports and outdoor' },
    { name: 'Animal and pets' },
    { name: 'Machinery tools' },
    { name: 'More category' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        // First 4 items as "deals", next 8 as featured grid
        setDealsProducts(data.slice(0, 5));
        setFeaturedProducts(data.slice(0, 8));
      } catch {
        // fallback: leave arrays empty
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="space-y-8 mt-2 animate-fadeIn">

      {/* ---- Hero Showcase Grid ---- */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 shadow-sm">

        {/* Left Category Sidebar */}
        <aside className="hidden lg:block lg:col-span-3">
          <ul className="space-y-1">
            {categories.map((cat, i) => (
              <li
                key={i}
                onClick={() => navigate('/products')}
                className={`p-2.5 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition text-sm text-gray-700 dark:text-slate-300 ${
                  cat.active ? 'bg-[#E5F1FF] dark:bg-slate-800 text-gray-900 dark:text-white font-semibold' : ''
                }`}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        </aside>

        {/* Center Trending Banner */}
        <section
          onClick={() => navigate('/products')}
          className="col-span-1 lg:col-span-6 bg-[#D6F2EE] dark:bg-slate-800 rounded-md p-8 md:p-12 relative overflow-hidden min-h-[360px] flex flex-col justify-center cursor-pointer group"
        >
          <div className="relative z-10 max-w-[280px]">
            <h3 className="text-lg md:text-xl font-normal text-gray-800 dark:text-slate-100">Latest trending</h3>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-1 mb-6 leading-tight">
              Electronic items
            </h2>
            <button className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white px-6 py-2.5 rounded-md font-semibold text-sm hover:shadow-md dark:shadow-slate-900/50 hover:bg-gray-50 dark:hover:bg-slate-900 transition">
              Learn more
            </button>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-[50%] hidden md:flex items-center justify-center p-4">
            <img
              src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500 rounded-r-md"
              alt="Electronic items"
            />
          </div>
        </section>

        {/* Right Action Dashboard Panels */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-3">
          {/* User Status Card */}
          <div className="bg-[#E3F0FF] dark:bg-slate-800 p-4 rounded-md flex-1 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-blue-200 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                {user ? user.email?.[0]?.toUpperCase() : 'U'}
              </div>
              <p className="text-sm text-gray-800 dark:text-slate-100 leading-tight">
                {user ? `Hi, ${user.email?.split('@')[0]}` : 'Hi, user'} <br />
                <span className="text-xs text-gray-500 dark:text-slate-400">
                  {user ? 'Welcome back!' : "let's get started"}
                </span>
              </p>
            </div>
            {!user && (
              <div className="space-y-2 mt-4">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-[#0D6EFD] text-white py-2 rounded-md font-semibold text-xs hover:bg-blue-700 transition"
                >
                  Join now
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-white dark:bg-slate-800 text-[#0D6EFD] border border-gray-200 dark:border-slate-700 py-2 rounded-md font-semibold text-xs hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                >
                  Log in
                </button>
              </div>
            )}
          </div>
          <div className="bg-[#F38332] p-4 rounded-md text-white text-sm font-medium flex items-center min-h-[90px]">
            <span>Get US $10 off with a new supplier</span>
          </div>
          <div className="bg-[#55BDC3] p-4 rounded-md text-white text-sm font-medium flex items-center min-h-[90px]">
            <span>Send quotes with supplier preferences</span>
          </div>
        </div>
      </div>

      {/* ---- Deals and Offers Section ---- */}
      <section className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl flex flex-col md:flex-row overflow-hidden shadow-sm animate-slideUp stagger-2">

        {/* Deal Timer Panel */}
        <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200 dark:border-slate-700 md:w-1/4 flex flex-col justify-between min-w-[240px]">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Deals and offers</h3>
            <p className="text-gray-400 dark:text-slate-500 text-sm mt-0.5">Hygiene equipments</p>
          </div>
          <CountdownTimer />
        </div>

        {/* Deal Product Grid */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-y md:divide-y-0 divide-gray-200 dark:divide-slate-700">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <Loader size={28} className="animate-spin text-blue-500" />
            </div>
          ) : dealsProducts.length > 0 ? (
            dealsProducts.map((product) => {
              const discount = Math.floor(Math.random() * 30 + 10);
              return (
                <div
                  key={product._id}
                  onClick={() => navigate(`/products/${product._id}`)}
                  className="p-5 text-center hover:shadow-inner transition cursor-pointer flex flex-col items-center justify-between"
                >
                  <div className="h-[140px] flex items-center justify-center">
                    <img
                      src={product.image}
                      className="max-h-full max-w-full object-contain mix-blend-multiply"
                      alt={product.name}
                    />
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-700 dark:text-slate-300 font-medium line-clamp-2">{product.name}</p>
                    <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs px-2.5 py-1 rounded-full font-bold mt-2 inline-block">
                      -{discount}%
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full flex items-center justify-center py-12 text-gray-400 dark:text-slate-500 text-sm">
              No products available
            </div>
          )}
        </div>
      </section>

      {/* ---- Featured Products Grid ---- */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Featured Products</h2>
          <Link to="/products" className="text-[#0D6EFD] text-sm font-semibold hover:underline">
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader size={36} className="animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {featuredProducts.map((product, idx) => (
              <div
                key={product._id}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group flex flex-col animate-slideUp"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div
                  onClick={() => navigate(`/products/${product._id}`)}
                  className="aspect-square bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4 cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <p
                    onClick={() => navigate(`/products/${product._id}`)}
                    className="text-sm font-semibold text-gray-800 dark:text-slate-100 line-clamp-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition flex-1"
                  >
                    {product.name}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} className={`fill-current ${i < 4 ? 'text-orange-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
                    <button
                      id={`add-cart-${product._id}`}
                      onClick={(e) => handleAddToCart(e, product)}
                      className="w-8 h-8 bg-[#0D6EFD] text-white rounded-md flex items-center justify-center hover:bg-blue-700 transition"
                      title="Add to cart"
                    >
                      <ShoppingCart size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default Home;
