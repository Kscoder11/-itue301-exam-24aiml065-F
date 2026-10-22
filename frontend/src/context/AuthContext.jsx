import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'eventhubAuth';
const EMPTY_AUTH = { attendee: null, token: null, role: null };

// Reads saved auth from localStorage so the user stays logged in after a refresh.
const loadAuthFromStorage = () => {
  try {
    const savedAuthText = localStorage.getItem(STORAGE_KEY);
    return savedAuthText ? JSON.parse(savedAuthText) : EMPTY_AUTH;
  } catch (parseError) {
    return EMPTY_AUTH;
  }
};

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadAuthFromStorage);

  const login = ({ attendee, token, role }) => {
    const newAuth = { attendee, token, role };
    setAuth(newAuth);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAuth));
  };

  const logout = () => {
    setAuth(EMPTY_AUTH);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
