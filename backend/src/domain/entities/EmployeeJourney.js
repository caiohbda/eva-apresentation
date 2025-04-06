const EmployeeJourney = {
  create: ({ employeeId, journeyId, startDate, status = 'pending', actionSchedules = [] }) => ({
    employeeId,
    journeyId,
    startDate,
    status,
    currentActionIndex: 0,
    completedActions: [],
    actionSchedules
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
  }),

  scheduleAction: (employeeJourney, actionId, scheduledTime) => ({
    ...employeeJourney,
    actionSchedules: [
      ...employeeJourney.actionSchedules,
      { actionId, scheduledTime }
    ]
  }),

  getNextScheduledTime: (employeeJourney, actionId) => {
    const schedule = employeeJourney.actionSchedules.find(s => s.actionId === actionId);
    return schedule ? schedule.scheduledTime : null;
  }
};

module.exports = { EmployeeJourney }; 