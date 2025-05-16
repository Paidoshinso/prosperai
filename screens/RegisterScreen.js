import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { account } from '../services/appwrite';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getPasswordStrength = (password) => {
    if (password.length < 6) return 'Fraca';
    if (
      /[A-Za-z]/.test(password) &&
      /[0-9]/.test(password) &&
      password.length >= 6
    ) {
      if (
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[^A-Za-z0-9]/.test(password) &&
        password.length >= 8
      ) {
        return 'Forte';
      }
      return 'Média';
    }
    return 'Fraca';
  };

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 'Fraca':
        return 'red';
      case 'Média':
        return 'orange';
      case 'Forte':
        return 'green';
      default:
        return 'gray';
    }
  };

  const handleRegister = async () => {
    const strength = getPasswordStrength(password);

    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    if (strength !== 'Forte') {
      Alert.alert('Erro', 'A senha deve ser forte para prosseguir.');
      return;
    }

    try {
      const userAccount = await account.create('unique()', email, password, name);
      console.log('Usuário criado:', userAccount);

      try {
        await account.createSession(email, password);
        console.log('Sessão iniciada com sucesso');
      } catch (sessionError) {
        console.warn('Erro ao criar sessão (ignorado):', sessionError.message);
      }

      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      Alert.alert('Sucesso', 'Registro realizado com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      let parsedError;
      try {
        parsedError = JSON.parse(error.response);
      } catch (_) {}

      if (
        parsedError?.message?.includes('Invalid `userId` param') ||
        error.message?.includes('Invalid `userId` param')
      ) {
        console.warn('Erro de userId ignorado:', error.message);
        Alert.alert('Sucesso parcial', 'Usuário criado com sucesso, mas ocorreu um erro não crítico.');
        navigation.navigate('Login');
      } else if (error.message?.includes('User already exists')) {
        Alert.alert('Erro', 'Este e-mail já está registrado.');
      } else {
        console.error('Erro inesperado:', error);
        Alert.alert('Erro', 'Não foi possível registrar. Tente novamente mais tarde.');
      }
    }
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthColor = getStrengthColor(passwordStrength);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar</Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Nome"
        style={styles.input}
      />

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Senha"
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? 'eye-off' : 'eye'} size={22} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Força da senha */}
      {password !== '' && (
        <Text style={[styles.strengthText, { color: strengthColor }]}>
          Força da senha: {passwordStrength}
        </Text>
      )}

      <View style={styles.passwordContainer}>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirme sua Senha"
          secureTextEntry={!showConfirmPassword}
          style={styles.passwordInput}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Icon name={showConfirmPassword ? 'eye-off' : 'eye'} size={22} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Registrar" onPress={handleRegister} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Voltar" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
  },
  toggle: {
    color: 'blue',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  strengthText: {
    marginBottom: 10,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginBottom: 10,
  },
});
