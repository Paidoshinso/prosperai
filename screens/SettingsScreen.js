import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Switch,
  Alert,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../context/ThemeContext';
import { account } from '../services/appwrite';
import { sendRetirementRulesNotification } from '../services/notifications';

export default function SettingsScreen({ navigation }) {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  // Carrega o estado das notificações
  useEffect(() => {
    const loadNotificationsState = async () => {
      try {
        const savedState = await AsyncStorage.getItem('notificationsEnabled');
        if (savedState) {
          setNotificationsEnabled(JSON.parse(savedState));
        }
      } catch (error) {
        console.error('Erro ao carregar estado das notificações:', error);
      }
    };
    loadNotificationsState();
  }, []);

  // Salva o estado das notificações
  const saveNotificationsState = async (value) => {
    try {
      await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(value));
    } catch (error) {
      console.error('Erro ao salvar estado das notificações:', error);
    }
  };

  const toggleNotifications = (value) => {
    setNotificationsEnabled(value);
    saveNotificationsState(value);
  };

  const clearCache = () => {
    Alert.alert(
      'Confirmar Ação',
      'Tem certeza de que deseja apagar todos os dados salvos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          onPress: async () => {
            setIsLoading(true);
            try {
              await AsyncStorage.clear();
              Alert.alert('Sucesso', 'Todos os dados foram apagados.');
            } catch (error) {
              console.error('Erro ao limpar o cache:', error);
              Alert.alert('Erro', 'Não foi possível limpar os dados.');
            } finally {
              setIsLoading(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      'Confirmar Logout',
      'Tem certeza de que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          onPress: async () => {
            try {
              await account.deleteSession('current');
              setLogoutModalVisible(true); // Mostra o modal de logout
            } catch (error) {
              console.error('Erro ao realizar logout:', error);
              Alert.alert('Erro', 'Não foi possível sair da conta.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  // Função para fechar o app
  const closeApp = () => {
    BackHandler.exitApp();
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>Configurações</Text>

      <View style={styles.settingRow}>
        <Text style={isDarkMode ? styles.darkText : null}>Modo Escuro</Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>

      <View style={styles.settingRow}>
        <Text style={isDarkMode ? styles.darkText : null}>Notificações</Text>
        <Switch value={notificationsEnabled} onValueChange={toggleNotifications} />
      </View>

      <Button
        title="Testar Notificação"
        onPress={() => {
          if (notificationsEnabled) {
            sendRetirementRulesNotification(); // Envia a notificação
          } else {
            Alert.alert('Atenção', 'As notificações estão desativadas. Por favor, ative-as primeiro.');
          }
        }}
      />

      <View style={styles.spacer} />

      <Button title="Limpar Dados" onPress={clearCache} color="#ff4d4d" />

      <View style={styles.spacer} />

      <Button title="Deslogar" onPress={handleLogout} color="#ff4d4d" />

      {/* Modal de Logout Confirmado */}
      <Modal
        visible={logoutModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, isDarkMode && styles.darkModalContent]}>
            <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>Logout realizado</Text>
            <Text style={[styles.modalText, isDarkMode && styles.darkText]}>
              Você foi deslogado com sucesso. Caso continue a tela, procure limpar os dados de navegação ou a aba aberta.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={closeApp}
            >
              <Text style={styles.modalButtonText}>Reiniciar Aplicativo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#00579d" />
          <Text style={styles.loadingText}>Processando...</Text>
        </View>
      )}

      <View style={styles.aboutSection}>
        <Text style={[styles.aboutText, isDarkMode && styles.darkText]}>
          Versão 1.0.0
        </Text>
      </View>
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
    backgroundColor: '#1a1a1a',
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
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
  },
  spacer: {
    height: 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
  },
  aboutSection: {
    marginTop: 30,
    alignItems: 'center',
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  darkModalContent: {
    backgroundColor: '#333',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  modalButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});