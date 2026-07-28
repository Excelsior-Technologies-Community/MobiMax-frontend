import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Archive, MessageSquare, ShoppingBag, Box, Mail, TrendingUp } from 'lucide-react';

const AdminPartnerActivity = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/admin/partners/${id}/activity`);
        const json = await res.json();
        if (json.status === 'success') {
          setData(json.data);
        }
      } catch (error) {
        console.error('Error fetching partner activity:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e26a1b]"></div>
      </div>
    );
  }

  if (!data || !data.partner) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Partner Not Found</h2>
        <Link to="/admin/partners" className="text-[#e26a1b] hover:underline mt-4 inline-block">
          Return to Partners List
        </Link>
      </div>
    );
  }

  const { partner, products, stockEntries, messages, bulkOrders } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          to="/admin/partners" 
          className="p-2 text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-50 rounded-xl transition-colors border border-gray-200 shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{partner.company} - Activity</h1>
          <p className="text-gray-500 text-sm mt-1">
            {partner.name} • {partner.email}
            {partner.store_address && (
              <> • {partner.store_address}{partner.store_city ? `, ${partner.store_city}` : ''}{partner.store_state ? `, ${partner.store_state}` : ''}</>
            )}
          </p>
        </div>
        <div className="ml-auto">
           <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border ${partner.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
             {partner.status.replace('_', ' ')}
           </span>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mr-4 text-blue-500">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Products</p>
            <h3 className="text-2xl font-bold text-gray-900">{products.length}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mr-4 text-purple-500">
            <Archive className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Stock Updates</p>
            <h3 className="text-2xl font-bold text-gray-900">{stockEntries.length}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mr-4 text-emerald-500">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Bulk Orders</p>
            <h3 className="text-2xl font-bold text-gray-900">{bulkOrders.length}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mr-4 text-amber-500">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Messages</p>
            <h3 className="text-2xl font-bold text-gray-900">{messages.length}</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100 bg-gray-50">
          {[
            { id: 'products', icon: Box, label: 'Products' },
            { id: 'stock', icon: Archive, label: 'Stock History' },
            { id: 'orders', icon: ShoppingBag, label: 'Bulk Orders' },
            { id: 'messages', icon: Mail, label: 'Messages' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? 'border-[#e26a1b] text-[#e26a1b] bg-white' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span className={`ml-1.5 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? 'bg-[#e26a1b]/10 text-[#e26a1b]' : 'bg-gray-100 text-gray-500'
              }`}>
                {tab.id === 'products' ? products.length : 
                 tab.id === 'stock' ? stockEntries.length : 
                 tab.id === 'orders' ? bulkOrders.length : 
                 messages.length}
              </span>
            </button>
          ))}
        </div>

        <div className="p-6 min-h-[400px]">
          {/* Products Tab */}
          {activeTab === 'products' && (
            <div>
              {products.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No products found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                        <th className="p-4 font-medium rounded-tl-xl">Product Info</th>
                        <th className="p-4 font-medium">Category</th>
                        <th className="p-4 font-medium">Price</th>
                        <th className="p-4 font-medium rounded-tr-xl">Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50/50">
                          <td className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                              {p.image_url ? (
                                <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <Box className="w-5 h-5 m-2.5 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{p.title}</p>
                              {p.sku && <p className="text-xs text-gray-500">SKU: {p.sku}</p>}
                            </div>
                          </td>
                          <td className="p-4 text-sm text-gray-600">{p.category}</td>
                          <td className="p-4 text-sm font-medium text-gray-900">₹{p.price}</td>
                          <td className="p-4 text-sm">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${p.in_stock ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                              {p.stock_quantity} in stock
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Stock Entries Tab */}
          {activeTab === 'stock' && (
            <div>
              {stockEntries.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No stock history found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                        <th className="p-4 font-medium rounded-tl-xl">Date</th>
                        <th className="p-4 font-medium">Product</th>
                        <th className="p-4 font-medium">Qty Added</th>
                        <th className="p-4 font-medium">Purchase Price</th>
                        <th className="p-4 font-medium rounded-tr-xl">Supplier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {stockEntries.map(se => (
                        <tr key={se.id} className="hover:bg-gray-50/50">
                          <td className="p-4 text-sm text-gray-500">
                            {new Date(se.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-sm font-medium text-gray-900">{se.product_title}</td>
                          <td className="p-4 text-sm font-semibold text-emerald-600">+{se.quantity_added}</td>
                          <td className="p-4 text-sm text-gray-600">
                            {se.purchase_price ? `₹${se.purchase_price}` : '-'}
                          </td>
                          <td className="p-4 text-sm text-gray-500">{se.supplier_name || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Bulk Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              {bulkOrders.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No bulk orders found.</div>
              ) : (
                <div className="space-y-4">
                  {bulkOrders.map(bo => (
                    <div key={bo.id} className="p-5 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{bo.product_title}</h4>
                          <p className="text-xs text-gray-500">Ordered on {new Date(bo.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                          bo.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          bo.status === 'cancelled' ? 'bg-red-50 text-red-600 border border-red-100' :
                          'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {bo.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div><span className="text-gray-500">Quantity:</span> <span className="font-medium text-gray-900">{bo.quantity}</span></div>
                        <div><span className="text-gray-500">Target Price:</span> <span className="font-medium text-gray-900">₹{bo.target_price}</span></div>
                        <div className="col-span-2"><span className="text-gray-500">Contact:</span> <span className="font-medium text-gray-900">{bo.name} ({bo.email})</span></div>
                      </div>
                      {bo.message && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 italic border border-gray-100">
                          "{bo.message}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div>
              {messages.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No messages found.</div>
              ) : (
                <div className="space-y-4">
                  {messages.map(msg => (
                    <div key={msg.id} className="p-5 border border-gray-100 rounded-xl bg-white shadow-sm">
                       <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{msg.name}</h4>
                          <p className="text-xs text-gray-500">{msg.email} • {msg.phone}</p>
                        </div>
                        <span className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-2 text-sm text-gray-700 border-l-2 border-[#e26a1b] pl-3 py-1 bg-gray-50">
                        {msg.message}
                      </div>
                      {msg.product_title && (
                        <div className="mt-3 text-xs text-gray-500 flex items-center gap-1.5">
                          <Box className="w-3.5 h-3.5" /> Regarding: <span className="font-medium">{msg.product_title}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminPartnerActivity;
