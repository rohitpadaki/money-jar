import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

function decodeToken(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    return payload;
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken') || null);
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const payload = decodeToken(token);
      return payload ? { username: payload.username, id: payload.sub } : null;
    }
    return null;
  });

  // Sync user whenever token changes
  useEffect(() => {
    if (authToken) {
      const payload = decodeToken(authToken);
      setUser(payload ? { username: payload.username, id: payload.sub } : null);
      localStorage.setItem('authToken', authToken);
    } else {
      setUser(null);
      localStorage.removeItem('authToken');
    }
  }, [authToken]);

  const login = (token) => setAuthToken(token);
  const logout = () => setAuthToken(null);

  return (
    <AuthContext.Provider value={{ authToken, user, isAuthenticated: !!authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}