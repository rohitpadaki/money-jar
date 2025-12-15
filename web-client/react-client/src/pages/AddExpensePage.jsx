import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, Edit2 } from 'lucide-react';
import { getGroupDetails } from '../services/groupService';
import { createExpense } from '../services/expenseService';
import UserAvatar from '../components/UserAvatar';

const AddExpensePage = () => {
  const { hiveId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [splitType, setSplitType] = useState('ALL');
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const groupData = await getGroupDetails(hiveId);
        setGroup(groupData);
        setParticipants(groupData.members.map(m => m.id)); // Default to all members
      } catch (err) {
        setError("Could not load group details.");
      }
    };
    fetchGroup();
  }, [hiveId]);

  const handleParticipantToggle = (userId) => {
    setParticipants(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSplitTypeChange = (type) => {
    setSplitType(type);
    if (type === 'ALL' && group) {
      setParticipants(group.members.map(m => m.id));
    } else {
      setParticipants([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseFloat(amount) <= 0 || !note.trim()) {
      setError("Please enter a valid amount and note.");
      return;
    }
    if (splitType === 'SELECTED' && participants.length === 0) {
      setError("Please select at least one participant.");
      return;
    }

    setLoading(true);
    setError('');

    const expenseData = {
      amount: parseFloat(amount),
      note,
      splitType,
      // Only include participants if the split type is 'SELECTED'
      participants: splitType === 'SELECTED' ? participants : undefined,
    };

    try {
      await createExpense(hiveId, expenseData);
      navigate(`/hive/${hiveId}`); // Navigate back to the hive details on success
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense.');
      setLoading(false);
    }
  };

  if (!group) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <button onClick={() => navigate(`/hive/${hiveId}`)} className="p-2 hover:bg-honey-100 rounded-lg">
          <ArrowLeft className="w-6 h-6 text-gray-600 cursor-pointer" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Expense to {group.name}</h1>
          <p className="text-gray-600">Enter the details of the shared cost.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <div className="flex items-center space-x-4 mb-6">
            <DollarSign className="w-8 h-8 text-honey-500" />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="text-3xl font-bold w-full border-none focus:ring-0 p-0"
              required
            />
          </div>
          <div className="flex items-center space-x-4">
            <Edit2 className="w-8 h-8 text-gray-500" />
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What was this for?"
              className="w-full input-field"
              required
            />
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-3">Split between</h2>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            <button type="button" onClick={() => handleSplitTypeChange('ALL')} className={`flex-1 p-3 text-center font-medium ${splitType === 'ALL' ? 'bg-honey-500 text-white' : 'bg-white'}`}>
              All Members
            </button>
            <button type="button" onClick={() => handleSplitTypeChange('SELECTED')} className={`flex-1 p-3 text-center font-medium ${splitType === 'SELECTED' ? 'bg-honey-500 text-white' : 'bg-white'}`}>
              Select Members
            </button>
          </div>

          {splitType === 'SELECTED' && (
            <div className="mt-4 space-y-2">
              {group.members.map(member => (
                <div key={member.id} onClick={() => handleParticipantToggle(member.id)} className={`flex items-center p-2 rounded-lg cursor-pointer ${participants.includes(member.id) ? 'bg-honey-100' : ''}`}>
                  <UserAvatar user={{ name: member.username }} size="md" />
                  <span className="ml-3 font-medium px-2!">{member.username}</span>
                  <div className={`ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center ${participants.includes(member.id) ? 'border-honey-500 bg-honey-500' : 'border-gray-300'}`}>
                    {participants.includes(member.id) && <div className="w-3 h-3 bg-white rounded-full" />}
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="text-sm text-gray-500 mt-3 text-center">Split by {splitType === 'ALL' ? 'everyone' : `${participants.length} people`}.</p>
        </div>
        
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        
        <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-center disabled:opacity-50">
          {loading ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
};

export default AddExpensePage;