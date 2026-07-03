import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Users } from 'lucide-react';

const AdminUsers = () => {
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/users');
        const data = await res.json();
        if (data.status === 'success') setUsersList(data.data);
      } catch (err) {
        console.error('Failed to fetch users', err);
      }
    };
    fetchUsers();
  }, []);

  const updateUserStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setUsersList(usersList.map(u => u.id === id ? { ...u, status: newStatus } : u));
      }
    } catch (err) {
      console.error('Failed to update user status', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">End Users</h1>
        <p className="text-gray-500 text-sm mt-1">Manage all registered end users on the platform.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_20px_-8px_rgba(0,0,0,0.1)] border border-gray-100/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAFBFC] border-b border-gray-100">
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {usersList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Users className="h-10 w-10 mb-3 text-gray-300" />
                      <p className="text-sm font-medium">No end users found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                usersList.map(u => (
                  <tr key={u.id} className="hover:bg-[#F8F9FB] transition-colors duration-150">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="h-9 w-9 rounded-full bg-[#635BFF]/10 flex items-center justify-center text-[#635BFF] font-bold text-sm mr-3">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{u.email}</td>
                    <td className="py-4 px-6 text-sm text-gray-500">{new Date(u.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase border ${
                        u.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                      }`}>
                        {u.status === 'active' ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                        {u.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {u.status === 'active' ? (
                        <button onClick={() => updateUserStatus(u.id, 'suspended')} className="text-xs font-semibold text-red-600 hover:text-white border border-red-200 hover:bg-red-500 hover:border-red-500 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm">
                          Suspend
                        </button>
                      ) : (
                        <button onClick={() => updateUserStatus(u.id, 'active')} className="text-xs font-semibold text-emerald-600 hover:text-white border border-emerald-200 hover:bg-emerald-500 hover:border-emerald-500 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm">
                          Activate
                        </button>
                      )}
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

export default AdminUsers;
