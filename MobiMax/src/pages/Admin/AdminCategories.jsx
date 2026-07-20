import React from 'react';

const AdminCategories = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your product categories here.</p>
        </div>
        <button className="px-4 py-2 bg-[#e26a1b] text-white rounded-lg font-medium hover:bg-[#c45a16] transition-colors">
          Add Category
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 text-center text-gray-500">
          No categories found. Click "Add Category" to create one.
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
