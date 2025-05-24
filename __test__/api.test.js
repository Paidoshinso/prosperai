const fetchMock = require('jest-fetch-mock');

// Mock do módulo Appwrite
jest.mock('appwrite', () => {
  const mockAccount = {
    get: jest.fn(),
  };

  return {
    Client: jest.fn(() => ({
      setEndpoint: jest.fn().mockReturnThis(),
      setProject: jest.fn().mockReturnThis(),
    })),
    Account: jest.fn(() => mockAccount),
  };
});

fetchMock.enableMocks();

describe('Testes das APIs', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks();
  });

  test('carregar relatórios de inflação com sucesso', async () => {
    const mockInflationData = {
      conteudo: [
        { id: 1, titulo: 'Relatório Inflação 1' },
        { id: 2, titulo: 'Relatório Inflação 2' },
      ],
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockInflationData));

    const response = await fetch(
      'https://www.bcb.gov.br/api/servico/sitebcb/ri/relatorios?quantidade=5 '
    );
    const data = await response.json();

    expect(data.conteudo).toHaveLength(2);
    expect(data.conteudo[0].titulo).toBe('Relatório Inflação 1');
  });

  test('tratar erro ao buscar relatórios de inflação', async () => {
    fetchMock.mockRejectOnce(new Error('Erro na API de inflação'));

    try {
      await fetch(
        'https://www.bcb.gov.br/api/servico/sitebcb/ri/relatorios?quantidade=5 '
      );
    } catch (error) {
      expect(error.message).toBe('Erro na API de inflação');
    }
  });

  test('retornar dados da taxa de câmbio com sucesso', async () => {
    const mockExchangeData = [
      { data: '01/01/2024', valor: '5.20' },
      { data: '02/01/2024', valor: '5.25' },
    ];

    const dataInicial = '01/01/2024';
    const dataFinal = '02/01/2024';

    fetchMock.mockResponseOnce(JSON.stringify(mockExchangeData));

    const response = await fetch(
      `https://api.bcb.gov.br/dados/serie/bcdata.sgs.10813/dados?formato=json&dataInicial= ${dataInicial}&dataFinal=${dataFinal}`
    );
    const data = await response.json();

    expect(data).toHaveLength(2);
    expect(parseFloat(data[1].valor)).toBe(5.25);
  });

  test('tratar erro ao buscar taxa de câmbio', async () => {
    const dataInicial = '01/01/2024';
    const dataFinal = '02/01/2024';

    fetchMock.mockRejectOnce(new Error('Erro na API de câmbio'));

    try {
      await fetch(
        `https://api.bcb.gov.br/dados/serie/bcdata.sgs.10813/dados?formato=json&dataInicial= ${dataInicial}&dataFinal=${dataFinal}`
      );
    } catch (error) {
      expect(error.message).toBe('Erro na API de câmbio');
    }
  });

  test('Retornar true para usuário autenticado no Appwrite', async () => {
    const Account = require('appwrite').Account;
    const accountInstance = Account();

    accountInstance.get.mockResolvedValue({ name: 'Luana' });

    const { isAuthenticated } = require('../services/appwrite');
    const result = await isAuthenticated();

    expect(result).toBe(true);
  });

  test('Retornar false para usuário NÃO autenticado no Appwrite', async () => {
    const Account = require('appwrite').Account;
    const accountInstance = Account();

    accountInstance.get.mockRejectedValue(new Error('Não autenticado'));

    const { isAuthenticated } = require('../services/appwrite');
    const result = await isAuthenticated();

    expect(result).toBe(false);
  });
});