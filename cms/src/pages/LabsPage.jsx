import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import LabsTable from '../components/Labs/LabsTable';
import AddLabModal from '../components/Labs/AddLabModal';
import EditLabModal from '../components/Labs/EditLabModal';
import LabDetail from '../components/Labs/LabDetail';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const LabsPage = () => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editLabData, setEditLabData] = useState(null);
  const [detailLabData, setDetailLabData] = useState(null);
  
  const navigate = useNavigate();

  const fetchLabs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/labs');
      setLabs(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching labs:', err);
      setError('Failed to load labs data. Showing preview data.');
      
      // Mock data for preview
      setLabs([
        { id: 1, name: 'Apex Diagnostics', phone: '+1 234 567 8901', email: 'contact@apexdiag.com', website: 'https://apexdiag.com', is_active: true, is_verified: true, branch_count: 5 },
        { id: 2, name: 'City Central Labs', phone: '+1 987 654 3210', email: 'info@citycentrallabs.com', website: 'https://citycentrallabs.com', is_active: true, is_verified: false, branch_count: 2 },
        { id: 3, name: 'BioTest Centers', phone: '+1 555 123 4567', email: 'support@biotest.com', website: '', is_active: false, is_verified: false, branch_count: 0 },
        { id: 4, name: 'Omega Pathology', phone: '+1 444 888 9999', email: 'hello@omegapath.com', website: 'https://omegapath.com', is_active: true, is_verified: true, branch_count: 12 },
        { id: 5, name: 'QuickLab Inc', phone: '+1 222 333 4444', email: 'admin@quicklab.com', website: '', is_active: true, is_verified: true, branch_count: 1 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  const handleAddLab = async (formData) => {
    try {
      await api.post('/labs', formData);
      fetchLabs(); // Refresh table
    } catch (error) {
      throw error; // Re-throw to be handled by modal
    }
  };

  const handleEditLab = async (id, formData) => {
    try {
      await api.put(`/labs/${id}`, formData);
      fetchLabs(); // Refresh table
    } catch (error) {
      throw error; // Re-throw to be handled by modal
    }
  };

  const handleDeleteLab = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      try {
        await api.delete(`/labs/${id}`);
        // Remove from local state to avoid refetching if desired, or refetch:
        fetchLabs();
      } catch (err) {
        console.error('Error deleting lab:', err);
        alert('Failed to delete lab.');
      }
    }
  };

  const handleToggleVerify = async (id, currentStatus) => {
    try {
      // Optimistic update
      setLabs(labs.map(lab => {
        const labId = lab.id || lab.lab_id;
        if (labId === id) {
          return { ...lab, is_verified: !currentStatus };
        }
        return lab;
      }));
      
      await api.put(`/labs/${id}/toggle-verify`, { is_verified: !currentStatus });
    } catch (err) {
      console.error('Error toggling verify status:', err);
      // Revert on failure
      fetchLabs();
      alert('Failed to update verification status.');
    }
  };

  const handleViewBranches = (labId) => {
    // Navigate to branches page with filter
    navigate(`/branches?lab_id=${labId}`);
  };

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-main font-serif">Labs Management</h1>
          <p className="text-text-muted mt-1">Manage pathology labs, verifications, and details.</p>
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg transition-colors font-medium shadow-sm"
        >
          <Plus size={20} />
          <span>Add Lab</span>
        </button>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 text-error rounded-lg border border-red-100">{error}</div>}

      {/* Main Table */}
      <LabsTable 
        labs={labs}
        loading={loading}
        onEdit={setEditLabData}
        onDelete={handleDeleteLab}
        onToggleVerify={handleToggleVerify}
        onViewDetails={setDetailLabData}
        onViewBranches={handleViewBranches}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Modals */}
      <AddLabModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddLab} 
      />
      
      <EditLabModal 
        isOpen={!!editLabData} 
        onClose={() => setEditLabData(null)} 
        onEdit={handleEditLab}
        lab={editLabData}
      />
      
      <LabDetail 
        isOpen={!!detailLabData} 
        onClose={() => setDetailLabData(null)} 
        lab={detailLabData} 
      />
    </div>
  );
};

export default LabsPage;
