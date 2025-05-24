const dotenv = require('dotenv');
const path = require('path');

// Carrega as variáveis do .env
// O caminho é resolvido para garantir que o arquivo .env seja encontrado corretamente
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

module.exports = {
  loadAsync: jest.fn().mockResolvedValue({
    APPWRITE_ENDPOINT: process.env.APPWRITE_ENDPOINT,
    APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID,
  }),
};