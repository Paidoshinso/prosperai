// services/appwrite.js
import { Client, Account } from 'appwrite';

// Inicializa o cliente do Appwrite
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Substitua pelo seu endpoint
  .setProject('67d3158800077d244e1e'); // Substitua pelo seu Project ID

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