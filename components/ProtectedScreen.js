// components/ProtectedScreen.js
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { isAuthenticated } from '../services/appwrite';
import { useNavigation } from '@react-navigation/native';

export default function ProtectedScreen({ children }) {
  const navigation = useNavigation();
  const [loading, setLoading] = React.useState(true);
  const [isAuth, setIsAuth] = React.useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await isAuthenticated();
      if (!authStatus) {
        navigation.navigate('Login'); // Redireciona para a tela de login
      } else {
        setIsAuth(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigation]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return isAuth ? children : null;
}