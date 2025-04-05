const { setupActionProcessor } = require('../ActionProcessor');

describe('ActionProcessor', () => {
  let employeeJourneyRepository;
  let journeyRepository;
  let actionService;
  let journeyActionQueue;
  let processAction;

  beforeEach(() => {
    // Mock dos repositórios
    employeeJourneyRepository = {
      findById: jest.fn(),
      update: jest.fn()
    };

    journeyRepository = {
      findById: jest.fn()
    };

    // Mock do serviço de ações
    actionService = {
      sendEmail: jest.fn(),
      sendWhatsApp: jest.fn(),
      callApi: jest.fn()
    };

    // Mock da fila
    journeyActionQueue = {
      process: jest.fn()
    };

    // Configura o processador
    setupActionProcessor({
      employeeJourneyRepository,
      journeyRepository,
      actionService,
      journeyActionQueue
    });

    // Captura a função de processamento
    processAction = journeyActionQueue.process.mock.calls[0][0];
  });

  it('deve processar uma ação de email com sucesso', async () => {
    // Arrange
    const employeeJourneyId = 'employee-journey-1';
    const journeyId = 'journey-1';
    const actionId = 'action-1';
    
    const employeeJourney = {
      id: employeeJourneyId,
      employeeId: 'employee-1',
      journeyId,
      startDate: new Date(),
      status: 'pending',
      currentActionIndex: 0,
      completedActions: []
    };

    const journey = {
      id: journeyId,
      name: 'Test Journey',
      description: 'Test Description',
      actions: [
        {
          id: actionId,
          type: 'email',
          config: {
            to: 'test@example.com',
            subject: 'Test Subject',
            body: 'Test Body'
          },
          delay: 0,
          order: 1
        }
      ]
    };

    employeeJourneyRepository.findById.mockResolvedValue(employeeJourney);
    journeyRepository.findById.mockResolvedValue(journey);
    actionService.sendEmail.mockResolvedValue(true);
    employeeJourneyRepository.update.mockResolvedValue({
      ...employeeJourney,
      completedActions: [actionId],
      currentActionIndex: 1,
      status: 'completed'
    });

    // Act
    await processAction({
      data: {
        employeeJourneyId,
        actionId
      }
    });

    // Assert
    expect(employeeJourneyRepository.findById).toHaveBeenCalledWith(employeeJourneyId);
    expect(journeyRepository.findById).toHaveBeenCalledWith(journeyId);
    expect(actionService.sendEmail).toHaveBeenCalledWith(journey.actions[0].config);
    expect(employeeJourneyRepository.update).toHaveBeenCalledWith(
      employeeJourneyId,
      expect.objectContaining({
        completedActions: [actionId],
        currentActionIndex: 1,
        status: 'completed'
      })
    );
  });

  it('deve processar uma ação de WhatsApp com sucesso', async () => {
    // Arrange
    const employeeJourneyId = 'employee-journey-1';
    const journeyId = 'journey-1';
    const actionId = 'action-1';
    
    const employeeJourney = {
      id: employeeJourneyId,
      employeeId: 'employee-1',
      journeyId,
      startDate: new Date(),
      status: 'pending',
      currentActionIndex: 0,
      completedActions: []
    };

    const journey = {
      id: journeyId,
      name: 'Test Journey',
      description: 'Test Description',
      actions: [
        {
          id: actionId,
          type: 'whatsapp',
          config: {
            to: '1234567890',
            message: 'Test Message'
          },
          delay: 0,
          order: 1
        }
      ]
    };

    employeeJourneyRepository.findById.mockResolvedValue(employeeJourney);
    journeyRepository.findById.mockResolvedValue(journey);
    actionService.sendWhatsApp.mockResolvedValue(true);
    employeeJourneyRepository.update.mockResolvedValue({
      ...employeeJourney,
      completedActions: [actionId],
      currentActionIndex: 1,
      status: 'completed'
    });

    // Act
    await processAction({
      data: {
        employeeJourneyId,
        actionId
      }
    });

    // Assert
    expect(employeeJourneyRepository.findById).toHaveBeenCalledWith(employeeJourneyId);
    expect(journeyRepository.findById).toHaveBeenCalledWith(journeyId);
    expect(actionService.sendWhatsApp).toHaveBeenCalledWith(journey.actions[0].config);
    expect(employeeJourneyRepository.update).toHaveBeenCalledWith(
      employeeJourneyId,
      expect.objectContaining({
        completedActions: [actionId],
        currentActionIndex: 1,
        status: 'completed'
      })
    );
  });

  it('deve processar uma ação de API com sucesso', async () => {
    // Arrange
    const employeeJourneyId = 'employee-journey-1';
    const journeyId = 'journey-1';
    const actionId = 'action-1';
    
    const employeeJourney = {
      id: employeeJourneyId,
      employeeId: 'employee-1',
      journeyId,
      startDate: new Date(),
      status: 'pending',
      currentActionIndex: 0,
      completedActions: []
    };

    const journey = {
      id: journeyId,
      name: 'Test Journey',
      description: 'Test Description',
      actions: [
        {
          id: actionId,
          type: 'api',
          config: {
            url: 'https://api.example.com',
            method: 'POST',
            data: { key: 'value' }
          },
          delay: 0,
          order: 1
        }
      ]
    };

    employeeJourneyRepository.findById.mockResolvedValue(employeeJourney);
    journeyRepository.findById.mockResolvedValue(journey);
    actionService.callApi.mockResolvedValue(true);
    employeeJourneyRepository.update.mockResolvedValue({
      ...employeeJourney,
      completedActions: [actionId],
      currentActionIndex: 1,
      status: 'completed'
    });

    // Act
    await processAction({
      data: {
        employeeJourneyId,
        actionId
      }
    });

    // Assert
    expect(employeeJourneyRepository.findById).toHaveBeenCalledWith(employeeJourneyId);
    expect(journeyRepository.findById).toHaveBeenCalledWith(journeyId);
    expect(actionService.callApi).toHaveBeenCalledWith(journey.actions[0].config);
    expect(employeeJourneyRepository.update).toHaveBeenCalledWith(
      employeeJourneyId,
      expect.objectContaining({
        completedActions: [actionId],
        currentActionIndex: 1,
        status: 'completed'
      })
    );
  });

  it('não deve processar a ação se a jornada do funcionário não for encontrada', async () => {
    // Arrange
    const employeeJourneyId = 'employee-journey-1';
    const actionId = 'action-1';
    
    employeeJourneyRepository.findById.mockResolvedValue(null);

    // Act
    await processAction({
      data: {
        employeeJourneyId,
        actionId
      }
    });

    // Assert
    expect(employeeJourneyRepository.findById).toHaveBeenCalledWith(employeeJourneyId);
    expect(journeyRepository.findById).not.toHaveBeenCalled();
    expect(actionService.sendEmail).not.toHaveBeenCalled();
    expect(actionService.sendWhatsApp).not.toHaveBeenCalled();
    expect(actionService.callApi).not.toHaveBeenCalled();
    expect(employeeJourneyRepository.update).not.toHaveBeenCalled();
  });

  it('não deve processar a ação se a jornada não for encontrada', async () => {
    // Arrange
    const employeeJourneyId = 'employee-journey-1';
    const journeyId = 'journey-1';
    const actionId = 'action-1';
    
    const employeeJourney = {
      id: employeeJourneyId,
      employeeId: 'employee-1',
      journeyId,
      startDate: new Date(),
      status: 'pending',
      currentActionIndex: 0,
      completedActions: []
    };

    employeeJourneyRepository.findById.mockResolvedValue(employeeJourney);
    journeyRepository.findById.mockResolvedValue(null);

    // Act
    await processAction({
      data: {
        employeeJourneyId,
        actionId
      }
    });

    // Assert
    expect(employeeJourneyRepository.findById).toHaveBeenCalledWith(employeeJourneyId);
    expect(journeyRepository.findById).toHaveBeenCalledWith(journeyId);
    expect(actionService.sendEmail).not.toHaveBeenCalled();
    expect(actionService.sendWhatsApp).not.toHaveBeenCalled();
    expect(actionService.callApi).not.toHaveBeenCalled();
    expect(employeeJourneyRepository.update).not.toHaveBeenCalled();
  });

  it('não deve processar a ação se a ação não for encontrada na jornada', async () => {
    // Arrange
    const employeeJourneyId = 'employee-journey-1';
    const journeyId = 'journey-1';
    const actionId = 'non-existent-action';
    
    const employeeJourney = {
      id: employeeJourneyId,
      employeeId: 'employee-1',
      journeyId,
      startDate: new Date(),
      status: 'pending',
      currentActionIndex: 0,
      completedActions: []
    };

    const journey = {
      id: journeyId,
      name: 'Test Journey',
      description: 'Test Description',
      actions: [
        {
          id: 'action-1',
          type: 'email',
          config: {
            to: 'test@example.com',
            subject: 'Test Subject',
            body: 'Test Body'
          },
          delay: 0,
          order: 1
        }
      ]
    };

    employeeJourneyRepository.findById.mockResolvedValue(employeeJourney);
    journeyRepository.findById.mockResolvedValue(journey);

    // Act
    await processAction({
      data: {
        employeeJourneyId,
        actionId
      }
    });

    // Assert
    expect(employeeJourneyRepository.findById).toHaveBeenCalledWith(employeeJourneyId);
    expect(journeyRepository.findById).toHaveBeenCalledWith(journeyId);
    expect(actionService.sendEmail).not.toHaveBeenCalled();
    expect(actionService.sendWhatsApp).not.toHaveBeenCalled();
    expect(actionService.callApi).not.toHaveBeenCalled();
    expect(employeeJourneyRepository.update).not.toHaveBeenCalled();
  });

  it('não deve atualizar a jornada do funcionário se a execução da ação falhar', async () => {
    // Arrange
    const employeeJourneyId = 'employee-journey-1';
    const journeyId = 'journey-1';
    const actionId = 'action-1';
    
    const employeeJourney = {
      id: employeeJourneyId,
      employeeId: 'employee-1',
      journeyId,
      startDate: new Date(),
      status: 'pending',
      currentActionIndex: 0,
      completedActions: []
    };

    const journey = {
      id: journeyId,
      name: 'Test Journey',
      description: 'Test Description',
      actions: [
        {
          id: actionId,
          type: 'email',
          config: {
            to: 'test@example.com',
            subject: 'Test Subject',
            body: 'Test Body'
          },
          delay: 0,
          order: 1
        }
      ]
    };

    employeeJourneyRepository.findById.mockResolvedValue(employeeJourney);
    journeyRepository.findById.mockResolvedValue(journey);
    actionService.sendEmail.mockRejectedValue(new Error('Failed to send email'));

    // Act
    await processAction({
      data: {
        employeeJourneyId,
        actionId
      }
    });

    // Assert
    expect(employeeJourneyRepository.findById).toHaveBeenCalledWith(employeeJourneyId);
    expect(journeyRepository.findById).toHaveBeenCalledWith(journeyId);
    expect(actionService.sendEmail).toHaveBeenCalledWith(journey.actions[0].config);
    expect(employeeJourneyRepository.update).not.toHaveBeenCalled();
  });
}); 