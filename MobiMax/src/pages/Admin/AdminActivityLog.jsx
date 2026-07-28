import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, User, Mail, Activity, ChevronRight, Building2, MapPin } from 'lucide-react';

const AdminActivityLog = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/admin/partners');
        const json = await res.json();
        if (json.status === 'success') {
          setPartners(json.data);
        }
      } catch (error) {
        console.error('Failed to fetch partners:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Partner Activities</h1>
          <p className="text-gray-500 text-sm mt-1">Select a partner to view their comprehensive activity and stats.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-3xl shadow-[0_2px_20px_-8px_rgba(0,0,0,0.1)] border border-gray-100/80">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#e26a1b]"></div>
        </div>
      ) : partners.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl shadow-[0_2px_20px_-8px_rgba(0,0,0,0.1)] border border-gray-100/80 text-gray-500">
          <Store className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No partners found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {partners.map(partner => (
            <Link 
              key={partner.id} 
              to={`/admin/partners/${partner.id}/activity`}
              className="group bg-white rounded-[24px] shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all duration-300 flex flex-col h-full"
            >
              {/* Card Header */}
              <div className="p-6 pb-2 flex justify-between items-start">
                <div className="w-20 h-20 rounded-[20px] bg-[#fff3ec] border border-[#fde8dc] flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-8 h-8 text-[#e26a1b]" />
                </div>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold lowercase ${
                  partner.status === 'active' || partner.status === 'approved' ? 'bg-red-50 text-red-600' :
                  partner.status === 'under_review' ? 'bg-amber-50 text-amber-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {partner.status === 'under_review' ? 'reviewing' : partner.status === 'approved' ? 'active' : partner.status}
                </span>
              </div>
              
              {/* Card Body */}
              <div className="p-6 pt-4 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-[#e26a1b] line-clamp-1 mb-6">
                  {partner.company || partner.name}
                </h3>
                
                <div className="space-y-3 flex-1">
                  <div className="flex items-center text-[15px] text-gray-600">
                    <User className="w-5 h-5 mr-3 text-gray-400" />
                    <span className="truncate">{partner.name || ''}</span>
                  </div>
                  <div className="flex items-center text-[15px] text-gray-600">
                    <Mail className="w-5 h-5 mr-3 text-gray-400" />
                    <span className="truncate">{partner.email}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-4 bg-[#fff8f5] flex items-center justify-between transition-colors">
                <div className="flex items-center text-[#e26a1b] font-bold text-[15px]">
                  <Activity className="w-5 h-5 mr-2.5" />
                  View Activity
                </div>
                <ChevronRight className="w-5 h-5 text-[#e26a1b]" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminActivityLog;
