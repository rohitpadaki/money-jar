import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, Edit2, User } from 'lucide-react';
import { getGroupDetails } from '../services/groupService';
import { createPayment } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';

const AddPaymentPage = () => {
  const { hiveId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [group, setGroup] = useState(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [toUserId, setToUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const groupData = await getGroupDetails(hiveId);
        setGroup(groupData);
      } catch (err) {
        setError("Could not load group details.");
      }
    };
    fetchGroup();
  }, [hiveId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseFloat(amount) <= 0 || !toUserId) {
      setError("Please enter a valid amount and select a recipient.");
      return;
    }

    setLoading(true);
    setError('');

    const paymentData = {
      amount: parseFloat(amount),
      note,
      toUserId,
      fromUserId: currentUser.sub, // The logged-in user is making the payment
    };

    try {
      await createPayment(hiveId, paymentData);
      navigate(`/hive/${hiveId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record payment.');
      setLoading(false);
    }
  };

  if (!group) return <div className="text-center p-8">Loading...</div>;

  // Exclude the current user from the list of recipients
  const otherMembers = group.members.filter(m => m.id !== currentUser.sub);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <button onClick={() => navigate(`/hive/${hiveId}`)} className="p-2 hover:bg-honey-100 rounded-lg">
          <ArrowLeft className="w-6 h-6 text-gray-600 cursor-pointer" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Record a Payment in {group.name}</h1>
          <p className="text-gray-600">Settle up a debt with another member.</p>
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
              placeholder="What was this payment for?"
              className="w-full input-field"
            />
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-3">To (Recipient)</h2>
          <div className="flex items-center space-x-4">
             <User className="w-8 h-8 text-gray-500" />
             <select
                value={toUserId}
                onChange={(e) => setToUserId(e.target.value)}
                className="w-full input-field"
                required
              >
                <option value="">Select a member</option>
                {otherMembers
                .filter(member => member.id !== currentUser.id)
                .map(member => (
                  <option key={member.id} value={member.id}>
                    {member.username}
                  </option>
                ))}
              </select>
          </div>
        </div>
        
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        
        <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-center disabled:opacity-50">
          {loading ? 'Recording...' : 'Record Payment'}
        </button>
      </form>
    </div>
  );
};

export default AddPaymentPage;