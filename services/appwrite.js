// services/appwrite.js
import { Client, Account } from 'appwrite';
import * as dotenv from 'expo-dotenv';

// Carrega as variáveis do .env
dotenv.loadAsync();

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT) 
  .setProject(process.env.APPWRITE_PROJECT_ID); 

export const account = new Account(client);

// Função para verificar se o usuário está logado
export const isAuthenticated = async () => {
  try {
    await account.get(); // Tenta obter a sessão do usuário
    return true; // Usuário autenticado
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return false; // Usuário não autenticado
  }
};

export default client;