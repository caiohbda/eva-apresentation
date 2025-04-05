const Journey = {
  create: ({ name, description, actions = [], status = 'active' }) => ({
    name,
    description,
    actions,
    status
  }),

  withId: (journey, id) => ({
    ...journey,
    id
  }),

  addAction: (journey, action) => ({
    ...journey,
    actions: [...journey.actions, action]
  }),

  isValid: (journey) => {
    const requiredFields = ['name', 'description'];
    return requiredFields.every(field => journey[field] && journey[field].trim() !== '');
  }
};

module.exports = { Journey }; 