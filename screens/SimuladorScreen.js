import React, { useContext, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { saveData } from '../database/db';
import { ThemeContext } from '../context/ThemeContext';

export default function SimuladorScreen() {
  const { isDarkMode } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [idadeAnos, setIdadeAnos] = useState('');
  const [idadeMeses, setIdadeMeses] = useState('');
  const [contribuicaoAnos, setContribuicaoAnos] = useState('');
  const [contribuicaoMeses, setContribuicaoMeses] = useState('');
  const [salario, setSalario] = useState('');
  const [resultado, setResultado] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const calcularAposentadoria = () => {
    if (!idadeAnos || !idadeMeses || !contribuicaoAnos || !contribuicaoMeses || !salario) {
    Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos antes de calcular.');
    return;
  }
    const idadeNum = parseInt(idadeAnos) + parseInt(idadeMeses) / 12;
    const contribuicaoNum = parseInt(contribuicaoAnos) + parseInt(contribuicaoMeses) / 12;
    const salarioNum = parseFloat(salario);

    if (
      isNaN(idadeNum) ||
      isNaN(contribuicaoNum) ||
      isNaN(salarioNum) ||
      idadeNum <= 0 ||
      contribuicaoNum <= 0 ||
      salarioNum <= 0
    ) {
      Alert.alert('Erro', 'Por favor, insira valores válidos.');
      return;
    }

    // Regras básicas
    const idadeMinimaHomem = 65;
    const idadeMinimaMulher = 62;
    const contribuicaoMinimaHomem = 20; // Mínimo para homens
    const contribuicaoMinimaMulher = 15; // Mínimo para mulheres

    // Regra de transição por pedágio
    const pedagioHomem = (35 - contribuicaoNum) * 2;
    const pedagioMulher = (30 - contribuicaoNum) * 2;

    // Cálculo do salário de aposentadoria
    const tetoINSS = 8157.41; // Teto do INSS em 2025
    const salarioBase = Math.min(salarioNum, tetoINSS);
    const salarioAposentadoria =
      salarioBase * 0.6 + Math.max(0, contribuicaoNum - 20) * 0.02 * salarioBase;

    // Verificações das regras
    const faltamIdadeHomem = idadeNum < idadeMinimaHomem ? idadeMinimaHomem - idadeNum : 0;
    const faltamContribuicaoHomem =
      contribuicaoNum < contribuicaoMinimaHomem
        ? contribuicaoMinimaHomem - contribuicaoNum
        : 0;
    const faltamIdadeMulher = idadeNum < idadeMinimaMulher ? idadeMinimaMulher - idadeNum : 0;
    const faltamContribuicaoMulher =
      contribuicaoNum < contribuicaoMinimaMulher
        ? contribuicaoMinimaMulher - contribuicaoNum
        : 0;
    const regraGeralHomem =
      idadeNum >= idadeMinimaHomem && contribuicaoNum >= contribuicaoMinimaHomem;
    const regraGeralMulher =
      idadeNum >= idadeMinimaMulher && contribuicaoNum >= contribuicaoMinimaMulher;
    const pedagioCompletoHomem = pedagioHomem <= 0;
    const pedagioCompletoMulher = pedagioMulher <= 0;

    // Função para converter anos fracionários em anos e meses
    const converterParaAnosEMeses = (valor) => {
      const anos = Math.floor(valor);
      const meses = Math.round((valor - anos) * 12);
      return `${anos} ano(s) e ${meses} mês(es)`;
    };

    // Regra de transição por idade progressiva
    const anoAtual = new Date().getFullYear();
    const idadeProgressivaHomem = 61 + (anoAtual - 2019) * 0.5; // Incremento de 6 meses por ano
    const idadeProgressivaMulher = 56 + (anoAtual - 2019) * 0.33; // Incremento de 4 meses por ano
    const faltamIdadeProgressivaHomem =
      idadeNum < idadeProgressivaHomem ? idadeProgressivaHomem - idadeNum : 0;
    const faltamIdadeProgressivaMulher =
      idadeNum < idadeProgressivaMulher ? idadeProgressivaMulher - idadeNum : 0;
    const regraProgressivaHomem =
      idadeNum >= idadeProgressivaHomem && contribuicaoNum >= 35;
    const regraProgressivaMulher =
      idadeNum >= idadeProgressivaMulher && contribuicaoNum >= 30;

    // Resultados
    const resultados = [
      {
        titulo: 'Regra Geral',
        detalhes: [
          {
            texto: regraGeralHomem
              ? `Homem: Pode se aposentar pela regra geral. Salário estimado: R$ ${salarioAposentadoria.toFixed(
                  2
                )}.`
              : `Homem: Faltam ${converterParaAnosEMeses(faltamIdadeHomem)} de idade e ${converterParaAnosEMeses(
                  faltamContribuicaoHomem
                )} de contribuição.`,
            explicacao:
              'Homens precisam ter pelo menos 65 anos de idade e 20 anos de contribuição.\n' +
              'Mulheres precisam ter pelo menos 62 anos de idade e 15 anos de contribuição.',
          },
          {
            texto: regraGeralMulher
              ? `Mulher: Pode se aposentar pela regra geral. Salário estimado: R$ ${salarioAposentadoria.toFixed(
                  2
                )}.`
              : `Mulher: Faltam ${converterParaAnosEMeses(faltamIdadeMulher)} de idade e ${converterParaAnosEMeses(
                  faltamContribuicaoMulher
                )} de contribuição.`,
            explicacao:
              'Homens precisam ter pelo menos 65 anos de idade e 20 anos de contribuição.\n' +
              'Mulheres precisam ter pelo menos 62 anos de idade e 15 anos de contribuição.',
          },
        ],
      },
      {
        titulo: 'Regra de Transição por Pedágio',
        detalhes: [
          {
            texto: pedagioCompletoHomem
              ? `Homem: Pode se aposentar pela regra de transição (pedágio). Salário estimado: R$ ${salarioAposentadoria.toFixed(
                  2
                )}.`
              : `Homem: Faltam ${converterParaAnosEMeses(Math.abs(pedagioHomem))} de contribuição para completar o pedágio.`,
            explicacao:
              'Homens precisam contribuir pelo dobro do tempo que falta para atingir 35 anos de contribuição.\n' +
              'Mulheres precisam contribuir pelo dobro do tempo que falta para atingir 30 anos de contribuição.',
          },
          {
            texto: pedagioCompletoMulher
              ? `Mulher: Pode se aposentar pela regra de transição (pedágio). Salário estimado: R$ ${salarioAposentadoria.toFixed(
                  2
                )}.`
              : `Mulher: Faltam ${converterParaAnosEMeses(Math.abs(pedagioMulher))} de contribuição para completar o pedágio.`,
            explicacao:
              'Homens precisam contribuir pelo dobro do tempo que falta para atingir 35 anos de contribuição.\n' +
              'Mulheres precisam contribuir pelo dobro do tempo que falta para atingir 30 anos de contribuição.',
          },
        ],
      },
      {
        titulo: 'Regra de Transição por Idade Progressiva',
        detalhes: [
          {
            texto: regraProgressivaHomem
              ? `Homem: Pode se aposentar pela regra de transição por idade progressiva. Salário estimado: R$ ${salarioAposentadoria.toFixed(
                  2
                )}.`
              : `Homem: Faltam ${converterParaAnosEMeses(faltamIdadeProgressivaHomem)} de idade e precisa ter 35 anos de contribuição.`,
            explicacao:
              'Homens precisam atingir uma idade mínima que aumenta gradualmente até 65 anos, além de 35 anos de contribuição.\n' +
              'Mulheres precisam atingir uma idade mínima que aumenta gradualmente até 62 anos, além de 30 anos de contribuição.',
          },
          {
            texto: regraProgressivaMulher
              ? `Mulher: Pode se aposentar pela regra de transição por idade progressiva. Salário estimado: R$ ${salarioAposentadoria.toFixed(
                  2
                )}.`
              : `Mulher: Faltam ${converterParaAnosEMeses(faltamIdadeProgressivaMulher)} de idade e precisa ter 30 anos de contribuição.`,
            explicacao:
              'Homens precisam atingir uma idade mínima que aumenta gradualmente até 65 anos, além de 35 anos de contribuição.\n' +
              'Mulheres precisam atingir uma idade mínima que aumenta gradualmente até 62 anos, além de 30 anos de contribuição.',
          },
        ],
      },
    ];

    setResultado(resultados);

    // Salva os dados no banco de dados
    const dataToSave = {
      idade: `${idadeAnos} anos e ${idadeMeses} meses`,
      contribuicao: `${contribuicaoAnos} anos e ${contribuicaoMeses} meses`,
      salario: salarioNum,
      resultados: resultados,
      data: new Date().toISOString(),
    };
    saveData(dataToSave);
    Alert.alert('Sucesso', 'Simulação salva com sucesso!');
  };

  const abrirModal = (explicacao) => {
    setModalContent(explicacao);
    setModalVisible(true);
  };

  return (
    <ScrollView
      style={[styles.container, isDarkMode && styles.darkContainer]}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={[styles.title, isDarkMode && styles.darkText]}>
        Simulador de Aposentadoria
      </Text>

      {/* Entradas */}
      <Text style={[styles.label, isDarkMode && styles.darkText]}>Idade:</Text>
      <View style={styles.row}>
        <TextInput
          value={idadeAnos}
          onChangeText={setIdadeAnos}
          keyboardType="numeric"
          placeholder="Anos"
          placeholderTextColor={isDarkMode ? '#aaa' : '#ccc'} // Cor do placeholder no modo escuro
          style={[
            styles.inputHalf,
            isDarkMode && styles.darkInput,
            { color: isDarkMode ? '#fff' : '#000' }, // Cor do texto no modo escuro
          ]}
        />
        <TextInput
          value={idadeMeses}
          onChangeText={setIdadeMeses}
          keyboardType="numeric"
          placeholder="Meses"
          placeholderTextColor={isDarkMode ? '#aaa' : '#ccc'} // Cor do placeholder no modo escuro
          style={[
            styles.inputHalf,
            isDarkMode && styles.darkInput,
            { color: isDarkMode ? '#fff' : '#000' }, // Cor do texto no modo escuro
          ]}
        />
      </View>

      <Text style={[styles.label, isDarkMode && styles.darkText]}>
        Tempo de Contribuição:
      </Text>
      <View style={styles.row}>
        <TextInput
          value={contribuicaoAnos}
          onChangeText={setContribuicaoAnos}
          keyboardType="numeric"
          placeholder="Anos"
          placeholderTextColor={isDarkMode ? '#aaa' : '#ccc'} // Cor do placeholder no modo escuro
          style={[
            styles.inputHalf,
            isDarkMode && styles.darkInput,
            { color: isDarkMode ? '#fff' : '#000' }, // Cor do texto no modo escuro
          ]}
        />
        <TextInput
          value={contribuicaoMeses}
          onChangeText={setContribuicaoMeses}
          keyboardType="numeric"
          placeholder="Meses"
          placeholderTextColor={isDarkMode ? '#aaa' : '#ccc'} // Cor do placeholder no modo escuro
          style={[
            styles.inputHalf,
            isDarkMode && styles.darkInput,
            { color: isDarkMode ? '#fff' : '#000' }, // Cor do texto no modo escuro
          ]}
        />
      </View>

      <Text style={[styles.label, isDarkMode && styles.darkText]}>Salário Médio:</Text>
      <TextInput
        value={salario}
        onChangeText={setSalario}
        keyboardType="numeric"
        placeholder="Salário Médio"
        placeholderTextColor={isDarkMode ? '#aaa' : '#ccc'} // Cor do placeholder no modo escuro
        style={[
          styles.input,
          isDarkMode && styles.darkInput,
          { color: isDarkMode ? '#fff' : '#000' }, // Cor do texto no modo escuro
        ]}
      />

      {/* Botão Calcular */}
      <Button title="Calcular" onPress={calcularAposentadoria} />

      {/* Resultados */}
      {resultado.map((item, index) => (
        <View key={index} style={[styles.resultadoBox, isDarkMode && styles.darkResultadoBox]}>
          <TouchableOpacity onPress={() => abrirModal(item.detalhes[0].explicacao)}>
            <Text style={[styles.resultadoTitulo, isDarkMode && styles.darkText]}>{item.titulo}</Text>
          </TouchableOpacity>
          {item.detalhes.map((detalhe, idx) => (
            <View key={idx}>
              <Text style={[styles.resultadoTexto, isDarkMode && styles.darkText]}>{detalhe.texto}</Text>
              {idx === 0 && <View style={styles.espacoEntreSexos} />}
            </View>
          ))}
        </View>
      ))}

      {/* Espaço entre os botões */}
      <View style={{ marginTop: 20 }}>
        <Button title="Voltar" onPress={() => navigation.goBack()} />
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, isDarkMode && styles.darkModalContent]}>
            <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>Explicação</Text>
            <Text style={[styles.modalText, isDarkMode && styles.darkText]}>{modalContent}</Text>
            <Button title="Fechar" onPress={() => setModalVisible(false)} />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  inputHalf: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginRight: 5,
  },
  darkInput: {
    backgroundColor: '#333',
    borderColor: '#555',
    color: '#fff',
  },
  resultadoBox: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  darkResultadoBox: {
    backgroundColor: '#333',
  },
  resultadoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  resultadoTexto: {
    fontSize: 16,
    color: '#333',
  },
  espacoEntreSexos: {
    height: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    marginBottom: 20,
    color: '#333',
  },
});