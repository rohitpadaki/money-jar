import React, { useEffect, useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { getAllCategories, deleteCategory } from '../services/categoryService';

const CategoryManagementModal = ({ isOpen, onClose, currentUser }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      setError('Failed to fetch categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchCategories();
  }, [isOpen]);

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category? This cannot be undone.')) return;
    setDeletingId(categoryId);
    try {
      await deleteCategory(categoryId);
      setCategories(categories.filter(cat => cat.id !== categoryId));
    } catch (err) {
      setError('Failed to delete category.');
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* Container with max height and flex layout to keep footer visible */}
      <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-md relative max-h-[90vh] flex flex-col">
        
        {/* Fixed Header Area */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Manage Categories</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto mb-6 pr-2 custom-scrollbar">
          {loading ? (
            <div className="py-10 text-center text-gray-500 font-medium">Loading categories...</div>
          ) : error ? (
            <div className="text-red-500 py-6 text-center bg-red-50 rounded-2xl">{error}</div>
          ) : (
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.id} className="flex items-center justify-between bg-honey-50 p-4 rounded-2xl border border-honey-100">
                  <span className="font-semibold text-gray-900">{cat.name}</span>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    disabled={deletingId === cat.id}
                    className="text-red-500 hover:bg-red-100 rounded-xl p-2 transition-colors disabled:opacity-50"
                    title="Delete category"
                  >
                    <Trash2 size={20} />
                  </button>
                </li>
              ))}
              {categories.length === 0 && (
                <li className="text-gray-500 text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  No categories found.
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Fixed Footer Area */}
        <div className="flex-shrink-0 pt-2 border-t border-gray-100">
          <button 
            onClick={onClose} 
            className="btn-secondary w-full py-4 rounded-2xl font-bold text-lg shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagementModal;