import React, { useState, useEffect } from 'react';

const TestModal = ({ isOpen, onClose, onSave, test }) => {
  const [formData, setFormData] = useState({ test_name: '', category: 'Blood', description: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (test) setFormData({ test_name: test.test_name||'', category: test.category||'Blood', description: test.description||'' });
      else setFormData({ test_name: '', category: 'Blood', description: '' });
    }
  }, [isOpen, test]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch(err) {
      alert('Error saving test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden">
        <div className="p-6 border-b flex justify-between bg-gray-50">
          <h2 className="text-xl font-bold">{test ? 'Edit Test' : 'Add New Test'}</h2>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Test Name *</label>
            <input required type="text" value={formData.test_name} onChange={e=>setFormData({...formData, test_name: e.target.value})} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select required value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className="w-full p-2 border rounded">
              <option value="Blood">Blood</option>
              <option value="Scanning">Scanning</option>
              <option value="Package">Package</option>
              <option value="Gastro">Gastro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded h-24" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-white rounded">{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestModal;
