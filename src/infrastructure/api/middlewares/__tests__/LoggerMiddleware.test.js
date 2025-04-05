const { LoggerMiddleware } = require('../LoggerMiddleware');
const winston = require('winston');

jest.mock('winston', () => ({
  createLogger: jest.fn().mockReturnValue({
    info: jest.fn(),
    error: jest.fn(),
  }),
  format: {
    combine: jest.fn(),
    timestamp: jest.fn(),
    json: jest.fn(),
  },
  transports: {
    Console: jest.fn(),
  },
}));

describe('LoggerMiddleware', () => {
  let req;
  let res;
  let next;
  let logger;

  beforeEach(() => {
    req = {
      method: 'GET',
      url: '/api/test',
      ip: '127.0.0.1',
      headers: {
        'user-agent': 'test-agent',
        'x-request-id': '123',
      },
      body: {},
    };

    res = {
      statusCode: 200,
      on: jest.fn(),
    };

    next = jest.fn();

    logger = winston.createLogger();
    LoggerMiddleware.logger = logger;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve registrar uma requisição bem-sucedida', () => {
    // Arrange
    const startTime = new Date();
    jest.spyOn(global, 'Date').mockImplementation(() => startTime);

    // Act
    LoggerMiddleware.handle(req, res, next);

    // Simula o fim da requisição
    const endTime = new Date(startTime.getTime() + 100);
    jest.spyOn(global, 'Date').mockImplementation(() => endTime);
    const [onFinishHandler] = res.on.mock.calls.find(call => call[0] === 'finish')[1];
    onFinishHandler();

    // Assert
    expect(logger.info).toHaveBeenCalledWith({
      method: 'GET',
      url: '/api/test',
      status: 200,
      ip: '127.0.0.1',
      userAgent: 'test-agent',
      requestId: '123',
      responseTime: 100,
    });
    expect(next).toHaveBeenCalled();
  });

  it('deve registrar uma requisição com erro', () => {
    // Arrange
    const startTime = new Date();
    jest.spyOn(global, 'Date').mockImplementation(() => startTime);
    res.statusCode = 500;

    // Act
    LoggerMiddleware.handle(req, res, next);

    // Simula o fim da requisição
    const endTime = new Date(startTime.getTime() + 100);
    jest.spyOn(global, 'Date').mockImplementation(() => endTime);
    const [onFinishHandler] = res.on.mock.calls.find(call => call[0] === 'finish')[1];
    onFinishHandler();

    // Assert
    expect(logger.error).toHaveBeenCalledWith({
      method: 'GET',
      url: '/api/test',
      status: 500,
      ip: '127.0.0.1',
      userAgent: 'test-agent',
      requestId: '123',
      responseTime: 100,
    });
    expect(next).toHaveBeenCalled();
  });

  it('deve registrar uma requisição com corpo', () => {
    // Arrange
    req.method = 'POST';
    req.body = { name: 'test' };
    const startTime = new Date();
    jest.spyOn(global, 'Date').mockImplementation(() => startTime);

    // Act
    LoggerMiddleware.handle(req, res, next);

    // Simula o fim da requisição
    const endTime = new Date(startTime.getTime() + 100);
    jest.spyOn(global, 'Date').mockImplementation(() => endTime);
    const [onFinishHandler] = res.on.mock.calls.find(call => call[0] === 'finish')[1];
    onFinishHandler();

    // Assert
    expect(logger.info).toHaveBeenCalledWith({
      method: 'POST',
      url: '/api/test',
      status: 200,
      ip: '127.0.0.1',
      userAgent: 'test-agent',
      requestId: '123',
      responseTime: 100,
      body: { name: 'test' },
    });
    expect(next).toHaveBeenCalled();
  });

  it('deve registrar uma requisição com query params', () => {
    // Arrange
    req.url = '/api/test?page=1&limit=10';
    req.query = { page: '1', limit: '10' };
    const startTime = new Date();
    jest.spyOn(global, 'Date').mockImplementation(() => startTime);

    // Act
    LoggerMiddleware.handle(req, res, next);

    // Simula o fim da requisição
    const endTime = new Date(startTime.getTime() + 100);
    jest.spyOn(global, 'Date').mockImplementation(() => endTime);
    const [onFinishHandler] = res.on.mock.calls.find(call => call[0] === 'finish')[1];
    onFinishHandler();

    // Assert
    expect(logger.info).toHaveBeenCalledWith({
      method: 'GET',
      url: '/api/test?page=1&limit=10',
      status: 200,
      ip: '127.0.0.1',
      userAgent: 'test-agent',
      requestId: '123',
      responseTime: 100,
      query: { page: '1', limit: '10' },
    });
    expect(next).toHaveBeenCalled();
  });

  it('deve registrar uma requisição com headers personalizados', () => {
    // Arrange
    req.headers['x-custom-header'] = 'custom-value';
    const startTime = new Date();
    jest.spyOn(global, 'Date').mockImplementation(() => startTime);

    // Act
    LoggerMiddleware.handle(req, res, next);

    // Simula o fim da requisição
    const endTime = new Date(startTime.getTime() + 100);
    jest.spyOn(global, 'Date').mockImplementation(() => endTime);
    const [onFinishHandler] = res.on.mock.calls.find(call => call[0] === 'finish')[1];
    onFinishHandler();

    // Assert
    expect(logger.info).toHaveBeenCalledWith({
      method: 'GET',
      url: '/api/test',
      status: 200,
      ip: '127.0.0.1',
      userAgent: 'test-agent',
      requestId: '123',
      responseTime: 100,
      headers: {
        'user-agent': 'test-agent',
        'x-request-id': '123',
        'x-custom-header': 'custom-value',
      },
    });
    expect(next).toHaveBeenCalled();
  });

  it('deve gerar um requestId quando não fornecido', () => {
    // Arrange
    delete req.headers['x-request-id'];
    const startTime = new Date();
    jest.spyOn(global, 'Date').mockImplementation(() => startTime);

    // Act
    LoggerMiddleware.handle(req, res, next);

    // Simula o fim da requisição
    const endTime = new Date(startTime.getTime() + 100);
    jest.spyOn(global, 'Date').mockImplementation(() => endTime);
    const [onFinishHandler] = res.on.mock.calls.find(call => call[0] === 'finish')[1];
    onFinishHandler();

    // Assert
    const logCall = logger.info.mock.calls[0][0];
    expect(logCall.requestId).toBeDefined();
    expect(logCall.requestId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(next).toHaveBeenCalled();
  });

  it('deve lidar com erros durante o registro', () => {
    // Arrange
    logger.info.mockImplementation(() => {
      throw new Error('Erro ao registrar');
    });
    const startTime = new Date();
    jest.spyOn(global, 'Date').mockImplementation(() => startTime);

    // Act
    LoggerMiddleware.handle(req, res, next);

    // Simula o fim da requisição
    const endTime = new Date(startTime.getTime() + 100);
    jest.spyOn(global, 'Date').mockImplementation(() => endTime);
    const [onFinishHandler] = res.on.mock.calls.find(call => call[0] === 'finish')[1];
    onFinishHandler();

    // Assert
    expect(logger.error).toHaveBeenCalledWith({
      message: 'Erro ao registrar log da requisição',
      error: expect.any(Error),
    });
    expect(next).toHaveBeenCalled();
  });
}); 