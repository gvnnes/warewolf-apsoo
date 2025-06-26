
import { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [authData, setAuthData] = useState(() => AuthService.getUser());


  const login = (data) => {
    setAuthData(data);
  };
  
  const logout = () => {
    AuthService.logout();
    setAuthData(null);
  };

 
  const value = {
    usuario: authData?.user,
    token: authData?.token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);