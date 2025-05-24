import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

// Mock do ThemeContext
jest.mock('react', () => {
  const ActualReact = jest.requireActual('react');
  return {
    ...ActualReact,
    useContext: () => ({
      isDarkMode: false,
    }),
  };
});

// Mock das imagens
jest.mock('react-native/Libraries/Image/resolveAssetSource', () =>
  jest.fn(() => ({ uri: 'mocked-asset-uri' }))
);

// Importação do HomeScreen após os mocks
import HomeScreen from '../screens/HomeScreen';

describe('Testes de Navegação - HomeScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    mockNavigation.navigate.mockClear();
  });

  test('deve renderizar HomeScreen sem erro', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    expect(getByText(/Prosper/i)).toBeDefined();
  });

  test('deve navegar para Simulador ao pressionar o botão "Iniciar Simulação"', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    fireEvent.press(getByText('Iniciar Simulação'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Simulador');
  });

  test('deve navegar para Calculadora IR', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    fireEvent.press(getByText('Calcular IR'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Taxa');
  });

  test('deve navegar para Relatórios', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    fireEvent.press(getByText('Relatórios'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Relatórios');
  });

  test('deve navegar para Perfil', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    fireEvent.press(getByText('Perfil'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Profile');
  });

  test('deve navegar para Taxa de Câmbio', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    fireEvent.press(getByText('Taxa de Câmbio'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Taxa de Câmbio');
  });

  test('deve navegar para Configurações', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    fireEvent.press(getByText('Configurações'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Settings');
  });

  test('deve navegar para Inflação', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    fireEvent.press(getByText('Inflação'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Inflation');
  });

  test('deve navegar para Sobre', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    fireEvent.press(getByText('Sobre'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('About');
  });

  test('deve navegar para Suporte', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    fireEvent.press(getByText('Suporte'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Support');
  });
});