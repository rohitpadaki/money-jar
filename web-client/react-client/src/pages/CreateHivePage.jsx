import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import UserAvatar from '../components/UserAvatar';
import { createGroup, getAllUsers, addMemberToGroup } from '../services/groupService';
import { useAuth } from '../context/AuthContext';

const CreateHivePage = () => {
  const { user: currentUser } = useAuth();
  const [hiveName, setHiveName] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        // console.log(users)
        // Exclude the current user from the list of users to add
        setAllUsers(users.filter(u => u.id !== currentUser.id));
        // console.log(currentUser)
      } catch (err) {
        console.error("Failed to fetch users", err);
        setError("Could not load users list.");
      }
    };
    fetchUsers();
  }, [currentUser]);

  const filteredUsers = allUsers.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserToggle = (user) => {
    if (selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hiveName.trim()) {
      setError("Hive name is required.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Step 1: Create the group
      const newGroup = await createGroup(hiveName);

      // Step 2: Add selected members
      for (const user of selectedUsers) {
        await addMemberToGroup(newGroup.id, user.id);
      }

      // Step 3: Navigate on success
      navigate('/dashboard');

    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 hover:bg-honey-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600 cursor-pointer" />
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
                  <UserAvatar user={{ name: user.username }} size="sm" />
                  <span className="text-sm font-medium text-gray-900">{user.username}</span>
                  <button
                    type="button"
                    onClick={() => handleUserToggle(user)}
                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
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
          
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search users by username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>

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
                  <UserAvatar user={{ name: user.username }} size="md" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{user.username}</p>
                    {/* Assuming email is not available from /users endpoint, can be adjusted */}
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

        {/* Error Display */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

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
            disabled={!hiveName.trim() || loading}
            className="flex-1 btn-primary py-3 text-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Hive'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateHivePage;