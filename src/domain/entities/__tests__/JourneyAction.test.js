const { JourneyAction } = require('../JourneyAction');

describe('JourneyAction Entity', () => {
  describe('create', () => {
    it('should create a valid email action', () => {
      const actionData = {
        type: 'email',
        config: {
          to: 'employee@example.com',
          subject: 'Welcome!',
          body: 'Welcome to our company!'
        }
      };

      const action = JourneyAction.create(actionData);

      expect(action.type).toBe(actionData.type);
      expect(action.config).toEqual(actionData.config);
    });

    it('should create a valid whatsapp action', () => {
      const actionData = {
        type: 'whatsapp',
        config: {
          to: '+5511999999999',
          message: 'Welcome to our company!'
        }
      };

      const action = JourneyAction.create(actionData);

      expect(action.type).toBe(actionData.type);
      expect(action.config).toEqual(actionData.config);
    });
  });

  describe('isValid', () => {
    it('should return true for a valid email action', () => {
      const validAction = {
        type: 'email',
        config: {
          to: 'employee@example.com',
          subject: 'Welcome!'
        }
      };

      expect(JourneyAction.isValid(validAction)).toBe(true);
    });

    it('should return true for a valid whatsapp action', () => {
      const validAction = {
        type: 'whatsapp',
        config: {
          to: '+5511999999999',
          message: 'Welcome!'
        }
      };

      expect(JourneyAction.isValid(validAction)).toBe(true);
    });

    it('should return false for an action without required fields', () => {
      const invalidAction = {
        type: 'email',
        config: {}
      };

      expect(JourneyAction.isValid(invalidAction)).toBe(false);
    });

    it('should return false for an action with invalid type', () => {
      const invalidAction = {
        type: 'invalid',
        config: {
          to: 'test@example.com'
        }
      };

      expect(JourneyAction.isValid(invalidAction)).toBe(false);
    });
  });

  describe('type checks', () => {
    it('should correctly identify email actions', () => {
      const action = JourneyAction.create({
        type: 'email',
        config: { 
          to: 'test@example.com',
          subject: 'Test'
        }
      });

      expect(JourneyAction.isEmail(action)).toBe(true);
      expect(JourneyAction.isWhatsapp(action)).toBe(false);
      expect(JourneyAction.isApi(action)).toBe(false);
    });

    it('should correctly identify whatsapp actions', () => {
      const action = JourneyAction.create({
        type: 'whatsapp',
        config: { 
          to: '+5511999999999',
          message: 'Test'
        }
      });

      expect(JourneyAction.isEmail(action)).toBe(false);
      expect(JourneyAction.isWhatsapp(action)).toBe(true);
      expect(JourneyAction.isApi(action)).toBe(false);
    });
  });
}); 