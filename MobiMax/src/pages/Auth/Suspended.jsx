import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Suspended = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-red-100 p-8 text-center animate-fade-in-up">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-50 mb-6">
          <ShieldAlert className="h-10 w-10 text-red-500" />
        </div>
        
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Account Suspended</h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Your access to MobiMax has been temporarily suspended by our administration team. 
          If you believe this is a mistake, please contact support for further assistance.
        </p>

        <div className="space-y-4">
          <a 
            href="mailto:support@mobimax.com" 
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm"
          >
            Contact Support
          </a>
          <Link 
            to="/" 
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Suspended;
