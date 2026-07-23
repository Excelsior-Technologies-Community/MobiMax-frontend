import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, Users, Trash2, Eye, X, User, Store, MapPin, CreditCard, ZoomIn, FileText, Building2, Phone, Mail, Image as ImageIcon } from 'lucide-react';
import io from 'socket.io-client';

const socket = io('http://localhost:5001');

const AdminPartners = () => {
  const [partnersList, setPartnersList] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [previewImage, setPreviewImage] = useState(null);

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
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">
          
          {/* Header */}
          <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-gray-900">
                  KYC Review
                </h2>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase border ${statusColors[selectedPartner.status] || statusColors.pending}`}>
                  {selectedPartner.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-500">Review documents and details for <span className="font-semibold text-gray-700">{selectedPartner.company}</span></p>
            </div>
            <button onClick={() => setSelectedPartner(null)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-8 overflow-y-auto flex-1 bg-gray-50/50">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Details */}
              <div className="lg:col-span-5 space-y-6 pb-4">
                
                {/* Owner Details Card */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/80 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Owner Details</h3>
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Full Name</p>
                      <p className="font-semibold text-gray-900">{selectedPartner.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</p>
                      <p className="font-medium text-gray-900 break-words" title={selectedPartner.email}>{selectedPartner.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone</p>
                      <p className="font-medium text-gray-900">{selectedPartner.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Store Details Card */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/80 flex items-center gap-2">
                    <Store className="w-4 h-4 text-emerald-500" />
                    <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Store Details</h3>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Store Name</p>
                        <p className="font-semibold text-gray-900">{selectedPartner.store_name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5"><Store className="w-3.5 h-3.5" /> Category</p>
                        <p className="font-medium text-gray-900">{selectedPartner.store_category || 'N/A'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Address</p>
                      <p className="text-sm font-medium text-gray-900 leading-relaxed">
                        {selectedPartner.store_address || 'N/A'}<br/>
                        {selectedPartner.store_city || ''}, {selectedPartner.store_state || ''} {selectedPartner.store_pincode || ''}<br/>
                        {selectedPartner.store_country || ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Identification Card */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/80 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-purple-500" />
                    <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Identification</h3>
                  </div>
                  <div className="p-5 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Aadhar Number</p>
                      <p className="font-mono font-medium text-gray-900 tracking-wide">{selectedPartner.aadhar_number || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">PAN Number</p>
                      <p className="font-mono font-medium text-gray-900 tracking-wide uppercase">{selectedPartner.pan_number || 'N/A'}</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Documents */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden h-full">
                  <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/80 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-500" />
                    <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Uploaded Documents</h3>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                      
                      {/* Document Item Component */}
                      {[
                        { title: 'Store Logo', url: selectedPartner.store_logo, icon: ImageIcon },
                        { title: 'Partner Photo', url: selectedPartner.partner_photo, icon: User },
                        { title: 'Aadhar Card', url: selectedPartner.aadhar_card, icon: CreditCard },
                        { title: 'PAN Card', url: selectedPartner.pan_card, icon: CreditCard }
                      ].map((doc, idx) => (
                        <div key={idx} className="flex flex-col">
                          <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5">
                            <doc.icon className="w-3.5 h-3.5 text-gray-400" />
                            {doc.title}
                          </p>
                          <div 
                            className="group relative h-40 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center cursor-pointer transition-all hover:border-[#e26a1b] hover:shadow-md"
                            onClick={() => doc.url && setPreviewImage(doc.url)}
                          >
                            {doc.url ? (
                              <>
                                <img src={doc.url} alt={doc.title} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                  <div className="bg-white/90 text-gray-900 px-3 py-1.5 rounded-lg shadow-sm font-medium text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                    <ZoomIn className="w-4 h-4" /> Zoom
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="flex flex-col items-center text-gray-400">
                                <FileText className="w-8 h-8 mb-2 opacity-20" />
                                <span className="text-xs font-medium">No document</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
          
          {/* Footer Actions */}
          <div className="px-8 py-5 border-t border-gray-100 bg-white flex justify-end gap-3 sticky bottom-0 z-10">
            <button onClick={() => setSelectedPartner(null)} className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
              Close
            </button>
            <button onClick={() => updatePartnerStatus(selectedPartner.id, 'suspended')} className="px-5 py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl transition-colors shadow-sm flex items-center gap-2">
              <XCircle className="w-4 h-4" /> Reject / Suspend
            </button>
            <button onClick={() => updatePartnerStatus(selectedPartner.id, 'active')} className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-colors shadow-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Approve Partner
            </button>
          </div>
        </div>
      </div>
    );
  };

  const filteredPartners = partnersList.filter(p => {
    if (filterStatus === 'all') return p.status !== 'under_review' && p.status !== 'pending';
    if (filterStatus === 'under_review') return p.status === 'under_review' || p.status === 'pending';
    return p.status === filterStatus;
  });

  const counts = {
    all: partnersList.filter(p => p.status !== 'under_review' && p.status !== 'pending').length,
    under_review: partnersList.filter(p => p.status === 'under_review' || p.status === 'pending').length,
    active: partnersList.filter(p => p.status === 'active').length,
    suspended: partnersList.filter(p => p.status === 'suspended').length
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Partners</h1>
        <p className="text-gray-500 text-sm mt-1">Review and manage partner applications and active partners.</p>
      </div>

      <div className="flex flex-wrap gap-2 pb-2">
        {['all', 'under_review', 'active', 'suspended'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              filterStatus === status
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 shadow-sm'
            }`}
          >
            <span>
              {status === 'all' ? 'All Partners' : 
               status === 'under_review' ? 'Under Review' : 
               status === 'active' ? 'Approved' : 'Suspended'}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              filterStatus === status ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              {counts[status]}
            </span>
          </button>
        ))}
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
              {filteredPartners.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Users className="h-10 w-10 mb-3 text-gray-300" />
                      <p className="text-sm font-medium">No partners found in this category</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPartners.map(p => (
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
      
      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/90 backdrop-blur-sm animate-fade-in" onClick={() => setPreviewImage(null)}>
          <button onClick={() => setPreviewImage(null)} className="absolute top-4 right-4 p-2 text-white hover:text-gray-300 transition-colors">
            <X className="w-8 h-8" />
          </button>
          <img src={previewImage} alt="Preview" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

export default AdminPartners;
