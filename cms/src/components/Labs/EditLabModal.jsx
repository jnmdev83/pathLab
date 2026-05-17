import React, { useState, useEffect } from 'react';

const EditLabModal = ({ isOpen, onClose, onEdit, lab }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    website: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (lab) {
      setFormData({
        name: lab.name || '',
        phone: lab.phone || '',
        email: lab.email || '',
        website: lab.website || ''
      });
    }
  }, [lab]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Basic validation
    if (!formData.name) {
      setError('Lab Name is a required field.');
      return;
    }

    try {
      setLoading(true);
      await onEdit(lab.id || lab.lab_id, formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update lab');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-md rounded-xl shadow-xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold font-serif text-text-main">Edit Lab</h2>
          <button 
            onClick={onClose}
            className="text-text-muted hover:text-error transition-colors text-2xl leading-none"
          >&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-error text-sm rounded-lg border border-red-100">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Lab Name <span className="text-error">*</span></label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Phone Number</label>
            <input 
              type="text" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Website</label>
            <input 
              type="text" 
              name="website" 
              value={formData.website} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-text-main bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors font-medium flex items-center justify-center min-w-[100px]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLabModal;
