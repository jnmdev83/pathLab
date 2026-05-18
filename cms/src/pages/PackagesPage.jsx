import React, { useState, useEffect } from 'react';
import { Plus, Boxes } from 'lucide-react';
import api from '../services/api';
import PackagesTable from '../components/Packages/PackagesTable';
import PackageModal from '../components/Packages/PackageModal';
import PackagePricing from '../components/Packages/PackagePricing';

const PackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPackage, setEditPackage] = useState(null);
  const [pricingPackage, setPricingPackage] = useState(null);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/packages');
      setPackages(res.data);
    } catch {
      showToast('Error fetching packages', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPackages(); }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (data) => {
    try {
      if (editPackage) {
        await api.put(`/admin/packages/${editPackage.id}`, data);
        showToast('Package template updated');
      } else {
        await api.post('/admin/packages', data);
        showToast('New package created');
      }
      await fetchPackages();
    } catch {
      showToast('Error saving package', 'error');
      throw new Error();
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete package template "${name}"? All lab mappings will also be removed.`)) {
      try {
        await api.delete(`/admin/packages/${id}`);
        fetchPackages();
        showToast('Package deleted');
      } catch {
        showToast('Error deleting package', 'error');
      }
    }
  };

  return (
    <div className="pb-8 animate-in fade-in duration-500">
      {toast && (
        <div className={`fixed top-4 right-4 p-4 rounded-xl z-50 text-white shadow-lg animate-in slide-in-from-right-4 ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
          {toast.msg}
        </div>
      )}
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Boxes className="text-indigo-600" size={24} />
            <h1 className="text-3xl font-bold font-serif text-gray-900">Health Packages</h1>
          </div>
          <p className="text-gray-500 text-sm">Create common package templates and compare labs side-by-side.</p>
        </div>
        <button 
          onClick={() => { setEditPackage(null); setIsModalOpen(true); }} 
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 active:scale-95"
        >
          <Plus size={20} /> New Package Template
        </button>
      </div>

      <PackagesTable 
        packages={packages} 
        loading={loading} 
        onEdit={p => { setEditPackage(p); setIsModalOpen(true); }} 
        onDelete={handleDelete} 
        onViewPricing={setPricingPackage} 
      />
      
      <PackageModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        package={editPackage} 
        onSave={handleSave} 
      />

      <PackagePricing 
        package={pricingPackage} 
        onClose={() => setPricingPackage(null)} 
      />
    </div>
  );
};

export default PackagesPage;
