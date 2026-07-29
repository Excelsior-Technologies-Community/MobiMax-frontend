import React, { useState, useEffect } from 'react';
import { User, Store, Shield, Save, Key, Mail, Phone, Building2, MapPin, Check, Settings as SettingsIcon, Lock, Fingerprint } from 'lucide-react';

const PartnerSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    store_name: '',
    store_category: '',
    store_address: '',
    store_city: '',
    store_state: '',
    store_country: '',
    store_pincode: ''
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [securityData, setSecurityData] = useState({
    two_factor_auth_enabled: 'false',
    app_lock_enabled: 'false',
    app_lock_pin: '',
    app_lock_pages: '',
    biometric_enabled: 'false'
  });

  // App lock change pin states
  const [originalPin, setOriginalPin] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [oldPinInput, setOldPinInput] = useState('');
  const [oldPinError, setOldPinError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('partnerToken') || sessionStorage.getItem('partnerToken');
      const res = await fetch('http://localhost:5001/api/partners/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 'success') {
        setProfileData({
          name: data.partner.name || '',
          email: data.partner.email || '',
          phone: data.partner.phone || '',
          company: data.partner.company || '',
          store_name: data.partner.store_name || '',
          store_category: data.partner.store_category || '',
          store_address: data.partner.store_address || '',
          store_city: data.partner.store_city || '',
          store_state: data.partner.store_state || '',
          store_country: data.partner.store_country || '',
          store_pincode: data.partner.store_pincode || ''
        });
        setSecurityData({
          two_factor_auth_enabled: data.partner.two_factor_auth_enabled || 'false',
          app_lock_enabled: data.partner.app_lock_enabled || 'false',
          app_lock_pin: data.partner.app_lock_pin || '',
          app_lock_pages: data.partner.app_lock_pages || '',
          biometric_enabled: data.partner.biometric_enabled || 'false'
        });
        setOriginalPin(data.partner.app_lock_pin || '');
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSecurityChange = (key, value) => {
    setSecurityData(prev => ({ ...prev, [key]: value }));
  };

  const saveProfile = async () => {
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const token = localStorage.getItem('partnerToken') || sessionStorage.getItem('partnerToken');
      const res = await fetch('http://localhost:5001/api/partners/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(profileData)
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSuccessMsg('Settings updated successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setErrorMsg('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const saveSecurity = async () => {
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const token = localStorage.getItem('partnerToken') || sessionStorage.getItem('partnerToken');
      
      // Update Security settings (App Lock, 2FA, Biometrics)
      const secRes = await fetch('http://localhost:5001/api/partners/security', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(securityData)
      });
      
      const secData = await secRes.json();
      if (secData.status !== 'success') {
        throw new Error(secData.message || 'Failed to update security settings');
      }

      // Update password if fields are filled
      if (passwordData.oldPassword && passwordData.newPassword) {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          throw new Error('New passwords do not match!');
        }
        const pwRes = await fetch('http://localhost:5001/api/partners/change-password', {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({
            oldPassword: passwordData.oldPassword,
            newPassword: passwordData.newPassword
          })
        });
        const pwData = await pwRes.json();
        if (pwData.status !== 'success') {
          throw new Error(pwData.message || 'Failed to change password');
        }
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      }

      setSuccessMsg('Security settings updated successfully!');
      setOriginalPin(securityData.app_lock_pin);
      setIsChangingPin(false);
      setOldPinInput('');
      setTimeout(() => setSuccessMsg(''), 3000);

    } catch (err) {
      setErrorMsg(err.message || 'An error occurred while saving.');
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
    { id: 'general', label: 'General Profile', icon: User },
    { id: 'store', label: 'Store Details', icon: Store },
    { id: 'security', label: 'Security & Access', icon: Shield }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-[#e26a1b]" />
            Partner Settings
          </h1>
          <p className="text-gray-500 mt-2">Manage your personal profile and store preferences.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {errorMsg && (
             <span className="text-red-500 text-sm font-medium animate-fade-in-up flex items-center gap-2">
               {errorMsg}
             </span>
          )}
          <div className="flex items-center gap-4">
             {successMsg && (
               <span className="text-emerald-500 text-sm font-medium animate-fade-in-up flex items-center gap-2">
                 <Check className="w-4 h-4" /> {successMsg}
               </span>
             )}
             <button 
               onClick={activeTab === 'security' ? saveSecurity : saveProfile}
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
                  onClick={() => {
                    setActiveTab(tab.id);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
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
                  <User className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Full Name</label>
                    <div className="relative">
                      <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        name="name"
                        value={profileData.name} 
                        onChange={handleProfileChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all font-semibold text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                      Email Address <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-[10px] rounded-full font-bold uppercase tracking-wider">Locked</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input 
                        type="email" 
                        value={profileData.email} 
                        disabled
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-100 border border-gray-200 rounded-xl outline-none font-medium text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input 
                        type="tel" 
                        name="phone"
                        value={profileData.phone} 
                        onChange={handleProfileChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all font-semibold text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Company Name</label>
                    <div className="relative">
                      <Building2 className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        name="company"
                        value={profileData.company} 
                        onChange={handleProfileChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all font-semibold text-gray-900"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Store Details Tab */}
          {activeTab === 'store' && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden animate-fade-in-up">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#e26a1b]/5 to-transparent rounded-bl-[100px] pointer-events-none"></div>
              
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-[#e26a1b]/10 rounded-xl text-[#e26a1b]">
                  <Store className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Store Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700">Display Store Name</label>
                  <div className="relative">
                    <Store className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      name="store_name"
                      value={profileData.store_name} 
                      onChange={handleProfileChange}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all font-semibold text-gray-900"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700">Street Address</label>
                  <div className="relative">
                    <MapPin className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      name="store_address"
                      value={profileData.store_address} 
                      onChange={handleProfileChange}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all font-semibold text-gray-900"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">City</label>
                  <input 
                    type="text" 
                    name="store_city"
                    value={profileData.store_city} 
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all font-semibold text-gray-900"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">State/Province</label>
                  <input 
                    type="text" 
                    name="store_state"
                    value={profileData.store_state} 
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all font-semibold text-gray-900"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Postal/Zip Code</label>
                  <input 
                    type="text" 
                    name="store_pincode"
                    value={profileData.store_pincode} 
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all font-semibold text-gray-900"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Country</label>
                  <input 
                    type="text" 
                    name="store_country"
                    value={profileData.store_country} 
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all font-semibold text-gray-900"
                  />
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
                      <p className="text-sm text-gray-500 mt-1">Require 2FA when logging into your partner account.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={securityData.two_factor_auth_enabled === 'true'}
                      onChange={(e) => handleSecurityChange('two_factor_auth_enabled', e.target.checked ? 'true' : 'false')}
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
                        <h3 className="font-bold text-gray-900 text-lg">Partner App Lock</h3>
                        <p className="text-sm text-gray-500 mt-1 max-w-md">Require a PIN code to access specific pages upon returning to the app.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={securityData.app_lock_enabled === 'true'}
                        onChange={(e) => handleSecurityChange('app_lock_enabled', e.target.checked ? 'true' : 'false')}
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#e26a1b]"></div>
                    </label>
                  </div>

                  {securityData.app_lock_enabled === 'true' && (
                    <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in-up space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="space-y-2 flex-1 max-w-xs">
                          <label className="block text-sm font-semibold text-gray-700">
                            {originalPin ? (isChangingPin ? 'Change PIN' : 'Master PIN') : 'Set 4-Digit PIN'}
                          </label>
                          
                          {!originalPin ? (
                            <input 
                              type="password"
                              maxLength="4"
                              placeholder="••••"
                              value={securityData.app_lock_pin}
                              onChange={(e) => handleSecurityChange('app_lock_pin', e.target.value.replace(/\D/g, ''))}
                              className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all text-center tracking-[1em] font-bold text-lg"
                            />
                          ) : isChangingPin ? (
                            <div className="space-y-3 animate-fade-in-up">
                              <div>
                                <input 
                                  type="password"
                                  maxLength="4"
                                  placeholder="Old PIN"
                                  value={oldPinInput}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    setOldPinInput(val);
                                    if (val.length === 4 && val !== originalPin) {
                                      setOldPinError('Incorrect old PIN');
                                    } else {
                                      setOldPinError('');
                                    }
                                  }}
                                  className={`w-full p-3 bg-white border ${oldPinError ? 'border-red-300 focus:ring-red-500/20 text-red-500' : 'border-gray-200 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b]'} rounded-xl focus:bg-white focus:ring-2 outline-none transition-all text-center tracking-[1em] font-bold text-lg`}
                                />
                                {oldPinError && <p className="text-red-500 text-xs mt-1 text-center font-medium">{oldPinError}</p>}
                              </div>
                              <input 
                                type="password"
                                maxLength="4"
                                placeholder="New PIN"
                                value={securityData.app_lock_pin}
                                disabled={oldPinInput !== originalPin}
                                onChange={(e) => handleSecurityChange('app_lock_pin', e.target.value.replace(/\D/g, ''))}
                                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all text-center tracking-[1em] font-bold text-lg disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed"
                              />
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <input 
                                type="password"
                                value="****"
                                disabled
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-center tracking-[1em] font-bold text-lg text-gray-500"
                              />
                              <button 
                                onClick={() => {
                                  setIsChangingPin(true);
                                  handleSecurityChange('app_lock_pin', '');
                                }}
                                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors active:scale-95"
                              >
                                Change
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="mt-7 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100 flex-1">
                          <strong>Note:</strong> Save settings to activate. Do not forget this PIN!
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-700">Select Pages to Lock</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {[
                            { path: '/partner/dashboard', label: 'Dashboard' },
                            { path: '/partner/orders', label: 'Orders' },
                            { path: '/partner/products', label: 'Products' },
                            { path: '/partner/stock', label: 'Stock Updates' },
                            { path: '/partner/bulk-orders', label: 'Bulk Orders' },
                            { path: '/partner/earnings', label: 'Earnings' },
                            { path: '/partner/settings', label: 'Settings' }
                          ].map(page => {
                            const isSelected = (securityData.app_lock_pages || '').includes(page.path);
                            return (
                              <label key={page.path} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-[#e26a1b]/10 border-[#e26a1b]/30 text-[#e26a1b]' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
                                <input 
                                  type="checkbox"
                                  className="w-4 h-4 text-[#e26a1b] rounded border-gray-300 focus:ring-[#e26a1b]"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    const pagesArr = (securityData.app_lock_pages || '').split(',').filter(Boolean);
                                    if (e.target.checked) {
                                      pagesArr.push(page.path);
                                    } else {
                                      const idx = pagesArr.indexOf(page.path);
                                      if (idx > -1) pagesArr.splice(idx, 1);
                                    }
                                    handleSecurityChange('app_lock_pages', pagesArr.join(','));
                                  }}
                                />
                                <span className="text-sm font-medium">{page.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Biometric Settings */}
                <div className={`p-5 rounded-2xl border transition-all duration-500 relative overflow-hidden ${securityData.biometric_enabled === 'true' ? 'bg-[#e26a1b]/5 border-[#e26a1b]/30 shadow-[0_0_20px_rgba(226,106,27,0.1)]' : 'bg-gray-50 border-gray-100 hover:border-[#e26a1b]/20'}`}>
                  
                  {/* Dynamic background animation when active */}
                  {securityData.biometric_enabled === 'true' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#e26a1b]/10 to-transparent w-full h-full animate-biometric-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
                  )}

                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 p-3 rounded-2xl shadow-sm border transition-all duration-500 relative overflow-hidden ${securityData.biometric_enabled === 'true' ? 'bg-white border-[#e26a1b]/30 shadow-[0_0_15px_rgba(226,106,27,0.2)]' : 'bg-white border-gray-100'}`}>
                        <Fingerprint className={`w-7 h-7 transition-colors duration-500 ${securityData.biometric_enabled === 'true' ? 'text-[#e26a1b]' : 'text-gray-400'}`} strokeWidth={1.5} />
                        {/* Scanning laser line effect */}
                        {securityData.biometric_enabled === 'true' && (
                          <div className="absolute left-0 right-0 h-[2px] bg-[#e26a1b] shadow-[0_0_8px_2px_rgba(226,106,27,0.8)] animate-biometric-scan"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                          Biometric Authentication
                          {securityData.biometric_enabled === 'true' && (
                            <span className="flex h-2.5 w-2.5 relative ml-1">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e26a1b] opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#e26a1b]"></span>
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 max-w-md">Enable Touch ID, Face ID, or Windows Hello for faster, secure partner access without a password.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={securityData.biometric_enabled === 'true'}
                        onChange={(e) => handleSecurityChange('biometric_enabled', e.target.checked ? 'true' : 'false')}
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#e26a1b]"></div>
                    </label>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Change Password</h3>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Current Password</label>
                      <div className="relative">
                        <Key className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input 
                          type="password" 
                          name="oldPassword"
                          value={passwordData.oldPassword}
                          onChange={handlePasswordChange}
                          placeholder="••••••••"
                          className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all font-medium"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">New Password</label>
                      <div className="relative">
                        <Key className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input 
                          type="password" 
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="••••••••"
                          className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Confirm New Password</label>
                      <div className="relative">
                        <Key className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input 
                          type="password" 
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          placeholder="••••••••"
                          className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PartnerSettings;
