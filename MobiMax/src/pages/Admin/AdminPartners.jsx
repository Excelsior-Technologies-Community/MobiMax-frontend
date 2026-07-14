import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, Users, Trash2, Eye, X } from 'lucide-react';
import io from 'socket.io-client';

const socket = io('http://localhost:5001');

const AdminPartners = () => {
  const [partnersList, setPartnersList] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/admin/partners');
        const data = await res.json();
        if (data.status === 'success') setPartnersList(data.data);
      } catch (err) {
        console.error('Failed to fetch partners', err);
      }
    };
    fetchPartners();

    // Socket.io Event Listeners
    socket.on('partner_registered', (newPartner) => {
      setPartnersList((prev) => [newPartner, ...prev]);
    });

    socket.on('partner_status_updated', (updatedData) => {
      setPartnersList((prev) => prev.map(p => p.id === updatedData.id ? { ...p, ...updatedData } : p));
    });

    socket.on('partner_deleted', ({ id }) => {
      setPartnersList((prev) => prev.filter(p => p.id !== id));
    });

    return () => {
      socket.off('partner_registered');
      socket.off('partner_status_updated');
      socket.off('partner_deleted');
    };
  }, []);

  const updatePartnerStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5001/api/admin/partners/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setPartnersList(partnersList.map(p => p.id === id ? { ...p, status: newStatus } : p));
        if (selectedPartner && selectedPartner.id === id) {
          setSelectedPartner(null);
        }
      }
    } catch (err) {
      console.error('Failed to update partner status', err);
    }
  };

  const deletePartner = async (id) => {
    if (!window.confirm('Are you sure you want to delete this partner? This action cannot be undone.')) return;
    
    try {
      const res = await fetch(`http://localhost:5001/api/admin/partners/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setPartnersList(partnersList.filter(p => p.id !== id));
      } else {
        alert('Failed to delete partner');
      }
    } catch (err) {
      console.error('Failed to delete partner', err);
    }
  };

  const statusColors = {
    active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    under_review: 'bg-blue-50 text-blue-600 border-blue-100',
    pending: 'bg-amber-50 text-amber-600 border-amber-100',
    suspended: 'bg-red-50 text-red-600 border-red-100'
  };

  const renderModal = () => {
    if (!selectedPartner) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                KYC Review: {selectedPartner.company}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Review documents and details before approving.</p>
            </div>
            <button onClick={() => setSelectedPartner(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Info Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2 mb-3">Owner Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Name</p>
                      <p className="font-semibold text-gray-900">{selectedPartner.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Email</p>
                      <p className="font-semibold text-gray-900">{selectedPartner.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Phone</p>
                      <p className="font-semibold text-gray-900">{selectedPartner.phone}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2 mb-3">Store Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Store Name</p>
                      <p className="font-semibold text-gray-900">{selectedPartner.store_name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Category</p>
                      <p className="font-semibold text-gray-900">{selectedPartner.store_category || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500 mb-1">Address</p>
                      <p className="font-semibold text-gray-900">
                        {selectedPartner.store_address || 'N/A'}<br/>
                        {selectedPartner.store_city || ''}, {selectedPartner.store_state || ''} {selectedPartner.store_pincode || ''}<br/>
                        {selectedPartner.store_country || ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2 mb-3">Identification</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Aadhar Number</p>
                      <p className="font-semibold text-gray-900">{selectedPartner.aadhar_number || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">PAN Number</p>
                      <p className="font-semibold text-gray-900">{selectedPartner.pan_number || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Column */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2 mb-3">Uploaded Documents</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-2">Store Logo</p>
                    <div className="h-32 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center">
                      {selectedPartner.store_logo ? <img src={selectedPartner.store_logo} alt="Logo" className="object-cover w-full h-full" /> : <span className="text-gray-400 text-xs">No image</span>}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-2">Partner Photo</p>
                    <div className="h-32 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center">
                      {selectedPartner.partner_photo ? <img src={selectedPartner.partner_photo} alt="Photo" className="object-cover w-full h-full" /> : <span className="text-gray-400 text-xs">No image</span>}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-2">Aadhar Card</p>
                    <div className="h-32 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center">
                      {selectedPartner.aadhar_card ? <img src={selectedPartner.aadhar_card} alt="Aadhar" className="object-cover w-full h-full" /> : <span className="text-gray-400 text-xs">No document</span>}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-2">PAN Card</p>
                    <div className="h-32 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center">
                      {selectedPartner.pan_card ? <img src={selectedPartner.pan_card} alt="PAN" className="object-cover w-full h-full" /> : <span className="text-gray-400 text-xs">No document</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button onClick={() => setSelectedPartner(null)} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Close
            </button>
            <button onClick={() => updatePartnerStatus(selectedPartner.id, 'suspended')} className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm">
              Reject / Suspend
            </button>
            <button onClick={() => updatePartnerStatus(selectedPartner.id, 'active')} className="px-4 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors shadow-sm">
              Approve Partner
            </button>
          </div>
        </div>
      </div>
    );
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
                        <div className="h-9 w-9 rounded-xl bg-[#e26a1b]/10 flex items-center justify-center text-[#e26a1b] font-bold text-sm mr-3 flex-shrink-0">
                          {p.store_logo ? (
                            <img src={p.store_logo} alt="Logo" className="h-full w-full object-cover rounded-xl" />
                          ) : (
                            p.company.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-900 block">{p.company}</span>
                          <span className="text-xs text-gray-500">{p.store_category || 'New'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 font-medium">{p.name}</td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      <div className="font-medium text-gray-700">{p.email}</div>
                      <div className="text-[11px] uppercase tracking-wider mt-0.5">{p.phone}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase border ${statusColors[p.status] || statusColors.pending}`}>
                        {p.status === 'active' ? <CheckCircle className="w-3 h-3 mr-1" /> : 
                         (p.status === 'pending' || p.status === 'under_review') ? <Clock className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                        {p.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setSelectedPartner(p)} 
                          className="flex items-center text-xs font-semibold text-blue-600 hover:text-white border border-blue-200 hover:bg-blue-500 hover:border-blue-500 px-3 py-1.5 rounded-lg transition-all duration-200 shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          Review KYC
                        </button>
                        
                        <button 
                          onClick={() => deletePartner(p.id)} 
                          title="Delete Partner"
                          className="flex items-center justify-center w-8 h-8 rounded-lg text-red-500 hover:text-white border border-red-100 hover:bg-red-500 hover:border-red-500 transition-all duration-200 shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {renderModal()}
    </div>
  );
};

export default AdminPartners;
