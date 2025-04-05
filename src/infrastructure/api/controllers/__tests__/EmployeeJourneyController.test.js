const EmployeeJourneyController = require('../EmployeeJourneyController');

describe('EmployeeJourneyController', () => {
  let mockAssociateJourneyToEmployee;
  let mockEmployeeJourneyRepository;
  let mockJourneyRepository;
  let mockJourneyActionQueue;
  let controller;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockAssociateJourneyToEmployee = jest.fn();
    mockEmployeeJourneyRepository = {
      findByEmployeeId: jest.fn()
    };
    mockJourneyRepository = {
      findById: jest.fn()
    };
    mockJourneyActionQueue = {
      addAction: jest.fn()
    };

    controller = EmployeeJourneyController({
      associateJourneyToEmployee: mockAssociateJourneyToEmployee,
      employeeJourneyRepository: mockEmployeeJourneyRepository,
      journeyRepository: mockJourneyRepository,
      journeyActionQueue: mockJourneyActionQueue
    });

    mockReq = {
      body: {},
      params: {}
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('associateJourney', () => {
    it('should successfully associate a journey to an employee', async () => {
      const employeeId = '123';
      const journeyId = '456';
      const startDate = '2024-03-20';
      const journey = {
        id: journeyId,
        actions: [
          { type: 'email', config: { to: 'test@example.com' } }
        ]
      };

      mockReq.body = { employeeId, journeyId, startDate };
      mockAssociateJourneyToEmployee.mockResolvedValue({
        id: '789',
        employeeId,
        journeyId,
        startDate: new Date(startDate),
        status: 'pending'
      });
      mockJourneyRepository.findById.mockResolvedValue(journey);

      await controller.associateJourney(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          id: '789',
          employeeId,
          journeyId,
          status: 'pending'
        })
      });
      expect(mockJourneyActionQueue.addAction).toHaveBeenCalled();
    });

    it('should handle errors when associating journey', async () => {
      const error = new Error('Test error');
      mockReq.body = { employeeId: '123', journeyId: '456', startDate: '2024-03-20' };
      mockAssociateJourneyToEmployee.mockRejectedValue(error);

      await controller.associateJourney(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: error.message
      });
    });
  });

  describe('getEmployeeJourneys', () => {
    it('should return employee journeys', async () => {
      const employeeId = '123';
      const journeys = [
        { id: '1', employeeId, journeyId: '456' },
        { id: '2', employeeId, journeyId: '789' }
      ];

      mockReq.params.employeeId = employeeId;
      mockEmployeeJourneyRepository.findByEmployeeId.mockResolvedValue(journeys);

      await controller.getEmployeeJourneys(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: journeys
      });
    });

    it('should handle errors when fetching journeys', async () => {
      const error = new Error('Test error');
      mockReq.params.employeeId = '123';
      mockEmployeeJourneyRepository.findByEmployeeId.mockRejectedValue(error);

      await controller.getEmployeeJourneys(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: error.message
      });
    });
  });
}); 