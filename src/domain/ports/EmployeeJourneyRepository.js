/**
 * @typedef {Object} EmployeeJourneyRepository
 * @property {Function} save - Salva uma jornada de funcionário
 * @property {Function} findById - Busca uma jornada de funcionário por ID
 * @property {Function} findByEmployeeId - Busca jornadas de um funcionário
 * @property {Function} findByJourneyId - Busca jornadas de uma jornada específica
 * @property {Function} update - Atualiza uma jornada de funcionário
 * @property {Function} findPendingActions - Busca ações pendentes para execução
 */

const EmployeeJourneyRepository = {
  save: async (employeeJourney) => {
    throw new Error('Not implemented');
  },

  findById: async (id) => {
    throw new Error('Not implemented');
  },

  findByEmployeeId: async (employeeId) => {
    throw new Error('Not implemented');
  },

  findByJourneyId: async (journeyId) => {
    throw new Error('Not implemented');
  },

  update: async (id, employeeJourney) => {
    throw new Error('Not implemented');
  },

  findPendingActions: async () => {
    throw new Error('Not implemented');
  }
};

module.exports = EmployeeJourneyRepository; 