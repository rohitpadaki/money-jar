import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, DollarSign, Users } from 'lucide-react';
import UserAvatar from '../components/UserAvatar';
import HexagonIcon from '../components/HexagonIcon';
import { mockHives, mockUsers } from '../data/mockData';

const HiveDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const hive = mockHives.find(h => h.id === parseInt(id));

  if (!hive) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Hive not found</h1>
        <Link to="/dashboard" className="btn-primary">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const getUserById = (userId) => mockUsers.find(user => user.id === userId);
  const members = hive.members.map(getUserById).filter(Boolean);

  // Calculate balances (simplified)
  const balances = members.map(member => {
    const paid = hive.expenses.filter(exp => exp.paidBy === member.id).reduce((sum, exp) => sum + exp.amount, 0);
    const owes = hive.expenses
      .filter(exp => exp.splitBetween.includes(member.id))
      .reduce((sum, exp) => sum + (exp.amount / exp.splitBetween.length), 0);
    return {
      user: member,
      balance: paid - owes
    };
  });

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 hover:bg-honey-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <HexagonIcon size={32} />
            <h1 className="text-2xl font-bold text-gray-900">{hive.name}</h1>
          </div>
          <p className="text-gray-600">Created on {hive.createdAt}</p>
        </div>
        <div className="flex space-x-3">
          <Link to={`/hive/${hive.id}/add-expense`} className="btn-primary flex items-center space-x-2">
            <Plus size={20} />
            <span>Add Expense</span>
          </Link>
          <Link to={`/hive/${hive.id}/log-payment`} className="btn-secondary flex items-center space-x-2">
            <DollarSign size={20} />
            <span>Log Payment</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Members & Balances */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-6">
            <Users className="w-5 h-5 text-honey-500" />
            <h2 className="text-lg font-semibold text-gray-900">Members & Balances</h2>
          </div>

          <div className="space-y-4">
            {balances.map(({ user, balance }) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-honey-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <UserAvatar user={user} size="md" />
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  {balance > 0 && (
                    <>
                      <p className="text-green-600 font-semibold">+${balance.toFixed(2)}</p>
                      <p className="text-xs text-green-600">gets back</p>
                    </>
                  )}
                  {balance < 0 && (
                    <>
                      <p className="text-red-600 font-semibold">${Math.abs(balance).toFixed(2)}</p>
                      <p className="text-xs text-red-600">owes</p>
                    </>
                  )}
                  {balance === 0 && (
                    <>
                      <p className="text-gray-600 font-semibold">$0.00</p>
                      <p className="text-xs text-gray-600">settled</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expenses */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Expenses</h2>
            <span className="text-sm text-gray-600">${hive.totalBalance.toFixed(2)} total</span>
          </div>

          {hive.expenses.length > 0 ? (
            <div className="space-y-4">
              {hive.expenses.map((expense) => {
                const payer = getUserById(expense.paidBy);
                const splitCount = expense.splitBetween.length;
                return (
                  <div key={expense.id} className="border border-honey-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{expense.title}</h3>
                      <span className="font-bold text-honey-600">${expense.amount.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <UserAvatar user={payer} size="sm" />
                        <span>Paid by {payer?.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>Split {splitCount} ways</span>
                        <span>• ${(expense.amount / splitCount).toFixed(2)} each</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>{expense.category}</span>
                      <span>{expense.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">No expenses yet</p>
              <Link
                to={`/hive/${hive.id}/add-expense`}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Add First Expense</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HiveDetailPage;