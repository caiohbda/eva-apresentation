const EmployeeJourneyController = require("../EmployeeJourneyController");

describe("EmployeeJourneyController", () => {
  const mockAssociateJourneyToEmployee = jest.fn();
  const mockEmployeeJourneyRepository = {
    findByEmployeeId: jest.fn(),
  };
  const mockJourneyRepository = {
    findById: jest.fn(),
  };
  const mockJourneyActionQueue = {
    addAction: jest.fn(),
  };

  const controller = EmployeeJourneyController({
    associateJourneyToEmployee: mockAssociateJourneyToEmployee,
    employeeJourneyRepository: mockEmployeeJourneyRepository,
    journeyRepository: mockJourneyRepository,
    journeyActionQueue: mockJourneyActionQueue,
  });

  const mockReq = {
    body: {},
    params: {},
  };

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createEmployeeJourney", () => {
    it("should successfully associate a journey to an employee", async () => {
      const employeeId = "123";
      const journeyId = "456";
      const startDate = "2024-03-20";

      const employeeJourney = {
        id: "789",
        employeeId,
        journeyId,
        startDate: new Date(startDate),
        status: "pending",
        currentActionIndex: 0,
        completedActions: [],
      };

      const journey = {
        id: journeyId,
        name: "Onboarding",
        actions: [
          {
            type: "email",
            config: {
              to: "employee@example.com",
              subject: "Welcome!",
            },
          },
        ],
      };

      mockReq.body = { employeeId, journeyId, startDate };
      mockAssociateJourneyToEmployee.mockResolvedValue(employeeJourney);
      mockJourneyRepository.findById.mockResolvedValue(journey);
      mockJourneyActionQueue.addAction.mockResolvedValue();

      await controller.createEmployeeJourney(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(employeeJourney);
      expect(mockJourneyActionQueue.addAction).toHaveBeenCalledWith(
        journey.actions[0],
        employeeJourney.id
      );
    });

    it("should handle errors when associating journey", async () => {
      const error = new Error("Test error");
      mockAssociateJourneyToEmployee.mockRejectedValue(error);

      await controller.createEmployeeJourney(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Erro ao criar jornada do funcionário",
      });
    });

    it("should handle journey not found error", async () => {
      const employeeId = "123";
      const journeyId = "456";
      const startDate = "2024-03-20";

      const employeeJourney = {
        id: "789",
        employeeId,
        journeyId,
        startDate: new Date(startDate),
        status: "pending",
      };

      mockReq.body = { employeeId, journeyId, startDate };
      mockAssociateJourneyToEmployee.mockResolvedValue(employeeJourney);
      mockJourneyRepository.findById.mockResolvedValue(null);

      await controller.createEmployeeJourney(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Jornada não encontrada",
      });
    });

    it("should handle journey with no actions", async () => {
      const employeeId = "123";
      const journeyId = "456";
      const startDate = "2024-03-20";

      const employeeJourney = {
        id: "789",
        employeeId,
        journeyId,
        startDate: new Date(startDate),
        status: "pending",
      };

      const journey = {
        id: journeyId,
        name: "Onboarding",
        actions: [],
      };

      mockReq.body = { employeeId, journeyId, startDate };
      mockAssociateJourneyToEmployee.mockResolvedValue(employeeJourney);
      mockJourneyRepository.findById.mockResolvedValue(journey);

      await controller.createEmployeeJourney(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockJourneyActionQueue.addAction).not.toHaveBeenCalled();
    });
  });

  describe("getEmployeeJourneys", () => {
    it("should return employee journeys", async () => {
      const employeeId = "123";
      const journeys = [
        {
          id: "789",
          employeeId,
          journeyId: "456",
          startDate: new Date(),
          status: "pending",
        },
      ];

      mockReq.params = { employeeId };
      mockEmployeeJourneyRepository.findByEmployeeId.mockResolvedValue(
        journeys
      );

      await controller.getEmployeeJourneys(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(journeys);
    });

    it("should handle errors when fetching journeys", async () => {
      const error = new Error("Test error");
      mockEmployeeJourneyRepository.findByEmployeeId.mockRejectedValue(error);

      await controller.getEmployeeJourneys(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Erro ao buscar jornadas dos funcionários",
      });
    });
  });
});
