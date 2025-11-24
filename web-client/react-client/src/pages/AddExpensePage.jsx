import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign } from 'lucide-react';
import UserAvatar from '../components/UserAvatar';
import { mockHives, mockUsers } from '../data/mockData';

const AddExpensePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const hive = mockHives.find(h => h.id === parseInt(id));

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    paidBy: '',
    splitBetween: [],
    date: new Date().toISOString().split('T')[0]
  });

  if (!hive) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Hive not found</h1>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const getUserById = (userId) => mockUsers.find(user => user.id === userId);
  const members = hive.members.map(getUserById).filter(Boolean);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMemberToggle = (memberId) => {
    setFormData(prev => ({
      ...prev,
      splitBetween: prev.splitBetween.includes(memberId)
        ? prev.splitBetween.filter(id => id !== memberId)
        : [...prev.splitBetween, memberId]
    }));
  };

  const handleSelectAll = () => {
    setFormData(prev => ({
      ...prev,
      splitBetween: prev.splitBetween.length === members.length ? [] : members.map(m => m.id)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock submission - redirect to hive detail
    navigate(`/hive/${id}`);
  };

  const splitAmount = formData.amount && formData.splitBetween.length > 0 
    ? (parseFloat(formData.amount) / formData.splitBetween.length).toFixed(2)
    : '0.00';

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate(`/hive/${id}`)}
          className="p-2 hover:bg-honey-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Expense</h1>
          <p className="text-gray-600">{hive.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Expense Details */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Expense Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
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
                  className="input-field pl-10"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
              >
                <option value="Food">Food & Dining</option>
                <option value="Transportation">Transportation</option>
                <option value="Accommodation">Accommodation</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Shopping">Shopping</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="paidBy" className="block text-sm font-medium text-gray-700 mb-2">
                Paid by
              </label>
              <select
                id="paidBy"
                name="paidBy"
                value={formData.paidBy}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select who paid</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
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

        {/* Split Between */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Split Between</h2>
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-honey-600 hover:text-honey-700 text-sm font-medium"
            >
              {formData.splitBetween.length === members.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="space-y-3">
            {members.map((member) => {
              const isSelected = formData.splitBetween.includes(member.id);
              return (
                <div
                  key={member.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-honey-100 border border-honey-300' : 'hover:bg-gray-50 border border-gray-200'
                  }`}
                  onClick={() => handleMemberToggle(member.id)}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleMemberToggle(member.id)}
                    className="h-4 w-4 text-honey-500 focus:ring-honey-500 border-honey-300 rounded"
                  />
                  <UserAvatar user={member} size="md" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                  {isSelected && (
                    <div className="text-right">
                      <p className="font-medium text-honey-600">${splitAmount}</p>
                      <p className="text-xs text-gray-500">per person</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {formData.splitBetween.length === 0 && (
            <p className="text-red-500 text-sm mt-2">Please select at least one person to split with</p>
          )}
        </div>

        {/* Summary */}
        {formData.amount && formData.splitBetween.length > 0 && (
          <div className="card bg-honey-50 border-honey-200">
            <h3 className="font-medium text-gray-900 mb-2">Split Summary</h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total amount: ${formData.amount}</span>
              <span className="text-gray-600">÷ {formData.splitBetween.length} people = ${splitAmount} each</span>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/hive/${id}`)}
            className="flex-1 btn-secondary py-3 text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!formData.title || !formData.amount || !formData.paidBy || formData.splitBetween.length === 0}
            className="flex-1 btn-primary py-3 text-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Expense
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExpensePage;