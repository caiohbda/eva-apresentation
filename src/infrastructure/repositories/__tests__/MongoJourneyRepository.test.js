const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const MongoJourneyRepository = require('../MongoJourneyRepository');
const { Journey } = require('../../../domain/entities/Journey');
const { JourneyAction } = require('../../../domain/entities/JourneyAction');

describe('MongoJourneyRepository', () => {
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
    repository = new MongoJourneyRepository();
    await mongoose.connection.dropDatabase();
  });

  describe('save', () => {
    it('deve salvar uma jornada com sucesso', async () => {
      // Arrange
      const emailAction = JourneyAction.create({
        type: 'email',
        config: {
          subject: 'Bem-vindo!',
          body: 'Bem-vindo à equipe!',
          to: '{{employee.email}}',
        },
      });

      const journey = Journey.create({
        name: 'Onboarding Dev',
        description: 'Jornada de onboarding para desenvolvedores',
        actions: [emailAction],
      });

      // Act
      const savedJourney = await repository.save(journey);

      // Assert
      expect(savedJourney).toBeDefined();
      expect(savedJourney.id).toBeDefined();
      expect(savedJourney.name).toBe('Onboarding Dev');
      expect(savedJourney.description).toBe('Jornada de onboarding para desenvolvedores');
      expect(savedJourney.actions).toHaveLength(1);
      expect(savedJourney.actions[0].type).toBe('email');
      expect(savedJourney.actions[0].config).toEqual({
        subject: 'Bem-vindo!',
        body: 'Bem-vindo à equipe!',
        to: '{{employee.email}}',
      });
    });

    it('deve atualizar uma jornada existente', async () => {
      // Arrange
      const emailAction = JourneyAction.create({
        type: 'email',
        config: {
          subject: 'Bem-vindo!',
          body: 'Bem-vindo à equipe!',
          to: '{{employee.email}}',
        },
      });

      const journey = Journey.create({
        name: 'Onboarding Dev',
        description: 'Jornada de onboarding para desenvolvedores',
        actions: [emailAction],
      });

      const savedJourney = await repository.save(journey);

      const whatsappAction = JourneyAction.create({
        type: 'whatsapp',
        config: {
          message: 'Bem-vindo ao time!',
          to: '{{employee.phone}}',
        },
      });

      const updatedJourney = Journey.create({
        id: savedJourney.id,
        name: 'Onboarding Dev Atualizado',
        description: 'Jornada de onboarding atualizada',
        actions: [emailAction, whatsappAction],
      });

      // Act
      const result = await repository.save(updatedJourney);

      // Assert
      expect(result.id).toBe(savedJourney.id);
      expect(result.name).toBe('Onboarding Dev Atualizado');
      expect(result.description).toBe('Jornada de onboarding atualizada');
      expect(result.actions).toHaveLength(2);
      expect(result.actions[1].type).toBe('whatsapp');
    });
  });

  describe('findById', () => {
    it('deve encontrar uma jornada pelo ID', async () => {
      // Arrange
      const emailAction = JourneyAction.create({
        type: 'email',
        config: {
          subject: 'Bem-vindo!',
          body: 'Bem-vindo à equipe!',
          to: '{{employee.email}}',
        },
      });

      const journey = Journey.create({
        name: 'Onboarding Dev',
        description: 'Jornada de onboarding para desenvolvedores',
        actions: [emailAction],
      });

      const savedJourney = await repository.save(journey);

      // Act
      const foundJourney = await repository.findById(savedJourney.id);

      // Assert
      expect(foundJourney).toBeDefined();
      expect(foundJourney.id).toBe(savedJourney.id);
      expect(foundJourney.name).toBe('Onboarding Dev');
      expect(foundJourney.actions).toHaveLength(1);
      expect(foundJourney.actions[0].type).toBe('email');
    });

    it('deve retornar null quando a jornada não é encontrada', async () => {
      // Act
      const foundJourney = await repository.findById('non-existent-id');

      // Assert
      expect(foundJourney).toBeNull();
    });
  });

  describe('findAll', () => {
    it('deve retornar todas as jornadas', async () => {
      // Arrange
      const emailAction = JourneyAction.create({
        type: 'email',
        config: {
          subject: 'Bem-vindo!',
          body: 'Bem-vindo à equipe!',
          to: '{{employee.email}}',
        },
      });

      const journey1 = Journey.create({
        name: 'Onboarding Dev',
        description: 'Jornada de onboarding para desenvolvedores',
        actions: [emailAction],
      });

      const whatsappAction = JourneyAction.create({
        type: 'whatsapp',
        config: {
          message: 'Bem-vindo ao time!',
          to: '{{employee.phone}}',
        },
      });

      const journey2 = Journey.create({
        name: 'Onboarding Designer',
        description: 'Jornada de onboarding para designers',
        actions: [emailAction, whatsappAction],
      });

      await repository.save(journey1);
      await repository.save(journey2);

      // Act
      const journeys = await repository.findAll();

      // Assert
      expect(journeys).toHaveLength(2);
      expect(journeys[0].name).toBe('Onboarding Dev');
      expect(journeys[1].name).toBe('Onboarding Designer');
      expect(journeys[1].actions).toHaveLength(2);
    });

    it('deve retornar array vazio quando não há jornadas', async () => {
      // Act
      const journeys = await repository.findAll();

      // Assert
      expect(journeys).toHaveLength(0);
    });
  });

  describe('delete', () => {
    it('deve deletar uma jornada com sucesso', async () => {
      // Arrange
      const emailAction = JourneyAction.create({
        type: 'email',
        config: {
          subject: 'Bem-vindo!',
          body: 'Bem-vindo à equipe!',
          to: '{{employee.email}}',
        },
      });

      const journey = Journey.create({
        name: 'Onboarding Dev',
        description: 'Jornada de onboarding para desenvolvedores',
        actions: [emailAction],
      });

      const savedJourney = await repository.save(journey);

      // Act
      const result = await repository.delete(savedJourney.id);
      const foundJourney = await repository.findById(savedJourney.id);

      // Assert
      expect(result).toBe(true);
      expect(foundJourney).toBeNull();
    });

    it('deve retornar false quando tenta deletar jornada inexistente', async () => {
      // Act
      const result = await repository.delete('non-existent-id');

      // Assert
      expect(result).toBe(false);
    });
  });
}); 