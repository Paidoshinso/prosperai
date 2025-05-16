// context/ThemeContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Carrega o tema salvo ao iniciar o aplicativo
  const loadTheme = async () => {
    try {
      const theme = await AsyncStorage.getItem('theme');
      if (theme !== null) {
        setIsDarkMode(JSON.parse(theme)); // Usa o tema salvo pelo usuário
      } else {
        // Se nenhum tema foi salvo, usa o modo do sistema
        const systemTheme = Appearance.getColorScheme() === 'dark';
        setIsDarkMode(systemTheme);
      }
    } catch (error) {
      console.error('Erro ao carregar o tema:', error);
    }
  };

  // Salva o tema no AsyncStorage
  const saveTheme = async (value) => {
    try {
      await AsyncStorage.setItem('theme', JSON.stringify(value));
      setIsDarkMode(value); // Atualiza o estado do tema
    } catch (error) {
      console.error('Erro ao salvar o tema:', error);
    }
  };

  // Função para alternar o tema
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    saveTheme(newMode);
  };

  // Carrega o tema ao montar o componente
  useEffect(() => {
    loadTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};