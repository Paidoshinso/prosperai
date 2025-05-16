// database/db.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const SIMULATIONS_KEY = 'simulacoes';

export const saveData = async (novaSimulacao) => {
  try {
    const simulacoesAnteriores = await getData(); // Busca as simulações existentes
    const simulacoes = simulacoesAnteriores || [];
    simulacoes.push(novaSimulacao); // Adiciona a nova simulação
    await AsyncStorage.setItem(SIMULATIONS_KEY, JSON.stringify(simulacoes)); // Salva no AsyncStorage
    console.log('Simulação salva com sucesso:', simulacoes); // Depuração
  } catch (error) {
    console.error('Erro ao salvar simulação:', error);
    throw error;
  }
};

export const clearData = async () => {
  try {
    await AsyncStorage.removeItem('simulacoes'); // Remove os dados
    console.log('Dados limpos com sucesso.');
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
  }
};

export const getData = async () => {
  try {
    const data = await AsyncStorage.getItem(SIMULATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao buscar simulações:', error);
    return [];
  }
};