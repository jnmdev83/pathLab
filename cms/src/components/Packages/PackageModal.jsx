import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import api from '../../services/api';

const PackageModal = ({ isOpen, onClose, package: pkg, onSave }) => {
  const [formData, setFormData] = useState({ name: '', description: '', category: 'package', is_active: true, test_ids: [] });
  const [availableTests, setAvailableTests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pkg) setFormData({ 
      name: pkg.name || '', 
      description: pkg.description || '', 
      category: pkg.category || 'package',
      is_active: pkg.is_active,
      test_ids: pkg.test_ids || [] 
    });
    else setFormData({ name: '', description: '', category: 'package', is_active: true, test_ids: [] });
  }, [pkg, isOpen]);

  useEffect(() => {
    if (isOpen) {
      api.get('/admin/tests').then(res => setAvailableTests(res.data)).catch(() => {});
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cleanData = {
        ...formData,
        test_ids: formData.test_ids.filter(id => id !== '' && id !== null && id !== undefined)
      };
      await onSave(cleanData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTestRow = () => {
    setFormData(prev => ({
      ...prev,
      test_ids: [...prev.test_ids, '']
    }));
  };

  const removeTestRow = (index) => {
    setFormData(prev => ({
      ...prev,
      test_ids: prev.test_ids.filter((_, idx) => idx !== index)
    }));
  };

  const handleTestChange = (index, value) => {
    setFormData(prev => {
      const updated = [...prev.test_ids];
      updated[index] = value ? Number(value) : '';
      return { ...prev, test_ids: updated };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold font-serif">{pkg ? 'Edit Package Template' : 'Create New Package'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Package Name</label>
              <input 
                type="text" 
                required
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="e.g. Full Body Premium Checkup"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select 
                className="w-full p-3 border rounded-xl outline-none"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="package">General Package</option>
                <option value="blood">Blood Care</option>
                <option value="scanning">Scanning/Imaging</option>
                <option value="Heart">Heart Health</option>
                <option value="Diabetic">Diabetes Care</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <div className="flex items-center gap-4 mt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-5 h-5 accent-indigo-600" />
                  <span className="text-sm">Active & Visible</span>
                </label>
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea 
                className="w-full p-3 border rounded-xl h-24 outline-none"
                placeholder="Describe what this package offers..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-semibold text-gray-700">Include Tests in this Package</label>
              <button 
                type="button" 
                onClick={addTestRow}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all"
              >
                <Plus size={14} /> Add Test Row
              </button>
            </div>
            
            <div className="space-y-3 max-h-48 overflow-y-auto border rounded-xl p-4 bg-gray-50">
              {formData.test_ids.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-400 italic">No tests added yet. Click "+ Add Test Row" to include tests in this package.</div>
              ) : (
                formData.test_ids.map((testId, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <select
                      value={testId || ''}
                      onChange={e => handleTestChange(index, e.target.value)}
                      required
                      className="flex-1 p-2.5 border rounded-lg bg-white outline-none text-sm"
                    >
                      <option value="">Select a Test...</option>
                      {availableTests.map(t => {
                        const isAlreadySelected = formData.test_ids.some((selectedId, sIdx) => selectedId === (t.id || t.test_id) && sIdx !== index);
                        return (
                          <option 
                            key={t.id || t.test_id} 
                            value={t.id || t.test_id}
                            disabled={isAlreadySelected}
                          >
                            {t.name || t.test_name} {isAlreadySelected ? '(Already Selected)' : ''}
                          </option>
                        );
                      })}
                    </select>
                    
                    <button
                      type="button"
                      onClick={() => removeTestRow(index)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Remove Test"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              {loading ? 'Saving...' : (pkg ? 'Update Package' : 'Create Package')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PackageModal;
