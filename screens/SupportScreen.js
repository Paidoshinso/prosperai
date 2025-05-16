// screens/SupportScreen.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

export default function SupportScreen() {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>Suporte</Text>
      <Text style={[styles.text, isDarkMode && styles.darkText]}>
        Entre em contato conosco para obter suporte:
      </Text>
      <Text style={[styles.text, isDarkMode && styles.darkText]}>
        Email: suporteprosperai@gov.com.br
      </Text>
      <Text style={[styles.text, isDarkMode && styles.darkText]}>
        Telefone: +55 0800 123 4567
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#1C1C1C',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
  },
});