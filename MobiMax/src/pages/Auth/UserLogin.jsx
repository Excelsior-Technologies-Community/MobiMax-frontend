import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const UserLogin = () => {
  return (
    <div className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500 text-sm">
            Sign in to your account to continue
          </p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email Address
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
                className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e26a1b] focus:border-[#e26a1b] sm:text-sm transition-colors"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                Password
              </label>
              <div className="text-sm">
                <a href="#" className="font-medium text-[#e26a1b] hover:text-[#c45a16] transition-colors">
                  Forgot your password?
                </a>
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
                className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e26a1b] focus:border-[#e26a1b] sm:text-sm transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#e26a1b] hover:bg-[#c45a16] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e26a1b] transition-all duration-200"
            >
              Sign in
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col space-y-4">
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-[#e26a1b] hover:text-[#c45a16] transition-colors">
              Sign up now
            </Link>
          </p>
          <div className="relative flex items-center justify-center">
            <span className="bg-white px-2 text-xs text-gray-500">OR</span>
            <div className="absolute w-full h-px bg-gray-200 -z-10"></div>
          </div>
          <Link 
            to="/partner/login" 
            className="w-full flex justify-center py-2 px-4 border border-[#e26a1b] text-sm font-medium rounded-lg text-[#e26a1b] bg-white hover:bg-[#fff7f2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e26a1b] transition-colors"
          >
            Login as a Partner
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
