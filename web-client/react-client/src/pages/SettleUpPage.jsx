import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getGroupDetails } from '../services/groupService';
import { getExpensesForGroup } from '../services/expenseService';
import { getPaymentsForGroup } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';
import UserAvatar from '../components/UserAvatar';

const SettleUpPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [hive, setHive] = useState(null);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !user) return;
      try {
        setLoading(true);
        const [hiveData, expensesData, paymentsData] = await Promise.all([
          getGroupDetails(id),
          getExpensesForGroup(id),
          getPaymentsForGroup(id),
        ]);
        setHive(hiveData);

        const balancesMap = new Map();
        const currentUser = user;

        hiveData.members.forEach(member => {
          if (member.id !== currentUser.id) {
            balancesMap.set(member.id, { member, balance: 0 });
          }
        });

        expensesData.forEach(expense => {
            const payerId = expense.payer.id;
            expense.participants.forEach(p => {
                const share = parseFloat(p.share);
                if (payerId === currentUser.id && p.user.id !== currentUser.id) {
                    const current = balancesMap.get(p.user.id);
                    if(current) {
                        balancesMap.set(p.user.id, { ...current, balance: current.balance + share });
                    }
                }
                else if (payerId !== currentUser.id && p.user.id === currentUser.id) {
                    const current = balancesMap.get(payerId);
                    if(current) {
                        balancesMap.set(payerId, { ...current, balance: current.balance - share });
                    }
                }
            })
        });

        paymentsData.forEach(payment => {
          const fromId = payment.fromUser.id;
          const toId = payment.toUser.id;
          const amount = parseFloat(payment.amount);

          if (fromId === currentUser.id && balancesMap.has(toId)) {
            const current = balancesMap.get(toId);
            balancesMap.set(toId, { ...current, balance: current.balance + amount });
          } else if (toId === currentUser.id && balancesMap.has(fromId)) {
            const current = balancesMap.get(fromId);
            balancesMap.set(fromId, { ...current, balance: current.balance - amount });
          }
        });
        
        setBalances(Array.from(balancesMap.values()));
        setError(null);
      } catch (err) {
        setError("Couldn't load settlement details. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  if (loading) {
    return <div className="text-center p-8">Calculating Balances...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }
  
  const owedToUser = balances.filter(b => b.balance > 0);
  const userOwes = balances.filter(b => b.balance < 0);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => navigate(`/hive/${id}`)}
          className="p-2 hover:bg-honey-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600 cursor-pointer" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settle Up</h1>
          <p className="text-gray-600">Balances for {hive?.name}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-red-600">You Owe</h2>
          <div className="space-y-4">
            {userOwes.length > 0 ? userOwes.map(({ member, balance }) => (
              <div key={member.id} className="card flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <UserAvatar user={{ name: member.username }} size="md" />
                    <p className="font-semibold">{member.username}</p>
                </div>
                <p className="font-bold text-red-600">${Math.abs(balance).toFixed(2)}</p>
              </div>
            )) : <p className="text-gray-500">You don't owe anyone.</p>}
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-green-600">You Are Owed</h2>
          <div className="space-y-4">
            {owedToUser.length > 0 ? owedToUser.map(({ member, balance }) => (
                <div key={member.id} className="card flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <UserAvatar user={{ name: member.username }} size="md" />
                        <p className="font-semibold">{member.username}</p>
                    </div>
                    <p className="font-bold text-green-600">${balance.toFixed(2)}</p>
                </div>
            )) : <p className="text-gray-500">No one owes you.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettleUpPage;