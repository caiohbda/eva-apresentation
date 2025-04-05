/**
 * @typedef {Object} EmployeeRepository
 * @property {Function} save - Salva um funcionário
 * @property {Function} findById - Busca um funcionário por ID
 * @property {Function} findAll - Lista todos os funcionários
 * @property {Function} update - Atualiza um funcionário
 * @property {Function} delete - Remove um funcionário
 */

const EmployeeRepository = {
  save: async (employee) => {
    throw new Error('Not implemented');
  },

  findById: async (id) => {
    throw new Error('Not implemented');
  },

  findAll: async () => {
    throw new Error('Not implemented');
  },

  update: async (id, employee) => {
    throw new Error('Not implemented');
  },

  delete: async (id) => {
    throw new Error('Not implemented');
  }
};

module.exports = EmployeeRepository; 