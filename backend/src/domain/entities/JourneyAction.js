const JourneyAction = {
  create: ({ type, config, delay = 0, order = 0, executionTime = null }) => ({
    type,
    config,
    delay,
    order,
    executionTime // Formato: "HH:mm" (ex: "09:00", "14:30")
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
        return Boolean(action.config.to && action.config.subject && action.config.body);
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
  isApi: (action) => action.type === 'api',

  // Novo método para validar o formato do horário
  isValidTime: (time) => {
    if (!time) return true; // Horário é opcional
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }
};

module.exports = { JourneyAction }; 