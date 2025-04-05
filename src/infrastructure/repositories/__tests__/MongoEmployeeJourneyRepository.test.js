const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const MongoEmployeeJourneyRepository = require('../MongoEmployeeJourneyRepository');
const { EmployeeJourney } = require('../../../domain/entities/EmployeeJourney');

describe('MongoEmployeeJourneyRepository', () => {
  let mongoServer;
  let repository;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    repository = new MongoEmployeeJourneyRepository();
    await mongoose.connection.dropDatabase();
  });

  describe('save', () => {
    it('deve salvar uma jornada de funcionário com sucesso', async () => {
      // Arrange
      const employeeJourney = EmployeeJourney.create({
        employeeId: 'emp123',
        journeyId: 'journey123',
        currentActionIndex: 0,
        status: 'in_progress',
      });

      // Act
      const savedEmployeeJourney = await repository.save(employeeJourney);

      // Assert
      expect(savedEmployeeJourney).toBeDefined();
      expect(savedEmployeeJourney.id).toBeDefined();
      expect(savedEmployeeJourney.employeeId).toBe('emp123');
      expect(savedEmployeeJourney.journeyId).toBe('journey123');
      expect(savedEmployeeJourney.currentActionIndex).toBe(0);
      expect(savedEmployeeJourney.status).toBe('in_progress');
    });

    it('deve atualizar uma jornada de funcionário existente', async () => {
      // Arrange
      const employeeJourney = EmployeeJourney.create({
        employeeId: 'emp123',
        journeyId: 'journey123',
        currentActionIndex: 0,
        status: 'in_progress',
      });

      const savedEmployeeJourney = await repository.save(employeeJourney);

      const updatedEmployeeJourney = EmployeeJourney.create({
        id: savedEmployeeJourney.id,
        employeeId: 'emp123',
        journeyId: 'journey123',
        currentActionIndex: 1,
        status: 'completed',
      });

      // Act
      const result = await repository.save(updatedEmployeeJourney);

      // Assert
      expect(result.id).toBe(savedEmployeeJourney.id);
      expect(result.currentActionIndex).toBe(1);
      expect(result.status).toBe('completed');
    });
  });

  describe('findById', () => {
    it('deve encontrar uma jornada de funcionário pelo ID', async () => {
      // Arrange
      const employeeJourney = EmployeeJourney.create({
        employeeId: 'emp123',
        journeyId: 'journey123',
        currentActionIndex: 0,
        status: 'in_progress',
      });

      const savedEmployeeJourney = await repository.save(employeeJourney);

      // Act
      const foundEmployeeJourney = await repository.findById(savedEmployeeJourney.id);

      // Assert
      expect(foundEmployeeJourney).toBeDefined();
      expect(foundEmployeeJourney.id).toBe(savedEmployeeJourney.id);
      expect(foundEmployeeJourney.employeeId).toBe('emp123');
      expect(foundEmployeeJourney.journeyId).toBe('journey123');
      expect(foundEmployeeJourney.currentActionIndex).toBe(0);
      expect(foundEmployeeJourney.status).toBe('in_progress');
    });

    it('deve retornar null quando a jornada de funcionário não é encontrada', async () => {
      // Act
      const foundEmployeeJourney = await repository.findById('non-existent-id');

      // Assert
      expect(foundEmployeeJourney).toBeNull();
    });
  });

  describe('findByEmployeeId', () => {
    it('deve encontrar todas as jornadas de um funcionário', async () => {
      // Arrange
      const employeeJourney1 = EmployeeJourney.create({
        employeeId: 'emp123',
        journeyId: 'journey123',
        currentActionIndex: 0,
        status: 'in_progress',
      });

      const employeeJourney2 = EmployeeJourney.create({
        employeeId: 'emp123',
        journeyId: 'journey456',
        currentActionIndex: 1,
        status: 'completed',
      });

      await repository.save(employeeJourney1);
      await repository.save(employeeJourney2);

      // Act
      const employeeJourneys = await repository.findByEmployeeId('emp123');

      // Assert
      expect(employeeJourneys).toHaveLength(2);
      expect(employeeJourneys[0].journeyId).toBe('journey123');
      expect(employeeJourneys[1].journeyId).toBe('journey456');
    });

    it('deve retornar array vazio quando o funcionário não tem jornadas', async () => {
      // Act
      const employeeJourneys = await repository.findByEmployeeId('emp123');

      // Assert
      expect(employeeJourneys).toHaveLength(0);
    });
  });

  describe('findByEmployeeIdAndJourneyId', () => {
    it('deve encontrar uma jornada específica de um funcionário', async () => {
      // Arrange
      const employeeJourney = EmployeeJourney.create({
        employeeId: 'emp123',
        journeyId: 'journey123',
        currentActionIndex: 0,
        status: 'in_progress',
      });

      await repository.save(employeeJourney);

      // Act
      const foundEmployeeJourney = await repository.findByEmployeeIdAndJourneyId('emp123', 'journey123');

      // Assert
      expect(foundEmployeeJourney).toBeDefined();
      expect(foundEmployeeJourney.employeeId).toBe('emp123');
      expect(foundEmployeeJourney.journeyId).toBe('journey123');
    });

    it('deve retornar null quando a combinação funcionário/jornada não existe', async () => {
      // Act
      const foundEmployeeJourney = await repository.findByEmployeeIdAndJourneyId('emp123', 'journey123');

      // Assert
      expect(foundEmployeeJourney).toBeNull();
    });
  });

  describe('findAll', () => {
    it('deve retornar todas as jornadas de funcionários', async () => {
      // Arrange
      const employeeJourney1 = EmployeeJourney.create({
        employeeId: 'emp123',
        journeyId: 'journey123',
        currentActionIndex: 0,
        status: 'in_progress',
      });

      const employeeJourney2 = EmployeeJourney.create({
        employeeId: 'emp456',
        journeyId: 'journey456',
        currentActionIndex: 1,
        status: 'completed',
      });

      await repository.save(employeeJourney1);
      await repository.save(employeeJourney2);

      // Act
      const employeeJourneys = await repository.findAll();

      // Assert
      expect(employeeJourneys).toHaveLength(2);
      expect(employeeJourneys[0].employeeId).toBe('emp123');
      expect(employeeJourneys[1].employeeId).toBe('emp456');
    });

    it('deve retornar array vazio quando não há jornadas de funcionários', async () => {
      // Act
      const employeeJourneys = await repository.findAll();

      // Assert
      expect(employeeJourneys).toHaveLength(0);
    });
  });

  describe('delete', () => {
    it('deve deletar uma jornada de funcionário com sucesso', async () => {
      // Arrange
      const employeeJourney = EmployeeJourney.create({
        employeeId: 'emp123',
        journeyId: 'journey123',
        currentActionIndex: 0,
        status: 'in_progress',
      });

      const savedEmployeeJourney = await repository.save(employeeJourney);

      // Act
      const result = await repository.delete(savedEmployeeJourney.id);
      const foundEmployeeJourney = await repository.findById(savedEmployeeJourney.id);

      // Assert
      expect(result).toBe(true);
      expect(foundEmployeeJourney).toBeNull();
    });

    it('deve retornar false quando tenta deletar jornada de funcionário inexistente', async () => {
      // Act
      const result = await repository.delete('non-existent-id');

      // Assert
      expect(result).toBe(false);
    });
  });
}); 