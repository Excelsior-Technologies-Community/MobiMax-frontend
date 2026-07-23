import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Archive, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

const PartnerStock = () => {
  const navigate = useNavigate();
  const [stockEntries, setStockEntries] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState(null);

  const [formData, setFormData] = useState({
    product_id: '',
    quantity_added: '',
    purchase_price: '',
    supplier_name: '',
    notes: ''
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('partnerToken') || sessionStorage.getItem('partnerToken');
      
      // Fetch Stock Entries
      const entriesRes = await fetch('http://localhost:5001/api/partners/stock-entries', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const entriesData = await entriesRes.json();
      
      // Fetch Products (for the dropdown)
      const productsRes = await fetch('http://localhost:5001/api/partners/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const productsData = await productsRes.json();

      if (entriesData.status === 'success') setStockEntries(entriesData.data);
      if (productsData.status === 'success') setProducts(productsData.data);
      
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setEditingEntryId(null);
    setFormData({ product_id: '', quantity_added: '', purchase_price: '', supplier_name: '', notes: '' });
    setIsAddModalOpen(true);
  };

  const openEditModal = (entry) => {
    setEditingEntryId(entry.id);
    setFormData({
      product_id: entry.product_id,
      quantity_added: entry.quantity_added,
      purchase_price: entry.purchase_price || '',
      supplier_name: entry.supplier_name || '',
      notes: entry.notes || ''
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this stock entry? This will adjust your total stock count.')) return;
    
    try {
      const token = localStorage.getItem('partnerToken') || sessionStorage.getItem('partnerToken');
      const response = await fetch(`http://localhost:5001/api/partners/stock-entries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.status === 'success') {
        fetchData();
      } else {
        alert(result.message || 'Failed to delete entry');
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('partnerToken') || sessionStorage.getItem('partnerToken');
      const url = editingEntryId 
        ? `http://localhost:5001/api/partners/stock-entries/${editingEntryId}`
        : 'http://localhost:5001/api/partners/stock-entries';
        
      const response = await fetch(url, {
        method: editingEntryId ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (result.status === 'success') {
        setIsAddModalOpen(false);
        setEditingEntryId(null);
        setFormData({ product_id: '', quantity_added: '', purchase_price: '', supplier_name: '', notes: '' });
        fetchData();
      } else {
        alert(result.message || 'Failed to log stock entry');
      }
    } catch (error) {
      console.error('Error adding stock entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1e272e] uppercase tracking-wider mb-1">Stock Ledger</h2>
          <p className="text-gray-500 font-medium text-sm">Detailed tracking of all incoming stock</p>
        </div>
        
        <button 
          onClick={openAddModal}
          className="bg-[#e26a1b] hover:bg-[#d52b27] text-white px-6 py-3 rounded-lg font-black uppercase tracking-widest text-sm flex items-center shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
        >
          <Plus className="w-5 h-5 mr-2" />
          Log Stock Entry
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search stock entries..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#e26a1b] focus:ring-1 focus:ring-[#e26a1b] transition-colors"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e26a1b]"></div>
          </div>
        ) : stockEntries.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Archive className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-black text-[#1e272e] uppercase mb-2">No Stock Entries</h3>
            <p className="text-gray-500 max-w-sm">You haven't logged any stock yet. Click "Log Stock Entry" to record incoming inventory.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-black text-gray-400 uppercase tracking-wider bg-white">
                  <th className="p-4 pl-6">Date</th>
                  <th className="p-4">Product</th>
                  <th className="p-4 text-center">Qty Added</th>
                  <th className="p-4">Supplier</th>
                  <th className="p-4">Cost Price</th>
                  <th className="p-4 max-w-[150px]">Notes</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stockEntries.map(entry => (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 pl-6 whitespace-nowrap">
                      <span className="font-bold text-[#1e272e] text-sm">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </span>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-[#1e272e] text-sm line-clamp-1">{entry.product_title}</p>
                      {entry.sku && <p className="text-xs text-gray-500 mt-0.5 font-mono">SKU: {entry.sku}</p>}
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-[#2ed573]/10 text-[#2ed573] border border-[#2ed573]/20 px-3 py-1 rounded-full text-sm font-black">
                        +{entry.quantity_added}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium text-gray-700">{entry.supplier_name || '-'}</span>
                    </td>
                    <td className="p-4">
                      {entry.purchase_price ? (
                        <span className="font-bold text-[#1e272e]">£{Number(entry.purchase_price).toFixed(2)}</span>
                      ) : '-'}
                    </td>
                    <td className="p-4 max-w-[150px]">
                      <p className="text-xs text-gray-500 truncate" title={entry.notes}>{entry.notes || '-'}</p>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(entry)}
                          className="p-2 text-gray-400 hover:text-[#e26a1b] hover:bg-orange-50 rounded-lg transition-colors"
                          title="Edit Entry"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(entry.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Stock Entry Modal */}
      {isAddModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1e272e]/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-black text-[#1e272e] uppercase tracking-wider">
                {editingEntryId ? 'Edit Stock Entry' : 'Log Stock Entry'}
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-[#d52b27] transition-colors"
              >
                <Plus className="w-6 h-6 transform rotate-45" />
              </button>
            </div>
            
            <div className="p-6">
              <form id="addStockForm" onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Select Product *</label>
                  <select 
                    name="product_id" 
                    value={formData.product_id}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#e26a1b] focus:ring-2 focus:ring-[#e26a1b]/20 transition-all font-medium text-[#1e272e] appearance-none"
                    required
                  >
                    <option value="" disabled>Choose a product</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.title} {p.sku ? `(${p.sku})` : ''}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Quantity Added *</label>
                    <input 
                      type="number" 
                      name="quantity_added" 
                      value={formData.quantity_added}
                      onChange={handleInputChange}
                      placeholder="e.g. 50"
                      min="1"
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#e26a1b] focus:ring-2 focus:ring-[#e26a1b]/20 transition-all font-bold text-[#1e272e]"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Cost Price (£) <span className="font-normal normal-case">(Opt)</span></label>
                    <input 
                      type="number" 
                      step="0.01"
                      name="purchase_price" 
                      value={formData.purchase_price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#e26a1b] focus:ring-2 focus:ring-[#e26a1b]/20 transition-all font-medium text-[#1e272e]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Supplier Name <span className="text-gray-400 font-normal normal-case">(Optional)</span></label>
                  <input 
                    type="text" 
                    name="supplier_name" 
                    value={formData.supplier_name}
                    onChange={handleInputChange}
                    placeholder="e.g. AutoParts Wholesale"
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#e26a1b] focus:ring-2 focus:ring-[#e26a1b]/20 transition-all font-medium text-[#1e272e]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Notes / Batch No. <span className="text-gray-400 font-normal normal-case">(Optional)</span></label>
                  <textarea 
                    name="notes" 
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any additional details..."
                    rows="2"
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#e26a1b] focus:ring-2 focus:ring-[#e26a1b]/20 transition-all font-medium text-[#1e272e] resize-none"
                  ></textarea>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-4">
              <button 
                type="button" 
                onClick={() => setIsAddModalOpen(false)}
                className="px-6 py-3 rounded-lg font-black text-gray-500 uppercase tracking-widest text-sm hover:bg-gray-200 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="addStockForm"
                className="bg-[#1e272e] hover:bg-[#e26a1b] text-white px-8 py-3 rounded-lg font-black uppercase tracking-widest text-sm shadow-md transition-colors flex items-center disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : editingEntryId ? 'Update Stock' : 'Log Stock'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default PartnerStock;
