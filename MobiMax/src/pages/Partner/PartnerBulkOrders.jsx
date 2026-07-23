import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2, XCircle, Search, Filter } from 'lucide-react';

const PartnerBulkOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
    
    // Listen for socket events
    const handleNewBulkOrder = (order) => {
      setOrders(prev => [order, ...prev]);
    };
    
    // Note: Assuming socket is attached to window in App.jsx or handled via context.
    // Since we don't have socket context in this component directly, you might need to handle this in PartnerLayout or a Context Provider.
    // For now, we will rely on fetching.
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('partnerToken') || sessionStorage.getItem('partnerToken');
      const response = await fetch('http://localhost:5001/api/partners/bulk-orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.status === 'success') {
        setOrders(result.data);
      } else {
        setError(result.message || 'Failed to fetch bulk orders');
      }
    } catch (err) {
      console.error('Error fetching bulk orders:', err);
      setError('An error occurred while fetching bulk orders');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('partnerToken') || sessionStorage.getItem('partnerToken');
      const response = await fetch(`http://localhost:5001/api/partners/bulk-orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const result = await response.json();
      if (result.status === 'success') {
        setOrders(orders.map(order => order.id === id ? { ...order, status } : order));
      } else {
        alert(result.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('An error occurred while updating status');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Pending</span>;
      case 'approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3 mr-1" /> Approved</span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> Rejected</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
          <div>
            <h2 className="text-lg font-black text-[#1e272e] uppercase tracking-wide">Bulk Orders</h2>
            <p className="text-sm text-gray-500 font-medium">Manage custom bulk order requests</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search orders..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all w-full md:w-64" />
            </div>
            <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:border-[#e26a1b] hover:text-[#e26a1b] transition-all shadow-sm">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </button>
          </div>
        </div>

        <div className="p-0">
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#e26a1b]"></div>
            </div>
          ) : error ? (
            <div className="py-12 px-6 text-center text-red-500 font-bold bg-red-50 mx-6 my-6 rounded-2xl">{error}</div>
          ) : orders.length === 0 ? (
            <div className="py-20 px-6 text-center flex flex-col items-center">
              <Package className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-black text-[#1e272e] mb-2 uppercase">No Bulk Orders Yet</h3>
              <p className="text-gray-500 max-w-sm">When customers request bulk orders for your products, they will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-widest text-gray-500 font-black">
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center p-1 overflow-hidden shrink-0">
                            {order.product_image ? (
                              <img src={order.product_image} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                            ) : (
                              <Package className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-black text-[#1e272e] line-clamp-1">{order.product_title}</div>
                            {order.product_sku && <div className="text-[10px] text-gray-400 font-bold uppercase">SKU: {order.product_sku}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">{order.name}</div>
                        <div className="text-xs text-gray-500">{order.email}</div>
                        <div className="text-xs text-gray-500">{order.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center justify-center min-w-[40px] px-3 h-10 rounded-xl bg-[#fff4ec] text-[#e26a1b] font-black text-sm border border-[#ffe0cc] shadow-sm">
                          {order.quantity}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(order.status)}
                        <div className="text-[10px] text-gray-400 mt-1 font-medium">{new Date(order.created_at).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {order.status === 'pending' && (
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => updateStatus(order.id, 'approved')}
                              className="px-4 py-2 bg-[#2ed573]/10 text-[#2ed573] hover:bg-[#2ed573]/20 rounded-xl text-xs font-black uppercase tracking-wider transition-colors border border-[#2ed573]/20"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => updateStatus(order.id, 'rejected')}
                              className="px-4 py-2 bg-[#ff4757]/10 text-[#ff4757] hover:bg-[#ff4757]/20 rounded-xl text-xs font-black uppercase tracking-wider transition-colors border border-[#ff4757]/20"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {order.message && (
                          <div className="mt-3 flex justify-end">
                            <div className="inline-block text-left bg-gray-50/80 px-4 py-2.5 rounded-xl rounded-tr-sm text-xs text-gray-500 italic border border-gray-100 shadow-sm max-w-[220px] break-words">
                              "{order.message}"
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerBulkOrders;
