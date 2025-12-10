import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ArrowDownRight, ListFilter as Filter, Search } from 'lucide-react';
import { getAllTransactions, getTransactionSummary, deleteTransaction } from '../services/transactionService';
import { useAuth } from '../context/AuthContext';


const PersonalJarPage = () => {
  const { user } = useAuth();
  const [allTransactions, setAllTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalBalance: 0, totalIncome: 0, totalExpenses: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transactionsData, summaryData] = await Promise.all([
        getAllTransactions(),
        getTransactionSummary(),
      ]);
      setAllTransactions(transactionsData);
      setSummary(summaryData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch transaction data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    if (user) {
      fetchData();
    }
  }, [user]);


  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(transaction => {
    const matchesSearch = (transaction.note || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type.toLowerCase() === filterType;
    const categoryName = transaction.category ? transaction.category.name : 'Uncategorized';
    const matchesCategory = filterCategory === 'all' || categoryName === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  })
}, [allTransactions, searchTerm, filterType, filterCategory]);


  const categories = useMemo(() => {
    const allCats = new Set(allTransactions.map(t => t.category ? t.category.name : 'Uncategorized'));
    return ['all', ...Array.from(allCats)];
  }, [allTransactions]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const handleDeleteTransaction = async (transactionId) => {
    if (!window.confirm("Delete this Transaction? This cannot be undone.")) return;
  
    try {
      await deleteTransaction(transactionId);
      await fetchData(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Failed to delete Transaction.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Link
          to="/dashboard"
          className="p-2 hover:bg-honey-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Transactions</h1>
          <p className="text-gray-600">Your complete transaction history</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="card text-center col-span-2">
          <p className="text-sm text-gray-600 mb-1">Total Balance</p>
          <p className={`text-2xl font-bold ${summary.totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${Math.abs(summary.totalBalance).toFixed(2)}
          </p>
          {/* <p className="text-xs text-gray-500">
            {summary.totalBalance >= 0 ? "You're owed" : 'You owe'}
          </p> */}
        </div>
        
        <div className="card text-center">
          <p className="text-sm text-gray-600 mb-1">Total Received</p>
          <p className="text-2xl font-bold text-green-600">${summary.totalIncome.toFixed(2)}</p>
          <p className="text-xs text-gray-500">Payments received</p>
        </div>
        
        <div className="card text-center">
          <p className="text-sm text-gray-600 mb-1">Total Spent</p>
          <p className="text-2xl font-bold text-red-600">${summary.totalExpenses.toFixed(2)}</p>
          <p className="text-xs text-gray-500">Your expenses</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-honey-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10!"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="expense">Expenses</option>
              <option value="income">Income</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input-field"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Transactions ({filteredTransactions.length})
          </h2>
          <Filter className="w-5 h-5 text-gray-400" />
        </div>

        {filteredTransactions.length > 0 ? (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => {
              const isIncome = transaction.type === 'income';
              const categoryName = transaction.category ? transaction.category.name : 'Uncategorized';
              return (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-honey-50 rounded-lg hover:bg-honey-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${
                      isIncome ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {isIncome ? (
                        <ArrowUpRight className="w-5 h-5 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium text-gray-900">{transaction.note || 'Transaction'}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          !isIncome 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {transaction.type.toLowerCase()}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{categoryName}</span>
                      </div>
                    </div>
                  </div>


                  <div className="text-right flex">
                    <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg cursor-pointer"
                      >
                        Delete
                    </button>
                    <div>
                      <p className={`text-lg font-bold ${
                        isIncome ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {isIncome ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {isIncome ? 'received' : 'paid'}
                      </p>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">No transactions found</p>
            <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalJarPage;