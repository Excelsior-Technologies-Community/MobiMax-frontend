import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Key, ArrowRight, User } from 'lucide-react';

const AdminLogin = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: id, password }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        // Store token/session based on Remember Me
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('adminToken', data.token);
        storage.setItem('adminUser', JSON.stringify(data.admin));
        
        // Redirect to dashboard
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Cannot connect to the server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-10 border border-gray-700">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-900 mb-4 border border-gray-700">
            <Shield className="h-8 w-8 text-[#e26a1b]" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Master Admin</h2>
          <p className="text-gray-400 text-sm">
            Restricted access. Authorized personnel only.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-sm text-red-400 text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="id">
              Admin ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="id"
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
                className="appearance-none block w-full pl-10 pr-3 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#e26a1b] focus:border-transparent sm:text-sm transition-all"
                placeholder="Enter Admin ID"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="appearance-none block w-full pl-10 pr-3 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#e26a1b] focus:border-transparent sm:text-sm transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-[#e26a1b] focus:ring-[#e26a1b] focus:ring-offset-gray-900"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300 cursor-pointer">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-[#e26a1b] hover:text-[#c95d17] transition-colors">
                Forgot password?
              </a>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-[#e26a1b] hover:bg-[#c95d17] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[#e26a1b] transition-all duration-200 shadow-[0_0_15px_rgba(226,106,27,0.3)] hover:shadow-[0_0_25px_rgba(226,106,27,0.5)] ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Authenticating...' : 'Access Portal'}
              {!isLoading && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
