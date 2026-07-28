import React, { useEffect, useState } from 'react';
import { Save, Settings as SettingsIcon, Layout, Eye, Bell, Activity, Check, Store, Percent, Shield, Mail, Lock, Timer, Wallet, Calendar, BellRing, Server } from 'lucide-react';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    ad_duration: '5000',
    ad_shuffle: 'false',
    popup_enabled: 'true',
    popup_delay: '1000',
    popup_frequency: 'session',
    auto_approve_partners: 'false',
    platform_commission_rate: '10',
    maintenance_mode: 'false',
    support_email: 'support@mobimax.com',
    two_factor_auth_required: 'false',
    session_timeout_minutes: '30',
    app_lock_enabled: 'false',
    app_lock_pin: '',
    minimum_payout_amount: '5000',
    payout_schedule: 'monthly',
    email_notifications_enabled: 'true'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/admin/settings');
        const json = await res.json();
        if (json.status === 'success') {
          setSettings(prev => ({ ...prev, ...json.data }));
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg('');
    try {
      const res = await fetch('http://localhost:5001/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const json = await res.json();
      if (json.status === 'success') {
        setSuccessMsg('Settings updated successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#e26a1b]"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'billing', label: 'Payments', icon: Wallet },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'ads', label: 'Advertisements', icon: Layout },
    { id: 'system', label: 'System Health', icon: Server }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-[#e26a1b]" />
            Platform Settings
          </h1>
          <p className="text-gray-500 mt-2">Manage global configurations across the entire MobiMax ecosystem.</p>
        </div>
        <div className="flex items-center gap-4">
           {successMsg && (
             <span className="text-emerald-500 text-sm font-medium animate-fade-in-up flex items-center gap-2">
               <Check className="w-4 h-4" /> {successMsg}
             </span>
           )}
           <button 
             onClick={handleSave}
             disabled={saving}
             className={`py-3 px-6 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#e26a1b] hover:bg-[#d65a11] hover:shadow-lg hover:-translate-y-0.5'}`}
           >
             {saving ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
             ) : (
               <><Save className="w-5 h-5" /> Save Changes</>
             )}
           </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex-shrink-0 sticky top-6">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all duration-200 text-left ${
                    isActive 
                      ? 'bg-[#e26a1b]/10 text-[#e26a1b]' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#e26a1b]' : 'text-gray-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 w-full min-w-0">
          
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden animate-fade-in-up">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#e26a1b]/5 to-transparent rounded-bl-[100px] pointer-events-none"></div>
              
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-[#e26a1b]/10 rounded-xl text-[#e26a1b]">
                  <SettingsIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">General Platform Settings</h2>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 transition-colors hover:border-red-100">
                  <div className="flex items-start gap-4">
                    <div className="mt-1"><Shield className="w-5 h-5 text-red-500" /></div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Maintenance Mode</h3>
                      <p className="text-sm text-gray-500 mt-1">Temporarily disable the public storefront. Admins can still access the dashboard.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.maintenance_mode === 'true'}
                      onChange={(e) => handleChange('maintenance_mode', e.target.checked ? 'true' : 'false')}
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 transition-colors hover:border-[#e26a1b]/20">
                  <div className="flex items-start gap-4">
                    <div className="mt-1"><Store className="w-5 h-5 text-gray-400" /></div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Auto-Approve Partners</h3>
                      <p className="text-sm text-gray-500 mt-1">Automatically approve new partner registrations without manual KYC review.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.auto_approve_partners === 'true'}
                      onChange={(e) => handleChange('auto_approve_partners', e.target.checked ? 'true' : 'false')}
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#e26a1b]"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Percent className="w-4 h-4 text-gray-400" />
                      Global Commission Rate (%)
                    </label>
                    <input 
                      type="number"
                      value={settings.platform_commission_rate}
                      onChange={(e) => handleChange('platform_commission_rate', e.target.value)}
                      className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all"
                    />
                    <p className="text-xs text-gray-500">The default percentage taken from partner sales.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      Support Email Address
                    </label>
                    <input 
                      type="email"
                      value={settings.support_email}
                      onChange={(e) => handleChange('support_email', e.target.value)}
                      className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all"
                    />
                    <p className="text-xs text-gray-500">Email displayed to customers for platform support.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden animate-fade-in-up">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#e26a1b]/5 to-transparent rounded-bl-[100px] pointer-events-none"></div>
              
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-[#e26a1b]/10 rounded-xl text-[#e26a1b]">
                  <Wallet className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Payments & Billing</h2>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-gray-400" />
                      Minimum Payout Amount (₹)
                    </label>
                    <input 
                      type="number"
                      value={settings.minimum_payout_amount}
                      onChange={(e) => handleChange('minimum_payout_amount', e.target.value)}
                      className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all"
                    />
                    <p className="text-xs text-gray-500">Threshold required before a partner can request withdrawal.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      Default Payout Schedule
                    </label>
                    <select 
                      value={settings.payout_schedule}
                      onChange={(e) => handleChange('payout_schedule', e.target.value)}
                      className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="bi-weekly">Bi-Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                    <p className="text-xs text-gray-500">How often partner payouts are automatically processed.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden animate-fade-in-up">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#e26a1b]/5 to-transparent rounded-bl-[100px] pointer-events-none"></div>
              
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-[#e26a1b]/10 rounded-xl text-[#e26a1b]">
                  <Shield className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Security & Access</h2>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 transition-colors hover:border-[#e26a1b]/20">
                  <div className="flex items-start gap-4">
                    <div className="mt-1"><Lock className="w-5 h-5 text-gray-400" /></div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Force Two-Factor Authentication (2FA)</h3>
                      <p className="text-sm text-gray-500 mt-1">Require all partners and admins to use 2FA when logging in.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.two_factor_auth_required === 'true'}
                      onChange={(e) => handleChange('two_factor_auth_required', e.target.checked ? 'true' : 'false')}
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#e26a1b]"></div>
                  </label>
                </div>

                {/* App Lock Settings */}
                <div className="p-5 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 p-2 bg-white rounded-xl shadow-sm border border-gray-100">
                        <Lock className="w-5 h-5 text-[#e26a1b]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">Master App Lock</h3>
                        <p className="text-sm text-gray-500 mt-1 max-w-md">Require a PIN code to access the Admin Dashboard upon returning to the app.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={settings.app_lock_enabled === 'true'}
                        onChange={(e) => handleChange('app_lock_enabled', e.target.checked ? 'true' : 'false')}
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#e26a1b]"></div>
                    </label>
                  </div>

                  {settings.app_lock_enabled === 'true' && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-end gap-4 animate-fade-in-up">
                      <div className="space-y-2 flex-1 max-w-xs">
                        <label className="block text-sm font-semibold text-gray-700">Set 4-Digit PIN</label>
                        <input 
                          type="password"
                          maxLength="4"
                          placeholder="••••"
                          value={settings.app_lock_pin}
                          onChange={(e) => handleChange('app_lock_pin', e.target.value.replace(/\D/g, ''))}
                          className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all text-center tracking-[1em] font-bold text-lg"
                        />
                      </div>
                      <div className="pb-3 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100 flex-1">
                        <strong>Note:</strong> Save settings to activate. Do not forget this PIN!
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Timer className="w-4 h-4 text-gray-400" />
                    Admin Session Timeout (Minutes)
                  </label>
                  <input 
                    type="number"
                    value={settings.session_timeout_minutes}
                    onChange={(e) => handleChange('session_timeout_minutes', e.target.value)}
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all md:w-1/2"
                  />
                  <p className="text-xs text-gray-500">Automatically log out admin users after this period of inactivity.</p>
                </div>
              </div>
            </div>
          )}

          {/* Ads Tab */}
          {activeTab === 'ads' && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden animate-fade-in-up">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#e26a1b]/5 to-transparent rounded-bl-[100px] pointer-events-none"></div>
              
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-[#e26a1b]/10 rounded-xl text-[#e26a1b]">
                  <Layout className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Advertisement & Popups</h2>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 transition-colors hover:border-[#e26a1b]/20">
                  <div>
                    <h3 className="font-semibold text-gray-900">Enable Promo Popups</h3>
                    <p className="text-sm text-gray-500 mt-1">Show promotional popup to users when they visit the site.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.popup_enabled === 'true'}
                      onChange={(e) => handleChange('popup_enabled', e.target.checked ? 'true' : 'false')}
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#e26a1b]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 transition-colors hover:border-[#e26a1b]/20">
                  <div>
                    <h3 className="font-semibold text-gray-900">Shuffle Advertisements</h3>
                    <p className="text-sm text-gray-500 mt-1">Randomize the order of ads displayed in banners and popups.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.ad_shuffle === 'true'}
                      onChange={(e) => handleChange('ad_shuffle', e.target.checked ? 'true' : 'false')}
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#e26a1b]"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Popup Delay (ms)</label>
                    <input 
                      type="number"
                      value={settings.popup_delay}
                      onChange={(e) => handleChange('popup_delay', e.target.value)}
                      className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all"
                    />
                    <p className="text-xs text-gray-500">Delay before the popup appears (e.g. 1000 = 1s).</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Ad Slide Duration (ms)</label>
                    <input 
                      type="number"
                      value={settings.ad_duration}
                      onChange={(e) => handleChange('ad_duration', e.target.value)}
                      className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all"
                    />
                    <p className="text-xs text-gray-500">Time each ad banner is shown on screen.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Popup Display Frequency</label>
                  <select 
                    value={settings.popup_frequency}
                    onChange={(e) => handleChange('popup_frequency', e.target.value)}
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all"
                  >
                    <option value="session">Once per Session (Recommended)</option>
                    <option value="always">Every Page Load (Aggressive)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* System Health Tab */}
          {activeTab === 'system' && (
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden animate-fade-in-up">
              <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
                <Activity className="w-64 h-64" />
              </div>
              
              <div className="flex items-center gap-3 mb-2 relative z-10">
                <Server className="w-8 h-8 text-emerald-400" />
                <h3 className="text-3xl font-bold">System Health</h3>
              </div>
              <p className="text-gray-400 text-sm mb-12 relative z-10">Live monitoring of core microservices and infrastructure.</p>
              
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-pulse"></div>
                    <div>
                      <span className="font-bold text-lg block">Database Cluster</span>
                      <span className="text-gray-400 text-xs">Primary Node</span>
                    </div>
                  </div>
                  <span className="text-emerald-400 text-sm font-bold uppercase tracking-wider bg-emerald-400/10 px-4 py-2 rounded-lg">Online</span>
                </div>
                <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-pulse"></div>
                    <div>
                      <span className="font-bold text-lg block">API Gateway</span>
                      <span className="text-gray-400 text-xs">Load Balancer</span>
                    </div>
                  </div>
                  <span className="text-emerald-400 text-sm font-bold uppercase tracking-wider bg-emerald-400/10 px-4 py-2 rounded-lg">Online</span>
                </div>
                <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.8)]"></div>
                    <div>
                      <span className="font-bold text-lg block">Redis Cache</span>
                      <span className="text-gray-400 text-xs">In-Memory Store</span>
                    </div>
                  </div>
                  <span className="text-amber-400 text-sm font-bold uppercase tracking-wider bg-amber-400/10 px-4 py-2 rounded-lg">Syncing</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
