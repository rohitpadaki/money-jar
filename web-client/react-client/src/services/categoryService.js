import api from '../api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Auth headers
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

export const getAllCategories = async () => {
  const response = await api.get(`${API_URL}/categories`, getAuthHeaders());
  return response.data;
};

export const deleteCategory = async (categoryId) => {
  const response = await api.delete(`${API_URL}/categories/${categoryId}`, getAuthHeaders());
  return response.data;
};

