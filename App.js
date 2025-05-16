// App.js
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from './context/ThemeContext';
import { AuthContext } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import SimuladorScreen from './screens/SimuladorScreen';
import ReportsScreen from './screens/SimulationScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import AboutScreen from './screens/AboutScreen';
import SupportScreen from './screens/SupportScreen';
import IRCalculatorScreen from './screens/IRCalculatorScreen';
import CambioScreen from './screens/CambioScreen';
import InflationScreen from './screens/InflationScreen';
import { AuthProvider } from './context/AuthContext';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuth, loading } = useContext(AuthContext);

  if (loading) {
    return null; // Exibe um loader enquanto verifica o estado do usuário
  }

  console.log('Rota inicial:', isAuth ? 'Home' : 'Login');

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuth ? 'Home' : 'Login'}>
        {/* Telas Públicas */}
        {!isAuth && (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
        {/* Telas Protegidas */}
        {isAuth && (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Simulador" component={SimuladorScreen} />
            <Stack.Screen name="Taxa" component={IRCalculatorScreen} />
            <Stack.Screen name="Relatórios" component={ReportsScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Taxa de Câmbio" component={CambioScreen} />
            <Stack.Screen name="Inflation" component={InflationScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen name="Support" component={SupportScreen} />

          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </AuthProvider>
  );
}