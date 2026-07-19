import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, PackageOpen, CreditCard, Tag, Truck } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, updateQty, cartTotal, clearCart } = useCart();

  const shipping = cartItems.length > 0 ? 9.99 : 0;
  const tax = parseFloat((cartTotal * 0.08).toFixed(2));
  const total = parseFloat((cartTotal + shipping + tax).toFixed(2));

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400 dark:text-slate-500 gap-6 animate-fadeIn">
        <div className="w-20 h-20 bg-gray-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center">
          <PackageOpen size={44} className="text-gray-300 dark:text-slate-400" />
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-600 dark:text-slate-400">Your cart is empty</p>
          <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">Looks like you haven't added anything yet</p>
        </div>
        <Link
          to="/products"
          id="continue-shopping-btn"
          className="flex items-center gap-2 bg-gradient-to-r from-[#0D6EFD] to-blue-700 text-white px-7 py-3.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
        >
          <ShoppingCart size={16} />
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">

      {/* Cart Items Panel */}
      <div className="lg:col-span-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm dark:shadow-slate-900/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Shopping Cart</h2>
            <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold px-2.5 py-1 rounded-lg">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            id="clear-cart-btn"
            onClick={clearCart}
            className="text-xs text-red-500 dark:text-red-400 hover:text-red-700 font-semibold border border-red-200 px-3.5 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
          >
            <Trash2 size={12} className="inline mr-1" />
            Clear all
          </button>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-slate-800">
          {cartItems.map((item, idx) => (
            <div key={item._id} className="py-5 flex flex-col sm:flex-row gap-5 animate-fadeIn" style={{ animationDelay: `${idx * 60}ms` }}>
              <Link to={`/products/${item._id}`} className="flex-shrink-0">
                <div className="w-24 h-24 rounded-xl border border-gray-200 dark:border-slate-700 flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-3 hover:border-blue-300 hover:shadow-md transition-all duration-200 group">
                  <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" />
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <Link to={`/products/${item._id}`}>
                  <h3 className="font-semibold text-gray-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition line-clamp-1">{item.name}</h3>
                </Link>
                <p className="text-gray-400 dark:text-slate-500 text-xs mt-0.5">{item.category}</p>
                <div className="mt-3 flex items-center gap-3">
                  <button
                    id={`remove-${item._id}`}
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-400 hover:text-red-600 border border-gray-200 dark:border-slate-700 hover:border-red-200 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 flex items-center gap-1"
                  >
                    <Trash2 size={11} />
                    Remove
                  </button>
                  <span className="text-xs text-gray-400 dark:text-slate-500">${item.price.toFixed(2)} each</span>
                </div>
              </div>

              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:gap-2">
                <span className="font-bold text-gray-900 dark:text-white text-lg min-w-[80px] text-right">${(item.price * item.qty).toFixed(2)}</span>
                <div className="flex items-center border-2 border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
                  <button
                    id={`qty-minus-${item._id}`}
                    onClick={() => {
                      if (item.qty === 1) removeFromCart(item._id);
                      else updateQty(item._id, item.qty - 1);
                    }}
                    className="px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 transition text-gray-500 dark:text-slate-400 hover:text-blue-600"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="px-4 py-1.5 text-sm font-bold border-x-2 border-gray-200 dark:border-slate-700 min-w-[40px] text-center text-gray-800 dark:text-slate-100">
                    {item.qty}
                  </span>
                  <button
                    id={`qty-plus-${item._id}`}
                    onClick={() => updateQty(item._id, item.qty + 1)}
                    className="px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 transition text-gray-500 dark:text-slate-400 hover:text-blue-600"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary Panel */}
      <div className="lg:col-span-4 space-y-4">

        {/* Coupon */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm dark:shadow-slate-900/50">
          <div className="flex items-center gap-2 mb-3">
            <Tag size={14} className="text-blue-500 dark:text-blue-400" />
            <p className="text-sm font-semibold text-gray-700 dark:text-slate-300">Have a coupon?</p>
          </div>
          <div className="flex border-2 border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden focus-within:border-blue-400 transition-colors">
            <input
              id="coupon-input"
              type="text"
              placeholder="Enter coupon code"
              className="flex-1 px-4 py-2.5 outline-none text-sm bg-white dark:bg-slate-800"
            />
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all">
              Apply
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm dark:shadow-slate-900/50">
          <div className="flex items-center gap-2 mb-5">
            <CreditCard size={16} className="text-blue-500 dark:text-blue-400" />
            <h3 className="font-bold text-gray-900 dark:text-white">Order Summary</h3>
          </div>
          <div className="space-y-3 text-sm text-gray-600 dark:text-slate-400 mb-5 border-b border-gray-100 dark:border-slate-800 pb-5">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900 dark:text-white">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-1.5">
                <Truck size={14} className="text-gray-400 dark:text-slate-500" />
                <span>Shipping</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-orange-600">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-between items-baseline mb-6">
            <span className="text-sm text-gray-600 dark:text-slate-400">Total</span>
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white">${total.toFixed(2)}</span>
          </div>
          <button
            id="checkout-btn"
            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3.5 rounded-xl font-bold text-sm hover:from-emerald-700 hover:to-green-700 transition-all duration-200 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            Proceed to Checkout
            <ArrowRight size={18} />
          </button>
          <Link
            to="/products"
            className="block text-center text-sm text-gray-500 dark:text-slate-400 hover:text-[#0D6EFD] font-medium mt-4 transition-colors"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* Payment Trust Badge */}
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 text-center">
          <p className="text-[11px] text-gray-400 dark:text-slate-500 font-medium">🔒 Secure checkout · 100% Protected</p>
        </div>
      </div>

    </div>
  );
};

export default Cart;
