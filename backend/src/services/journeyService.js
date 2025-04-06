const { Journey } = require('../domain/entities/Journey');
const { JourneyAction } = require('../domain/entities/JourneyAction');
const { EmployeeJourney } = require('../domain/entities/EmployeeJourney');
const journeyRepository = require('../repositories/journeyRepository');
const employeeJourneyRepository = require('../repositories/employeeJourneyRepository');
const actionQueue = require('../infrastructure/actionQueue');

const journeyService = {
  async createJourney(journeyData) {
    const { name, description, actions } = journeyData;

    // Validar ações
    const validatedActions = actions.map((action, index) => {
      const { type, config, executionTime } = action;
      
      // Validar horário de execução
      if (executionTime && !JourneyAction.isValidTime(executionTime)) {
        throw new Error(`Horário de execução inválido para a ação ${index + 1}`);
      }

      // Criar ação validada
      const journeyAction = JourneyAction.create({
        type,
        config,
        order: index,
        executionTime
      });

      if (!JourneyAction.isValid(journeyAction)) {
        throw new Error(`Configuração inválida para a ação ${index + 1}`);
      }

      return journeyAction;
    });

    // Criar jornada
    const journey = Journey.create({
      name,
      description,
      actions: validatedActions
    });

    if (!Journey.isValid(journey)) {
      throw new Error('Dados da jornada inválidos');
    }

    // Salvar no repositório
    const savedJourney = await journeyRepository.save(journey);
    return savedJourney;
  },

  async startEmployeeJourney(employeeId, journeyId) {
    const journey = await journeyRepository.findById(journeyId);
    if (!journey) {
      throw new Error('Jornada não encontrada');
    }

    // Criar jornada do funcionário
    const employeeJourney = EmployeeJourney.create({
      employeeId,
      journeyId,
      startDate: new Date(),
      actionSchedules: journey.actions.map(action => ({
        actionId: action.id,
        scheduledTime: action.executionTime
      }))
    });

    if (!EmployeeJourney.isValid(employeeJourney)) {
      throw new Error('Dados da jornada do funcionário inválidos');
    }

    // Salvar no repositório
    const savedEmployeeJourney = await employeeJourneyRepository.save(employeeJourney);

    // Agendar primeira ação
    const firstAction = journey.actions[0];
    if (firstAction) {
      await actionQueue.scheduleAction(savedEmployeeJourney.id, firstAction.id, firstAction.executionTime);
    }

    return savedEmployeeJourney;
  },

  async getJourneyById(journeyId) {
    const journey = await journeyRepository.findById(journeyId);
    if (!journey) {
      throw new Error('Jornada não encontrada');
    }
    return journey;
  },

  async getEmployeeJourneyById(employeeJourneyId) {
    const employeeJourney = await employeeJourneyRepository.findById(employeeJourneyId);
    if (!employeeJourney) {
      throw new Error('Jornada do funcionário não encontrada');
    }
    return employeeJourney;
  },

  async listJourneys() {
    return journeyRepository.findAll();
  },

  async listEmployeeJourneys(employeeId) {
    return employeeJourneyRepository.findByEmployeeId(employeeId);
  }
};

module.exports = journeyService; 