const JourneyAction = {
  create: ({ type, config, delay = 0, order = 0, executionTime = null }) => ({
    type,
    config,
    delay,
    order,
    executionTime, // Formato: "HH:mm" (ex: "09:00", "14:30")
  }),

  withId: (action, id) => ({
    ...action,
    id,
  }),

  isValid: (action) => {
    if (!action || !action.type || !action.config) return false;

    // Validar configuração específica para cada tipo
    switch (action.type) {
      case "email":
        return (
          Boolean(
            action.config.to && action.config.subject && action.config.body
          ) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(action.config.to) // Validação de e-mail
        );
      case "whatsapp":
        return (
          Boolean(action.config.to && action.config.message) &&
          /^\+[1-9]\d{1,14}$/.test(action.config.to) // Validação de número de telefone internacional
        );
      case "api":
        try {
          const url = new URL(action.config.url);
          return Boolean(
            action.config.url &&
              action.config.method &&
              ["GET", "POST", "PUT", "DELETE", "PATCH"].includes(
                action.config.method
              ) &&
              (action.config.headers === undefined ||
                typeof action.config.headers === "object") &&
              (action.config.body === undefined ||
                typeof action.config.body === "object")
          );
        } catch {
          return false;
        }
      default:
        return false;
    }
  },

  isEmail: (action) => action.type === "email",
  isWhatsapp: (action) => action.type === "whatsapp",
  isApi: (action) => action.type === "api",

  // Novo método para validar o formato do horário
  isValidTime: (time) => {
    if (!time) return true; // Horário é opcional
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  },
};

module.exports = { JourneyAction };
