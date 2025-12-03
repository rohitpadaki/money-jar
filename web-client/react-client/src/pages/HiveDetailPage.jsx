import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Users, Receipt, CreditCard, ArrowRight } from 'lucide-react';
import UserAvatar from '../components/UserAvatar';
import { getGroupDetails } from '../services/groupService';
import { getExpensesForGroup } from '../services/expenseService';
import { getPaymentsForGroup } from '../services/paymentService';

const HiveDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hive, setHive] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('expenses');

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        // Fetch all data in parallel for efficiency
        const [hiveData, expensesData, paymentsData] = await Promise.all([
          getGroupDetails(id),
          getExpensesForGroup(id),
          getPaymentsForGroup(id),
        ]);
        setHive(hiveData);
        setExpenses(expensesData);
        setPayments(paymentsData);
        setError(null);
      } catch (err) {
        setError("Couldn't load hive details. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="text-center p-8">Loading Hive...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }

  if (!hive) {
    return <div className="text-center p-8">Hive not found.</div>;
  }
  
  const totalExpense = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 hover:bg-honey-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{hive.name}</h1>
          <p className="text-gray-600">Created by {hive.createdBy.username}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <div className="card text-center">
          <Users className="w-8 h-8 mx-auto text-honey-500 mb-2" />
          <p className="text-2xl font-bold">{hive.members.length}</p>
          <p className="text-gray-600">Members</p>
        </div>
        <div className="card text-center">
          <Receipt className="w-8 h-8 mx-auto text-honey-500 mb-2" />
          <p className="text-2xl font-bold">${totalExpense.toFixed(2)}</p>
          <p className="text-gray-600">Total Spent</p>
        </div>
        <div className="col-span-2 card text-center">
          <CreditCard className="w-8 h-8 mx-auto text-honey-500 mb-2" />
          <p className="text-2xl font-bold text-green-600">$0.00</p>
          <p className="text-gray-600">You are owed</p>
        </div>
      </div>

      {/* Action Buttons & Members */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex space-x-4">
          <button
           onClick={()=> navigate(`/hive/${id}/add-expense`)}
           className="btn-primary flex items-center space-x-2">
            <Plus size={20} />
            <span>Add Expense</span>
          </button>
          <button
          onClick={() => navigate(`/hive/${id}/add-payment`)}
          className="btn-secondary">Pay Someone</button>
        </div>
        <div className="flex -space-x-2">
          {hive.members.map((member) => (
            <UserAvatar key={member.id} user={{ name: member.username }} size="md" className="border-2 border-white" />
          ))}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex !space-x-6">
          <button onClick={() => setActiveTab('expenses')} className={`py-3 px-1 font-medium ${activeTab === 'expenses' ? 'border-b-2 border-honey-500 text-honey-600' : 'text-gray-600 hover:text-gray-800'}`}>
            Expenses ({expenses.length})
          </button>
          <button onClick={() => setActiveTab('payments')} className={`py-3 px-1 font-medium ${activeTab === 'payments' ? 'border-b-2 border-honey-500 text-honey-600' : 'text-gray-600 hover:text-gray-800'}`}>
            Payments ({payments.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'expenses' && (
          <div className="space-y-4">
            {expenses.length > 0 ? expenses.map(exp => (
              <div key={exp.id} className="card flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-900">{exp.note || 'Expense'}</p>
                  <p className="text-sm text-gray-600">Paid by {exp.payer.name}</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-red-600">${parseFloat(exp.amount).toFixed(2)}</p>
                  <p className="text-sm text-gray-500 text-right">{new Date(exp.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            )) : <p className="text-center text-gray-500 py-8">No expenses recorded yet.</p>}
          </div>
        )}
        {activeTab === 'payments' && (
           <div className="space-y-4">
            {payments.length > 0 ? payments.map(pay => (
              <div key={pay.id} className="card flex items-center">
                <UserAvatar user={{name: pay.fromUser.username}} size="md" />
                <div className="flex-1 mx-4">
                  <p className="font-semibold text-gray-900">{pay.fromUser.username} paid {pay.toUser.username}</p>
                  <p className="text-sm text-gray-600">{pay.note || 'Payment'}</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-600">${parseFloat(pay.amount).toFixed(2)}</p>
                  <p className="text-sm text-gray-500 text-right">{new Date(pay.date).toLocaleDateString()}</p>
                </div>
              </div>
            )) : <p className="text-center text-gray-500 py-8">No payments recorded yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default HiveDetailPage;