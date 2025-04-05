const JourneyAction = {
  create: ({ type, config, delay = 0, order = 0 }) => ({
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
    if (!action || !action.type || !action.config) return false;
    
    // Validar configuração específica para cada tipo
    switch (action.type) {
      case 'email':
        return Boolean(action.config.to && action.config.subject);
      case 'whatsapp':
        return Boolean(action.config.to && action.config.message);
      case 'api':
        return Boolean(action.config.url && action.config.method);
      default:
        return false;
    }
  },

  isEmail: (action) => action.type === 'email',
  isWhatsapp: (action) => action.type === 'whatsapp',
  isApi: (action) => action.type === 'api'
};

module.exports = { JourneyAction }; 