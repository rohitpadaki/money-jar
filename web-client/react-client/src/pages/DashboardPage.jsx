import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowUpRight, ArrowDownRight} from 'lucide-react';
import HoneyJarIcon from '../components/HoneyJarIcon';
import HexagonIcon from '../components/HexagonIcon';
import UserAvatar from '../components/UserAvatar';
import { useAuth } from '../context/AuthContext';
import { getBalance, getAllTransactions } from '../services/transactionService';
import { getMyGroups } from '../services/groupService';

const DashboardPage = () => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const { user } = useAuth();
  const [totalBalance, setTotalBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [hives, setHives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        // Fetch all data in parallel
        const [balanceData, transactionsData, hivesData] = await Promise.all([
          getBalance(),
          getAllTransactions(),
          getMyGroups(),
        ]);
        setTotalBalance(balanceData.balance);
        setRecentTransactions(transactionsData);
        setHives(hivesData);
        setError(null);
      } catch (err) {
        setError("Couldn't load your data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user ? user.username : "User"}! 🍯
        </h1>
        <p className="text-gray-600">Manage your expenses and keep track of your hives</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Personal Jar Section (No changes here) */}
        <div className="col-span-1">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className='flex items-center space-x-3'>
                <HoneyJarIcon size={32} />
                <h2 className="text-xl font-semibold text-gray-900">Personal Jar</h2>
              </div>
                <Link to="/view-transactions">
                  <span className='btn-primary'>
                      View All Transactions
                  </span>
                </Link>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-1">Your Balance</p>
              {loading ? (
                <p className="text-lg">Loading...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : 
              (
                <>
                  <p className={`text-3xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${Math.abs(totalBalance).toFixed(2)}
                  </p>
                </>
              )
              }
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Recent Transactions</h3>
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                 <p className="text-red-500">{error}</p>
              ) : recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {recentTransactions.slice(0, 3).map((transaction) => {
                    const isIncome = transaction.type === 'income';
                    return (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-honey-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${isIncome ? 'bg-green-100' : 'bg-red-100'}`}>
                            {isIncome ? (
                              <ArrowUpRight className="w-4 h-4 text-green-600" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{transaction.note || 'Transaction'}</p>
                            <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <p className={`font-medium ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                          {isIncome ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No transactions yet</p>
              )}
            </div>

            <Link
              to="/add-transaction"
              className="w-full btn-primary text-center block py-3 rounded-xl font-medium"
            >
              Add Transaction
            </Link>
          </div>
        </div>

        {/* My Hives Section (Updated) */}
        <div className="col-span-1">
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

            {loading ? (
              <p>Loading hives...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : hives.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hives.map((hive) => (
                  <Link
                    key={hive.id}
                    to={`/hive/${hive.id}`}
                    className="block p-4 border border-honey-200 rounded-xl hover:border-honey-400 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{hive.name}</h3>

                      <HexagonIcon size={24} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{hive.memberCount} members</span>
                      <span className="text-xs text-gray-500">
                        by {hive.createdBy.username}
                      </span>
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