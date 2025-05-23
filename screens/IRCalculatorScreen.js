// screens/IncomeTaxCalculatorScreen.js
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

export default function IRCalculatorScreen() {
  const { isDarkMode } = useContext(ThemeContext); // Obter o estado do tema
  const [income, setIncome] = useState('');
  const [tax, setTax] = useState(0);
  const [taxRate, setTaxRate] = useState(0); // Estado para armazenar a taxa de imposto

  const calculateTax = () => {
    const incomeValue = parseFloat(income);
    if (isNaN(incomeValue)) {
      Alert.alert('Erro', 'Por favor, insira um valor válido.');
      return;
    }

    // Valor mínimo para ser tributado (de acordo com o Diário Oficial)
    const minimumTaxableIncome = 2259.20;

    if (incomeValue < minimumTaxableIncome) {
      Alert.alert(
        'Isento de Imposto',
        `O valor mínimo para ser tributado é R$ 2.259,20}.`
      );
      setTax('0.00'); // Define o imposto como zero
      setTaxRate(0); // Define a taxa de imposto como zero
      return;
    }

    let taxPercentage = 0; // Variável para armazenar a porcentagem

    // Faixas de imposto de renda (De acordo com a norma publicada no Diário Oficial da União)
    if (incomeValue <= 2259.21) {
      taxPercentage = 7.5; // 7.5%
    } else if (incomeValue <= 2826.66) {
      taxPercentage = 15; // 15%
    } else if (incomeValue <= 3751.07) {
      taxPercentage = 22.5; // 22.5%
    } else {
      taxPercentage = 27.5; // 27.5%
    }

    const calculatedTax = incomeValue * (taxPercentage / 100);
    setTax(calculatedTax.toFixed(2)); // Define o valor do imposto
    setTaxRate(taxPercentage); // Define a porcentagem do imposto
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>Calculadora de Imposto de Renda</Text>

      {/* Entrada de Salário */}
      <Text style={[styles.label, isDarkMode && styles.darkText]}>Salário Bruto (R$):</Text>
      <TextInput
        value={income}
        onChangeText={setIncome}
        keyboardType="numeric"
        style={[styles.input, isDarkMode && styles.darkInput]}
      />

      {/* Botão Calcular */}
      <Button title="Calcular" onPress={calculateTax} />

      {/* Resultado */}
      <Text style={[styles.result, isDarkMode && styles.darkText]}>
        Valor do Imposto: R$ {tax || '0.00'}
      </Text>
      <Text style={[styles.result, isDarkMode && styles.darkText]}>
        Porcentagem de Imposto: {taxRate}% ({taxRate > 0 ? 'Tributado' : 'Isento'})
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff', // Fundo claro
  },
  darkContainer: {
    backgroundColor: '#1C1C1C', // Fundo escuro
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000', // Texto claro
  },
  darkText: {
    color: '#fff', // Texto escuro
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#000', // Texto claro
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9', // Fundo claro
  },
  darkInput: {
    backgroundColor: '#333', // Fundo escuro
    borderColor: '#555',
    color: '#fff', // Texto escuro
  },
  result: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
    color: '#000', // Texto claro
  },
});
