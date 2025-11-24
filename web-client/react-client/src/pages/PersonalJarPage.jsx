import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ArrowDownRight, ListFilter as Filter, Search } from 'lucide-react';
import UserAvatar from '../components/UserAvatar';
import { recentTransactions, mockUsers, mockHives } from '../data/mockData';

// Extended transaction data for demonstration
const allTransactions = [
  ...recentTransactions,
  {
    id: 4,
    type: 'expense',
    description: 'Internet Bill - House Roommates',
    amount: -25.00,
    date: '2024-01-18',
    hiveId: 1,
    category: 'Utilities'
  },
  {
    id: 5,
    type: 'payment',
    description: 'Payment received from Mike',
    amount: 52.00,
    date: '2024-01-15',
    hiveId: 1,
    category: 'Settlement'
  },
  {
    id: 6,
    type: 'expense',
    description: 'Gas for Road Trip - Weekend Trip',
    amount: -28.50,
    date: '2024-01-11',
    hiveId: 2,
    category: 'Transportation'
  },
  {
    id: 7,
    type: 'payment',
    description: 'Payment sent to Emily',
    amount: -45.00,
    date: '2024-01-10',
    hiveId: 2,
    category: 'Settlement'
  },
  {
    id: 8,
    type: 'expense',
    description: 'Dinner at Italian Restaurant',
    amount: -35.75,
    date: '2024-01-08',
    hiveId: 1,
    category: 'Food'
  },
  {
    id: 9,
    type: 'payment',
    description: 'Payment received from Chris',
    amount: 67.25,
    date: '2024-01-05',
    hiveId: 2,
    category: 'Settlement'
  },
  {
    id: 10,
    type: 'expense',
    description: 'Grocery Shopping - House Roommates',
    amount: -42.30,
    date: '2024-01-03',
    hiveId: 1,
    category: 'Food'
  }
];

const PersonalJarPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const getHiveById = (id) => mockHives.find(hive => hive.id === id);

  const filteredTransactions = allTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const totalBalance = allTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalIncome = allTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = Math.abs(allTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));

  const categories = ['all', 'Food', 'Transportation', 'Utilities', 'Settlement', 'Accommodation', 'Entertainment'];

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card text-center">
          <p className="text-sm text-gray-600 mb-1">Total Balance</p>
          <p className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${Math.abs(totalBalance).toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">
            {totalBalance >= 0 ? 'You\'re owed' : 'You owe'}
          </p>
        </div>
        
        <div className="card text-center">
          <p className="text-sm text-gray-600 mb-1">Total Received</p>
          <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
          <p className="text-xs text-gray-500">Payments received</p>
        </div>
        
        <div className="card text-center">
          <p className="text-sm text-gray-600 mb-1">Total Spent</p>
          <p className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
          <p className="text-xs text-gray-500">Your share of expenses</p>
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
                className="input-field pl-10"
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
              <option value="payment">Payments</option>
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
              const hive = getHiveById(transaction.hiveId);
              return (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-honey-50 rounded-lg hover:bg-honey-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${
                      transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.amount > 0 ? (
                        <ArrowUpRight className="w-5 h-5 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'expense' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {transaction.type}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{transaction.date}</span>
                        <span>•</span>
                        <span>{transaction.category}</span>
                        {hive && (
                          <>
                            <span>•</span>
                            <Link 
                              to={`/hive/${hive.id}`}
                              className="text-honey-600 hover:text-honey-700 font-medium"
                            >
                              {hive.name}
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {transaction.amount > 0 ? 'received' : 'paid'}
                    </p>
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