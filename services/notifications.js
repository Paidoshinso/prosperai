import * as Notifications from 'expo-notifications';

// Configura o handler de notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Função para agendar uma notificação
export const scheduleNotification = async (title, body) => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    console.warn('Permissão de notificação negada.');
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
    },
    trigger: null, // Dispara imediatamente
  });
};

// Função para enviar notificações sobre regras de aposentadoria
export const sendRetirementRulesNotification = async () => {
  // Lista de mensagens possíveis
  const messages = [
    {
      title: 'Regras de Aposentadoria',
      body:
        'Lembre-se de verificar as regras de transição e contribuição mínima para garantir sua elegibilidade.',
    },
    {
      title: 'Planeje sua Aposentadoria',
      body:
        'Contribua regularmente para o INSS e acompanhe suas contribuições para garantir um futuro tranquilo.',
    },
    {
      title: 'Dicas para Aposentadoria',
      body:
        'Considere aumentar suas contribuições para alcançar um benefício maior no futuro.',
    },
    {
      title: 'Atenção às Regras de Transição',
      body:
        'As regras de transição podem impactar diretamente sua aposentadoria. Fique atento!',
    },
    {
      title: 'Importância do Planejamento Financeiro',
      body:
        'Planejar sua aposentadoria é essencial para manter seu padrão de vida no futuro.',
    },
    {
      title: 'Mudanças nas Leis Previdenciárias',
      body:
        'Fique por dentro das mudanças nas leis previdenciárias para evitar surpresas.',
    },
  ];

  // Solicita permissões antes de enviar a notificação
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    console.warn('Permissão de notificação negada.');
    return;
  }

  // Seleciona uma mensagem aleatória da lista
  const randomIndex = Math.floor(Math.random() * messages.length);
  const selectedMessage = messages[randomIndex];

  // Agenda a notificação com a mensagem selecionada
  scheduleNotification(selectedMessage.title, selectedMessage.body);
};