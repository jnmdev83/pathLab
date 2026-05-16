import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import api from '../services/api';
import UsersTable from '../components/Users/UsersTable';
import UserModal from '../components/Users/UserModal';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch {
      setUsers([
        { id: 1, name: 'Admin', email: 'admin@pathlab.com', phone: '1234567890', role: 'Super Admin', is_active: true, last_login: '2023-11-20T10:00:00Z' },
        { id: 2, name: 'Staff Member', email: 'staff@pathlab.com', phone: '0987654321', role: 'Support Staff', is_active: true, last_login: null }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const showToast = (msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (data) => {
    try {
      if (editUser) {
        // Cannot edit email, so remove it from payload if needed
        const { email, password, ...updateData } = data;
        await api.put(`/admin/users/${editUser.id || editUser.user_id}`, updateData);
      } else {
        await api.post('/admin/users', data);
      }
      fetchUsers();
      showToast(editUser ? 'User updated' : 'User added');
    } catch(err) { throw err; } // Let modal catch error
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete user ${name}?`)) {
      try {
        await api.delete(`/admin/users/${id}`);
        fetchUsers();
        showToast('User deleted');
      } catch { showToast('Error deleting user', 'error'); }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await api.put(`/admin/users/${id}`, { is_active: !currentStatus });
      fetchUsers();
      showToast('Status updated');
    } catch { showToast('Error updating status', 'error'); }
  };

  return (
    <div className="pb-8">
      {toast && <div className={`fixed top-4 right-4 p-4 rounded z-50 text-white ${toast.type==='success'?'bg-emerald-500':'bg-red-500'}`}>{toast.msg}</div>}
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif">Admin Users</h1>
          <p className="text-gray-500 mt-1">Manage system administrators and staff access.</p>
        </div>
        <button onClick={() => { setEditUser(null); setIsModalOpen(true); }} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg">
          <Plus size={20} /> Add User
        </button>
      </div>

      <UsersTable users={users} loading={loading} onEdit={u => { setEditUser(u); setIsModalOpen(true); }} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />
      
      <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} user={editUser} onSave={handleSave} />
    </div>
  );
};

export default UsersPage;
