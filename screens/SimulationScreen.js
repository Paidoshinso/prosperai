import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  ScrollView,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getData, clearData } from '../database/db';
import { ThemeContext } from '../context/ThemeContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function ReportsScreen({ navigation }) {
  const { isDarkMode } = useContext(ThemeContext);
  const [simulacoes, setSimulacoes] = useState([]);
  const [dadosOriginais, setDadosOriginais] = useState([]); // Armazena os dados originais
  const [filtro, setFiltro] = useState('todos');
  const [modalVisible, setModalVisible] = useState(false);
  const [detalhesSimulacao, setDetalhesSimulacao] = useState(null);

  // Função para formatar a data como DD/MM/YYYY
  const formatDate = (isoDate) => {
    if (!isoDate) return 'N/A'; // Retorna 'N/A' se a data for inválida
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0'); // Dia com 2 dígitos
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês com 2 dígitos (lembre-se que os meses começam em 0)
    const year = date.getFullYear(); // Ano completo
    return `${day}/${month}/${year}`;
  };

  // Dados de reajuste do INSS para 2025 (exemplo fictício)
  const reajusteINSS2025 = 6.5; // Porcentagem de reajuste

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const dadosSimulacoes = await getData();
        setSimulacoes(dadosSimulacoes);
        setDadosOriginais(dadosSimulacoes); // Salva os dados originais
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
    carregarDados();
  }, []);

  const limparSimulacoes = async () => {
    // Exibe uma caixa de diálogo de confirmação
    Alert.alert(
      'Confirmar', // Título da caixa de diálogo
      'Tem certeza de que deseja apagar todas as simulações?', // Mensagem de confirmação
      [
        {
          text: 'Cancelar', // Botão "Cancelar"
          onPress: () => console.log('Ação cancelada'), // Ação ao pressionar "Cancelar"
          style: 'cancel', // Estilo do botão (opcional)
        },
        {
          text: 'Sim', // Botão "Sim"
          onPress: async () => {
            try {
              await clearData(); // Limpa os dados
              setSimulacoes([]); // Atualiza o estado das simulações
              setDadosOriginais([]); // Limpa os dados originais
              Alert.alert('Sucesso', 'Simulações removidas com sucesso!'); // Mensagem de sucesso
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível limpar as simulações.'); // Mensagem de erro
            }
          },
        },
      ],
      { cancelable: true } // Permite fechar a caixa de diálogo pressionando fora dela
    );
  };

  const aplicarFiltro = (periodo) => {
    let dadosFiltrados = [...dadosOriginais]; // Sempre começa com os dados originais
    if (periodo !== 'todos') {
      const hoje = new Date();
      let dataLimite;
      switch (periodo) {
        case '7dias':
          dataLimite = new Date(hoje.setDate(hoje.getDate() - 7));
          break;
        case '30dias':
          dataLimite = new Date(hoje.setDate(hoje.getDate() - 30));
          break;
        default:
          break;
      }
      dadosFiltrados = dadosOriginais.filter((item) => {
        const dataItem = new Date(item.data);
        return dataItem >= dataLimite;
      });
    }
    setFiltro(periodo);
    setSimulacoes(dadosFiltrados); // Atualiza os dados filtrados
  };

  const exportarDados = async () => {
    try {
      const csvContent = `Data,Idade,Contribuição,Salário Médio,Salário Aposentadoria
${simulacoes
        .map(
          (item) =>
            `${formatDate(item.data)},${item.idade},${item.contribuicao},${item.salario},${calcularSalarioAposentadoria(
              item
            )}`
        )
        .join('\n')}`;
      const filePath = `${FileSystem.documentDirectory}simulacoes.csv`;
      await FileSystem.writeAsStringAsync(filePath, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Erro', 'Compartilhamento não disponível neste dispositivo.');
        return;
      }
      await Sharing.shareAsync(filePath, { mimeType: 'text/csv' });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível exportar os dados.');
    }
  };

  const calcularSalarioAposentadoria = (item) => {
    const tetoINSS = 8157.41; // Teto do INSS em 2025
    const salarioBase = Math.min(parseFloat(item.salario), tetoINSS);
    // Garante que contribuição seja um número válido
    const contribuicaoNum = parseFloat(
      typeof item.contribuicao === 'string'
        ? item.contribuicao.split(' ')[0] // Remove "anos" e converte para número
        : item.contribuicao || 0
    );
    const salarioAposentadoria =
      salarioBase * 0.6 + Math.max(0, contribuicaoNum - 20) * 0.02 * salarioBase;
    return salarioAposentadoria.toFixed(2);
  };

  const abrirDetalhes = (item) => {
    setDetalhesSimulacao(item);
    setModalVisible(true);
  };

  const fecharDetalhes = () => {
    setDetalhesSimulacao(null);
    setModalVisible(false);
  };

  return (
    <ScrollView style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Filtros */}
      <View style={styles.filterRow}>
        <Button title="Todos" onPress={() => aplicarFiltro('todos')} />
        <Button title="Últimos 7 Dias" onPress={() => aplicarFiltro('7dias')} />
        <Button title="Últimos 30 Dias" onPress={() => aplicarFiltro('30dias')} />
      </View>
      {/* Ação */}
      <View style={styles.buttonRow}>
        <Button title="Exportar Dados" onPress={exportarDados} color="#007bff" />
        <Button title="Limpar Simulações" onPress={limparSimulacoes} color="#ff4d4d" />
      </View>
      {/* Gráfico de Simulações */}
      {simulacoes.length > 0 ? (
        <>
          <LineChart
            data={{
              labels: simulacoes.map((item) => formatDate(item.data)),
              datasets: [
                {
                  data: simulacoes.map((item) => calcularSalarioAposentadoria(item)),
                  color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Cor para salário projetado
                  strokeWidth: 2,
                },
                {
                  data: simulacoes.map((item) => {
                    const salarioAposentadoria = calcularSalarioAposentadoria(item);
                    return parseFloat(salarioAposentadoria) + (parseFloat(salarioAposentadoria) * (reajusteINSS2025 / 100)); // Aplica o reajuste
                  }),
                  color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`, // Cor para salário reajustado
                  strokeWidth: 2,
                },
              ],
              legend: ['Salário Projetado          ', 'Salário Reajustado (INSS)'],
            }}
            width={350}
            height={220}
            chartConfig={{
              backgroundColor: isDarkMode ? '#121212' : '#f4f4f4',
              backgroundGradientFrom: isDarkMode ? '#121212' : '#f4f4f4',
              backgroundGradientTo: isDarkMode ? '#121212' : '#f4f4f4',
              decimalPlaces: 2,
              color: (opacity = 1) => (isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`),
              labelColor: (opacity = 1) => (isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`),
              style: { borderRadius: 16 },
              propsForDots: { r: '6', strokeWidth: '2', stroke: '#6200ee' },
            }}
            bezier
            style={styles.chart}
          />
          {/* Lista de Simulações */}
          <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>
            Histórico de Simulações:
          </Text>
          <FlatList
            data={simulacoes}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => abrirDetalhes(item)}>
                <View style={[styles.simulationItem, isDarkMode && styles.darkSimulationItem]}>
                  <Text style={[styles.simulationText, isDarkMode && styles.darkText]}>
                    Data: {formatDate(item.data)}
                  </Text>
                  <Text style={[styles.simulationText, isDarkMode && styles.darkText]}>
                    Salário Projetado: R$ {calcularSalarioAposentadoria(item)}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </>
      ) : (
        <Text style={[styles.noData, isDarkMode && styles.darkText]}>
          Nenhum dado disponível para o gráfico.
        </Text>
      )}
      {/* Modal de Detalhes */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, isDarkMode && styles.darkModalContent]}>
            <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>Detalhes da Simulação</Text>
            {detalhesSimulacao && (
              <>
                <Text style={[styles.modalText, isDarkMode && styles.darkText]}>
                  Data: {formatDate(detalhesSimulacao.data)}
                </Text>
                <Text style={[styles.modalText, isDarkMode && styles.darkText]}>
                  Idade: {detalhesSimulacao.idade || 'N/A'}
                </Text>
                <Text style={[styles.modalText, isDarkMode && styles.darkText]}>
                  Contribuição: {detalhesSimulacao.contribuicao || 'N/A'}
                </Text>
                <Text style={[styles.modalText, isDarkMode && styles.darkText]}>
                  Salário Médio: R$ {detalhesSimulacao.salario || 'N/A'}
                </Text>
                <Text style={[styles.modalText, isDarkMode && styles.darkText]}>
                  Salário Projetado: R$ {calcularSalarioAposentadoria(detalhesSimulacao)}
                </Text>
              </>
            )}
            <Button title="Fechar" onPress={fecharDetalhes} />
          </View>
        </View>
      </Modal>
    </ScrollView>
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
    color: '#000',
  },
  simulationItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  darkSimulationItem: {
    backgroundColor: '#333',
  },
  simulationText: {
    fontSize: 14,
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  noData: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#777',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    alignSelf: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  darkModalContent: {
    backgroundColor: '#333',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
});