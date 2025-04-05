const { Either } = require('fp-ts/Either');
const { pipe } = require('fp-ts/function');
const { fold } = require('fp-ts/Either');

/**
 * Configura o processador de ações para o background job
 */
const setupActionProcessor = ({
  employeeJourneyRepository,
  journeyRepository,
  actionService,
  journeyActionQueue
}) => {
  // Processador de ações
  const processAction = async (job) => {
    const { employeeJourneyId, actionId } = job.data;
    
    console.log(`Processando ação ${actionId} para jornada de funcionário ${employeeJourneyId}`);
    
    // Busca a jornada do funcionário
    const employeeJourney = await employeeJourneyRepository.findById(employeeJourneyId);
    if (!employeeJourney) {
      console.error(`Jornada de funcionário ${employeeJourneyId} não encontrada`);
      return;
    }
    
    // Busca a jornada
    const journey = await journeyRepository.findById(employeeJourney.journeyId);
    if (!journey) {
      console.error(`Jornada ${employeeJourney.journeyId} não encontrada`);
      return;
    }
    
    // Busca a ação
    const action = journey.actions.find(a => a.id === actionId);
    if (!action) {
      console.error(`Ação ${actionId} não encontrada na jornada ${journey.id}`);
      return;
    }
    
    // Executa a ação com base no tipo
    try {
      switch (action.type) {
        case 'email':
          await actionService.sendEmail(action.config);
          break;
        case 'whatsapp':
          await actionService.sendWhatsApp(action.config);
          break;
        case 'api':
          await actionService.callApi(action.config);
          break;
        default:
          console.error(`Tipo de ação desconhecido: ${action.type}`);
          return;
      }
      
      // Atualiza a jornada do funcionário
      const updatedEmployeeJourney = {
        ...employeeJourney,
        completedActions: [...employeeJourney.completedActions, actionId],
        currentActionIndex: employeeJourney.currentActionIndex + 1,
        status: employeeJourney.currentActionIndex + 1 >= journey.actions.length ? 'completed' : 'in_progress'
      };
      
      await employeeJourneyRepository.update(employeeJourneyId, updatedEmployeeJourney);
      
      console.log(`Ação ${actionId} processada com sucesso para jornada de funcionário ${employeeJourneyId}`);
    } catch (error) {
      console.error(`Erro ao processar ação ${actionId}:`, error);
    }
  };
  
  // Registra o processador na fila
  journeyActionQueue.process(processAction);
  
  console.log('Processador de ações configurado com sucesso');
};

module.exports = {
  setupActionProcessor
}; 