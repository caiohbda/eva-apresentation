const JourneyAction = {
  create: ({ type, config, delay, order }) => ({
    type,
    config,
    delay,
    order
  }),

  withId: (action, id) => ({
    ...action,
    id
  }),

  isValid: (action) => {
    const requiredFields = ['type', 'config', 'delay', 'order'];
    return requiredFields.every(field => action[field] !== undefined);
  },

  isEmail: (action) => action.type === 'email',
  isWhatsApp: (action) => action.type === 'whatsapp',
  isApi: (action) => action.type === 'api'
};

module.exports = { JourneyAction }; 