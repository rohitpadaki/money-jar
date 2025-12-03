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

export const getPaymentsForGroup = async (groupId) => {
  const response = await api.get(`${API_URL}/groups/${groupId}/payments`, getAuthHeaders());
  return response.data;
};

export const createPayment = async (groupId, paymentData) => {
    const response = await api.post(`${API_URL}/groups/${groupId}/payments`, paymentData, getAuthHeaders());
    return response.data;
  };