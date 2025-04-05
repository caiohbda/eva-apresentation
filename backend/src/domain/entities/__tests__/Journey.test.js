const { Journey } = require('../Journey');
const { JourneyAction } = require('../JourneyAction');

describe('Journey Entity', () => {
  describe('create', () => {
    it('should create a valid journey', () => {
      const journeyData = {
        name: 'Onboarding',
        description: 'New employee onboarding journey',
        actions: [
          {
            type: 'email',
            config: { to: 'employee@example.com', subject: 'Welcome!' }
          }
        ]
      };

      const journey = Journey.create(journeyData);

      expect(journey.name).toBe(journeyData.name);
      expect(journey.description).toBe(journeyData.description);
      expect(journey.actions).toEqual(journeyData.actions);
      expect(journey.status).toBe('active');
    });

    it('should create a journey with default values', () => {
      const journeyData = {
        name: 'Simple Journey',
        description: 'A simple journey'
      };

      const journey = Journey.create(journeyData);

      expect(journey.actions).toEqual([]);
      expect(journey.status).toBe('active');
    });
  });

  describe('withId', () => {
    it('should add id to a journey', () => {
      const journey = Journey.create({
        name: 'Test Journey',
        description: 'Test description'
      });

      const id = '123';
      const journeyWithId = Journey.withId(journey, id);

      expect(journeyWithId.id).toBe(id);
      expect(journeyWithId.name).toBe(journey.name);
      expect(journeyWithId.description).toBe(journey.description);
      expect(journeyWithId.actions).toEqual(journey.actions);
      expect(journeyWithId.status).toBe(journey.status);
    });
  });

  describe('addAction', () => {
    it('should add an action to a journey', () => {
      const journey = Journey.create({
        name: 'Test Journey',
        description: 'Test description'
      });

      const action = {
        type: 'email',
        config: { to: 'test@example.com', subject: 'Test' }
      };

      const updatedJourney = Journey.addAction(journey, action);

      expect(updatedJourney.actions).toHaveLength(1);
      expect(updatedJourney.actions[0]).toEqual(action);
      expect(updatedJourney.name).toBe(journey.name);
      expect(updatedJourney.description).toBe(journey.description);
      expect(updatedJourney.status).toBe(journey.status);
    });

    it('should add multiple actions to a journey', () => {
      const journey = Journey.create({
        name: 'Test Journey',
        description: 'Test description'
      });

      const emailAction = {
        type: 'email',
        config: { to: 'test@example.com', subject: 'Test' }
      };

      const whatsappAction = {
        type: 'whatsapp',
        config: { to: '+5511999999999', message: 'Test' }
      };

      let updatedJourney = Journey.addAction(journey, emailAction);
      updatedJourney = Journey.addAction(updatedJourney, whatsappAction);

      expect(updatedJourney.actions).toHaveLength(2);
      expect(updatedJourney.actions[0]).toEqual(emailAction);
      expect(updatedJourney.actions[1]).toEqual(whatsappAction);
    });
  });

  describe('isValid', () => {
    it('should return true for a valid journey', () => {
      const validJourney = {
        name: 'Test Journey',
        description: 'Test description',
        actions: []
      };

      expect(Journey.isValid(validJourney)).toBe(true);
    });

    it('should return false for a journey without required fields', () => {
      const invalidJourney = {
        description: 'Test description',
        actions: []
      };

      expect(Journey.isValid(invalidJourney)).toBe(false);
    });

    it('should return false for a journey with empty required fields', () => {
      const invalidJourney = {
        name: '',
        description: '  ',
        actions: []
      };

      expect(Journey.isValid(invalidJourney)).toBe(false);
    });
  });
}); 