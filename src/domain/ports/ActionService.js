/**
 * @typedef {Object} ActionService
 * @property {Function} sendEmail - Envia um e-mail
 * @property {Function} sendWhatsApp - Envia uma mensagem no WhatsApp
 * @property {Function} callApi - Faz uma chamada para API externa
 */

const ActionService = {
  sendEmail: async ({ to, subject, body }) => {
    throw new Error('Not implemented');
  },

  sendWhatsApp: async ({ to, message }) => {
    throw new Error('Not implemented');
  },

  callApi: async ({ url, method, headers, body }) => {
    throw new Error('Not implemented');
  }
};

module.exports = ActionService; 