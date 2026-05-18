import React, { useState, useEffect } from 'react';
import { X, MapPin, Calculator, Clock, Tag } from 'lucide-react';
import api from '../../services/api';

const PackagePricing = ({ package: pkg, onClose }) => {
  const [labs, setLabs] = useState([]);
  const [branches, setBranches] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    lab_id: '',
    lab_branch_id: '',
    price: '',
    reporting_time: '24 HR',
    home_collection: true,
    discount_label: '',
    notes: ''
  });

  useEffect(() => {
    if (pkg) {
      api.get('/labs').then(res => setLabs(res.data)).catch(() => {});
      fetchMappings();
    }
  }, [pkg]);

  const fetchMappings = async () => {
    try {
      const res = await api.get('/admin/package-mappings');
      setMappings(res.data.filter(m => m.package_id === pkg.id));
    } catch (err) { console.error(err); }
  };

  const handleLabChange = async (labId) => {
    setFormData({ ...formData, lab_id: labId, lab_branch_id: '' });
    if (labId) {
      const res = await api.get(`/labs/${labId}/branches`);
      setBranches(res.data);
    } else {
      setBranches([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/admin/package-mappings', { ...formData, package_id: pkg.id });
      fetchMappings();
      setFormData({ ...formData, price: '', discount_label: '', notes: '' });
    } catch (err) {
      alert('Error mapping package to branch');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMapping = async (mappingId) => {
    if (window.confirm('Are you sure you want to remove this assignment?')) {
      try {
        await api.delete(`/admin/package-mappings/${mappingId}`);
        fetchMappings();
      } catch (err) {
        alert('Error removing package assignment');
      }
    }
  };

  if (!pkg) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-xl font-bold font-serif">Assign Labs to {pkg.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">Define lab-specific pricing and turnaround times.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-3 gap-8">
          {/* Form */}
          <div className="col-span-1">
            <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
              <Calculator size={16} /> New Assignment
            </h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Select Lab</label>
                <select 
                  required
                  className="w-full p-2.5 border rounded-lg text-sm"
                  value={formData.lab_id}
                  onChange={e => handleLabChange(e.target.value)}
                >
                  <option value="">Choose Lab...</option>
                  {labs.map(lab => <option key={lab.id} value={lab.id}>{lab.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Select Branch</label>
                <select 
                  required
                  className="w-full p-2.5 border rounded-lg text-sm"
                  value={formData.lab_branch_id}
                  onChange={e => setFormData({ ...formData, lab_branch_id: e.target.value })}
                >
                  <option value="">Choose Branch...</option>
                  {branches.length > 0 && <option value="all">⭐ All Branches (Global Lab Assignment)</option>}
                  {branches.map(b => <option key={b.id} value={b.id}>{b.branch_name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Price (₹)</label>
                  <input 
                    type="number" required
                    className="w-full p-2.5 border rounded-lg text-sm"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Turnaround</label>
                  <input 
                    type="text" required
                    className="w-full p-2.5 border rounded-lg text-sm"
                    value={formData.reporting_time}
                    onChange={e => setFormData({ ...formData, reporting_time: e.target.value })}
                    placeholder="e.g. 12 HR"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Discount Tag</label>
                <input 
                  type="text"
                  className="w-full p-2.5 border rounded-lg text-sm"
                  value={formData.discount_label}
                  onChange={e => setFormData({ ...formData, discount_label: e.target.value })}
                  placeholder="e.g. 20% OFF"
                />
              </div>
              <div className="flex items-center gap-2 py-2">
                <input type="checkbox" checked={formData.home_collection} onChange={e => setFormData({...formData, home_collection: e.target.checked})} className="accent-indigo-600" />
                <span className="text-xs font-medium text-gray-600">Home Collection Available</span>
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 shadow-md transition-all active:scale-95"
              >
                {loading ? 'Processing...' : 'Assign to Branch'}
              </button>
            </form>
          </div>

          {/* List of Mappings */}
          <div className="col-span-2 border-l pl-8">
            <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
              <MapPin size={16} /> Current Lab Availability
            </h4>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {mappings.length === 0 && <div className="text-center py-12 text-gray-400 text-sm italic">This package is not yet assigned to any lab.</div>}
              {mappings.map(m => (
                <div key={m.id} className="p-4 border rounded-xl flex justify-between items-center hover:border-indigo-200 transition-all bg-indigo-50/10">
                  <div>
                    <div className="font-bold text-gray-900">{m.lab_name}</div>
                    <div className="text-xs text-gray-500">{m.branch_name}</div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1 text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                        <Tag size={10} /> ₹{m.price}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold bg-gray-100 px-2 py-0.5 rounded">
                        <Clock size={10} /> {m.reporting_time}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {m.discount_label && <div className="text-[10px] text-amber-600 font-bold mb-1">{m.discount_label}</div>}
                    <button 
                      onClick={() => handleRemoveMapping(m.id)} 
                      className="text-xs text-red-500 font-bold hover:text-red-700 hover:underline transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagePricing;
