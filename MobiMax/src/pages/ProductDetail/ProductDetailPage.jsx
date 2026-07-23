import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Store, Package, Mail, MessageSquare, ShoppingBag, X } from 'lucide-react';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showContactModal, setShowContactModal] = useState(false);
  const [showBulkOrderModal, setShowBulkOrderModal] = useState(false);

  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [bulkOrderForm, setBulkOrderForm] = useState({ name: '', email: '', phone: '', quantity: '', message: '' });
  
  const [formStatus, setFormStatus] = useState(null); // { type: 'success' | 'error', message: '' }

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5001/api/public/product/${id}`);
        const result = await response.json();
        if (result.status === 'success') {
          setProduct(result.data);
        } else {
          setError(result.message || 'Failed to fetch product details');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('An error occurred while fetching product details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus(null);
    try {
      const response = await fetch(`http://localhost:5001/api/public/store/${product.partner_id}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      const result = await response.json();
      if (result.status === 'success') {
        setFormStatus({ type: 'success', message: 'Message sent successfully to the store!' });
        setContactForm({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setShowContactModal(false), 2000);
      } else {
        setFormStatus({ type: 'error', message: result.message || 'Failed to send message' });
      }
    } catch (err) {
      setFormStatus({ type: 'error', message: 'An error occurred. Please try again.' });
    }
  };

  const handleBulkOrderSubmit = async (e) => {
    e.preventDefault();
    setFormStatus(null);
    try {
      const response = await fetch(`http://localhost:5001/api/public/product/${product.id}/bulk-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bulkOrderForm)
      });
      const result = await response.json();
      if (result.status === 'success') {
        setFormStatus({ type: 'success', message: 'Bulk order request submitted successfully! The store will contact you soon.' });
        setBulkOrderForm({ name: '', email: '', phone: '', quantity: '', message: '' });
        setTimeout(() => setShowBulkOrderModal(false), 2000);
      } else {
        setFormStatus({ type: 'error', message: result.message || 'Failed to submit bulk order request' });
      }
    } catch (err) {
      setFormStatus({ type: 'error', message: 'An error occurred. Please try again.' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e26a1b]"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex justify-center items-center py-20 px-4">
        <div className="bg-red-50 text-red-500 p-6 rounded-xl text-center font-bold max-w-md w-full shadow-sm border border-red-100">
          <Package className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <p>{error || 'Product not found'}</p>
          <Link to="/" className="mt-6 inline-block text-sm text-red-600 hover:text-red-800 underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-12 font-['Inter',system-ui,sans-serif]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        
        {/* Breadcrumb / Back Navigation */}
        <div className="mb-8 flex items-center">
          <Link to={`/store/${product.partner_id}/category/${encodeURIComponent(product.category)}`} className="inline-flex items-center text-gray-500 hover:text-[#e26a1b] font-bold text-sm transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* Product Image Section */}
          <div className="md:w-1/2 bg-gray-50 p-8 flex items-center justify-center relative min-h-[400px]">
            {product.oldPrice && product.in_stock && (
              <div className="absolute top-6 right-6 bg-[#1e272e] text-white text-xs font-black px-3 py-1.5 rounded uppercase tracking-wider z-10 shadow-lg">
                -{(100 - (product.price / product.oldPrice) * 100).toFixed(0)}% OFF
              </div>
            )}
            {!product.in_stock && (
              <div className="absolute top-6 left-6 bg-[#e55039] text-white text-xs font-black px-3 py-1.5 rounded uppercase tracking-wider z-10 shadow-lg">
                OUT OF STOCK
              </div>
            )}
            <img 
              src={product.image_url} 
              alt={product.title} 
              className={`max-w-full max-h-[500px] object-contain drop-shadow-xl mix-blend-multiply ${!product.in_stock ? 'grayscale opacity-80' : ''}`}
            />
          </div>

          {/* Product Details Section */}
          <div className="md:w-1/2 p-8 lg:p-12 flex flex-col">
            <div className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider w-max mb-4">
              {product.category}
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-black text-[#1e272e] leading-tight mb-2">
              {product.title}
            </h1>
            
            {product.sku && (
              <p className="text-sm text-gray-400 font-medium mb-6">SKU: {product.sku}</p>
            )}

            <div className="flex items-end gap-4 mb-8">
              <span className="text-4xl font-black text-[#e26a1b]">£{Number(product.price).toFixed(2)}</span>
              {product.oldPrice && (
                <span className="text-lg text-gray-400 line-through mb-1 font-bold">£{Number(product.oldPrice).toFixed(2)}</span>
              )}
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {product.description || "No description provided for this product."}
              </p>
            </div>

            {/* Store Info Banner */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-8 flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-xl border border-gray-100 flex items-center justify-center p-1.5 shadow-sm overflow-hidden shrink-0">
                {product.store_logo ? (
                  <img src={product.store_logo} alt={product.store_name} className="w-full h-full object-contain" />
                ) : (
                  <Store className="w-6 h-6 text-gray-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Sold By</p>
                <h4 className="font-black text-[#1e272e] truncate">{product.store_name}</h4>
                <p className="text-xs text-gray-500">{product.store_city}</p>
              </div>
              <button 
                onClick={() => setShowContactModal(true)}
                className="shrink-0 bg-white border border-gray-200 hover:border-[#e26a1b] hover:text-[#e26a1b] text-gray-700 w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm"
                title="Contact Store"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>

            {/* Actions */}
            <div className="mt-auto space-y-3">
              <button 
                disabled={!product.in_stock}
                className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-lg ${product.in_stock ? 'bg-[#1e272e] text-white hover:bg-[#e26a1b] hover:shadow-[#e26a1b]/30 hover:-translate-y-0.5' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
              >
                {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              
              <button 
                onClick={() => setShowBulkOrderModal(true)}
                className="w-full py-4 rounded-xl bg-white border-2 border-gray-200 text-gray-700 font-black uppercase tracking-widest text-sm hover:border-[#1e272e] hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <Package className="w-5 h-5" /> Request Bulk Order
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Contact Store Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#1e272e] p-6 text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>
              <h3 className="font-black text-xl flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#e26a1b]" /> Contact {product.store_name}
              </h3>
              <button onClick={() => setShowContactModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 md:p-8">
              {formStatus && (
                <div className={`mb-6 p-4 rounded-xl text-sm font-bold ${formStatus.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                  {formStatus.message}
                </div>
              )}
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Your Name</label>
                  <input type="text" required value={contactForm.name} onChange={(e) => setContactForm({...contactForm, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email Address</label>
                  <input type="email" required value={contactForm.email} onChange={(e) => setContactForm({...contactForm, email: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Phone (Optional)</label>
                  <input type="tel" value={contactForm.phone} onChange={(e) => setContactForm({...contactForm, phone: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all" placeholder="+44 20 7123 4567" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Message</label>
                  <textarea required rows={4} value={contactForm.message} onChange={(e) => setContactForm({...contactForm, message: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all resize-none" placeholder={`I have a question about ${product.title}...`}></textarea>
                </div>
                <button type="submit" className="w-full py-4 mt-2 bg-[#e26a1b] text-white rounded-xl font-black uppercase tracking-widest text-sm hover:bg-[#d05c14] transition-colors shadow-lg shadow-[#e26a1b]/30">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Order Modal */}
      {showBulkOrderModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto pt-20 pb-10">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
            <div className="bg-[#1e272e] p-6 text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>
              <h3 className="font-black text-xl flex items-center gap-2">
                <Package className="w-5 h-5 text-[#e26a1b]" /> Request Bulk Order
              </h3>
              <button onClick={() => setShowBulkOrderModal(false)} className="text-gray-400 hover:text-white transition-colors z-10 relative">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 md:p-8">
              
              <div className="flex items-center gap-4 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="w-16 h-16 bg-white rounded-xl p-2 border border-gray-100 shrink-0">
                   <img src={product.image_url} alt={product.title} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 line-clamp-1">{product.title}</h4>
                  <p className="text-[#e26a1b] font-bold text-sm">£{Number(product.price).toFixed(2)} / unit</p>
                </div>
              </div>

              {formStatus && (
                <div className={`mb-6 p-4 rounded-xl text-sm font-bold ${formStatus.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                  {formStatus.message}
                </div>
              )}
              
              <form onSubmit={handleBulkOrderSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Your Name</label>
                    <input type="text" required value={bulkOrderForm.name} onChange={(e) => setBulkOrderForm({...bulkOrderForm, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Required Quantity</label>
                    <input type="number" min="5" required value={bulkOrderForm.quantity} onChange={(e) => setBulkOrderForm({...bulkOrderForm, quantity: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all font-black text-[#e26a1b]" placeholder="e.g. 50" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email Address</label>
                    <input type="email" required value={bulkOrderForm.email} onChange={(e) => setBulkOrderForm({...bulkOrderForm, email: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Phone Number</label>
                    <input type="tel" required value={bulkOrderForm.phone} onChange={(e) => setBulkOrderForm({...bulkOrderForm, phone: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all" placeholder="+44 20 7123 4567" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Additional Details (Optional)</label>
                  <textarea rows={3} value={bulkOrderForm.message} onChange={(e) => setBulkOrderForm({...bulkOrderForm, message: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all resize-none" placeholder="Any specific requirements or timeline..."></textarea>
                </div>
                <button type="submit" className="w-full py-4 mt-2 bg-[#1e272e] text-white rounded-xl font-black uppercase tracking-widest text-sm hover:bg-[#e26a1b] transition-colors shadow-lg">
                  Submit Bulk Request
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetailPage;
