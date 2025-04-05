const { EmployeeJourney } = require('../EmployeeJourney');

describe('EmployeeJourney Entity', () => {
  describe('create', () => {
    it('should create a valid employee journey', () => {
      const employeeJourneyData = {
        employeeId: '123',
        journeyId: '456',
        startDate: new Date('2024-03-20')
      };

      const employeeJourney = EmployeeJourney.create(employeeJourneyData);

      expect(employeeJourney.employeeId).toBe(employeeJourneyData.employeeId);
      expect(employeeJourney.journeyId).toBe(employeeJourneyData.journeyId);
      expect(employeeJourney.startDate).toEqual(employeeJourneyData.startDate);
      expect(employeeJourney.status).toBe('pending');
      expect(employeeJourney.currentActionIndex).toBe(0);
      expect(employeeJourney.completedActions).toEqual([]);
    });
  });

  describe('isValid', () => {
    it('should return true for a valid employee journey', () => {
      const validEmployeeJourney = {
        employeeId: '123',
        journeyId: '456',
        startDate: new Date('2024-03-20'),
        status: 'pending',
        currentActionIndex: 0,
        completedActions: []
      };

      expect(EmployeeJourney.isValid(validEmployeeJourney)).toBe(true);
    });

    it('should return false for an employee journey without required fields', () => {
      const invalidEmployeeJourney = {
        employeeId: '123',
        status: 'pending'
      };

      expect(EmployeeJourney.isValid(invalidEmployeeJourney)).toBe(false);
    });
  });

  describe('status checks', () => {
    it('should correctly identify journey status', () => {
      const employeeJourney = EmployeeJourney.create({
        employeeId: '123',
        journeyId: '456',
        startDate: new Date('2024-03-20')
      });

      expect(EmployeeJourney.isPending(employeeJourney)).toBe(true);
      expect(EmployeeJourney.isInProgress(employeeJourney)).toBe(false);
      expect(EmployeeJourney.isCompleted(employeeJourney)).toBe(false);
    });
  });

  describe('markActionAsCompleted', () => {
    it('should mark an action as completed', () => {
      const employeeJourney = EmployeeJourney.create({
        employeeId: '123',
        journeyId: '456',
        startDate: new Date('2024-03-20')
      });

      const actionId = '789';
      const updated = EmployeeJourney.markActionAsCompleted(employeeJourney, actionId);

      expect(updated.completedActions).toContain(actionId);
      expect(updated.currentActionIndex).toBe(1);
    });
  });

  describe('updateStatus', () => {
    it('should update the journey status', () => {
      const employeeJourney = EmployeeJourney.create({
        employeeId: '123',
        journeyId: '456',
        startDate: new Date('2024-03-20')
      });

      const updated = EmployeeJourney.updateStatus(employeeJourney, 'in_progress');

      expect(updated.status).toBe('in_progress');
      expect(EmployeeJourney.isInProgress(updated)).toBe(true);
    });
  });
}); 