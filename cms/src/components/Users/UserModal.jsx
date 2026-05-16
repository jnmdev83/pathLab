import React, { useState, useEffect } from 'react';

const UserModal = ({ isOpen, onClose, onSave, user }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: 'Support Staff', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (user) setFormData({ name: user.name||'', email: user.email||'', phone: user.phone||'', role: user.role||'Support Staff', password: '' });
      else setFormData({ name: '', email: '', phone: '', role: 'Support Staff', password: '' });
      setError('');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user && formData.password.length < 8) return setError('Password must be at least 8 characters');
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch(err) {
      setError(err.response?.data?.message || 'Error saving user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden">
        <div className="p-6 border-b flex justify-between bg-gray-50">
          <h2 className="text-xl font-bold">{user ? 'Edit User' : 'Add New User'}</h2>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input required type="text" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email * {user && '(Cannot edit email)'}</label>
            <input required type="email" disabled={!!user} value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full p-2 border rounded disabled:bg-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone *</label>
            <input required type="text" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role *</label>
            <select required value={formData.role} onChange={e=>setFormData({...formData, role: e.target.value})} className="w-full p-2 border rounded">
              <option value="Support Staff">Support Staff</option>
              <option value="Lab Manager">Lab Manager</option>
              <option value="Super Admin">Super Admin</option>
            </select>
          </div>
          {!user && (
            <div>
              <label className="block text-sm font-medium mb-1">Password *</label>
              <input required type="password" value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} className="w-full p-2 border rounded" minLength={8} />
            </div>
          )}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-white rounded">{loading ? 'Saving...' : 'Save User'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
