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

export const getMyGroups = async () => {
  const response = await api.get(`${API_URL}/groups/my`, getAuthHeaders());
  return response.data;
};

export const createGroup = async (name) => {
  const response = await api.post(`${API_URL}/groups`, { name }, getAuthHeaders());
  return response.data;
};

// New function to get all users
export const getAllUsers = async () => {
    const response = await api.get(`${API_URL}/user`, getAuthHeaders());
    return response.data;
  };
  
// New function to add a member to a group
export const addMemberToGroup = async (groupId, userId) => {

    const response = await api.post(`${API_URL}/group-members/${groupId}/add`, { userId }, getAuthHeaders());
    return response.data;
  };

export const getGroupDetails = async (groupId) => {
  const response = await api.get(`${API_URL}/groups/${groupId}`, getAuthHeaders());
  return response.data;
};

export const findUserByUsername = async (username) => {
  // console.log(username);
  const response = await api.get(`${API_URL}/user/${username}`, getAuthHeaders());
  // console.log(response.data);
  return response.data;
};

export const removeMemberFromGroup = async (groupId, userId) => {
  const response = await api.delete(`${API_URL}/group-members/${groupId}/remove/${userId}`, getAuthHeaders());
  return response.data;
};

export const leaveGroup = async (groupId) => {
  const response = await api.delete(`${API_URL}/group-members/${groupId}/leave`, getAuthHeaders());
  return response.data;
};

export const deleteGroup = async (groupId) => {
  const response = await api.delete(`${API_URL}/groups/${groupId}`, getAuthHeaders());
  return response.data;
};

export const deleteExpense = async (groupId, expenseId) => {
  const response = await api.delete(`${API_URL}/groups/${groupId}/expenses/${expenseId}`)
}