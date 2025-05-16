// screens/CambioScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { ThemeContext } from '../context/ThemeContext'; // Importa o contexto de tema

export default function CambioScreen() {
  const { isDarkMode } = React.useContext(ThemeContext);

  const [exchangeRate, setExchangeRate] = useState(null);
  const [realValue, setRealValue] = useState('');
  const [dollarValue, setDollarValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [historicalData, setHistoricalData] = useState([]); // Dados históricos para o gráfico

  // Função para calcular datas dinâmicas
  const getDynamicDates = () => {
    const today = new Date();
    const tenDaysAgo = new Date(today);
    tenDaysAgo.setDate(today.getDate() - 10);

    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    return {
      dataInicial: formatDate(tenDaysAgo),
      dataFinal: formatDate(today),
    };
  };

  // Função para buscar a taxa de câmbio atual e os dados históricos
  const fetchExchangeData = async () => {
    try {
      const { dataInicial, dataFinal } = getDynamicDates();

      // Busca os dados históricos
      const response = await fetch(
        `https://api.bcb.gov.br/dados/serie/bcdata.sgs.10813/dados?formato=json&dataInicial=${dataInicial}&dataFinal=${dataFinal}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const latestRate = parseFloat(data[data.length - 1].valor);
        setExchangeRate(latestRate);

        // Formata os dados para o gráfico
        const formattedData = data.map((item) => ({
          date: item.data,
          value: parseFloat(item.valor),
        }));
        setHistoricalData(formattedData);
      } else {
        throw new Error('Nenhum dado disponível para o período.');
      }
    } catch (error) {
      console.error('Erro ao buscar taxa de câmbio:', error);
      Alert.alert('Erro', 'Não foi possível obter a taxa de câmbio.');
    } finally {
      setLoading(false);
    }
  };

  // Função para converter real em dólar
  const convertRealToDollar = (value) => {
    if (!exchangeRate) return;
    const realAmount = parseFloat(value);
    if (isNaN(realAmount)) {
      setDollarValue('');
      return;
    }
    const dollarAmount = (realAmount / exchangeRate).toFixed(2);
    setDollarValue(dollarAmount);
  };

  // Função para converter dólar em real
  const convertDollarToReal = (value) => {
    if (!exchangeRate) return;
    const dollarAmount = parseFloat(value);
    if (isNaN(dollarAmount)) {
      setRealValue('');
      return;
    }
    const realAmount = (dollarAmount * exchangeRate).toFixed(2);
    setRealValue(realAmount);
  };

  useEffect(() => {
    fetchExchangeData(); // Busca a taxa de câmbio e dados históricos ao carregar a tela
  }, []);

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkTitle]}>Conversor de Moedas</Text>

      {/* Carregando */}
      {loading ? (
        <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#00579d'} />
      ) : (
        <>
          {/* Taxa de Câmbio Atual */}
          <Text style={[styles.exchangeRate, isDarkMode && styles.darkExchangeRate]}>
            Taxa de Câmbio Atual: {exchangeRate} BRL/USD
          </Text>

          {/* Conversão Bidirecional */}
          <View style={styles.conversionContainer}>
            {/* Entrada de Valor em Reais */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, isDarkMode && styles.darkLabel]}>BRL (R$)</Text>
              <TextInput
                value={realValue}
                onChangeText={(text) => {
                  setRealValue(text);
                  convertRealToDollar(text);
                }}
                placeholder="Valor em Reais"
                placeholderTextColor={isDarkMode ? '#aaa' : '#888'} // Cor do placeholder
                keyboardType="numeric"
                style={[styles.input, isDarkMode && styles.darkInput]}
              />
            </View>

            {/* Entrada de Valor em Dólares */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, isDarkMode && styles.darkLabel]}>USD ($)</Text>
              <TextInput
                value={dollarValue}
                onChangeText={(text) => {
                  setDollarValue(text);
                  convertDollarToReal(text);
                }}
                placeholder="Valor em Dólares"
                placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
                keyboardType="numeric"
                style={[styles.input, isDarkMode && styles.darkInput]}
              />
            </View>
          </View>

           {/* Gráfico de Variação do Dólar */}
          <View style={[styles.chartContainer, isDarkMode && styles.darkChartContainer]}>
            <Text style={[styles.subtitle, isDarkMode && styles.darkSubtitle]}>
              Variação do Dólar nos Últimos 10 Dias
            </Text>
            <LineChart
              data={{
                labels: historicalData.map((item) => item.date.split('/')[0]), // Exibe apenas o dia
                datasets: [
                  {
                    data: historicalData.map((item) => item.value),
                    color: (opacity = 1) =>
                      isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 255, ${opacity})`,
                  },
                ],
              }}
              width={Dimensions.get('window').width - 40} // Ajusta largura ao dispositivo
              height={250}
              chartConfig={{
                backgroundColor: isDarkMode ? '#121212' : '#fff',
                backgroundGradientFrom: isDarkMode ? '#121212' : '#fff',
                backgroundGradientTo: isDarkMode ? '#121212' : '#fff',
                decimalPlaces: 2,
                color: (opacity = 1) =>
                  isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) =>
                  isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
                propsForLabels: {
                  fontSize: 12,
                },
              }}
              bezier
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
          </View>

        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  darkContainer: {
    backgroundColor: '#1C1C1C',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  darkTitle: {
    color: '#fff',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#555',
  },
  darkSubtitle: {
    color: '#fff',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 30,
    elevation: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },
  darkChartContainer: {
    backgroundColor: '#1e1e1e',
  },
  exchangeRate: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  darkExchangeRate: {
    color: '#ccc',
  },
  conversionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  darkLabel: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    color: '#333', // Cor do texto digitado
  },
  darkInput: {
    borderColor: '#333',
    backgroundColor: '#1e1e1e',
    color: '#fff', // Cor do texto digitado no modo escuro
  },
});