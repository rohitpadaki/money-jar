import api from "../api";


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    // Handle case where token is not available
    console.error("No auth token found");
    return {};
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAllTransactions = async () => {
  const response = await api.get(`${API_URL}/transactions`, getAuthHeaders());
  return response.data;
};

export const getTransactionSummary = async () => {
  const balancePromise = api.get(`${API_URL}/transactions/summary/balance`, getAuthHeaders());
  const byTypePromise = api.get(`${API_URL}/transactions/summary/by-type`, getAuthHeaders());

  const [balanceRes, byTypeRes] = await Promise.all([balancePromise, byTypePromise]);

  const summary = {
    totalBalance: balanceRes.data.balance || 0,
    totalIncome: 0,
    totalExpenses: 0,
  };

  byTypeRes.data.forEach(item => {
    if (item.type === 'income') {
      summary.totalIncome = parseFloat(item.total) || 0;
    } else if (item.type === 'expense') {
      summary.totalExpenses = parseFloat(item.total) || 0;
    }
  });

  return summary;
};

export const addExpense = async (expenseData) => {
  const response = await api.post(`${API_URL}/transactions`, expenseData, getAuthHeaders());
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get(`${API_URL}/categories`, getAuthHeaders());
  return response.data;
};

export const getBalance = async () => {
  const response = await api.get(`${API_URL}/transactions/summary/balance`, getAuthHeaders());
  return response.data;
};


export const createCategory = async (categoryData) => {
  const response = await api.post(`${API_URL}/categories`, categoryData, getAuthHeaders());
  return response.data;
};