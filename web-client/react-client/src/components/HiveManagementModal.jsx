import React from 'react';
import { LogOut, Trash2, X, UserPlus } from 'lucide-react';

const HiveManagementModal = ({ isOpen, onClose, hive, currentUser, onAddMember, onRemoveMember, onLeaveGroup, onDeleteGroup }) => {
  if (!isOpen) return null;

  const isOwner = hive.createdBy.id === currentUser.id;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* Modal Container with Max Height and Flex Layout */}
      <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-md relative max-h-[90vh] flex flex-col">
        
        {/* Fixed Header */}
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900 pr-8 line-clamp-1">Manage "{hive.name}"</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors absolute top-4 right-4"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto mb-6 pr-2 custom-scrollbar space-y-8">
          
          {/* Member List Section */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Members ({hive.members.length})</h3>
            <ul className="space-y-2">
              {hive.members.map(member => (
                <li key={member.id} className="flex items-center justify-between bg-honey-50 p-3 rounded-2xl border border-honey-100">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">{member.username}</span>
                    {member.id === hive.createdBy.id && (
                      <span className="text-[10px] bg-honey-200 text-honey-800 px-2 py-0.5 rounded-full w-fit font-bold uppercase">Owner</span>
                    )}
                  </div>
                  
                  {isOwner && member.id !== currentUser.id && (
                    <button
                      onClick={() => onRemoveMember(member.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors cursor-pointer"
                      title="Remove member"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Add Member Form Section */}
          {isOwner && (
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <UserPlus size={16} /> Add Member
              </h3>
              <form onSubmit={onAddMember} className="flex space-x-2">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="input-field flex-grow bg-white"
                  required
                />
                <button type="submit" className="btn-primary px-4">Add</button>
              </form>
            </div>
          )}
        </div>

        {/* Fixed Footer with Action Buttons */}
        <div className="flex flex-col space-y-3 flex-shrink-0 pt-4 border-t border-gray-100">
            {!isOwner && (
                <button
                    onClick={onLeaveGroup}
                    className="w-full py-3 rounded-2xl bg-red-50 text-red-600 font-bold 
                            hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                >
                    <LogOut size={18} />
                    Leave Hive
                </button>
            )}

            {isOwner && (
                <button
                    onClick={onDeleteGroup}
                    className="w-full py-3 rounded-2xl bg-red-50 text-red-600 font-bold 
                            hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                >
                    <Trash2 size={18} />
                    Delete Hive
                </button>
            )}

          <button 
            onClick={onClose} 
            className="btn-secondary w-full py-4 rounded-2xl font-bold text-lg hover:shadow-md transition-all active:scale-[0.98]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HiveManagementModal;