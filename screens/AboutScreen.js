// screens/AboutScreen.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

export default function AboutScreen() {
  const { isDarkMode } = useContext(ThemeContext);

  // Função para abrir links externos
  const openLink = (url) => {
    Linking.openURL(url).catch((err) =>
      Alert.alert('Erro', 'Não foi possível abrir o link.')
    );
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Título */}
      <Text style={[styles.title, isDarkMode && styles.darkText]}>
        Sobre o 
        <Text style={[styles.titlePart1, isDarkMode && styles.darkTitlePart]}> Prosper</Text>
        <Text style={[styles.titlePart2, isDarkMode && styles.darkTitlePart]}>A</Text>
        <Text style={[styles.titlePart3, isDarkMode && styles.darkTitlePart]}>í</Text>
      </Text>

      {/* Descrição */}
      <Text style={[styles.text, isDarkMode && styles.darkText]}>
        Bem-vindo ao{' '}
        <Text style={styles.highlight}>ProsperAÍ</Text>, o aplicativo que
        ajuda você a organizar suas finanças e obter a situação da economia do país em uma
        forma prática e eficiente!
      </Text>

      <Text style={[styles.text, isDarkMode && styles.darkText]}>
        Com este app, você pode:
      </Text>

      <Text style={[styles.listItem, isDarkMode && styles.darkText]}>
        • Simular sua aposentadoria de acordo com regras específicas.
      </Text>
      <Text style={[styles.listItem, isDarkMode && styles.darkText]}>
        • Gerenciar seu perfil pessoal (foto, idade, trabalho atual).
      </Text>
      <Text style={[styles.listItem, isDarkMode && styles.darkText]}>
        • Calcular imposto de renda com base no seu salário bruto.
      </Text>
      <Text style={[styles.listItem, isDarkMode && styles.darkText]}>
        • Acompanhar simulações financeiras e reajustes do INSS.
      </Text>
      <Text style={[styles.listItem, isDarkMode && styles.darkText]}>
        • Acompanhar a taxa de câmbio atual e converter os valores da moeda.
      </Text>
      <Text style={[styles.listItem, isDarkMode && styles.darkText]}>
        • Consultar relatórios oficiais de inflação do Banco Central.
      </Text>
      <Text style={[styles.listItem, isDarkMode && styles.darkText]}>
        • Acompanhar a inflação e o impacto sobre os produtos de acordo com IPCA.
      </Text>
      <Text style={[styles.listItem, isDarkMode && styles.darkText]}>
        • Personalizar sua experiência com temas claro e escuro.
      </Text>

      {/* Versão */}
      <Text style={[styles.text, isDarkMode && styles.darkText]}>
        Versão: 1.0.0
      </Text>

      {/* Créditos */}
      <Text style={[styles.text, isDarkMode && styles.darkText]}>
        Desenvolvido utilizando{' '}
        <Text
          style={styles.link}
          onPress={() => openLink('https://reactnative.dev')}
        >
          React Native
        </Text>{' '}
        e{' '}
        <Text
          style={styles.link}
          onPress={() => openLink('https://expo.dev')}
        >
          Expo
        </Text>
        .
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
   titlePart1: {
    paddingLeft: 5, 
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00579d', // Azul
  },
  titlePart2: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#28a745', // Verde
  },
  titlePart3: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffc107', // Amarelo
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
  },
  listItem: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 5,
    color: '#000',
  },
  highlight: {
    fontWeight: 'bold',
    color: '#6200ee',
  },
  link: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});