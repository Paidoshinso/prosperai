// screens/InflationScreen.js
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { ThemeContext } from '../context/ThemeContext';

export default function InflationScreen() {
  const { isDarkMode } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [inflationReports, setInflationReports] = useState([]); // Relatórios de inflação
  const [index, setIndex] = useState(0); // Índice da aba ativa
  const [routes] = useState([
    { key: 'dadosFicticios', title: 'Dados' },
    { key: 'relatorios', title: 'Relatórios' },
  ]);

  // Dados fictícios baseados no artigo da CNN Brasil
  const inflationData = [
    { name: 'Alimentos', percentage: 33.3 }, // Um terço da inflação
    { name: 'Transporte', percentage: 25.0 },
    { name: 'Habitação', percentage: 15.0 },
    { name: 'Outros', percentage: 26.7 },
  ];

  // Lista de produtos impactados pela inflação (baseada no artigo)
  const productInflation = [
    { name: 'Arroz', percentage: 15.2 },
    { name: 'Feijão', percentage: 12.5 },
    { name: 'Carne Bovina', percentage: 18.7 },
    { name: 'Leite', percentage: 10.3 },
    { name: 'Óleo de Soja', percentage: 22.1 },
  ];

  // Função para abrir links externos
  const openReportLink = (url) => {
    Linking.openURL(url).catch((err) =>
      Alert.alert('Erro', 'Não foi possível abrir o link.')
    );
  };

  // Função para gerar cores aleatórias para o gráfico
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Configuração do gráfico de pizza
  const pieChartData = inflationData.map((item) => ({
    name: item.name,
    population: item.percentage,
    color: getRandomColor(),
    legendFontColor: isDarkMode ? '#fff' : '#7F7F7F',
    legendFontSize: 14,
  }));

  // Carregar dados ao iniciar a tela
  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Buscar relatórios de inflação do Banco Central
        const response = await fetch(
          'https://www.bcb.gov.br/api/servico/sitebcb/ri/relatorios?quantidade=5'
        );
        const data = await response.json();
        setInflationReports(data?.conteudo || []);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, []);

  // Aba de Dados Fictícios
  const renderDadosFicticios = () => (
    <ScrollView style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Título */}
      <Text style={[styles.title, isDarkMode && styles.darkTitle]}>
        Análise da Inflação em 2024
      </Text>

      {/* Gráfico de Pizza */}
      <View style={[styles.chartContainer, isDarkMode && styles.darkChartContainer]}>
        <Text style={[styles.subtitle, isDarkMode && styles.darkSubtitle]}>
          Contribuição dos Setores para a Inflação
        </Text>
        <PieChart
          data={pieChartData}
          width={Dimensions.get('window').width - 40}
          height={250}
          chartConfig={{
            backgroundColor: isDarkMode ? '#121212' : '#fff',
            backgroundGradientFrom: isDarkMode ? '#121212' : '#fff',
            backgroundGradientTo: isDarkMode ? '#121212' : '#fff',
            decimalPlaces: 1,
            color: (opacity = 1) =>
              isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      {/* Lista de Produtos */}
      <View style={styles.productListContainer}>
        <Text style={[styles.subtitle, isDarkMode && styles.darkSubtitle]}>
          Impacto da Inflação nos Produtos
        </Text>
        {productInflation.map((item, index) => (
          <View key={index} style={styles.productItem}>
            <Text style={[styles.productName, isDarkMode && styles.darkProductName]}>
              {item.name}
            </Text>
            <Text style={[styles.productPercentage, isDarkMode && styles.darkProductPercentage]}>
              {item.percentage.toFixed(1)}%
            </Text>
          </View>
        ))}
      </View>

      {/* Explicação Sobre a Inflação */}
      <View style={[styles.explanationContainer, isDarkMode && styles.darkExplanationContainer]}>
        <Text style={[styles.explanationTitle, isDarkMode && styles.darkExplanationTitle]}>
          A Inflação no Brasil em 2024: Causas e Impactos
        </Text>
        <Text style={[styles.explanationText, isDarkMode && styles.darkExplanationText]}>
          A inflação no Brasil em 2024 superou as expectativas, atingindo 4,83% e ultrapassando o teto da meta estabelecida pelo
          Banco Central, que era de 4,5%. Esse cenário trouxe preocupações tanto para os consumidores quanto para os formuladores
          de políticas econômicas. Diversos fatores contribuíram para essa alta, sendo os principais o aumento nos preços dos
          alimentos, condições climáticas adversas, desvalorização do real, elevação nos preços dos combustíveis e um mercado de
          trabalho aquecido.
        </Text>
        <Text style={[styles.explanationSubTitle, isDarkMode && styles.darkExplanationSubTitle]}>
          Principais Fatores da Alta Inflacionária
        </Text>
        <Text style={[styles.explanationText, isDarkMode && styles.darkExplanationText]}>
          <Text style={[styles.boldText, isDarkMode && styles.darkBoldText]}>Aumento nos Preços dos Alimentos:</Text> Um dos principais responsáveis pela inflação foi a
          elevação significativa nos preços dos alimentos, especialmente das carnes e produtos básicos. Esse aumento impactou
          diretamente o custo de vida da população, refletindo-se no índice de preços ao consumidor.
        </Text>
        <Text style={[styles.explanationText, isDarkMode && styles.darkExplanationText]}>
          <Text style={[styles.boldText, isDarkMode && styles.darkBoldText]}>Condições Climáticas Adversas:</Text> A produção agrícola sofreu com eventos climáticos
          extremos, como secas severas e enchentes, que reduziram a oferta de alimentos e pressionaram os preços para cima. Esse
          fator impactou tanto os produtos in natura quanto os processados.
        </Text>
        <Text style={[styles.explanationText, isDarkMode && styles.darkExplanationText]}>
          <Text style={[styles.boldText, isDarkMode && styles.darkBoldText]}>Desvalorização do Real:</Text> A moeda brasileira teve uma desvalorização significativa em
          relação ao dólar, o que encareceu produtos importados, como eletrônicos e combustíveis, contribuindo para o aumento geral
          dos preços.
        </Text>
        <Text style={[styles.explanationText, isDarkMode && styles.darkExplanationText]}>
          <Text style={[styles.boldText, isDarkMode && styles.darkBoldText]}>Aumento dos Preços dos Combustíveis:</Text> A reoneração dos combustíveis, após a suspensão
          temporária de tributos federais, elevou os custos de transporte e logística. Esse fator se refletiu em diversos setores
          da economia, impactando desde o transporte de mercadorias até o preço final ao consumidor.
        </Text>
        <Text style={[styles.explanationText, isDarkMode && styles.darkExplanationText]}>
          <Text style={[styles.boldText, isDarkMode && styles.darkBoldText]}>Crescimento Econômico e Mercado de Trabalho Aquecido:</Text> O Brasil registrou um crescimento
          de 3,4% no PIB em 2024, o maior avanço desde 2021. Esse crescimento impulsionou a renda e o emprego, elevando a demanda por
          bens e serviços, o que também contribuiu para a inflação.
        </Text>
        <Text style={[styles.explanationSubTitle, isDarkMode && styles.darkExplanationSubTitle]}>
          Impactos e Medidas de Controle
        </Text>
        <Text style={[styles.explanationText, isDarkMode && styles.darkExplanationText]}>
          Diante desse cenário, o Banco Central adotou medidas de política monetária para conter a alta dos preços, incluindo o
          aumento da taxa básica de juros (Selic). O objetivo dessas ações é reduzir a demanda e equilibrar a inflação dentro da meta
          estabelecida. A inflação elevada impacta diretamente o poder de compra da população, reduzindo o consumo e afetando o
          crescimento econômico.
        </Text>
        <Text style={[styles.explanationSubTitle, isDarkMode && styles.darkExplanationSubTitle]}>
          Conclusão
        </Text>
        <Text style={[styles.explanationText, isDarkMode && styles.darkExplanationText]}>
          A inflação de 2024 foi influenciada por diversos fatores, incluindo choques externos e internos. O desafio para o governo
          e o Banco Central será equilibrar o crescimento econômico com o controle da inflação, garantindo estabilidade financeira e
          bem-estar para a população.
        </Text>
      </View>
    </ScrollView>
  );

  // Aba de Relatórios de Inflação
  const renderRelatorios = () => (
    <ScrollView style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Relatórios de Inflação */}
      {loading ? (
        <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#00579d'} />
      ) : inflationReports.length > 0 ? (
        <FlatList
          data={inflationReports}
          keyExtractor={(item) => item.identificador}
          renderItem={({ item }) => (
            <View style={[styles.reportItem, isDarkMode && styles.darkReportItem]}>
              <Text style={[styles.reportTitle, isDarkMode && styles.darkText]}>
                {item.edicao}º Edição - {item.volume}º Volume
              </Text>
              <Text style={[styles.reportDate, isDarkMode && styles.darkText]}>
                Referência: {item.dataReferencia}
              </Text>
              <Text
                style={[styles.reportLink, isDarkMode && styles.darkText]}
                onPress={() => openReportLink(item.url)}
              >
                Abrir Relatório
              </Text>
            </View>
          )}
        />
      ) : (
        <Text style={[styles.noData, isDarkMode && styles.darkText]}>
          Nenhum relatório de inflação disponível.
        </Text>
      )}
    </ScrollView>
  );

  const renderScene = SceneMap({
    dadosFicticios: renderDadosFicticios,
    relatorios: renderRelatorios,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: '#fff' }}
          style={[
            styles.tabBar,
            isDarkMode ? styles.darkTabBar : styles.lightTabBar,
          ]}
          labelStyle={styles.tabLabel}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20, // Adiciona espaçamento nas laterais
  },
  darkContainer: {
    backgroundColor: '#1C1C1C',
    padding: 20, // Adiciona espaçamento nas laterais
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  darkTitle: {
    color: '#fff',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#555',
  },
  darkSubtitle: {
    color: '#fff',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 30,
    elevation: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },
  darkChartContainer: {
    backgroundColor: '#1e1e1e',
  },
  productListContainer: {
    marginBottom: 20,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  productName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  darkProductName: {
    color: '#fff',
  },
  productPercentage: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  darkProductPercentage: {
    color: '#ff6347',
  },
  reportItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  darkReportItem: {
    backgroundColor: '#333',
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  reportDate: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
  reportLink: {
    fontSize: 14,
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  noData: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#777',
  },
  tabBar: {
    backgroundColor: '#6200ee', // Padrão antigo, substituído abaixo
  },
  lightTabBar: {
    backgroundColor: '#00579d', // Azul institucional para modo claro
  },
  darkTabBar: {
    backgroundColor: '#1e1e1e', // Cinza escuro para modo escuro
  },
  tabLabel: {
    color: '#fff',
    fontSize: 16,
  },
  explanationContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  darkExplanationContainer: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 10,
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  darkExplanationTitle: {
    color: '#fff',
  },
  explanationSubTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
  darkExplanationSubTitle: {
    color: '#fff',
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
    marginBottom: 10,
  },
  darkExplanationText: {
    color: '#ccc',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#333',
  },
  darkBoldText: {
    color: '#fff',
  },
});