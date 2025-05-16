// context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { isAuthenticated } from '../services/appwrite';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const authStatus = await isAuthenticated();
      setIsAuth(authStatus);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth(); // Verifica a autenticação ao iniciar o app
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};