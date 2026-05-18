import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import api from '../services/api';
import TestsTable from '../components/Tests/TestsTable';
import TestModal from '../components/Tests/TestModal';
import TestPricing from '../components/Tests/TestPricing';

const TestsPage = () => {
  const [tests, setTests] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [selectedLab, setSelectedLab] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTest, setEditTest] = useState(null);
  const [pricingTest, setPricingTest] = useState(null);

  useEffect(() => {
    api.get('/labs').then(res => setLabs(res.data)).catch(() => {});
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/tests${selectedLab ? `?lab_id=${selectedLab}` : ''}`);
      setTests(res.data);
    } catch {
      setTests([
        { test_id: 1, test_name: 'Complete Blood Count', category: 'Blood', description: 'Measures RBC, WBC, and platelets.', branch_count: 5 },
        { test_id: 2, test_name: 'Lipid Profile', category: 'Blood', description: 'Cholesterol and triglycerides test.', branch_count: 4 },
        { test_id: 3, test_name: 'MRI Brain', category: 'Scanning', description: 'Detailed scan of brain structures.', branch_count: 1 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTests(); }, [selectedLab]);

  const showToast = (msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (data) => {
    try {
      if (editTest) await api.put(`/admin/tests/${editTest.id || editTest.test_id}`, data);
      else await api.post('/admin/tests', data);
      await fetchTests();
      showToast('Test saved successfully');
    } catch { showToast('Error saving test', 'error'); throw new Error(); }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete test ${name}?`)) {
      try {
        await api.delete(`/admin/tests/${id}`);
        fetchTests();
        showToast('Test deleted');
      } catch { showToast('Error deleting test', 'error'); }
    }
  };

  return (
    <div className="pb-8">
      {toast && <div className={`fixed top-4 right-4 p-4 rounded z-50 text-white ${toast.type==='success'?'bg-emerald-500':'bg-red-500'}`}>{toast.msg}</div>}
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif">Tests Library</h1>
          <p className="text-gray-500 mt-1">Manage global tests and branch pricing.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedLab} 
            onChange={e => setSelectedLab(e.target.value)}
            className="h-[40px] px-3 border rounded-lg bg-white outline-none text-sm min-w-[200px] max-w-[320px] truncate shadow-sm transition-all"
          >
            <option value="">All Labs (Global Library)</option>
            {labs.map(lab => (
              <option key={lab.id} value={lab.id}>{lab.name}</option>
            ))}
          </select>
          <button 
            onClick={() => { setEditTest(null); setIsModalOpen(true); }} 
            className="h-[40px] flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 rounded-lg text-sm font-medium whitespace-nowrap transition-colors shadow-sm"
          >
            <Plus size={18} /> Add Test
          </button>
        </div>
      </div>

      <TestsTable tests={tests} loading={loading} onEdit={t => { setEditTest(t); setIsModalOpen(true); }} onDelete={handleDelete} onViewPricing={setPricingTest} />
      
      <TestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} test={editTest} onSave={handleSave} />
      <TestPricing test={pricingTest} onClose={() => setPricingTest(null)} />
    </div>
  );
};

export default TestsPage;
