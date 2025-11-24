import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import UserAvatar from '../components/UserAvatar';
import { mockUsers } from '../data/mockData';

const CreateHivePage = () => {
  const [hiveName, setHiveName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserToggle = (user) => {
    if (selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock creation - redirect to hive detail
    navigate('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 hover:bg-honey-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Hive</h1>
          <p className="text-gray-600">Set up a new group to split expenses</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Hive Name */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hive Details</h2>
          <div>
            <label htmlFor="hiveName" className="block text-sm font-medium text-gray-700 mb-2">
              Hive Name
            </label>
            <input
              type="text"
              id="hiveName"
              value={hiveName}
              onChange={(e) => setHiveName(e.target.value)}
              className="input-field"
              placeholder="e.g., House Roommates, Weekend Trip, etc."
              required
            />
          </div>
        </div>

        {/* Selected Members */}
        {selectedUsers.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Selected Members ({selectedUsers.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-2 bg-honey-100 rounded-full px-3 py-2"
                >
                  <UserAvatar user={user} size="sm" />
                  <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  <button
                    type="button"
                    onClick={() => handleUserToggle(user)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Members */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Members</h2>
          
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>

          {/* User List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredUsers.map((user) => {
              const isSelected = selectedUsers.find(u => u.id === user.id);
              return (
                <div
                  key={user.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-honey-100 border border-honey-300' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleUserToggle(user)}
                >
                  <UserAvatar user={user} size="md" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className="flex items-center">
                    {isSelected ? (
                      <div className="w-6 h-6 bg-honey-500 rounded-full flex items-center justify-center">
                        <Plus className="w-4 h-4 text-white rotate-45" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                        <Plus className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredUsers.length === 0 && (
            <p className="text-gray-500 text-center py-4">No users found</p>
          )}
        </div>

        {/* Submit */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex-1 btn-secondary py-3 text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!hiveName.trim() || selectedUsers.length === 0}
            className="flex-1 btn-primary py-3 text-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Hive
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateHivePage;