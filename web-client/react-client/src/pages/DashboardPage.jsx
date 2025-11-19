import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import HoneyJarIcon from '../components/HoneyJarIcon';
import HexagonIcon from '../components/HexagonIcon';
import UserAvatar from '../components/UserAvatar';
import { mockHives, mockUsers, recentTransactions, currentUser } from '../data/mockData';

const DashboardPage = () => {
  // Calculate total balance for current user
  const totalBalance = recentTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  const getUserById = (id) => mockUsers.find(user => user.id === id);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {currentUser.name.split(' ')[0]}! 🍯
        </h1>
        <p className="text-gray-600">Manage your shared expenses and keep track of your hives</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personal Jar Section */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <HoneyJarIcon size={32} />
              <h2 className="text-xl font-semibold text-gray-900">Personal Jar</h2>
            </div>

            {/* Balance */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-1">This Month</p>
              <p className={`text-3xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(totalBalance).toFixed(2)}
              </p>
              {totalBalance < 0 && <p className="text-sm text-red-600">You owe</p>}
              {totalBalance > 0 && <p className="text-sm text-green-600">You're owed</p>}
              {totalBalance === 0 && <p className="text-sm text-gray-600">All settled up!</p>}
            </div>

            {/* Recent Transactions */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Recent Transactions</h3>
              {recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {recentTransactions.slice(0, 3).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-honey-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.amount > 0 ? (
                            <ArrowUpRight className="w-4 h-4 text-green-600" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-xs text-gray-500">{transaction.date}</p>
                        </div>
                      </div>
                      <p className={`font-medium ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No transactions yet</p>
              )}
            </div>

            {/* Add Expense Button */}
            <Link
              to="/add-expense"
              className="w-full btn-primary text-center block py-3 rounded-xl font-medium"
            >
              Add Expense
            </Link>
          </div>
        </div>

        {/* My Hives Section */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">My Hives</h2>
              <Link
                to="/create-hive"
                className="btn-primary flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>New Hive</span>
              </Link>
            </div>

            {mockHives.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockHives.map((hive) => (
                  <Link
                    key={hive.id}
                    to={`/hive/${hive.id}`}
                    className="block p-4 border border-honey-200 rounded-xl hover:border-honey-400 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{hive.name}</h3>
                      <HexagonIcon size={24} />
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex -space-x-2">
                        {hive.members.slice(0, 3).map((memberId) => {
                          const member = getUserById(memberId);
                          return member ? (
                            <UserAvatar key={member.id} user={member} size="sm" className="border-2 border-white" />
                          ) : null;
                        })}
                        {hive.members.length > 3 && (
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white">
                            +{hive.members.length - 3}
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-gray-600">{hive.members.length} members</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{hive.expenses.length} expenses</span>
                      <span className="font-semibold text-honey-600">${hive.totalBalance.toFixed(2)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <HexagonIcon size={80} className="mx-auto mb-4" color="#D1D5DB" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hives yet</h3>
                <p className="text-gray-600 mb-6">Create a hive to start splitting bills with friends</p>
                <Link
                  to="/create-hive"
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Create Your First Hive</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;