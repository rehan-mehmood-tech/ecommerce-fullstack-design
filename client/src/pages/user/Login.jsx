import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, signup, user } = useAuth();
  const [tab, setTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({ name: '', email: '', password: '' });

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'login') {
        await login(form.email, form.password);
      } else {
        await signup(form.email, form.password);
      }
      navigate('/');
    } catch (err) {
      const messages = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/invalid-credential': 'Invalid email or password.',
      };
      setError(messages[err.code] || err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-[#0D6EFD] rounded-xl flex items-center justify-center text-white shadow-lg dark:shadow-slate-900/50">
            <ShoppingBag size={26} className="stroke-[2.5]" />
          </div>
          <span className="text-3xl font-bold text-[#0D6EFD] tracking-tight">Quikart</span>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-slate-900/50 border border-gray-100 dark:border-slate-800 overflow-hidden">

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-slate-700">
            <button
              id="login-tab"
              onClick={() => { setTab('login'); setError(''); }}
              className={`flex-1 py-4 text-sm font-semibold transition ${
                tab === 'login'
                  ? 'text-[#0D6EFD] border-b-2 border-[#0D6EFD] bg-blue-50/40 dark:bg-blue-900/20'
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
              }`}
            >
              Sign In
            </button>
            <button
              id="signup-tab"
              onClick={() => { setTab('signup'); setError(''); }}
              className={`flex-1 py-4 text-sm font-semibold transition ${
                tab === 'signup'
                  ? 'text-[#0D6EFD] border-b-2 border-[#0D6EFD] bg-blue-50/40 dark:bg-blue-900/20'
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {tab === 'login' ? 'Welcome back!' : 'Create your account'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                {tab === 'login'
                  ? 'Sign in to continue to Quikart'
                  : 'Join thousands of happy shoppers'}
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="flex items-center gap-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg px-4 py-3 text-sm">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Name field (signup only) */}
            {tab === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Full Name</label>
                <div className="relative">
                  <User size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                  <input
                    id="name-input"
                    name="name"
                    type="text"
                    required={tab === 'signup'}
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-sm outline-none focus:border-[#0D6EFD] focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Email Address</label>
              <div className="relative">
                <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                <input
                  id="email-input"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-sm outline-none focus:border-[#0D6EFD] focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Password</label>
              <div className="relative">
                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                <input
                  id="password-input"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder={tab === 'signup' ? 'At least 6 characters' : '••••••••'}
                  className="w-full pl-10 pr-11 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-sm outline-none focus:border-[#0D6EFD] focus:ring-2 focus:ring-blue-100 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-400 transition"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-[#0D6EFD] text-white py-3.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Please wait...</span>
                </>
              ) : (
                tab === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>

            {/* Footer link */}
            <p className="text-center text-sm text-gray-500 dark:text-slate-400">
              {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => { setTab(tab === 'login' ? 'signup' : 'login'); setError(''); }}
                className="text-[#0D6EFD] font-semibold hover:underline"
              >
                {tab === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;
