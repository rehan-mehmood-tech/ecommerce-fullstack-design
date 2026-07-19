import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ChevronUp, ChevronDown, Grid, List, Heart, Star, ShoppingCart, Loader, SearchX } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Accessories', 'Home Appliances', 'Footwear', 'Sports'];

const ProductList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart, cartItems } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
  const [wishlist, setWishlist] = useState([]);

  const currentSearch = searchParams.get('search') || '';

  // Fetch products whenever search params change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (currentSearch) params.set('search', currentSearch);
        if (selectedCategory !== 'All') params.set('category', selectedCategory);

        const res = await fetch(`${API_BASE}/api/products?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError('Could not load products. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentSearch, selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (searchInput.trim()) params.search = searchInput.trim();
    setSearchParams(params);
  };

  const toggleWishlist = (id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const isInCart = (id) => cartItems.some(i => i._id === id);

  return (
    <div className="space-y-4 mt-2 animate-fadeIn">

      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 dark:text-slate-400 flex items-center gap-2">
        <span className="cursor-pointer hover:text-gray-900 dark:hover:text-white" onClick={() => navigate('/')}>Home</span>
        <span>&gt;</span>
        <span className="text-gray-800 dark:text-slate-100 font-medium">All Products</span>
        {currentSearch && (
          <>
            <span>&gt;</span>
            <span className="text-gray-800 dark:text-slate-100 font-medium">"{currentSearch}"</span>
          </>
        )}
      </nav>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          id="product-search-input"
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search products by name or category..."
          className="flex-1 border border-gray-300 dark:border-slate-600 rounded-md px-4 py-2.5 text-sm outline-none focus:border-[#0D6EFD] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition"
        />
        <button
          id="product-search-btn"
          type="submit"
          className="bg-[#0D6EFD] text-white px-6 py-2.5 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
        >
          Search
        </button>
        {currentSearch && (
          <button
            type="button"
            onClick={() => { setSearchInput(''); setSearchParams({}); }}
            className="px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-md text-sm text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
          >
            Clear
          </button>
        )}
      </form>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">

          {/* Category Filter */}
          <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
            <div className="flex items-center justify-between font-semibold text-gray-800 dark:text-slate-100 text-sm mb-3">
              <span>Category</span>
              <ChevronUp size={16} />
            </div>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
              {CATEGORIES.map((cat) => (
                <li
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition py-0.5 ${
                    selectedCategory === cat ? 'text-gray-900 dark:text-white font-semibold text-blue-600 dark:text-blue-400' : ''
                  }`}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range (UI only) */}
          <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
            <div className="flex items-center justify-between font-semibold text-gray-800 dark:text-slate-100 text-sm mb-3">
              <span>Price Range</span>
              <ChevronDown size={16} />
            </div>
            <div className="space-y-2">
              {['Under $50', '$50 - $200', '$200 - $500', 'Over $500'].map((range) => (
                <label key={range} className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-slate-300 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400" />
                  <span>{range}</span>
                </label>
              ))}
            </div>
          </div>

        </aside>

        {/* Right Product List/Grid View */}
        <main className="col-span-1 lg:col-span-9 space-y-4">

          {/* Filter Bar Controls */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md p-3.5 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-800 dark:text-slate-100">
            <div>
              {loading ? (
                <span className="text-gray-400 dark:text-slate-500">Loading...</span>
              ) : (
                <>
                  <span className="font-semibold">{products.length}</span> items
                  {selectedCategory !== 'All' && <> in <span className="font-semibold">{selectedCategory}</span></>}
                  {currentSearch && <> matching "<span className="font-semibold">{currentSearch}</span>"</>}
                </>
              )}
            </div>
            <div className="flex items-center gap-5 flex-wrap">
              <div className="flex border border-gray-300 dark:border-slate-600 rounded-md overflow-hidden bg-white dark:bg-slate-800">
                <button
                  id="grid-view-btn"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 transition ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-slate-700' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                >
                  <Grid size={16} />
                </button>
                <button
                  id="list-view-btn"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 border-l border-gray-200 dark:border-slate-700 transition ${viewMode === 'list' ? 'bg-gray-100 dark:bg-slate-700' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-24">
              <Loader size={36} className="animate-spin text-blue-500 dark:text-blue-400" />
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-700 dark:text-red-400 rounded-md p-6 text-center text-sm">
              {error}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400 dark:text-slate-500">
              <SearchX size={52} className="mb-4 opacity-50" />
              <p className="text-lg font-semibold text-gray-500 dark:text-slate-400">No products found</p>
              <p className="text-sm mt-1">Try a different search term or category</p>
            </div>
          )}

          {/* List View */}
          {!loading && !error && viewMode === 'list' && (
            <div className="space-y-4">
              {products.map(product => (
                <div
                  key={product._id}
                  className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md p-5 flex flex-col md:flex-row gap-6 hover:shadow-md dark:hover:shadow-slate-900/50 transition relative group"
                >
                  {/* Product Image */}
                  <div className="w-[180px] h-[180px] flex items-center justify-center flex-shrink-0 mx-auto md:mx-0 bg-gray-50 dark:bg-slate-900 rounded-md p-3">
                    <img
                      src={product.image}
                      className="max-h-full max-w-full object-contain mix-blend-multiply cursor-pointer group-hover:scale-105 transition"
                      alt={product.name}
                      onClick={() => navigate(`/products/${product._id}`)}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-2">
                    <span className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 px-2 py-0.5 rounded font-medium">
                      {product.category}
                    </span>
                    <h3
                      onClick={() => navigate(`/products/${product._id}`)}
                      className="font-bold text-gray-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer text-lg leading-tight"
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-3">
                      <span className="text-xl font-extrabold text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
                      <div className="flex items-center text-orange-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={13} className={`fill-current ${i < 4 ? '' : 'text-gray-300 dark:text-slate-600 fill-none'}`} />
                        ))}
                      </div>
                      <span>•</span>
                      <span className={`font-semibold ${product.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                    <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed max-w-[650px] line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        id={`view-${product._id}`}
                        onClick={() => navigate(`/products/${product._id}`)}
                        className="text-blue-600 dark:text-blue-400 font-bold hover:text-blue-800 dark:hover:text-blue-300 transition text-sm"
                      >
                        View details
                      </button>
                      <button
                        id={`add-cart-list-${product._id}`}
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-semibold transition ${
                          isInCart(product._id)
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                            : 'bg-[#0D6EFD] text-white hover:bg-blue-700'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <ShoppingCart size={14} />
                        {isInCart(product._id) ? 'In Cart' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product._id)}
                    className={`absolute right-5 top-5 w-10 h-10 border rounded-full flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm dark:shadow-slate-900/50 transition ${
                      wishlist.includes(product._id)
                        ? 'border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800'
                    }`}
                  >
                    <Heart size={18} className={wishlist.includes(product._id) ? 'fill-current' : ''} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Grid View */}
          {!loading && !error && viewMode === 'grid' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {products.map(product => (
                <div
                  key={product._id}
                  className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md overflow-hidden hover:shadow-md dark:hover:shadow-slate-900/50 transition group flex flex-col"
                >
                  <div
                    className="aspect-square bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4 cursor-pointer"
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <p
                      onClick={() => navigate(`/products/${product._id}`)}
                      className="text-sm font-semibold text-gray-800 dark:text-slate-100 line-clamp-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 flex-1"
                    >
                      {product.name}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
                      <button
                        id={`add-cart-grid-${product._id}`}
                        onClick={() => addToCart(product)}
                        className="w-8 h-8 bg-[#0D6EFD] text-white rounded-md flex items-center justify-center hover:bg-blue-700 transition"
                      >
                        <ShoppingCart size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default ProductList;
