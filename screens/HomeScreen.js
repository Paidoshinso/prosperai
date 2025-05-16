// screens/HomeScreen.js
import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView, // Importa o ScrollView
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext'; // Importe o ThemeContext

export default function HomeScreen({ navigation }) {
  const { isDarkMode } = useContext(ThemeContext);

  // Função para renderizar os botões com ícone e texto
  const renderButton = (iconSource, title, onPress) => (
    <TouchableOpacity
      style={[styles.button, isDarkMode && styles.darkButton]}
      onPress={onPress}>
      {/* Ícone com tintColor dinâmico */}
      <Image
        source={iconSource}
        style={styles.icon}
        resizeMode="contain"
        tintColor={isDarkMode ? '#fff' : null} // Cor branca no modo escuro
      />
      <Text style={[styles.buttonText, isDarkMode && styles.darkButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.container, isDarkMode && styles.darkContainer]}
      contentContainerStyle={styles.contentContainer}>
      {/* Título */}
      <View style={styles.titleContainer}>
        <Text style={styles.titlePart1}>Prosper</Text>
        <Text style={styles.titlePart2}>A</Text>
        <Text style={styles.titlePart3}>í</Text>
      </View>

      {/* Grid de Botões */}
      <View style={styles.grid}>
        {/* Botão Simulação */}
        {renderButton(
          require('../assets/simulation.png'), // Ícone de simulação
          'Iniciar Simulação',
          () => navigation.navigate('Simulador')
        )}

        {/* Botão Imposto de Renda */}
        {renderButton(
          require('../assets/tax.png'), // Ícone de imposto
          'Calcular IR',
          () => navigation.navigate('Taxa')
        )}

        {/* Botão Relatórios */}
        {renderButton(
          require('../assets/dashboard.png'), // Ícone de relatórios
          'Relatórios',
          () => navigation.navigate('Relatórios')
        )}

        {/* Botão Perfil */}
        {renderButton(
          require('../assets/user.png'), // Ícone de perfil
          'Perfil',
          () => navigation.navigate('Profile')
        )}

        {/* Botão Taxa de Câmbio */}
        {renderButton(
          require('../assets/cambio.png'), // Ícone de câmbio
          'Taxa de Câmbio',
          () => navigation.navigate('Taxa de Câmbio')
        )}

        {/* Botão Configurações */}
        {renderButton(
          require('../assets/settings.png'), // Ícone de configurações
          'Configurações',
          () => navigation.navigate('Settings')
        )}

        {/* Botão Inflação */}
        {renderButton(
          require('../assets/inflation.png'), // Ícone de inflação
          'Inflação',
          () => navigation.navigate('Inflation')
        )}

        {/* Botão Sobre */}
        {renderButton(
          require('../assets/about.png'), // Ícone de informações
          'Sobre',
          () => navigation.navigate('About')
        )}

        {/* Botão Suporte */}
        {renderButton(
          require('../assets/report.png'), // Ícone de suporte
          'Suporte',
          () => navigation.navigate('Support')
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9', // Fundo claro
  },
  darkContainer: {
    backgroundColor: '#1C1C1C', // Fundo escuro
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  titlePart1: {
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%', // Largura dos botões
    height: 120,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  darkButton: {
    backgroundColor: '#333', // Fundo dos botões no modo escuro
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00579d', // Azul institucional
  },
  darkButtonText: {
    color: '#fff', // Texto branco no modo escuro
  },
});