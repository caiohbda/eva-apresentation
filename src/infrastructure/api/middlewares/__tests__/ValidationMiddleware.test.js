const { ValidationMiddleware } = require('../ValidationMiddleware');
const Joi = require('joi');

describe('ValidationMiddleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('validateBody', () => {
    it('deve validar o body com sucesso', () => {
      // Arrange
      const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
      });

      req.body = {
        name: 'João Silva',
        email: 'joao.silva@example.com',
      };

      const middleware = ValidationMiddleware.validateBody(schema);

      // Act
      middleware(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('deve retornar erro 400 quando o body é inválido', () => {
      // Arrange
      const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
      });

      req.body = {
        name: 'João Silva',
        email: 'email-invalido',
      };

      const middleware = ValidationMiddleware.validateBody(schema);

      // Act
      middleware(req, res, next);

      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: expect.stringContaining('"email" must be a valid email'),
      });
    });

    it('deve retornar erro 400 quando campos obrigatórios estão faltando', () => {
      // Arrange
      const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
      });

      req.body = {
        name: 'João Silva',
      };

      const middleware = ValidationMiddleware.validateBody(schema);

      // Act
      middleware(req, res, next);

      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: expect.stringContaining('"email" is required'),
      });
    });
  });

  describe('validateParams', () => {
    it('deve validar os params com sucesso', () => {
      // Arrange
      const schema = Joi.object({
        id: Joi.string().required(),
      });

      req.params = {
        id: '123',
      };

      const middleware = ValidationMiddleware.validateParams(schema);

      // Act
      middleware(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('deve retornar erro 400 quando os params são inválidos', () => {
      // Arrange
      const schema = Joi.object({
        id: Joi.number().required(),
      });

      req.params = {
        id: 'abc',
      };

      const middleware = ValidationMiddleware.validateParams(schema);

      // Act
      middleware(req, res, next);

      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: expect.stringContaining('"id" must be a number'),
      });
    });
  });

  describe('validateQuery', () => {
    it('deve validar a query com sucesso', () => {
      // Arrange
      const schema = Joi.object({
        page: Joi.number().min(1),
        limit: Joi.number().min(1),
      });

      req.query = {
        page: '1',
        limit: '10',
      };

      const middleware = ValidationMiddleware.validateQuery(schema);

      // Act
      middleware(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('deve retornar erro 400 quando a query é inválida', () => {
      // Arrange
      const schema = Joi.object({
        page: Joi.number().min(1),
        limit: Joi.number().min(1),
      });

      req.query = {
        page: '0',
        limit: '-1',
      };

      const middleware = ValidationMiddleware.validateQuery(schema);

      // Act
      middleware(req, res, next);

      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: expect.stringContaining('"page" must be greater than or equal to 1'),
      });
    });
  });

  describe('validateAll', () => {
    it('deve validar body, params e query com sucesso', () => {
      // Arrange
      const schema = {
        body: Joi.object({
          name: Joi.string().required(),
        }),
        params: Joi.object({
          id: Joi.string().required(),
        }),
        query: Joi.object({
          page: Joi.number().min(1),
        }),
      };

      req.body = { name: 'João Silva' };
      req.params = { id: '123' };
      req.query = { page: '1' };

      const middleware = ValidationMiddleware.validateAll(schema);

      // Act
      middleware(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('deve retornar erro 400 quando qualquer parte é inválida', () => {
      // Arrange
      const schema = {
        body: Joi.object({
          name: Joi.string().required(),
        }),
        params: Joi.object({
          id: Joi.string().required(),
        }),
        query: Joi.object({
          page: Joi.number().min(1),
        }),
      };

      req.body = { name: 123 }; // Inválido: nome deve ser string
      req.params = { id: '123' };
      req.query = { page: '1' };

      const middleware = ValidationMiddleware.validateAll(schema);

      // Act
      middleware(req, res, next);

      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: expect.stringContaining('"name" must be a string'),
      });
    });

    it('deve ignorar validações não especificadas', () => {
      // Arrange
      const schema = {
        body: Joi.object({
          name: Joi.string().required(),
        }),
      };

      req.body = { name: 'João Silva' };
      req.params = { id: 'invalid' };
      req.query = { page: 'invalid' };

      const middleware = ValidationMiddleware.validateAll(schema);

      // Act
      middleware(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
}); 