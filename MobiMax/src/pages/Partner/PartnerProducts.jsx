import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2, Image as ImageIcon, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

const PartnerProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    oldPrice: '',
    discount: '',
    category: '',
    stock_quantity: '',
    sku: '',
    product_images: [],
    existing_images: []
  });
  const [imagePreviews, setImagePreviews] = useState([]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('partnerToken') || sessionStorage.getItem('partnerToken');
      const response = await fetch('http://localhost:5001/api/partners/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.status === 'success') {
        setProducts(data.data);
      } else if (response.status === 401) {
        localStorage.removeItem('partnerToken');
        sessionStorage.removeItem('partnerToken');
        navigate('/partner/login');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Auto-calculate logic
      if (name === 'oldPrice' || name === 'discount') {
        const old = parseFloat(name === 'oldPrice' ? value : prev.oldPrice);
        const disc = parseFloat(name === 'discount' ? value : prev.discount);
        
        if (!isNaN(old) && !isNaN(disc) && disc > 0) {
          newData.price = (old - (old * disc / 100)).toFixed(2);
        }
      } else if (name === 'price') {
        const old = parseFloat(prev.oldPrice);
        const curr = parseFloat(value);
        if (!isNaN(old) && !isNaN(curr) && old > curr) {
          newData.discount = ((1 - (curr / old)) * 100).toFixed(0);
        } else {
          newData.discount = '';
        }
      }
      
      return newData;
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Combine existing string URLs + newly added files, capped at 5 total
    const totalImages = formData.existing_images.length + formData.product_images.length;
    const remainingSlots = 5 - totalImages;
    
    if (remainingSlots <= 0) return;
    
    const allowedFiles = files.slice(0, remainingSlots);
    const combinedFiles = [...formData.product_images, ...allowedFiles];
    
    setFormData(prev => ({ ...prev, product_images: combinedFiles }));
    
    // Generate previews for the new files and append to existing previews
    const newPreviews = allowedFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const numExisting = formData.existing_images.length;
    
    if (index < numExisting) {
      // Removing an existing image
      const newExisting = [...formData.existing_images];
      newExisting.splice(index, 1);
      setFormData(prev => ({ ...prev, existing_images: newExisting }));
    } else {
      // Removing a newly added file
      const newFiles = [...formData.product_images];
      newFiles.splice(index - numExisting, 1);
      setFormData(prev => ({ ...prev, product_images: newFiles }));
    }
    
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const openAddModal = () => {
    setEditingProductId(null);
    setFormData({ title: '', description: '', price: '', oldPrice: '', discount: '', category: '', stock_quantity: '', sku: '', product_images: [], existing_images: [] });
    setImagePreviews([]);
    setIsAddModalOpen(true);
  };

  const handleEditClick = (product) => {
    setEditingProductId(product.id);
    
    let parsedImages = [];
    try {
      parsedImages = product.images_json ? JSON.parse(product.images_json) : [product.image_url];
    } catch (e) {
      parsedImages = [product.image_url];
    }

    let calculatedDiscount = '';
    if (product.oldPrice && product.oldPrice > product.price) {
      calculatedDiscount = ((1 - (product.price / product.oldPrice)) * 100).toFixed(0);
    }

    setFormData({
      title: product.title,
      description: product.description || '',
      price: product.price,
      oldPrice: product.oldPrice || '',
      discount: calculatedDiscount,
      category: product.category,
      stock_quantity: product.stock_quantity !== undefined ? product.stock_quantity : '',
      sku: product.sku || '',
      product_images: [],
      existing_images: parsedImages
    });
    setImagePreviews(parsedImages);
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('partnerToken') || sessionStorage.getItem('partnerToken');
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      if (formData.oldPrice) formDataToSend.append('oldPrice', formData.oldPrice);
      if (formData.stock_quantity) formDataToSend.append('stock_quantity', formData.stock_quantity);
      if (formData.sku) formDataToSend.append('sku', formData.sku);
      
      if (formData.existing_images && formData.existing_images.length > 0) {
        formDataToSend.append('existing_images', JSON.stringify(formData.existing_images));
      }
      
      formData.product_images.forEach(file => {
        formDataToSend.append('product_images', file);
      });

      const url = editingProductId 
        ? `http://localhost:5001/api/partners/products/${editingProductId}`
        : 'http://localhost:5001/api/partners/products';
        
      const method = editingProductId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });
      const result = await response.json();
      if (result.status === 'success') {
        setIsAddModalOpen(false);
        setEditingProductId(null);
        setFormData({ title: '', description: '', price: '', oldPrice: '', discount: '', category: '', stock_quantity: '', sku: '', product_images: [], existing_images: [] });
        setImagePreviews([]);
        fetchProducts(); // Refresh list
      } else if (response.status === 401) {
        localStorage.removeItem('partnerToken');
        sessionStorage.removeItem('partnerToken');
        navigate('/partner/login');
      } else {
        alert(result.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('partnerToken') || sessionStorage.getItem('partnerToken');
        const response = await fetch(`http://localhost:5001/api/partners/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json();
        if (result.status === 'success') {
          fetchProducts();
        } else if (response.status === 401) {
          localStorage.removeItem('partnerToken');
          sessionStorage.removeItem('partnerToken');
          navigate('/partner/login');
        } else {
          alert(result.message || 'Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleUpdateStock = async (id, currentStock) => {
    const newStockStr = window.prompt('Enter new stock quantity:', currentStock || 0);
    if (newStockStr === null) return; // User cancelled
    
    const newStock = parseInt(newStockStr, 10);
    if (isNaN(newStock) || newStock < 0) {
      alert('Please enter a valid non-negative number for stock quantity.');
      return;
    }
    
    try {
      const token = localStorage.getItem('partnerToken') || sessionStorage.getItem('partnerToken');
      const response = await fetch(`http://localhost:5001/api/partners/products/${id}/stock`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ stock_quantity: newStock })
      });
      const result = await response.json();
      if (result.status === 'success') {
        setProducts(prev => prev.map(p => 
          p.id === id ? { ...p, stock_quantity: result.stock_quantity, in_stock: result.in_stock ? 1 : 0 } : p
        ));
      } else if (response.status === 401) {
        localStorage.removeItem('partnerToken');
        sessionStorage.removeItem('partnerToken');
        navigate('/partner/login');
      } else {
        alert(result.message || 'Failed to update stock status');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1e272e] uppercase tracking-wider mb-1">Products Inventory</h2>
          <p className="text-gray-500 font-medium text-sm">Manage your store's product listings</p>
        </div>
        
        <button 
          onClick={openAddModal}
          className="bg-[#e26a1b] hover:bg-[#d52b27] text-white px-6 py-3 rounded-lg font-black uppercase tracking-widest text-sm flex items-center shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#e26a1b] focus:ring-1 focus:ring-[#e26a1b] transition-colors"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e26a1b]"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Package className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-black text-[#1e272e] uppercase mb-2">No Products Found</h3>
            <p className="text-gray-500 max-w-sm">You haven't added any products yet. Click the "Add Product" button to create your first listing.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-black text-gray-400 uppercase tracking-wider bg-white">
                  <th className="p-4 pl-6">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Stock</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map(product => (
                  <tr key={product.id} className={`hover:bg-gray-50 transition-colors group ${!product.in_stock ? 'opacity-70 bg-gray-50/50' : ''}`}>
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-4">
                        <img src={product.image_url} alt={product.title} className="w-12 h-12 rounded-lg object-cover border border-gray-100" />
                        <div>
                          <p className="font-bold text-[#1e272e] text-sm group-hover:text-[#e26a1b] transition-colors line-clamp-1">{product.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{product.description || 'No description'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-black text-[#e26a1b]">£{Number(product.price).toFixed(2)}</span>
                        {product.oldPrice && (
                          <span className="text-xs text-gray-400 line-through">£{Number(product.oldPrice).toFixed(2)}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        product.status === 'active' ? 'bg-[#2ed573]/10 text-[#2ed573]' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleUpdateStock(product.id, product.stock_quantity)}
                        className={`relative inline-flex items-center justify-center h-8 px-3 min-w-[70px] rounded-full transition-colors duration-200 focus:outline-none border ${
                          !product.in_stock 
                            ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100' 
                            : product.stock_quantity <= 5
                              ? 'bg-orange-50 border-orange-200 text-orange-500 hover:bg-orange-100'
                              : 'bg-[#2ed573]/10 border-[#2ed573]/30 text-[#2ed573] hover:bg-[#2ed573]/20'
                        }`}
                        title="Click to update stock quantity"
                      >
                        <span className="text-xs font-black tracking-wider">
                          {product.stock_quantity !== undefined && product.stock_quantity !== null ? product.stock_quantity : 0} 
                        </span>
                      </button>
                      <div className={`text-[9px] font-black uppercase tracking-wider mt-1 ${
                        !product.in_stock ? 'text-red-400' : product.stock_quantity <= 5 ? 'text-orange-400' : 'text-[#2ed573]'
                      }`}>
                        {!product.in_stock ? 'Out of Stock' : product.stock_quantity <= 5 ? 'Low Stock' : 'In Stock'}
                      </div>
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEditClick(product)}
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" 
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" 
                          title="Delete"
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

      {/* Add Product Modal */}
      {isAddModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1e272e]/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-black text-[#1e272e] uppercase tracking-wider">
                {editingProductId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button 
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProductId(null);
                }}
                className="text-gray-400 hover:text-[#d52b27] transition-colors"
              >
                <Plus className="w-6 h-6 transform rotate-45" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="addProductForm" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Image Upload Area */}
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors relative">
                  {imagePreviews.length > 0 ? (
                    <div className="w-full">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-bold text-gray-700">{imagePreviews.length}/5 Images Selected</span>
                        {imagePreviews.length < 5 && (
                          <label className="bg-white px-3 py-1.5 rounded shadow-sm text-xs font-bold text-[#e26a1b] cursor-pointer hover:bg-gray-50 transition-colors border border-gray-200">
                            Add More
                            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                          </label>
                        )}
                      </div>
                      <div className="grid grid-cols-5 gap-3">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative aspect-square group rounded-lg overflow-hidden border border-gray-200 bg-white">
                            <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                            {index === 0 && <span className="absolute bottom-0 left-0 right-0 bg-[#e26a1b] text-white text-[9px] font-bold text-center py-0.5 z-10">COVER</span>}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                              <button 
                                type="button" 
                                onClick={() => removeImage(index)}
                                className="bg-white text-red-500 p-1.5 rounded-full hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 flex flex-col items-center">
                      <ImageIcon className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Upload Product Images</p>
                      <p className="text-xs text-gray-400 text-center max-w-xs mb-4">You can select up to 5 images (PNG, JPG, WEBP). First image acts as cover.</p>
                      <label className="bg-white px-4 py-2 rounded shadow-sm text-sm font-bold text-[#e26a1b] cursor-pointer hover:bg-gray-50 transition-colors border border-gray-200">
                        Browse Files
                        <input type="file" name="product_images" multiple accept="image/*" onChange={handleImageChange} className="hidden" required />
                      </label>
                    </div>
                  )}
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Product Title *</label>
                    <input 
                      type="text" 
                      name="title" 
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Brake Pads Set"
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#e26a1b] focus:ring-2 focus:ring-[#e26a1b]/20 transition-all font-medium text-[#1e272e]"
                      required
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Description</label>
                    <textarea 
                      name="description" 
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Product details, specifications, etc."
                      rows="3"
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#e26a1b] focus:ring-2 focus:ring-[#e26a1b]/20 transition-all font-medium text-[#1e272e] resize-none"
                    ></textarea>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Old Price (£) <span className="text-gray-400 font-normal normal-case">(Optional)</span></label>
                    <input 
                      type="number" 
                      step="0.01"
                      name="oldPrice" 
                      value={formData.oldPrice}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#e26a1b] focus:ring-2 focus:ring-[#e26a1b]/20 transition-all font-medium text-[#1e272e]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Discount (%) <span className="text-gray-400 font-normal normal-case">(Auto-calculates Price)</span></label>
                    <input 
                      type="number" 
                      step="1"
                      min="0"
                      max="99"
                      name="discount" 
                      value={formData.discount}
                      onChange={handleInputChange}
                      placeholder="e.g. 10"
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#e26a1b] focus:ring-2 focus:ring-[#e26a1b]/20 transition-all font-medium text-[#1e272e]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Final Price (£) *</label>
                    <input 
                      type="number" 
                      step="0.01"
                      name="price" 
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#e26a1b] focus:ring-2 focus:ring-[#e26a1b]/20 transition-all font-medium text-[#1e272e]"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Category *</label>
                    <select 
                      name="category" 
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#e26a1b] focus:ring-2 focus:ring-[#e26a1b]/20 transition-all font-medium text-[#1e272e] appearance-none"
                      required
                    >
                      <option value="" disabled>Select a category</option>
                      <option value="Service Kits">Service Kits</option>
                      <option value="Brake Discs & Pads">Brake Discs & Pads</option>
                      <option value="Suspension">Suspension</option>
                      <option value="Engine Parts">Engine Parts</option>
                      <option value="Oil & Lubricants">Oil & Lubricants</option>
                      <option value="Tires & Wheels">Tires & Wheels</option>
                      <option value="Steering">Steering</option>
                      <option value="Batteries">Batteries</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">SKU <span className="text-gray-400 font-normal normal-case">(Optional)</span></label>
                    <input 
                      type="text" 
                      name="sku" 
                      value={formData.sku}
                      onChange={handleInputChange}
                      placeholder="e.g. BP-12345"
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#e26a1b] focus:ring-2 focus:ring-[#e26a1b]/20 transition-all font-medium text-[#1e272e]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Stock Quantity</label>
                    <input 
                      type="number" 
                      name="stock_quantity" 
                      value={formData.stock_quantity}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#e26a1b] focus:ring-2 focus:ring-[#e26a1b]/20 transition-all font-medium text-[#1e272e]"
                    />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-4">
              <button 
                type="button" 
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProductId(null);
                }}
                className="px-6 py-3 rounded-lg font-black text-gray-500 uppercase tracking-widest text-sm hover:bg-gray-200 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="addProductForm"
                className="bg-[#1e272e] hover:bg-[#e26a1b] text-white px-8 py-3 rounded-lg font-black uppercase tracking-widest text-sm shadow-md transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  editingProductId ? 'Update Product' : 'Save Product'
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default PartnerProducts;
