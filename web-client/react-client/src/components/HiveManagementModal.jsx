import React from 'react';
import { LogOut, Trash2 } from 'lucide-react';

const HiveManagementModal = ({ isOpen, onClose, hive, currentUser, onAddMember, onRemoveMember, onLeaveGroup, onDeleteGroup }) => {
  if (!isOpen) return null;

  const isOwner = hive.createdBy.id === currentUser.id;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <h2 className="text-2xl font-bold mb-4">Manage "{hive.name}"</h2>

        {/* Member List */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Members</h3>
          <ul className="space-y-2">
            {hive.members.map(member => (
              <li key={member.id} className="flex items-center justify-between">
                <span>{member.username} {member.id === hive.createdBy.id && '(Owner)'}</span>
                {isOwner && member.id !== currentUser.id && (
                  <button
                    onClick={() => onRemoveMember(member.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Add Member Form */}
        {isOwner && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Add Member</h3>
            {/* Simple form for now, can be expanded with user search */}
            <form onSubmit={onAddMember} className="flex space-x-2">
              <input
                type="text"
                name="username"
                placeholder="Enter Username to add"
                className="input flex-grow"
                required
              />
              <button type="submit" className="btn-secondary">Add</button>
            </form>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3">
            {!isOwner && (
                <button
                    onClick={onLeaveGroup}
                    className="w-full px-4 py-2 rounded-md bg-red-500 text-white font-semibold 
                            hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 
                            transition-colors duration-200"
                >
                    Leave Hive
                </button>
            )}

            {isOwner && (
                <button
                    onClick={onDeleteGroup}
                    className="w-full px-4 py-2 rounded-md bg-red-500 text-white font-semibold 
                            hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 
                            transition-colors duration-200"
                >
                    Delete Hive
                </button>
            )}

          <button onClick={onClose} className="btn-secondary w-full">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HiveManagementModal;