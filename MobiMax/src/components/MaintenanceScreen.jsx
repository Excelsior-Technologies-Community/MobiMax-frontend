import React from 'react';
import { Settings, ShieldAlert } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

const MaintenanceScreen = () => {
  const { globalSettings } = useSettings();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#e26a1b]"></div>
        
        <div className="w-20 h-20 bg-[#e26a1b]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Settings className="w-10 h-10 text-[#e26a1b] animate-spin-slow" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Under Maintenance</h1>
        <p className="text-gray-500 mb-8">
          We are currently performing scheduled maintenance to improve the MobiMax platform. We'll be back online shortly.
        </p>
        
        <div className="bg-amber-50 rounded-2xl p-4 flex items-start gap-3 text-left">
          <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-800 text-sm">Need urgent assistance?</h3>
            <p className="text-amber-700 text-xs mt-1">
              Contact our support team at <a href={`mailto:${globalSettings.support_email}`} className="font-bold underline">{globalSettings.support_email}</a>
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100">
          <a href="/admin" className="text-sm text-gray-400 hover:text-[#e26a1b] font-medium transition-colors">Admin Login</a>
          <span className="mx-2 text-gray-300">•</span>
          <a href="/partner" className="text-sm text-gray-400 hover:text-[#e26a1b] font-medium transition-colors">Partner Dashboard</a>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceScreen;
