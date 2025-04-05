const { EmployeeJourney } = require('../EmployeeJourney');

describe('EmployeeJourney Entity', () => {
  describe('create', () => {
    it('should create a valid employee journey', () => {
      const journeyData = {
        employeeId: '123',
        journeyId: '456',
        startDate: new Date(),
        status: 'pending'
      };

      const journey = EmployeeJourney.create(journeyData);

      expect(journey.employeeId).toBe(journeyData.employeeId);
      expect(journey.journeyId).toBe(journeyData.journeyId);
      expect(journey.startDate).toBe(journeyData.startDate);
      expect(journey.status).toBe(journeyData.status);
      expect(journey.currentActionIndex).toBe(0);
      expect(journey.completedActions).toEqual([]);
    });
  });

  describe('withId', () => {
    it('should add id to an employee journey', () => {
      const journey = EmployeeJourney.create({
        employeeId: '123',
        journeyId: '456',
        startDate: new Date()
      });

      const id = '789';
      const journeyWithId = EmployeeJourney.withId(journey, id);

      expect(journeyWithId.id).toBe(id);
      expect(journeyWithId.employeeId).toBe(journey.employeeId);
      expect(journeyWithId.journeyId).toBe(journey.journeyId);
      expect(journeyWithId.startDate).toBe(journey.startDate);
      expect(journeyWithId.status).toBe(journey.status);
      expect(journeyWithId.currentActionIndex).toBe(journey.currentActionIndex);
      expect(journeyWithId.completedActions).toEqual(journey.completedActions);
    });
  });

  describe('isValid', () => {
    it('should return true for a valid employee journey', () => {
      const validJourney = {
        employeeId: '123',
        journeyId: '456',
        startDate: new Date()
      };

      expect(EmployeeJourney.isValid(validJourney)).toBe(true);
    });

    it('should return false for an employee journey without required fields', () => {
      const invalidJourney = {
        employeeId: '123',
        journeyId: '456'
      };

      expect(EmployeeJourney.isValid(invalidJourney)).toBe(false);
    });
  });

  describe('status checks', () => {
    it('should correctly identify journey status', () => {
      const journey = EmployeeJourney.create({
        employeeId: '123',
        journeyId: '456',
        startDate: new Date(),
        status: 'in_progress'
      });

      expect(EmployeeJourney.isCompleted(journey)).toBe(false);
      expect(EmployeeJourney.isPending(journey)).toBe(false);
      expect(EmployeeJourney.isInProgress(journey)).toBe(true);
    });
  });

  describe('markActionAsCompleted', () => {
    it('should mark an action as completed', () => {
      const journey = EmployeeJourney.create({
        employeeId: '123',
        journeyId: '456',
        startDate: new Date()
      });

      const actionId = '789';
      const updatedJourney = EmployeeJourney.markActionAsCompleted(journey, actionId);

      expect(updatedJourney.completedActions).toContain(actionId);
      expect(updatedJourney.currentActionIndex).toBe(1);
    });
  });

  describe('updateStatus', () => {
    it('should update the journey status', () => {
      const journey = EmployeeJourney.create({
        employeeId: '123',
        journeyId: '456',
        startDate: new Date()
      });

      const newStatus = 'completed';
      const updatedJourney = EmployeeJourney.updateStatus(journey, newStatus);

      expect(updatedJourney.status).toBe(newStatus);
    });
  });
}); 