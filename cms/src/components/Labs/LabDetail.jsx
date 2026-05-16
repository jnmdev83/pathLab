import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Globe, CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';

const LabDetail = ({ isOpen, onClose, lab }) => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && lab) {
      const fetchBranches = async () => {
        try {
          setLoading(true);
          const labId = lab.id || lab.lab_id;
          // You could also fetch full lab details if 'lab' prop doesn't have everything
          const response = await api.get(`/labs/${labId}/branches`);
          setBranches(response.data || []);
          setError(null);
        } catch (err) {
          console.error('Error fetching branches:', err);
          setError('Failed to load branches for this lab.');
          // Mock data for preview
          setBranches([
            { id: 1, name: 'Main Branch', address: '123 Health St, City', phone: '+1 234 567 8901' },
            { id: 2, name: 'Downtown Center', address: '456 Med Ave, City', phone: '+1 234 567 8902' }
          ]);
        } finally {
          setLoading(false);
        }
      };

      fetchBranches();
    }
  }, [isOpen, lab]);

  if (!isOpen || !lab) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl shadow-xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold font-serif text-text-main">Lab Details</h2>
          <button 
            onClick={onClose}
            className="text-text-muted hover:text-error transition-colors text-2xl leading-none"
          >&times;</button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {/* Lab Info Card */}
          <div className="bg-white rounded-lg border border-border p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-primary mb-1">{lab.name}</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${lab.is_active !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                    {lab.is_active !== false ? 'Active' : 'Inactive'}
                  </span>
                  {lab.is_verified && (
                    <span className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      <CheckCircle size={12} /> Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-text-main">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-primary shrink-0">
                  <Phone size={16} />
                </div>
                <span>{lab.phone || 'N/A'}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-primary shrink-0">
                  <Mail size={16} />
                </div>
                <span>{lab.email || 'N/A'}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-primary shrink-0">
                  <Globe size={16} />
                </div>
                <span>{lab.website || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          {/* Branches Section */}
          <h4 className="text-lg font-bold text-text-main font-serif mb-3 flex items-center gap-2">
            <MapPin size={20} className="text-primary" />
            Associated Branches
          </h4>
          
          {error && <div className="p-3 bg-red-50 text-error text-sm rounded-lg mb-4">{error}</div>}
          
          {loading ? (
            <div className="py-8 flex justify-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : branches.length === 0 ? (
            <div className="text-center py-8 text-text-muted bg-gray-50 rounded-lg border border-border border-dashed">
              No branches found for this lab.
            </div>
          ) : (
            <div className="space-y-3">
              {branches.map(branch => (
                <div key={branch.id || branch.branch_id} className="p-4 rounded-lg border border-border bg-white hover:border-primary transition-colors">
                  <h5 className="font-bold text-text-main mb-1">{branch.name}</h5>
                  <p className="text-sm text-text-muted flex items-start gap-1 mb-1">
                    <MapPin size={14} className="mt-0.5 shrink-0" /> {branch.address || branch.location || 'No address provided'}
                  </p>
                  {branch.phone && (
                    <p className="text-sm text-text-muted flex items-center gap-1">
                      <Phone size={14} className="shrink-0" /> {branch.phone}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-border bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabDetail;
