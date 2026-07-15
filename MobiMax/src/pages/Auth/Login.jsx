import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User, Briefcase, ShoppingBag, Store, ShieldCheck } from 'lucide-react';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isPartner = location.pathname.includes('partner');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Clear errors and inputs when route changes
  useEffect(() => {
    setError('');
    setEmail('');
    setPassword('');
  }, [isPartner]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const endpoint = isPartner 
      ? 'http://localhost:5001/api/partners/login' 
      : 'http://localhost:5001/api/users/login';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        if (isPartner) {
          localStorage.setItem('partnerToken', data.token);
          localStorage.setItem('partnerData', JSON.stringify(data.partner));
        } else {
          localStorage.setItem('userToken', data.token);
          localStorage.setItem('userData', JSON.stringify(data.user));
        }
        
        window.dispatchEvent(new Event('authChange'));
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Cannot connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Login Form */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
          <div className="mb-8 md:mb-10 text-center md:text-left">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl mb-4 bg-gray-50">
              {isPartner ? <Briefcase className="w-8 h-8 text-[#e26a1b]" /> : <User className="w-8 h-8 text-[#e26a1b]" />}
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
              {isPartner ? 'Partner Portal' : 'Welcome Back'}
            </h2>
            <p className="text-gray-500 font-medium">
              {isPartner ? 'Sign in to manage your store and orders' : 'Sign in to your customer account to continue'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium animate-fade-in flex items-center">
              <ShieldCheck className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {isPartner ? 'Business Email' : 'Email Address'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] transition-all font-medium sm:text-sm"
                  placeholder={isPartner ? 'partner@company.com' : 'you@example.com'}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <Link 
                  to={`/forgot-password?type=${isPartner ? 'partner' : 'customer'}`} 
                  className="text-sm font-bold text-[#e26a1b] hover:text-[#c45a16] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] transition-all font-medium sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-white text-sm font-bold shadow-lg shadow-[#e26a1b]/20 hover:shadow-[#e26a1b]/40 focus:outline-none transition-all duration-200 ${
                isPartner
                  ? 'bg-gray-900 hover:bg-gray-800 shadow-gray-900/20 hover:shadow-gray-900/40'
                  : 'bg-[#e26a1b] hover:bg-orange-600'
              } ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 font-medium">
              Don't have an account?{' '}
              <Link to={isPartner ? '/partner/signup' : '/signup'} className="font-bold text-[#e26a1b] hover:text-[#c45a16]">
                Create one now
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side: Informational / Promo */}
        <div className={`w-full md:w-1/2 p-8 md:p-12 text-white flex flex-col justify-center items-center relative overflow-hidden ${isPartner ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-[#e26a1b] to-orange-500'}`}>
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 md:w-64 md:h-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 md:w-64 md:h-64 rounded-full bg-black/10 blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            {isPartner ? (
              <>
                <ShoppingBag className="w-20 h-20 text-white/90 mb-6" />
                <h3 className="text-3xl font-extrabold mb-4">Looking to Shop?</h3>
                <p className="text-gray-300 text-lg mb-10 max-w-sm">
                  Discover thousands of products at unbeatable prices. Switch to the customer portal to start shopping.
                </p>
                <Link 
                  to="/login"
                  className="w-full max-w-xs py-3.5 px-6 rounded-xl bg-white text-gray-900 font-bold hover:bg-gray-50 transition-all shadow-xl hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center"
                >
                  <User className="w-5 h-5 mr-2" />
                  Go to Customer Login
                </Link>
              </>
            ) : (
              <>
                <Store className="w-20 h-20 text-white/90 mb-6" />
                <h3 className="text-3xl font-extrabold mb-4">Are you a Business?</h3>
                <p className="text-orange-100 text-lg mb-10 max-w-sm">
                  Join our partner network and reach thousands of new customers daily. Start growing your business today.
                </p>
                <Link 
                  to="/partner/signup"
                  className="w-full max-w-xs py-3.5 px-6 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/30 hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center mb-4"
                >
                  <Briefcase className="w-5 h-5 mr-2" />
                  Become a Partner
                </Link>
                <Link 
                  to="/partner/login"
                  className="text-orange-100 hover:text-white font-medium text-sm transition-colors"
                >
                  Already a partner? Sign in here
                </Link>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
