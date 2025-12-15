import api from '../api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.error("No auth token found");
    return {};
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getExpensesForGroup = async (groupId) => {
  const response = await api.get(`${API_URL}/groups/${groupId}/expenses`, getAuthHeaders());
  return response.data;
};

export const createExpense = async (groupId, expenseData) => {
    const response = await api.post(`${API_URL}/groups/${groupId}/expenses`, expenseData, getAuthHeaders());
    return response.data;
  };

export const getExpenseDetails = async (groupId, expenseId) => {
  const response = await api.get(`${API_URL}/groups/${groupId}/expenses/${expenseId}`, getAuthHeaders());
  return response.data;
}