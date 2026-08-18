import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'));
  const [role, setRole] = useState(() => localStorage.getItem('role'));

  const login = useCallback((id, userRole) => {
    localStorage.setItem('userId', id);
    localStorage.setItem('role', userRole);
    setUserId(id);
    setRole(userRole);
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    setUserId(null);
    setRole(null);
  }, []);

  const value = { userId, role, isLoggedIn: Boolean(userId), login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
