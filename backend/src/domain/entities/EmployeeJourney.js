const EmployeeJourney = {
  create: ({ employeeId, journeyId, startDate, status = 'pending' }) => ({
    employeeId,
    journeyId,
    startDate,
    status,
    currentActionIndex: 0,
    completedActions: []
  }),

  withId: (employeeJourney, id) => ({
    ...employeeJourney,
    id
  }),

  isValid: (employeeJourney) => {
    const requiredFields = ['employeeId', 'journeyId', 'startDate'];
    return requiredFields.every(field => employeeJourney[field] !== undefined);
  },

  isCompleted: (employeeJourney) => employeeJourney.status === 'completed',
  isPending: (employeeJourney) => employeeJourney.status === 'pending',
  isInProgress: (employeeJourney) => employeeJourney.status === 'in_progress',

  markActionAsCompleted: (employeeJourney, actionId) => ({
    ...employeeJourney,
    completedActions: [...employeeJourney.completedActions, actionId],
    currentActionIndex: employeeJourney.currentActionIndex + 1
  }),

  updateStatus: (employeeJourney, newStatus) => ({
    ...employeeJourney,
    status: newStatus
  })
};

module.exports = { EmployeeJourney }; 