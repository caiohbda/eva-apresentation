const { Either } = require('fp-ts/lib/Either');
const EmployeeController = require('../EmployeeController');
const CreateEmployee = require('../../../application/use-cases/CreateEmployee');
const GetEmployee = require('../../../application/use-cases/GetEmployee');
const UpdateEmployee = require('../../../application/use-cases/UpdateEmployee');
const DeleteEmployee = require('../../../application/use-cases/DeleteEmployee');

jest.mock('../../../application/use-cases/CreateEmployee');
jest.mock('../../../application/use-cases/GetEmployee');
jest.mock('../../../application/use-cases/UpdateEmployee');
jest.mock('../../../application/use-cases/DeleteEmployee');

describe('EmployeeController', () => {
  let controller;
  let mockEmployeeRepository;

  beforeEach(() => {
    mockEmployeeRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    controller = new EmployeeController(mockEmployeeRepository);

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('createEmployee', () => {
    it('deve criar um funcionário com sucesso', async () => {
      // Arrange
      const req = {
        body: {
          name: 'João Silva',
          email: 'joao.silva@example.com',
          phone: '11999999999',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockEmployee = {
        id: 'emp123',
        name: 'João Silva',
        email: 'joao.silva@example.com',
        phone: '11999999999',
      };

      CreateEmployee.prototype.execute.mockResolvedValue(
        Either.right(mockEmployee)
      );

      // Act
      await controller.createEmployee(req, res);

      // Assert
      expect(CreateEmployee.prototype.execute).toHaveBeenCalledWith({
        name: 'João Silva',
        email: 'joao.silva@example.com',
        phone: '11999999999',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockEmployee);
    });

    it('deve retornar erro 400 quando a criação falha', async () => {
      // Arrange
      const req = {
        body: {
          name: 'João Silva',
          email: 'joao.silva@example.com',
          phone: '11999999999',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const error = new Error('Email já cadastrado');
      CreateEmployee.prototype.execute.mockResolvedValue(
        Either.left(error)
      );

      // Act
      await controller.createEmployee(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Email já cadastrado',
      });
    });
  });

  describe('getEmployee', () => {
    it('deve retornar um funcionário com sucesso', async () => {
      // Arrange
      const req = {
        params: {
          id: 'emp123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockEmployee = {
        id: 'emp123',
        name: 'João Silva',
        email: 'joao.silva@example.com',
        phone: '11999999999',
      };

      GetEmployee.prototype.execute.mockResolvedValue(
        Either.right(mockEmployee)
      );

      // Act
      await controller.getEmployee(req, res);

      // Assert
      expect(GetEmployee.prototype.execute).toHaveBeenCalledWith('emp123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockEmployee);
    });

    it('deve retornar erro 404 quando o funcionário não é encontrado', async () => {
      // Arrange
      const req = {
        params: {
          id: 'emp123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const error = new Error('Funcionário não encontrado');
      GetEmployee.prototype.execute.mockResolvedValue(
        Either.left(error)
      );

      // Act
      await controller.getEmployee(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Funcionário não encontrado',
      });
    });
  });

  describe('getAllEmployees', () => {
    it('deve retornar todos os funcionários com sucesso', async () => {
      // Arrange
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockEmployees = [
        {
          id: 'emp123',
          name: 'João Silva',
          email: 'joao.silva@example.com',
          phone: '11999999999',
        },
        {
          id: 'emp456',
          name: 'Maria Santos',
          email: 'maria.santos@example.com',
          phone: '11988888888',
        },
      ];

      mockEmployeeRepository.findAll.mockResolvedValue(mockEmployees);

      // Act
      await controller.getAllEmployees(req, res);

      // Assert
      expect(mockEmployeeRepository.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockEmployees);
    });

    it('deve retornar erro 500 quando falha ao buscar funcionários', async () => {
      // Arrange
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mockEmployeeRepository.findAll.mockRejectedValue(
        new Error('Erro ao buscar funcionários')
      );

      // Act
      await controller.getAllEmployees(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro ao buscar funcionários',
      });
    });
  });

  describe('updateEmployee', () => {
    it('deve atualizar um funcionário com sucesso', async () => {
      // Arrange
      const req = {
        params: {
          id: 'emp123',
        },
        body: {
          name: 'João Silva Atualizado',
          phone: '11977777777',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockEmployee = {
        id: 'emp123',
        name: 'João Silva Atualizado',
        email: 'joao.silva@example.com',
        phone: '11977777777',
      };

      UpdateEmployee.prototype.execute.mockResolvedValue(
        Either.right(mockEmployee)
      );

      // Act
      await controller.updateEmployee(req, res);

      // Assert
      expect(UpdateEmployee.prototype.execute).toHaveBeenCalledWith({
        id: 'emp123',
        name: 'João Silva Atualizado',
        phone: '11977777777',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockEmployee);
    });

    it('deve retornar erro 404 quando o funcionário não é encontrado', async () => {
      // Arrange
      const req = {
        params: {
          id: 'emp123',
        },
        body: {
          name: 'João Silva Atualizado',
          phone: '11977777777',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const error = new Error('Funcionário não encontrado');
      UpdateEmployee.prototype.execute.mockResolvedValue(
        Either.left(error)
      );

      // Act
      await controller.updateEmployee(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Funcionário não encontrado',
      });
    });
  });

  describe('deleteEmployee', () => {
    it('deve deletar um funcionário com sucesso', async () => {
      // Arrange
      const req = {
        params: {
          id: 'emp123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      DeleteEmployee.prototype.execute.mockResolvedValue(
        Either.right(true)
      );

      // Act
      await controller.deleteEmployee(req, res);

      // Assert
      expect(DeleteEmployee.prototype.execute).toHaveBeenCalledWith('emp123');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith();
    });

    it('deve retornar erro 404 quando o funcionário não é encontrado', async () => {
      // Arrange
      const req = {
        params: {
          id: 'emp123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const error = new Error('Funcionário não encontrado');
      DeleteEmployee.prototype.execute.mockResolvedValue(
        Either.left(error)
      );

      // Act
      await controller.deleteEmployee(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Funcionário não encontrado',
      });
    });
  });
}); 