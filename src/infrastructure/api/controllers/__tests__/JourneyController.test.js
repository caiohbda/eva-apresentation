const { Either } = require('fp-ts/lib/Either');
const JourneyController = require('../JourneyController');
const CreateJourney = require('../../../application/use-cases/CreateJourney');
const GetJourney = require('../../../application/use-cases/GetJourney');
const UpdateJourney = require('../../../application/use-cases/UpdateJourney');
const DeleteJourney = require('../../../application/use-cases/DeleteJourney');

jest.mock('../../../application/use-cases/CreateJourney');
jest.mock('../../../application/use-cases/GetJourney');
jest.mock('../../../application/use-cases/UpdateJourney');
jest.mock('../../../application/use-cases/DeleteJourney');

describe('JourneyController', () => {
  let controller;
  let mockJourneyRepository;

  beforeEach(() => {
    mockJourneyRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    controller = new JourneyController(mockJourneyRepository);

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('createJourney', () => {
    it('deve criar uma jornada com sucesso', async () => {
      // Arrange
      const req = {
        body: {
          name: 'Onboarding Dev',
          description: 'Jornada de onboarding para desenvolvedores',
          actions: [
            {
              type: 'email',
              config: {
                subject: 'Bem-vindo!',
                body: 'Bem-vindo à equipe!',
                to: '{{employee.email}}',
              },
            },
          ],
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockJourney = {
        id: 'journey123',
        name: 'Onboarding Dev',
        description: 'Jornada de onboarding para desenvolvedores',
        actions: [
          {
            type: 'email',
            config: {
              subject: 'Bem-vindo!',
              body: 'Bem-vindo à equipe!',
              to: '{{employee.email}}',
            },
          },
        ],
      };

      CreateJourney.prototype.execute.mockResolvedValue(
        Either.right(mockJourney)
      );

      // Act
      await controller.createJourney(req, res);

      // Assert
      expect(CreateJourney.prototype.execute).toHaveBeenCalledWith({
        name: 'Onboarding Dev',
        description: 'Jornada de onboarding para desenvolvedores',
        actions: [
          {
            type: 'email',
            config: {
              subject: 'Bem-vindo!',
              body: 'Bem-vindo à equipe!',
              to: '{{employee.email}}',
            },
          },
        ],
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockJourney);
    });

    it('deve retornar erro 400 quando a criação falha', async () => {
      // Arrange
      const req = {
        body: {
          name: 'Onboarding Dev',
          description: 'Jornada de onboarding para desenvolvedores',
          actions: [
            {
              type: 'email',
              config: {
                subject: 'Bem-vindo!',
                body: 'Bem-vindo à equipe!',
                to: '{{employee.email}}',
              },
            },
          ],
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const error = new Error('Erro ao criar jornada');
      CreateJourney.prototype.execute.mockResolvedValue(
        Either.left(error)
      );

      // Act
      await controller.createJourney(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro ao criar jornada',
      });
    });
  });

  describe('getJourney', () => {
    it('deve retornar uma jornada com sucesso', async () => {
      // Arrange
      const req = {
        params: {
          id: 'journey123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockJourney = {
        id: 'journey123',
        name: 'Onboarding Dev',
        description: 'Jornada de onboarding para desenvolvedores',
        actions: [
          {
            type: 'email',
            config: {
              subject: 'Bem-vindo!',
              body: 'Bem-vindo à equipe!',
              to: '{{employee.email}}',
            },
          },
        ],
      };

      GetJourney.prototype.execute.mockResolvedValue(
        Either.right(mockJourney)
      );

      // Act
      await controller.getJourney(req, res);

      // Assert
      expect(GetJourney.prototype.execute).toHaveBeenCalledWith('journey123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockJourney);
    });

    it('deve retornar erro 404 quando a jornada não é encontrada', async () => {
      // Arrange
      const req = {
        params: {
          id: 'journey123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const error = new Error('Jornada não encontrada');
      GetJourney.prototype.execute.mockResolvedValue(
        Either.left(error)
      );

      // Act
      await controller.getJourney(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Jornada não encontrada',
      });
    });
  });

  describe('getAllJourneys', () => {
    it('deve retornar todas as jornadas com sucesso', async () => {
      // Arrange
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockJourneys = [
        {
          id: 'journey123',
          name: 'Onboarding Dev',
          description: 'Jornada de onboarding para desenvolvedores',
          actions: [
            {
              type: 'email',
              config: {
                subject: 'Bem-vindo!',
                body: 'Bem-vindo à equipe!',
                to: '{{employee.email}}',
              },
            },
          ],
        },
        {
          id: 'journey456',
          name: 'Onboarding Designer',
          description: 'Jornada de onboarding para designers',
          actions: [
            {
              type: 'email',
              config: {
                subject: 'Bem-vindo!',
                body: 'Bem-vindo à equipe de design!',
                to: '{{employee.email}}',
              },
            },
          ],
        },
      ];

      mockJourneyRepository.findAll.mockResolvedValue(mockJourneys);

      // Act
      await controller.getAllJourneys(req, res);

      // Assert
      expect(mockJourneyRepository.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockJourneys);
    });

    it('deve retornar erro 500 quando falha ao buscar jornadas', async () => {
      // Arrange
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mockJourneyRepository.findAll.mockRejectedValue(
        new Error('Erro ao buscar jornadas')
      );

      // Act
      await controller.getAllJourneys(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro ao buscar jornadas',
      });
    });
  });

  describe('updateJourney', () => {
    it('deve atualizar uma jornada com sucesso', async () => {
      // Arrange
      const req = {
        params: {
          id: 'journey123',
        },
        body: {
          name: 'Onboarding Dev Atualizado',
          description: 'Jornada de onboarding para desenvolvedores atualizada',
          actions: [
            {
              type: 'email',
              config: {
                subject: 'Bem-vindo - Versão 2!',
                body: 'Bem-vindo à equipe! Versão atualizada.',
                to: '{{employee.email}}',
              },
            },
          ],
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockJourney = {
        id: 'journey123',
        name: 'Onboarding Dev Atualizado',
        description: 'Jornada de onboarding para desenvolvedores atualizada',
        actions: [
          {
            type: 'email',
            config: {
              subject: 'Bem-vindo - Versão 2!',
              body: 'Bem-vindo à equipe! Versão atualizada.',
              to: '{{employee.email}}',
            },
          },
        ],
      };

      UpdateJourney.prototype.execute.mockResolvedValue(
        Either.right(mockJourney)
      );

      // Act
      await controller.updateJourney(req, res);

      // Assert
      expect(UpdateJourney.prototype.execute).toHaveBeenCalledWith({
        id: 'journey123',
        name: 'Onboarding Dev Atualizado',
        description: 'Jornada de onboarding para desenvolvedores atualizada',
        actions: [
          {
            type: 'email',
            config: {
              subject: 'Bem-vindo - Versão 2!',
              body: 'Bem-vindo à equipe! Versão atualizada.',
              to: '{{employee.email}}',
            },
          },
        ],
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockJourney);
    });

    it('deve retornar erro 404 quando a jornada não é encontrada', async () => {
      // Arrange
      const req = {
        params: {
          id: 'journey123',
        },
        body: {
          name: 'Onboarding Dev Atualizado',
          description: 'Jornada de onboarding para desenvolvedores atualizada',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const error = new Error('Jornada não encontrada');
      UpdateJourney.prototype.execute.mockResolvedValue(
        Either.left(error)
      );

      // Act
      await controller.updateJourney(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Jornada não encontrada',
      });
    });
  });

  describe('deleteJourney', () => {
    it('deve deletar uma jornada com sucesso', async () => {
      // Arrange
      const req = {
        params: {
          id: 'journey123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      DeleteJourney.prototype.execute.mockResolvedValue(
        Either.right(true)
      );

      // Act
      await controller.deleteJourney(req, res);

      // Assert
      expect(DeleteJourney.prototype.execute).toHaveBeenCalledWith('journey123');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith();
    });

    it('deve retornar erro 404 quando a jornada não é encontrada', async () => {
      // Arrange
      const req = {
        params: {
          id: 'journey123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const error = new Error('Jornada não encontrada');
      DeleteJourney.prototype.execute.mockResolvedValue(
        Either.left(error)
      );

      // Act
      await controller.deleteJourney(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Jornada não encontrada',
      });
    });
  });
}); 