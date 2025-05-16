// screens/ProfileScreen.js
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { ThemeContext } from '../context/ThemeContext';
import { account } from '../services/appwrite'; // Importe o cliente do Appwrite

export default function ProfileScreen() {
  const { isDarkMode } = useContext(ThemeContext);
  const [photo, setPhoto] = useState(null); // URI da foto
  const [age, setAge] = useState('');
  const [job, setJob] = useState('');
  const [userName, setUserName] = useState(''); // Nome do usuário logado
  const [isEditing, setIsEditing] = useState(false);

  // Carregar os dados salvos ao iniciar
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // Carregar dados do AsyncStorage
        const savedAge = await AsyncStorage.getItem('profile_age');
        const savedJob = await AsyncStorage.getItem('profile_job');
        const savedPhoto = await AsyncStorage.getItem('profile_photo');

        if (savedAge) setAge(savedAge);
        if (savedJob) setJob(savedJob);
        if (savedPhoto) setPhoto(savedPhoto);

        // Buscar o nome do usuário logado no Appwrite
        fetchUserData();
      } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error);
      }
    };

    loadProfileData();
  }, []);

  // Função para buscar o nome do usuário logado no Appwrite
  const fetchUserData = async () => {
    try {
      const user = await account.get(); // Obtém os dados do usuário logado
      setUserName(user.name); // Define o nome do usuário no estado
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
    }
  };

  // Salvar os dados no AsyncStorage
  const saveProfileData = async () => {
    try {
      await AsyncStorage.setItem('profile_age', age);
      await AsyncStorage.setItem('profile_job', job);
      if (photo) await AsyncStorage.setItem('profile_photo', photo); // Salva a URI da foto
      Alert.alert('Sucesso', 'Dados salvos com sucesso!');
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao salvar dados do perfil:', error);
      Alert.alert('Erro', 'Não foi possível salvar os dados.');
    }
  };

  // Função para escolher uma imagem da galeria
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permissão necessária', 'Por favor, conceda permissão para acessar a galeria.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Usa MediaTypeOptions para compatibilidade
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedPhotoUri = result.assets[0].uri; // Acessa a URI da imagem selecionada
      setPhoto(selectedPhotoUri); // Atualiza o estado com a nova foto
    }
  };

  // Função para limpar todos os dados do AsyncStorage
  const clearCache = async () => {
    try {
      await AsyncStorage.clear(); // Limpa todos os dados salvos no AsyncStorage
      setPhoto(null); // Limpa a foto
      setAge(''); // Limpa a idade
      setJob(''); // Limpa o trabalho
      Alert.alert('Sucesso', 'Todos os dados foram apagados.');
    } catch (error) {
      console.error('Erro ao limpar o cache:', error);
      Alert.alert('Erro', 'Não foi possível limpar os dados.');
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Título */}
      <Text style={[styles.title, isDarkMode && styles.darkText]}>Meu Perfil</Text>

      {/* Nome do Usuário */}
      {userName ? (
        <Text style={[styles.welcomeText, isDarkMode && styles.darkText]}>
          Usuario{' '}
          <Text style={[styles.userName, isDarkMode && styles.darkText]}>
            {userName}
          </Text>
        </Text>
      ) : (
        <Text style={[styles.userName, isDarkMode && styles.darkText]}>
          Carregando...
        </Text>
      )}

      {/* Foto de Perfil */}
      {isEditing ? (
        <TouchableOpacity onPress={pickImage} style={styles.photoContainer}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photo} />
          ) : (
            <Text style={[styles.photoPlaceholder, isDarkMode && styles.darkText]}>
              Adicionar Foto
            </Text>
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.photoContainer}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photo} />
          ) : (
            <Text style={[styles.photoPlaceholder, isDarkMode && styles.darkText]}>
              Foto de Perfil
            </Text>
          )}
        </View>
      )}

      {/* Idade */}
      <Text style={[styles.label, isDarkMode && styles.darkText]}>Idade:</Text>
      {isEditing ? (
        <TextInput
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          style={[styles.input, isDarkMode && styles.darkInput]}
        />
      ) : (
        <Text style={[styles.text, isDarkMode && styles.darkText]}>{age || 'N/A'}</Text>
      )}

      {/* Trabalho Atual */}
      <Text style={[styles.label, isDarkMode && styles.darkText]}>Trabalho Atual:</Text>
      {isEditing ? (
        <TextInput
          value={job}
          onChangeText={setJob}
          style={[styles.input, isDarkMode && styles.darkInput]}
        />
      ) : (
        <Text style={[styles.text, isDarkMode && styles.darkText]}>{job || 'N/A'}</Text>
      )}

      {/* Botões Editar/Salvar */}
      {isEditing ? (
        <Button title="Salvar" onPress={saveProfileData} />
      ) : (
        <Button title="Editar" onPress={() => setIsEditing(true)} />
      )}

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
  welcomeText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#000', // Cor do texto fixo no modo claro
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00579d', // Azul institucional no modo claro
  },
  darkText: {
    color: '#fff', // Cor do texto no modo escuro
  },
  photoContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  photoPlaceholder: {
    fontSize: 16,
    color: '#aaa',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  darkInput: {
    backgroundColor: '#333',
    borderColor: '#555',
    color: '#fff',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
  },
});