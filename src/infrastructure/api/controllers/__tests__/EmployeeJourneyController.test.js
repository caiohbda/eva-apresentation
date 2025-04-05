const { Either } = require('fp-ts/lib/Either');
const EmployeeJourneyController = require('../EmployeeJourneyController');
const AssociateJourneyToEmployee = require('../../../application/use-cases/AssociateJourneyToEmployee');
const ExecuteJourneyAction = require('../../../application/use-cases/ExecuteJourneyAction');

jest.mock('../../../application/use-cases/AssociateJourneyToEmployee');
jest.mock('../../../application/use-cases/ExecuteJourneyAction');

describe('EmployeeJourneyController', () => {
  let controller;
  let mockEmployeeJourneyRepository;
  let mockJourneyActionQueue;

  beforeEach(() => {
    mockEmployeeJourneyRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmployeeId: jest.fn(),
    };

    mockJourneyActionQueue = {
      add: jest.fn(),
    };

    controller = new EmployeeJourneyController(
      mockEmployeeJourneyRepository,
      mockJourneyActionQueue
    );

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('associateJourney', () => {
    it('deve associar uma jornada a um funcionário com sucesso', async () => {
      // Arrange
      const req = {
        body: {
          employeeId: 'employee123',
          journeyId: 'journey123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockEmployeeJourney = {
        id: 'ej123',
        employeeId: 'employee123',
        journeyId: 'journey123',
        currentActionIndex: 0,
        status: 'in_progress',
      };

      AssociateJourneyToEmployee.prototype.execute.mockResolvedValue(
        Either.right(mockEmployeeJourney)
      );

      // Act
      await controller.associateJourney(req, res);

      // Assert
      expect(AssociateJourneyToEmployee.prototype.execute).toHaveBeenCalledWith({
        employeeId: 'employee123',
        journeyId: 'journey123',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockEmployeeJourney);
    });

    it('deve retornar erro 400 quando a associação falha', async () => {
      // Arrange
      const req = {
        body: {
          employeeId: 'employee123',
          journeyId: 'journey123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const error = new Error('Falha na associação');
      AssociateJourneyToEmployee.prototype.execute.mockResolvedValue(
        Either.left(error)
      );

      // Act
      await controller.associateJourney(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Falha na associação',
      });
    });
  });

  describe('getEmployeeJourneys', () => {
    it('deve retornar as jornadas de um funcionário com sucesso', async () => {
      // Arrange
      const req = {
        params: {
          employeeId: 'employee123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockJourneys = [
        {
          id: 'ej123',
          employeeId: 'employee123',
          journeyId: 'journey123',
          currentActionIndex: 0,
          status: 'in_progress',
        },
      ];

      mockEmployeeJourneyRepository.findByEmployeeId.mockResolvedValue(mockJourneys);

      // Act
      await controller.getEmployeeJourneys(req, res);

      // Assert
      expect(mockEmployeeJourneyRepository.findByEmployeeId).toHaveBeenCalledWith('employee123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockJourneys);
    });

    it('deve retornar erro 500 quando falha ao buscar jornadas', async () => {
      // Arrange
      const req = {
        params: {
          employeeId: 'employee123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mockEmployeeJourneyRepository.findByEmployeeId.mockRejectedValue(
        new Error('Erro ao buscar jornadas')
      );

      // Act
      await controller.getEmployeeJourneys(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro ao buscar jornadas',
      });
    });
  });

  describe('executeAction', () => {
    it('deve executar uma ação com sucesso', async () => {
      // Arrange
      const req = {
        params: {
          employeeJourneyId: 'ej123',
          actionIndex: 0,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockResult = {
        success: true,
        message: 'Ação executada com sucesso',
      };

      ExecuteJourneyAction.prototype.execute.mockResolvedValue(
        Either.right(mockResult)
      );

      // Act
      await controller.executeAction(req, res);

      // Assert
      expect(ExecuteJourneyAction.prototype.execute).toHaveBeenCalledWith({
        employeeJourneyId: 'ej123',
        actionIndex: 0,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('deve retornar erro 400 quando a execução falha', async () => {
      // Arrange
      const req = {
        params: {
          employeeJourneyId: 'ej123',
          actionIndex: 0,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const error = new Error('Falha ao executar ação');
      ExecuteJourneyAction.prototype.execute.mockResolvedValue(
        Either.left(error)
      );

      // Act
      await controller.executeAction(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Falha ao executar ação',
      });
    });
  });
}); 