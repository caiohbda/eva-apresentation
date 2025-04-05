/**
 * @typedef {Object} JourneyRepository
 * @property {Function} save - Salva uma jornada
 * @property {Function} findById - Busca uma jornada por ID
 * @property {Function} findAll - Lista todas as jornadas
 * @property {Function} update - Atualiza uma jornada
 * @property {Function} delete - Remove uma jornada
 */

const JourneyRepository = {
  save: async (journey) => {
    throw new Error('Not implemented');
  },

  findById: async (id) => {
    throw new Error('Not implemented');
  },

  findAll: async () => {
    throw new Error('Not implemented');
  },

  update: async (id, journey) => {
    throw new Error('Not implemented');
  },

  delete: async (id) => {
    throw new Error('Not implemented');
  }
};

module.exports = JourneyRepository; 