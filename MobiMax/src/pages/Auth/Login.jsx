import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User, Briefcase } from 'lucide-react';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Default to partner tab if URL is /partner/login
  const [activeTab, setActiveTab] = useState(
    location.pathname.includes('partner') ? 'partner' : 'customer'
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Clear errors and inputs when switching tabs
  useEffect(() => {
    setError('');
    setEmail('');
    setPassword('');
  }, [activeTab]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const isPartner = activeTab === 'partner';
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
        
        window.dispatchEvent(new Event('authChange')); // Notify TopBar instantly
        navigate('/'); // Soft redirect
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
    <div className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('customer')}
            className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors relative ${
              activeTab === 'customer' 
                ? 'text-[#e26a1b] bg-[#fff7f2]' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <User className="w-4 h-4" />
            Customer
            {activeTab === 'customer' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e26a1b]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('partner')}
            className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors relative ${
              activeTab === 'partner' 
                ? 'text-[#e26a1b] bg-[#fff7f2]' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Partner
            {activeTab === 'partner' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e26a1b]" />
            )}
          </button>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-500 text-sm">
              Sign in to your {activeTab === 'partner' ? 'partner account' : 'account'} to continue
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-500 border border-red-200 rounded-lg text-sm text-center animate-fade-in">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                {activeTab === 'partner' ? 'Business Email' : 'Email Address'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e26a1b] focus:border-[#e26a1b] sm:text-sm transition-colors"
                  placeholder={activeTab === 'partner' ? 'partner@company.com' : 'you@example.com'}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                  Password
                </label>
                <div className="text-sm">
                  <Link 
                    to={`/forgot-password?type=${activeTab === 'partner' ? 'partner' : 'customer'}`} 
                    className="font-medium text-[#e26a1b] hover:text-[#c45a16] transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e26a1b] focus:border-[#e26a1b] sm:text-sm transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                  activeTab === 'partner'
                    ? 'bg-gray-900 hover:bg-gray-800 focus:ring-gray-900'
                    : 'bg-[#e26a1b] hover:bg-[#c45a16] focus:ring-[#e26a1b]'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col space-y-4">
            <p className="text-center text-sm text-gray-600">
              {activeTab === 'partner' ? 'Want to partner with us?' : "Don't have an account?"}{' '}
              <Link 
                to={activeTab === 'partner' ? '/partner/signup' : '/signup'} 
                className="font-medium text-[#e26a1b] hover:text-[#c45a16] transition-colors"
              >
                {activeTab === 'partner' ? 'Apply now' : 'Sign up now'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
