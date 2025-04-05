const { ErrorMiddleware } = require('../ErrorMiddleware');

describe('ErrorMiddleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('deve tratar erros com status code', () => {
    // Arrange
    const error = new Error('Recurso não encontrado');
    error.statusCode = 404;

    // Act
    ErrorMiddleware.handle(error, req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Recurso não encontrado',
    });
  });

  it('deve tratar erros sem status code como 500', () => {
    // Arrange
    const error = new Error('Erro interno do servidor');

    // Act
    ErrorMiddleware.handle(error, req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Erro interno do servidor',
    });
  });

  it('deve tratar erros de validação', () => {
    // Arrange
    const error = new Error('Erro de validação');
    error.statusCode = 400;
    error.validation = {
      field: 'email',
      message: 'Email inválido',
    };

    // Act
    ErrorMiddleware.handle(error, req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Erro de validação',
      validation: {
        field: 'email',
        message: 'Email inválido',
      },
    });
  });

  it('deve tratar erros com detalhes adicionais', () => {
    // Arrange
    const error = new Error('Erro de processamento');
    error.statusCode = 422;
    error.details = {
      reason: 'Dados inválidos',
      code: 'INVALID_DATA',
    };

    // Act
    ErrorMiddleware.handle(error, req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Erro de processamento',
      details: {
        reason: 'Dados inválidos',
        code: 'INVALID_DATA',
      },
    });
  });

  it('deve tratar erros em ambiente de desenvolvimento com stack trace', () => {
    // Arrange
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const error = new Error('Erro de desenvolvimento');
    error.stack = 'Error: Erro de desenvolvimento\n    at Test.js:1:1';

    // Act
    ErrorMiddleware.handle(error, req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Erro de desenvolvimento',
      stack: 'Error: Erro de desenvolvimento\n    at Test.js:1:1',
    });

    // Cleanup
    process.env.NODE_ENV = originalEnv;
  });

  it('não deve incluir stack trace em ambiente de produção', () => {
    // Arrange
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const error = new Error('Erro de produção');
    error.stack = 'Error: Erro de produção\n    at Test.js:1:1';

    // Act
    ErrorMiddleware.handle(error, req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Erro de produção',
    });
    expect(res.json).not.toHaveBeenCalledWith(
      expect.objectContaining({
        stack: expect.any(String),
      })
    );

    // Cleanup
    process.env.NODE_ENV = originalEnv;
  });

  it('deve tratar erros com múltiplos detalhes', () => {
    // Arrange
    const error = new Error('Erro com múltiplos detalhes');
    error.statusCode = 400;
    error.validation = {
      field: 'email',
      message: 'Email inválido',
    };
    error.details = {
      reason: 'Formato inválido',
      code: 'INVALID_FORMAT',
    };
    error.context = {
      requestId: '123',
      timestamp: new Date().toISOString(),
    };

    // Act
    ErrorMiddleware.handle(error, req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Erro com múltiplos detalhes',
      validation: {
        field: 'email',
        message: 'Email inválido',
      },
      details: {
        reason: 'Formato inválido',
        code: 'INVALID_FORMAT',
      },
      context: {
        requestId: '123',
        timestamp: expect.any(String),
      },
    });
  });

  it('deve tratar erros com mensagem de objeto', () => {
    // Arrange
    const error = {
      message: {
        code: 'CUSTOM_ERROR',
        description: 'Erro personalizado',
      },
      statusCode: 400,
    };

    // Act
    ErrorMiddleware.handle(error, req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 'CUSTOM_ERROR',
        description: 'Erro personalizado',
      },
    });
  });
}); 