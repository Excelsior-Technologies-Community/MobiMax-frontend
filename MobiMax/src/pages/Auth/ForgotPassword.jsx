import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, ArrowRight, User, Briefcase, CheckCircle, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const typeParam = searchParams.get('type') || 'customer';

  const [activeTab, setActiveTab] = useState(
    typeParam === 'partner' ? 'partner' : 'customer'
  );

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setError('');
    setMessage('');
    setEmail('');
    setIsSuccess(false);
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          type: activeTab === 'partner' ? 'partner' : 'user' 
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setIsSuccess(true);
        setMessage(data.message);
      } else {
        setError(data.message || 'An error occurred. Please try again.');
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
        {!isSuccess && (
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
        )}

        <div className="p-8">
          {isSuccess ? (
            <div className="text-center animate-fade-in-up">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
              <p className="text-gray-600 mb-8 leading-relaxed text-sm">
                {message}
              </p>
              <Link
                to={activeTab === 'partner' ? '/partner/login' : '/login'}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-[#e26a1b] hover:bg-[#c45a16] transition-colors shadow-sm"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
                <p className="text-gray-500 text-sm">
                  Enter your {activeTab === 'partner' ? 'partner' : ''} email and we'll send you a link to reset your password.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-500 border border-red-200 rounded-lg text-sm text-center animate-fade-in">
                  {error}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
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
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col space-y-4">
                <Link 
                  to={activeTab === 'partner' ? '/partner/login' : '/login'} 
                  className="flex items-center justify-center text-sm font-medium text-gray-600 hover:text-[#e26a1b] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
