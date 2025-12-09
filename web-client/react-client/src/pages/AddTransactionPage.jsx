import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, Plus } from 'lucide-react';
import { addExpense, getCategories, createCategory } from '../services/transactionService';
import { useAuth } from '../context/AuthContext';

const AddTransactionPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');


  const [formData, setFormData] = useState({
    note: '',
    amount: '',
    categoryId: '',
    type: 'expense', 
    date: new Date().toISOString().split('T')[0]
  });

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
      if (fetchedCategories.length > 0 && !formData.categoryId) {
        setFormData(prev => ({ ...prev, categoryId: fetchedCategories[0].id }));
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
      setError("Could not load categories.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNewCategorySubmit = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const newCategory = await createCategory({ 
        name: newCategoryName,
        type: formData.type // Link category type to transaction type
      });
      await fetchCategories(); // Refresh categories
      setFormData(prev => ({ ...prev, categoryId: newCategory.id }));
      setShowNewCategory(false);
      setNewCategoryName('');
    } catch (err) {
      console.error("Failed to create category", err);
      setError("Could not create new category.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };
      await addExpense(expenseData);
      navigate(`/dashboard`);
    } catch (err) {
      console.error('Failed to add expense', err);
      setError('Failed to add expense. Please try again.');
    }
  };


  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate(`/dashboard`)}
          className="p-2 hover:bg-honey-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Personal Transactions</h1>
          <p className="text-gray-600">This will be added to your personal jar.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Expense Details */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Transaction Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                id="note"
                name="note"
                value={formData.note}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Dinner at Restaurant, Grocery Shopping"
                required
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-honey-400" />
                </div>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="input-field pl-10!"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="flex items-center space-x-2">
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="input-field flex-grow"
                >
                  {categories.filter(c => c.type === formData.type).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCategory(!showNewCategory)}
                  className="btn-secondary p-2"
                  title="Add new category"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {showNewCategory && (
                <div className="mt-2 flex items-center space-x-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="input-field flex-grow"
                    placeholder="New category name"
                  />
                  <button type="button" onClick={handleNewCategorySubmit} className="btn-primary">Save</button>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="input-field"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {/* Submit */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/dashboard`)}
            className="flex-1 btn-secondary py-3 text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!formData.note || !formData.amount || !formData.categoryId}
            className="flex-1 btn-primary py-3 text-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Transaction
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTransactionPage;