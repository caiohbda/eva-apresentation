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
      expect(action.delay).toBe(0);
      expect(action.order).toBe(0);
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
      expect(action.delay).toBe(0);
      expect(action.order).toBe(0);
    });

    it('should create a valid api action', () => {
      const actionData = {
        type: 'api',
        config: {
          url: 'https://api.example.com/webhook',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        },
        delay: 1000,
        order: 2
      };

      const action = JourneyAction.create(actionData);

      expect(action.type).toBe(actionData.type);
      expect(action.config).toEqual(actionData.config);
      expect(action.delay).toBe(1000);
      expect(action.order).toBe(2);
    });
  });

  describe('withId', () => {
    it('should add id to an action', () => {
      const action = JourneyAction.create({
        type: 'email',
        config: {
          to: 'test@example.com',
          subject: 'Test'
        }
      });

      const id = '123';
      const actionWithId = JourneyAction.withId(action, id);

      expect(actionWithId.id).toBe(id);
      expect(actionWithId.type).toBe(action.type);
      expect(actionWithId.config).toEqual(action.config);
      expect(actionWithId.delay).toBe(action.delay);
      expect(actionWithId.order).toBe(action.order);
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

    it('should return true for a valid api action', () => {
      const validAction = {
        type: 'api',
        config: {
          url: 'https://api.example.com/webhook',
          method: 'POST'
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

    it('should return false for an action without config', () => {
      const invalidAction = {
        type: 'email'
      };

      expect(JourneyAction.isValid(invalidAction)).toBe(false);
    });

    it('should return false for null action', () => {
      expect(JourneyAction.isValid(null)).toBe(false);
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

    it('should correctly identify api actions', () => {
      const action = JourneyAction.create({
        type: 'api',
        config: { 
          url: 'https://api.example.com/webhook',
          method: 'POST'
        }
      });

      expect(JourneyAction.isEmail(action)).toBe(false);
      expect(JourneyAction.isWhatsapp(action)).toBe(false);
      expect(JourneyAction.isApi(action)).toBe(true);
    });
  });
}); 