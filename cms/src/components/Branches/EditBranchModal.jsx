import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const EditBranchModal = ({ isOpen, onClose, onEdit, branch }) => {
  const [formData, setFormData] = useState({});
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && branch) {
      setFormData({
        name: branch.name || '', address: branch.address || '', city: branch.city || '', 
        state: branch.state || '', postal_code: branch.postal_code || '', phone: branch.phone || '',
        latitude: branch.latitude || '', longitude: branch.longitude || '', 
        operating_hours: branch.operating_hours || '', home_collection: !!branch.home_collection
      });
      api.get('/cities').then(res => setCities(res.data)).catch(err => {
        setCities([{ id: 1, name: 'Mumbai' }, { id: 2, name: 'Delhi' }, { id: 3, name: 'Bangalore' }]);
      });
    }
  }, [isOpen, branch]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.city || !formData.phone) {
      return setError('Please fill all required fields');
    }
    try {
      setLoading(true);
      await onEdit(branch.id || branch.branch_id, formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update branch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-surface w-full max-w-2xl rounded-xl shadow-xl border border-border overflow-hidden my-8">
        <div className="p-6 border-b border-border flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold font-serif">Edit Branch</h2>
          <button onClick={onClose} className="text-2xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-error text-sm rounded-lg">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Branch Name *</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded" /></div>
            <div><label className="block text-sm font-medium mb-1">Phone *</label><input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-2 border rounded" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Address *</label><input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-2 border rounded" /></div>
            <div>
              <label className="block text-sm font-medium mb-1">City *</label>
              <select value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-2 border rounded bg-white">
                <option value="">Select City</option>
                {cities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div><label className="block text-sm font-medium mb-1">State</label><input type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full p-2 border rounded" /></div>
            <div><label className="block text-sm font-medium mb-1">Postal Code</label><input type="text" value={formData.postal_code} onChange={e => setFormData({...formData, postal_code: e.target.value})} className="w-full p-2 border rounded" /></div>
            <div><label className="block text-sm font-medium mb-1">Operating Hours</label><input type="text" value={formData.operating_hours} onChange={e => setFormData({...formData, operating_hours: e.target.value})} className="w-full p-2 border rounded" /></div>
            <div><label className="block text-sm font-medium mb-1">Latitude</label><input type="number" step="any" value={formData.latitude} onChange={e => setFormData({...formData, latitude: e.target.value})} className="w-full p-2 border rounded" /></div>
            <div><label className="block text-sm font-medium mb-1">Longitude</label><input type="number" step="any" value={formData.longitude} onChange={e => setFormData({...formData, longitude: e.target.value})} className="w-full p-2 border rounded" /></div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" id="home_collection_edit" checked={formData.home_collection} onChange={e => setFormData({...formData, home_collection: e.target.checked})} className="w-4 h-4 rounded text-primary" />
            <label htmlFor="home_collection_edit" className="text-sm font-medium">Offers Home Collection</label>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-white rounded">{loading ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBranchModal;
