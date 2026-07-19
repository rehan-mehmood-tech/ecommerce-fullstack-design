import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  TrendingUp, ShoppingBag, Users, DollarSign,
  Plus, Trash2, Edit, Menu, X, LogOut,
  ChevronLeft, Loader, AlertCircle,
  Save, Check, Package, Search, Box,
  Layers, Shield, Database, RefreshCw,
  Sun, Moon
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const EMPTY_FORM = { name: '', price: '', image: '', description: '', category: 'Electronics', stock: '' };
const CATEGORIES = ['Electronics', 'Clothing', 'Accessories', 'Home Appliances', 'Footwear', 'Sports'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const successRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const getToken = useCallback(async () => {
    if (!user) return null;
    return await user.getIdToken();
  }, [user]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setProducts(data);
    } catch {
      setError('Could not load products. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const openAddModal = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditTarget(product);
    setForm({
      name: product.name,
      price: String(product.price),
      image: product.image,
      description: product.description,
      category: product.category,
      stock: String(product.stock)
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.name || !form.price || !form.image || !form.description || !form.stock) {
      setFormError('Please fill in all required fields.');
      return;
    }
    setSaving(true);
    try {
      const token = await getToken();
      const payload = {
        name: form.name,
        price: parseFloat(form.price),
        image: form.image,
        description: form.description,
        category: form.category,
        stock: parseInt(form.stock, 10)
      };
      let res;
      if (editTarget) {
        res = await fetch(`${API_BASE}/api/products/${editTarget._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${API_BASE}/api/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
      }
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Request failed');
      }
      setModalOpen(false);
      await fetchProducts();
      showSuccess(editTarget ? 'Product updated successfully!' : 'Product added successfully!');
    } catch (err) {
      setFormError(err.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/api/products/${deleteTarget._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Delete failed');
      setDeleteTarget(null);
      await fetchProducts();
      showSuccess('Product deleted successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const catalogValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const categoriesCount = new Set(products.map(p => p.category)).size;

  const stats = [
    { label: 'Total Products', value: String(products.length), icon: Box, gradient: 'from-violet-600 to-indigo-600', lightBg: 'bg-violet-50 dark:bg-violet-900/20' },
    { label: 'Total Stock', value: String(totalStock), icon: Database, gradient: 'from-blue-600 to-cyan-600', lightBg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Catalog Value', value: `$${catalogValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, icon: DollarSign, gradient: 'from-emerald-600 to-teal-600', lightBg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Categories', value: String(categoriesCount), icon: Layers, gradient: 'from-orange-600 to-amber-600', lightBg: 'bg-orange-50 dark:bg-orange-900/20' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex">

      {/* Success Toast */}
      {successMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] animate-slideDown">
          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded-xl px-5 py-3.5 shadow-lg shadow-emerald-200/30 dark:shadow-slate-900/50 backdrop-blur-sm">
            <div className="w-7 h-7 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
              <Check size={14} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-sm font-semibold">{successMsg}</span>
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fadeIn" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-slate-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col flex-shrink-0 shadow-2xl`}>
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-700/50 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/20">
              <Shield size={16} />
            </div>
            <div>
              <span className="text-white font-bold tracking-wide text-sm">QUIKART</span>
              <p className="text-[10px] text-slate-500 font-medium leading-none mt-0.5">Admin Panel</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white transition">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          <div className="bg-gradient-to-r from-blue-600/20 to-blue-600/5 text-white flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm border border-blue-500/20 shadow-sm">
            <TrendingUp size={17} />
            <span>Overview</span>
          </div>
          <button onClick={openAddModal} className="w-full hover:bg-slate-700/50 hover:text-white flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group">
            <div className="w-6 h-6 rounded-md bg-slate-700/50 group-hover:bg-blue-500/20 flex items-center justify-center transition-colors">
              <Plus size={14} className="group-hover:text-blue-400 transition-colors" />
            </div>
            <span>Add Product</span>
          </button>
          <div className="hover:bg-slate-700/50 hover:text-white flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group cursor-not-allowed opacity-60">
            <Users size={17} />
            <span>Customers</span>
          </div>
        </nav>

        <div className="p-3 border-t border-slate-700/50 space-y-2.5">
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200">
            <ChevronLeft size={15} />
            <span>Back to Store</span>
          </button>
          <div className="bg-slate-800/50 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                {user?.email?.[0]?.toUpperCase() || 'A'}
              </div>
              <p className="text-xs text-slate-400 truncate flex-1">{user?.email || 'Admin'}</p>
            </div>
            <button onClick={logout} className="w-full flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-red-500/20 hover:text-red-300 text-slate-400 py-2 rounded-lg text-xs font-semibold transition-all duration-200">
              <LogOut size={12} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 shadow-sm dark:shadow-slate-900/50">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-lg transition">
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">Dashboard</h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">Manage your e-commerce store</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition" title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={fetchProducts} className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition" title="Refresh">
              <RefreshCw size={16} />
            </button>
            <div className="hidden sm:flex items-center gap-2.5 bg-slate-100 dark:bg-slate-700 rounded-lg px-3.5 py-2">
              <Search size={14} className="text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent text-sm outline-none w-40 text-slate-600 dark:text-slate-400 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto">

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-2.5 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl px-5 py-3.5 text-sm animate-shake">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
              <button onClick={() => setError('')} className="ml-auto text-red-400 dark:text-red-300 hover:text-red-600"><X size={14} /></button>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-slate-900/50 border border-slate-200/80 dark:border-slate-700/80 p-5 md:p-6 hover:shadow-xl dark:hover:shadow-slate-900/50 hover:-translate-y-0.5 transition-all duration-300"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-slate-400 dark:text-slate-500 text-[11px] uppercase font-bold tracking-widest">{stat.label}</p>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
                  </div>
                  <div className={`w-11 h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${stat.gradient} text-white flex items-center justify-center shadow-lg dark:shadow-slate-900/50 shadow-${stat.gradient.split(' ')[0].replace('from-', '')}/20 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon size={20} className="stroke-[2]" />
                  </div>
                </div>
                <div className={`mt-4 h-1.5 rounded-full ${stat.lightBg} overflow-hidden`}>
                  <div className={`h-full rounded-full bg-gradient-to-r ${stat.gradient} transition-all duration-700`} style={{ width: `${Math.min(100, ((i + 1) * 25))}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Search */}
          <div className="sm:hidden flex items-center gap-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 shadow-sm dark:shadow-slate-900/50">
            <Search size={15} className="text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="bg-transparent text-sm outline-none w-full text-slate-600 dark:text-slate-400 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Product Table Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm dark:shadow-slate-900/50 overflow-hidden">
            <div className="px-5 md:px-7 py-5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap justify-between items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm">
                  <Package size={16} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white text-base">Product Inventory</h2>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} total</p>
                </div>
              </div>
              <button id="add-product-btn" onClick={openAddModal} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 flex items-center gap-1.5">
                <Plus size={14} className="stroke-[3]" />
                Add Product
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-10 h-10 border-[3px] border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
                <span className="text-sm text-slate-400 dark:text-slate-500 font-medium">Loading products...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                      {['Product', 'Category', 'Stock', 'Price', 'Actions'].map(h => (
                        <th key={h} className="px-5 md:px-7 py-4 text-[11px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product, idx) => (
                        <tr key={product._id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-colors duration-150 group" style={{ animationDelay: `${idx * 40}ms` }}>
                          <td className="px-5 md:px-7 py-4">
                            <div className="flex items-center gap-3.5">
                              <div className="w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:border-blue-200 dark:group-hover:border-blue-700 transition-colors">
                                <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                              </div>
                              <div>
                                <span className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-1 max-w-[200px]">{product.name}</span>
                                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 block">ID: {product._id.slice(-6)}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 md:px-7 py-4">
                            <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-5 md:px-7 py-4">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-bold ${product.stock < 10 ? 'text-red-500' : product.stock < 30 ? 'text-amber-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                {product.stock}
                              </span>
                              <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden hidden md:block">
                                <div className={`h-full rounded-full ${product.stock < 10 ? 'bg-red-400' : product.stock < 30 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                                  style={{ width: `${Math.min(100, product.stock)}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="px-5 md:px-7 py-4">
                            <span className="font-bold text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
                          </td>
                          <td className="px-5 md:px-7 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => openEditModal(product)} className="w-8 h-8 rounded-lg text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 flex items-center justify-center group/edit" title="Edit">
                                <Edit size={14} className="group-hover/edit:scale-110 transition-transform" />
                              </button>
                              <button onClick={() => setDeleteTarget(product)} className="w-8 h-8 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 flex items-center justify-center group/del" title="Delete">
                                <Trash2 size={14} className="group-hover/del:scale-110 transition-transform" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5}>
                          <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center mb-4">
                              <Package size={28} className="text-slate-300 dark:text-slate-600" />
                            </div>
                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                              {searchTerm ? 'No products match your search' : 'No products yet'}
                            </p>
                            <p className="text-xs mt-1 mb-4">
                              {searchTerm ? 'Try a different search term' : 'Add your first product to get started'}
                            </p>
                            {!searchTerm && (
                              <button onClick={openAddModal} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 flex items-center gap-1.5">
                                <Plus size={13} /> Add Product
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl dark:shadow-slate-900/50 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scaleIn">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm ${editTarget ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
                  {editTarget ? <Edit size={15} /> : <Plus size={15} />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editTarget ? 'Edit Product' : 'Add New Product'}</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{editTarget ? 'Update product details' : 'Fill in the product details'}</p>
                </div>
              </div>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center justify-center">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {formError && (
                <div className="flex items-center gap-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl px-4 py-3 text-sm">
                  <AlertCircle size={15} className="flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}
              {[
                { id: 'form-name', label: 'Product Name', key: 'name', type: 'text', placeholder: 'e.g. Sony WH-1000XM5 Headphones' },
                { id: 'form-price', label: 'Price (USD)', key: 'price', type: 'number', placeholder: '0.00', step: '0.01', min: '0' },
                { id: 'form-image', label: 'Image URL', key: 'image', type: 'url', placeholder: 'https://images.unsplash.com/...' },
                { id: 'form-stock', label: 'Stock Quantity', key: 'stock', type: 'number', placeholder: '0', min: '0' }
              ].map(field => (
                <div key={field.key} className="space-y-1.5">
                  <label htmlFor={field.id} className="text-sm font-semibold text-slate-700 dark:text-slate-300">{field.label}</label>
                  <input
                    id={field.id}
                    type={field.type}
                    step={field.step}
                    min={field.min}
                    value={form[field.key]}
                    onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    required
                    className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/30 transition-all bg-white dark:bg-slate-900"
                  />
                </div>
              ))}
              <div className="space-y-1.5">
                <label htmlFor="form-category" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Category</label>
                <select
                  id="form-category"
                  value={form.category}
                  onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/30 transition-all bg-white dark:bg-slate-900"
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="form-description" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
                <textarea
                  id="form-description"
                  value={form.description}
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter product description..."
                  required
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/30 transition-all resize-none bg-white dark:bg-slate-900"
                />
              </div>
              {form.image && (
                <div className="rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-950 flex items-center gap-4">
                  <img src={form.image} alt="Preview" className="w-16 h-16 object-contain rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5" onError={e => { e.target.style.display = 'none'; }} />
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Image Preview</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Product image URL preview</p>
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 py-3 rounded-xl font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200">
                  Cancel
                </button>
                <button
                  id="save-product-btn"
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {saving ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                  ) : (
                    <><Save size={15} /> {editTarget ? 'Save Changes' : 'Add Product'}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl dark:shadow-slate-900/50 w-full max-w-sm p-6 text-center animate-scaleIn">
            <div className="w-16 h-16 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
              <Trash2 size={28} className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Product?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-7 leading-relaxed">
              Are you sure you want to delete <br />
              <span className="font-semibold text-slate-700 dark:text-slate-300">"{deleteTarget.name}"</span>?
              <br />This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 py-3 rounded-xl font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200">
                Cancel
              </button>
              <button
                id="confirm-delete-btn"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 rounded-xl font-semibold text-sm hover:from-red-700 hover:to-rose-700 transition-all duration-200 shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {deleting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Deleting...</> : <><Trash2 size={14} /> Delete</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyframe animations injected via style tag */}
      <style>{`
        @keyframes slideDown { from { opacity: 0; transform: translate(-50%, -20px); } to { opacity: 1; transform: translate(-50%, 0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); } 20%, 40%, 60%, 80% { transform: translateX(3px); } }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.25s ease-out; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
};

export default Dashboard;
