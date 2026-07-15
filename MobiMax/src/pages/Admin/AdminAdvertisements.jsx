import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, Settings, Check, X, RefreshCw, UploadCloud, Loader2 } from 'lucide-react';

const AdminAdvertisements = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [settings, setSettings] = useState({ ad_duration: 5000, ad_shuffle: 'false', popup_enabled: 'true', popup_delay: 1000, popup_frequency: 'session' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isAddingAd, setIsAddingAd] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // New Ad Form State
  const [newAdUrl, setNewAdUrl] = useState('');
  const [newAdLink, setNewAdLink] = useState('');

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      await uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:5001/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        setNewAdUrl(data.data.url);
      } else {
        alert('Upload failed: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('An error occurred during upload.');
    }
    setIsUploading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [adsRes, settingsRes] = await Promise.all([
        fetch('http://localhost:5001/api/admin/advertisements'),
        fetch('http://localhost:5001/api/admin/settings')
      ]);

      const adsData = await adsRes.json();
      const settingsData = await settingsRes.json();

      if (adsData.status === 'success') setAdvertisements(adsData.data);
      if (settingsData.status === 'success') {
        setSettings({
          ad_duration: parseInt(settingsData.data.ad_duration) || 5000,
          ad_shuffle: settingsData.data.ad_shuffle || 'false',
          popup_enabled: settingsData.data.popup_enabled || 'true',
          popup_delay: parseInt(settingsData.data.popup_delay) || 1000,
          popup_frequency: settingsData.data.popup_frequency || 'session'
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setIsLoading(false);
  };

  const saveSettings = async () => {
    setIsSavingSettings(true);
    try {
      await fetch('http://localhost:5001/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      // Handle success notification here if needed
    } catch (error) {
      console.error('Error saving settings:', error);
    }
    setIsSavingSettings(false);
  };

  const handleAddAd = async (e) => {
    e.preventDefault();
    if (!newAdUrl) return;

    try {
      const res = await fetch('http://localhost:5001/api/admin/advertisements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: newAdUrl, link_url: newAdLink, sort_order: advertisements.length }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setAdvertisements([data.data, ...advertisements]);
        setNewAdUrl('');
        setNewAdLink('');
        setIsAddingAd(false);
      }
    } catch (error) {
      console.error('Error adding ad:', error);
    }
  };

  const toggleAdStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus ? 0 : 1;
      await fetch(`http://localhost:5001/api/admin/advertisements/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: newStatus }),
      });
      setAdvertisements(advertisements.map(ad => ad.id === id ? { ...ad, is_active: newStatus } : ad));
    } catch (error) {
      console.error('Error toggling ad status:', error);
    }
  };

  const deleteAd = async (id) => {
    if (!window.confirm('Are you sure you want to delete this advertisement?')) return;
    try {
      await fetch(`http://localhost:5001/api/admin/advertisements/${id}`, { method: 'DELETE' });
      setAdvertisements(advertisements.filter(ad => ad.id !== id));
    } catch (error) {
      console.error('Error deleting ad:', error);
    }
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center items-center h-64"><RefreshCw className="animate-spin h-8 w-8 text-[#111827]" /></div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advertisement Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage homepage banners and carousel settings.</p>
        </div>
        <button 
          onClick={() => setIsAddingAd(true)}
          className="bg-[#111827] text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-800 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Banner
        </button>
      </div>

      {/* Settings Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-gray-50 gap-4">
          <div className="flex items-center">
            <Settings className="w-5 h-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Global Advertisement Settings</h2>
          </div>
          <button 
            onClick={saveSettings}
            disabled={isSavingSettings}
            className="bg-[#e26a1b] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#c45a16] transition-colors disabled:opacity-50 w-full sm:w-auto"
          >
            {isSavingSettings ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Main Slider Speed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Main Slider Duration (ms)</label>
            <input 
              type="number" 
              value={settings.ad_duration}
              onChange={(e) => setSettings({...settings, ad_duration: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111827] focus:border-transparent outline-none"
              placeholder="e.g. 5000 for 5 seconds"
            />
            <p className="text-xs text-gray-500 mt-1">Speed of the homepage hero slider</p>
          </div>

          {/* Enable Popup */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enable Promotional Popup</label>
            <select 
              value={settings.popup_enabled}
              onChange={(e) => setSettings({...settings, popup_enabled: e.target.value})}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111827] focus:border-transparent outline-none"
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Master switch for the modal popup</p>
          </div>

          {/* Popup Delay */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Popup Delay (ms)</label>
            <input 
              type="number" 
              value={settings.popup_delay}
              onChange={(e) => setSettings({...settings, popup_delay: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111827] focus:border-transparent outline-none"
              placeholder="e.g. 1000 for 1 second"
            />
            <p className="text-xs text-gray-500 mt-1">Time to wait before showing popup</p>
          </div>

          {/* Popup Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Popup Frequency</label>
            <select 
              value={settings.popup_frequency}
              onChange={(e) => setSettings({...settings, popup_frequency: e.target.value})}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111827] focus:border-transparent outline-none"
            >
              <option value="session">Every Session (Default)</option>
              <option value="daily">Once per Day</option>
              <option value="always">Always (Every Load)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">How often the user sees the popup</p>
          </div>

          {/* Shuffle Ads */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shuffle Advertisements</label>
            <select 
              value={settings.ad_shuffle}
              onChange={(e) => setSettings({...settings, ad_shuffle: e.target.value})}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111827] focus:border-transparent outline-none"
            >
              <option value="false">Sequential (Ordered)</option>
              <option value="true">Randomized (Shuffled)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Order in which banners are chosen</p>
          </div>
        </div>
      </div>

      {/* Add New Ad Modal */}
      {isAddingAd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Add New Advertisement</h2>
              <button onClick={() => setIsAddingAd(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddAd} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Upload *</label>
                
                {/* Drag and Drop Zone */}
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors ${
                    isDragging 
                      ? 'border-[#e26a1b] bg-[#e26a1b]/5' 
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={isUploading}
                  />
                  
                  {isUploading ? (
                    <div className="flex flex-col items-center py-4">
                      <Loader2 className="w-8 h-8 text-[#e26a1b] animate-spin mb-2" />
                      <p className="text-sm font-medium text-gray-600">Uploading image...</p>
                    </div>
                  ) : newAdUrl ? (
                    <div className="flex flex-col items-center text-center">
                      <Check className="w-10 h-10 text-green-500 mb-2" />
                      <p className="text-sm font-medium text-gray-900">Image uploaded successfully!</p>
                      <p className="text-xs text-gray-500 mt-1">Drag a new image or click to replace</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <UploadCloud className={`w-10 h-10 mb-3 ${isDragging ? 'text-[#e26a1b]' : 'text-gray-400'}`} />
                      <p className="text-sm font-medium text-gray-900">Drag and drop an image here</p>
                      <p className="text-xs text-gray-500 mt-1">or click to browse from your computer</p>
                      <p className="text-xs text-gray-400 mt-3">Recommended size: 1200x500px</p>
                    </div>
                  )}
                </div>

                {/* Optional Manual URL Fallback */}
                <div className="mt-3">
                  <div className="flex items-center text-xs text-gray-500 mb-1">
                    <span className="flex-1 h-px bg-gray-200"></span>
                    <span className="px-2">OR PASTE URL</span>
                    <span className="flex-1 h-px bg-gray-200"></span>
                  </div>
                  <input 
                    type="url" 
                    value={newAdUrl}
                    onChange={(e) => setNewAdUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111827] outline-none text-sm"
                    placeholder="https://example.com/banner.jpg"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Link URL (Optional)</label>
                <input 
                  type="url" 
                  value={newAdLink}
                  onChange={(e) => setNewAdLink(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111827] outline-none"
                  placeholder="https://example.com/promotion"
                />
              </div>
              
              {/* Preview */}
              {newAdUrl && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preview</label>
                  <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img src={newAdUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/1200x500?text=Invalid+Image+URL' }} />
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsAddingAd(false)}
                  className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-[#111827] text-white font-medium rounded-lg hover:bg-gray-800"
                >
                  Add Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Advertisements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {advertisements.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No advertisements found</h3>
            <p className="text-gray-500 text-sm">Click "Add New Banner" to create your first ad.</p>
          </div>
        ) : (
          advertisements.map((ad) => (
            <div key={ad.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 ${ad.is_active ? 'border-gray-200' : 'border-gray-200 opacity-60 grayscale-[50%]'}`}>
              <div className="h-48 w-full bg-gray-100 relative group">
                <img src={ad.image_url} alt="Advertisement" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  {ad.link_url && (
                    <a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100">
                      Test Link
                    </a>
                  )}
                </div>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleAdStatus(ad.id, ad.is_active)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${ad.is_active ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${ad.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <span className="text-sm font-medium text-gray-700">
                    {ad.is_active ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <button 
                  onClick={() => deleteAd(ad.id)}
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Advertisement"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminAdvertisements;
