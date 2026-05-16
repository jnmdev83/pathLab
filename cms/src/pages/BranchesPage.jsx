import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import api from '../services/api';
import BranchesTable from '../components/Branches/BranchesTable';
import AddBranchModal from '../components/Branches/AddBranchModal';
import EditBranchModal from '../components/Branches/EditBranchModal';

const BranchesPage = () => {
  const [searchParams] = useSearchParams();
  const initialLabId = searchParams.get('lab_id');
  
  const [labs, setLabs] = useState([]);
  const [selectedLabId, setSelectedLabId] = useState(initialLabId || '');
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editBranch, setEditBranch] = useState(null);

  useEffect(() => {
    // Fetch labs for dropdown
    api.get('/labs').then(res => {
      setLabs(res.data);
      if (!selectedLabId && res.data.length > 0) {
        setSelectedLabId(res.data[0].id || res.data[0].lab_id);
      }
    }).catch(err => {
      setLabs([{ id: 1, name: 'Apex Diagnostics' }, { id: 2, name: 'City Central Labs' }]);
      if (!selectedLabId) setSelectedLabId(1);
    });
  }, []);

  const fetchBranches = async (labId) => {
    if (!labId) return;
    setLoading(true);
    try {
      const res = await api.get(`/labs/${labId}/branches`);
      setBranches(res.data);
    } catch (err) {
      setBranches([
        { id: 101, name: 'Main Center', city: 'Mumbai', address: 'Andheri West', phone: '9876543210', latitude: 19.1, longitude: 72.8, is_active: true, home_collection: true },
        { id: 102, name: 'Suburban Branch', city: 'Mumbai', address: 'Borivali', phone: '9876543211', latitude: 19.2, longitude: 72.85, is_active: true, home_collection: false }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches(selectedLabId);
  }, [selectedLabId]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdd = async (data) => {
    await api.post('/branches', data);
    fetchBranches(selectedLabId);
    showToast('Branch added successfully');
  };

  const handleEdit = async (id, data) => {
    await api.put(`/branches/${id}`, data);
    fetchBranches(selectedLabId);
    showToast('Branch updated successfully');
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete branch ${name}?`)) {
      try {
        await api.delete(`/branches/${id}`);
        fetchBranches(selectedLabId);
        showToast('Branch deleted');
      } catch (err) {
        showToast('Failed to delete', 'error');
      }
    }
  };

  return (
    <div className="pb-8">
      {toast && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 text-white ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif">Branches</h1>
          <p className="text-text-muted mt-1">Manage laboratory branch locations.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            value={selectedLabId} 
            onChange={(e) => setSelectedLabId(e.target.value)}
            className="p-2 border rounded-lg bg-white outline-none min-w-[200px]"
          >
            <option value="">Select Lab...</option>
            {labs.map(lab => (
              <option key={lab.id || lab.lab_id} value={lab.id || lab.lab_id}>{lab.name}</option>
            ))}
          </select>

          <button 
            onClick={() => selectedLabId ? setIsAddOpen(true) : alert('Select a lab first')}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg"
          >
            <Plus size={20} /> Add Branch
          </button>
        </div>
      </div>

      {!selectedLabId ? (
        <div className="p-10 text-center bg-surface rounded-xl border">Please select a lab to view branches.</div>
      ) : (
        <BranchesTable 
          branches={branches} 
          loading={loading} 
          onEdit={setEditBranch} 
          onDelete={handleDelete}
          onToggleStatus={async (id, status) => {
            try {
              await api.put(`/branches/${id}/status`, { is_active: !status });
              fetchBranches(selectedLabId);
              showToast('Status updated');
            } catch(e) { showToast('Update failed', 'error'); }
          }}
        />
      )}

      <AddBranchModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={handleAdd} labId={selectedLabId} />
      <EditBranchModal isOpen={!!editBranch} onClose={() => setEditBranch(null)} onEdit={handleEdit} branch={editBranch} />
    </div>
  );
};

export default BranchesPage;
