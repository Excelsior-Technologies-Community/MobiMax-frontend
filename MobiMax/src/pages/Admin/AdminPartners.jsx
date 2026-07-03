import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, Users } from 'lucide-react';

const AdminPartners = () => {
  const [partnersList, setPartnersList] = useState([]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/partners');
        const data = await res.json();
        if (data.status === 'success') setPartnersList(data.data);
      } catch (err) {
        console.error('Failed to fetch partners', err);
      }
    };
    fetchPartners();
  }, []);

  const updatePartnerStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/partners/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setPartnersList(partnersList.map(p => p.id === id ? { ...p, status: newStatus } : p));
      }
    } catch (err) {
      console.error('Failed to update partner status', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Partners</h1>
        <p className="text-gray-500 text-sm mt-1">Review and manage partner applications and active partners.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_20px_-8px_rgba(0,0,0,0.1)] border border-gray-100/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAFBFC] border-b border-gray-100">
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email / Phone</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {partnersList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Users className="h-10 w-10 mb-3 text-gray-300" />
                      <p className="text-sm font-medium">No partners found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                partnersList.map(p => (
                  <tr key={p.id} className="hover:bg-[#F8F9FB] transition-colors duration-150">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="h-9 w-9 rounded-xl bg-[#e26a1b]/10 flex items-center justify-center text-[#e26a1b] font-bold text-sm mr-3">
                          {p.company.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{p.company}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 font-medium">{p.name}</td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      <div className="font-medium text-gray-700">{p.email}</div>
                      <div className="text-[11px] uppercase tracking-wider mt-0.5">{p.phone}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase border ${
                        p.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        p.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-red-50 text-red-600 border-red-100'
                      }`}>
                        {p.status === 'active' ? <CheckCircle className="w-3 h-3 mr-1" /> : 
                         p.status === 'pending' ? <Clock className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        {p.status === 'pending' && (
                          <button onClick={() => updatePartnerStatus(p.id, 'active')} className="text-xs font-semibold text-emerald-600 hover:text-white border border-emerald-200 hover:bg-emerald-500 hover:border-emerald-500 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm">
                            Accept
                          </button>
                        )}
                        {p.status === 'active' && (
                          <button onClick={() => updatePartnerStatus(p.id, 'suspended')} className="text-xs font-semibold text-red-600 hover:text-white border border-red-200 hover:bg-red-500 hover:border-red-500 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm">
                            Suspend
                          </button>
                        )}
                        {p.status === 'suspended' && (
                          <button onClick={() => updatePartnerStatus(p.id, 'active')} className="text-xs font-semibold text-emerald-600 hover:text-white border border-emerald-200 hover:bg-emerald-500 hover:border-emerald-500 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm">
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPartners;
