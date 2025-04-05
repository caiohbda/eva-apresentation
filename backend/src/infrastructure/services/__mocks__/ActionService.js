const ActionService = () => {
  const sentEmails = [];
  const sentWhatsAppMessages = [];
  const apiCalls = [];

  const sendEmail = async ({ to, subject, body }) => {
    console.log('Mock: Enviando email:', { to, subject, body });
    sentEmails.push({ to, subject, body, timestamp: new Date() });
    return true;
  };

  const sendWhatsApp = async ({ to, message }) => {
    console.log('Mock: Enviando mensagem WhatsApp:', { to, message });
    sentWhatsAppMessages.push({ to, message, timestamp: new Date() });
    return true;
  };

  const callApi = async ({ url, method, headers, body }) => {
    console.log('Mock: Chamando API:', { url, method, headers, body });
    apiCalls.push({ url, method, headers, body, timestamp: new Date() });
    return { success: true, data: { message: 'API call simulated successfully' } };
  };

  // Métodos para testes
  const getSentEmails = () => sentEmails;
  const getSentWhatsAppMessages = () => sentWhatsAppMessages;
  const getApiCalls = () => apiCalls;
  const clearHistory = () => {
    sentEmails.length = 0;
    sentWhatsAppMessages.length = 0;
    apiCalls.length = 0;
  };

  return {
    sendEmail,
    sendWhatsApp,
    callApi,
    getSentEmails,
    getSentWhatsAppMessages,
    getApiCalls,
    clearHistory
  };
};

module.exports = ActionService; 