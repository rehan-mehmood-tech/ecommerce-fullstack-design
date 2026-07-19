import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import {
  ArrowLeft,
  ShoppingCart,
  User,
  ChevronLeft,
  ChevronRight,
  Star,
  MessageSquare,
  ShoppingBag,
  Check,
  ShieldCheck,
  Globe,
  Heart,
  Mail,
  Loader,
  AlertCircle
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [added, setAdded] = useState(false);

  const isInCart = product && cartItems.some(i => i._id === product._id);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE}/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader size={40} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-500 dark:text-slate-400 gap-4">
        <AlertCircle size={48} className="text-red-400" />
        <p className="text-lg font-semibold">{error || 'Product not found'}</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-[#0D6EFD] text-white px-6 py-2.5 rounded-md font-semibold text-sm hover:bg-blue-700 transition"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const priceTiers = [
    { price: `$${product.price.toFixed(2)}`, qty: '1-50 pcs', active: true },
    { price: `$${(product.price * 0.92).toFixed(2)}`, qty: '50-200 pcs', active: false },
    { price: `$${(product.price * 0.85).toFixed(2)}`, qty: '200+ pcs', active: false }
  ];

  return (
    <div className="space-y-4 animate-fadeIn">

      {/* MOBILE HEADER */}
      <div className="md:hidden flex items-center justify-between py-3 px-4 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 fixed top-0 left-0 right-0 z-50">
        <button onClick={() => navigate('/products')} className="text-gray-700 dark:text-slate-300 p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full">
          <ArrowLeft size={22} />
        </button>
        <div className="flex items-center gap-4 text-gray-700 dark:text-slate-300">
          <Link to="/cart" className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full relative">
            <ShoppingCart size={22} />
            {isInCart && (
              <span className="absolute -top-1 -right-1 bg-[#0D6EFD] text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                ✓
              </span>
            )}
          </Link>
          <Link to="/profile" className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full">
            <User size={22} />
          </Link>
        </div>
      </div>

      {/* Mobile spacer */}
      <div className="md:hidden h-10" />

      {/* DESKTOP BREADCRUMBS */}
      <nav className="hidden md:flex text-sm text-gray-500 dark:text-slate-400 items-center gap-2 mt-2">
        <span className="cursor-pointer hover:text-gray-900 dark:hover:text-white dark:text-white" onClick={() => navigate('/')}>Home</span>
        <span>&gt;</span>
        <span className="cursor-pointer hover:text-gray-900 dark:hover:text-white dark:text-white" onClick={() => navigate('/products')}>Products</span>
        <span>&gt;</span>
        <span className="cursor-pointer hover:text-gray-900 dark:hover:text-white dark:text-white">{product.category}</span>
        <span>&gt;</span>
        <span className="text-gray-800 dark:text-slate-100 font-medium line-clamp-1">{product.name}</span>
      </nav>

      {/* DESKTOP LAYOUT */}
      <div className="hidden md:grid grid-cols-12 gap-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md p-6">

        {/* Left: Image Gallery */}
        <div className="col-span-4 space-y-4">
          <div className="border border-gray-200 dark:border-slate-700 rounded-md p-6 bg-gray-50 dark:bg-slate-900 flex items-center justify-center aspect-square relative group">
            <img
              src={product.image}
              className="max-h-full max-w-full object-contain mix-blend-multiply"
              alt={product.name}
            />
            <div className="absolute bottom-4 right-4 flex bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md shadow-sm dark:shadow-slate-900/50 overflow-hidden select-none">
              <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 border-r border-gray-200 dark:border-slate-700"><ChevronLeft size={16} /></button>
              <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800"><ChevronRight size={16} /></button>
            </div>
          </div>
          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-2.5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`border rounded-md p-2 aspect-square flex items-center justify-center bg-gray-50 dark:bg-slate-900 cursor-pointer hover:border-blue-500 ${i === 0 ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200 dark:border-slate-700'}`}
              >
                <img src={product.image} className="max-h-full max-w-full object-contain mix-blend-multiply" alt="thumb" />
              </div>
            ))}
          </div>
        </div>

        {/* Middle: Core Info */}
        <div className="col-span-5 space-y-4 pr-4">
          {/* Stock status */}
          <div className={`flex items-center gap-1.5 font-semibold text-sm ${product.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
            {product.stock > 0 ? <Check size={16} className="stroke-[3]" /> : <AlertCircle size={16} />}
            <span>{product.stock > 0 ? `In stock (${product.stock} units)` : 'Out of stock'}</span>
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight">{product.name}</h1>

          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-slate-400">
            <div className="flex items-center text-orange-500 dark:text-orange-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className={`fill-current ${i < 4 ? '' : 'text-gray-300 fill-none'}`} />
              ))}
              <span className="text-orange-600 dark:text-orange-400 font-semibold ml-1.5">4.5</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <MessageSquare size={16} className="text-gray-400 dark:text-slate-500" />
              <span>32 reviews</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <ShoppingBag size={16} className="text-gray-400 dark:text-slate-500" />
              <span>154 sold</span>
            </div>
          </div>

          {/* Price Tiers */}
          <div className="bg-[#FFF2E2] dark:bg-slate-800 rounded-md p-4 grid grid-cols-3 divide-x divide-orange-200 border border-orange-100">
            {priceTiers.map((tier, idx) => (
              <div key={idx} className="px-4 first:pl-0 last:pr-0">
                <p className={`text-lg font-bold ${tier.active ? 'text-[#FA3434]' : 'text-gray-800 dark:text-slate-100'}`}>{tier.price}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{tier.qty}</p>
              </div>
            ))}
          </div>

          {/* Specs */}
          <div className="border-t border-gray-100 dark:border-slate-800 pt-4 space-y-2.5">
            {[
              { label: 'Category', val: product.category },
              { label: 'Stock', val: `${product.stock} units` },
              { label: 'Condition', val: 'Brand new' },
              { label: 'Shipping', val: 'Worldwide' }
            ].map((spec, idx) => (
              <div key={idx} className="grid grid-cols-3 text-sm">
                <span className="text-gray-400 dark:text-slate-500 font-medium">{spec.label}:</span>
                <span className="col-span-2 text-gray-700 dark:text-slate-300">{spec.val}</span>
              </div>
            ))}
          </div>

          <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">{product.description}</p>

          {/* Add to Cart button (desktop) */}
          <button
            id="add-to-cart-desktop"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-sm transition ${
              added
                ? 'bg-green-600 text-white'
                : isInCart
                ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'
                : 'bg-[#0D6EFD] text-white hover:bg-blue-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <ShoppingCart size={16} />
            {added ? 'Added!' : isInCart ? 'In Cart — Add More' : 'Add to Cart'}
          </button>
        </div>

        {/* Right: Supplier Box */}
        <div className="col-span-3 space-y-4">
          <div className="border border-gray-200 dark:border-slate-700 rounded-md p-4 shadow-sm dark:shadow-slate-900/50 bg-white dark:bg-slate-800 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-[#D4F4F6] dark:bg-slate-700 text-[#00838F] font-bold text-lg rounded-md flex items-center justify-center flex-shrink-0">
                Q
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-slate-500">Supplier</p>
                <p className="font-bold text-gray-800 dark:text-slate-100 text-sm leading-tight mt-0.5">Quikart Trading LLC</p>
              </div>
            </div>
            <div className="space-y-2.5 pt-2 border-t border-gray-100 dark:border-slate-800 text-sm text-gray-600 dark:text-slate-400">
              <div className="flex items-center gap-3">
                <span className="text-base leading-none w-5 text-center">🌍</span>
                <span>Worldwide, Multiple locations</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-gray-400 dark:text-slate-500 w-5 flex-shrink-0" />
                <span>Verified Seller</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe size={18} className="text-gray-400 dark:text-slate-500 w-5 flex-shrink-0" />
                <span>Worldwide shipping</span>
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <button className="w-full bg-[#0D6EFD] text-white py-2.5 rounded-md font-semibold text-sm hover:bg-blue-700 transition flex items-center justify-center gap-2">
                <Mail size={16} />
                Send inquiry
              </button>
              <button className="w-full bg-white dark:bg-slate-800 text-[#0D6EFD] border border-gray-200 dark:border-slate-700 py-2.5 rounded-md font-semibold text-sm hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900 transition">
                Seller's profile
              </button>
            </div>
          </div>
          <button
            id="save-for-later"
            onClick={() => setFavorite(!favorite)}
            className="flex items-center justify-center gap-2 text-[#0D6EFD] text-sm font-semibold w-full hover:underline pt-2"
          >
            <Heart size={18} className={favorite ? 'fill-current text-red-500 dark:text-red-400' : ''} />
            <span>Save for later</span>
          </button>
        </div>
      </div>

      {/* MOBILE LAYOUT */}
      <div className="md:hidden bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md overflow-hidden flex flex-col">
        <div className="bg-gray-50 dark:bg-slate-900 aspect-square flex items-center justify-center p-6 relative">
          <img
            src={product.image}
            className="max-h-full max-w-full object-contain mix-blend-multiply"
            alt={product.name}
          />
          <div className="absolute bottom-4 right-4 bg-gray-900/40 text-white rounded-full px-3 py-1 flex items-center gap-2.5 text-sm font-semibold backdrop-blur-xs select-none">
            <button className="hover:opacity-75 transition"><ChevronLeft size={16} /></button>
            <span className="text-xs">1/4</span>
            <button className="hover:opacity-75 transition"><ChevronRight size={16} /></button>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2.5 text-xs text-gray-500 dark:text-slate-400">
            <div className="flex items-center text-orange-500 dark:text-orange-400 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className={`fill-current ${i < 4 ? '' : 'text-gray-300 fill-none'}`} />
              ))}
            </div>
            <span>• 32 reviews • 154 sold</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">{product.name}</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-[#FA3434]">${product.price.toFixed(2)}</span>
            <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">(1-50 pcs)</span>
          </div>
          <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">{product.description}</p>
          <div className="flex gap-2">
            <button
              id="add-to-cart-mobile"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 py-3 rounded-md font-semibold text-sm transition flex items-center justify-center gap-2 ${
                added ? 'bg-green-600 text-white' : 'bg-[#0D6EFD] text-white hover:bg-blue-700'
              } disabled:opacity-50`}
            >
              <ShoppingCart size={16} />
              {added ? 'Added!' : 'Add to Cart'}
            </button>
            <button
              onClick={() => setFavorite(!favorite)}
              className={`w-12 h-12 border rounded-md flex items-center justify-center bg-white dark:bg-slate-800 transition hover:bg-red-50 ${
                favorite ? 'border-red-200 text-red-500 dark:text-red-400' : 'border-gray-200 dark:border-slate-700 text-[#0D6EFD]'
              }`}
            >
              <Heart size={20} className={favorite ? 'fill-current' : ''} />
            </button>
          </div>
          <div className="border-t border-gray-100 dark:border-slate-800 pt-4 space-y-3">
            {[
              { label: 'Category', val: product.category },
              { label: 'Stock', val: `${product.stock} units` },
              { label: 'Condition', val: 'Brand new' }
            ].map((spec, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-gray-400 dark:text-slate-500 font-medium">{spec.label}</span>
                <span className="text-gray-700 dark:text-slate-300 font-semibold">{spec.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductDetail;
