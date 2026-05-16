import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { IndianRupee } from 'lucide-react';

const TestPricing = ({ test, onClose }) => {
  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Assignment form state
  const [branches, setBranches] = useState([]);
  const [assignForm, setAssignForm] = useState({ branch_id: '', price: '', reporting_time: '' });

  useEffect(() => {
    if (test) fetchPricing();
    api.get('/branches').then(res => setBranches(res.data)).catch(() => setBranches([{id:1, name:'City Center'}, {id:2, name:'Northside'}]));
  }, [test]);

  const fetchPricing = async () => {
    try {
      const res = await api.get(`/admin/tests/${test.test_id || test.id}/branches`);
      setPricingData(res.data);
    } catch {
      setPricingData([
        { id: 1, lab_name: 'Apex Diag', branch_name: 'Main Branch', price: 500, reporting_time: '24 hours', is_available: true },
        { id: 2, lab_name: 'Apex Diag', branch_name: 'Suburban', price: 550, reporting_time: '24 hours', is_available: true }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      await api.post('/lab-test-branches', { 
        test_id: test.test_id || test.id, 
        branch_id: assignForm.branch_id, 
        price: assignForm.price, 
        reporting_time: assignForm.reporting_time 
      });
      fetchPricing();
      setAssignForm({ branch_id: '', price: '', reporting_time: '' });
    } catch(err) {
      alert('Failed to assign test to branch');
    }
  };

  const handleUpdatePrice = async (recordId, currentPrice) => {
    const newPrice = prompt('Enter new price:', currentPrice);
    if (newPrice && !isNaN(newPrice)) {
      try {
        await api.put(`/lab-test-branches/${recordId}`, { price: parseFloat(newPrice) });
        fetchPricing();
      } catch {
        alert('Failed to update price');
      }
    }
  };

  if (!test) return null;

  // Sorting for Price Comparison feature (cheapest first)
  const sortedPricing = [...pricingData].sort((a,b) => a.price - b.price);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-surface w-full max-w-4xl rounded-xl shadow-xl overflow-hidden my-8">
        <div className="p-6 border-b flex justify-between bg-gray-50">
          <h2 className="text-xl font-bold font-serif">Test Pricing: {test.test_name}</h2>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>
        
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-bold">Current Assignments & Prices (Price Comparison)</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-3">Lab / Branch</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Reporting Time</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {loading ? <tr><td colSpan="4" className="p-4 text-center">Loading...</td></tr> : 
                   sortedPricing.length === 0 ? <tr><td colSpan="4" className="p-4 text-center text-gray-500">Not assigned to any branches yet</td></tr> :
                   sortedPricing.map(p => (
                    <tr key={p.id}>
                      <td className="p-3"><div className="font-medium">{p.lab_name}</div><div className="text-xs text-gray-500">{p.branch_name}</div></td>
                      <td className="p-3 text-emerald-600 font-bold flex items-center"><IndianRupee size={14}/>{p.price}</td>
                      <td className="p-3">{p.reporting_time}</td>
                      <td className="p-3"><button onClick={() => handleUpdatePrice(p.id, p.price)} className="text-primary text-xs bg-indigo-50 px-2 py-1 rounded">Edit Price</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl border">
            <h3 className="font-bold mb-4">Assign to New Branch</h3>
            <form onSubmit={handleAssign} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1">Branch *</label>
                <select required value={assignForm.branch_id} onChange={e=>setAssignForm({...assignForm, branch_id: e.target.value})} className="w-full p-2 border rounded text-sm bg-white">
                  <option value="">Select Branch</option>
                  {branches.map(b => <option key={b.id||b.branch_id} value={b.id||b.branch_id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Price (₹) *</label>
                <input required type="number" value={assignForm.price} onChange={e=>setAssignForm({...assignForm, price: e.target.value})} className="w-full p-2 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Reporting Time *</label>
                <input required type="text" value={assignForm.reporting_time} onChange={e=>setAssignForm({...assignForm, reporting_time: e.target.value})} placeholder="e.g. 24 hours" className="w-full p-2 border rounded text-sm" />
              </div>
              <button type="submit" className="w-full bg-primary text-white py-2 rounded text-sm font-medium">Assign Test</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPricing;
