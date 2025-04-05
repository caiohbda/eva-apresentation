const AssociateJourneyToEmployee = require('../AssociateJourneyToEmployee');
const { EmployeeJourney } = require('../../../domain/entities/EmployeeJourney');

describe('AssociateJourneyToEmployee Use Case', () => {
  const mockEmployeeRepository = {
    findById: jest.fn()
  };

  const mockJourneyRepository = {
    findById: jest.fn()
  };

  const mockEmployeeJourneyRepository = {
    save: jest.fn()
  };

  const useCase = AssociateJourneyToEmployee({
    employeeRepository: mockEmployeeRepository,
    journeyRepository: mockJourneyRepository,
    employeeJourneyRepository: mockEmployeeJourneyRepository
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully associate a journey to an employee', async () => {
    const employeeId = '123';
    const journeyId = '456';
    const startDate = new Date();

    const employee = { id: employeeId, name: 'John Doe' };
    const journey = { id: journeyId, name: 'Onboarding' };
    const employeeJourney = {
      id: '789',
      employeeId,
      journeyId,
      startDate,
      status: 'pending'
    };

    mockEmployeeRepository.findById.mockResolvedValue(employee);
    mockJourneyRepository.findById.mockResolvedValue(journey);
    mockEmployeeJourneyRepository.save.mockResolvedValue(employeeJourney);

    const result = await useCase({ employeeId, journeyId, startDate });

    expect(result).toEqual(employeeJourney);
    expect(mockEmployeeRepository.findById).toHaveBeenCalledWith(employeeId);
    expect(mockJourneyRepository.findById).toHaveBeenCalledWith(journeyId);
    expect(mockEmployeeJourneyRepository.save).toHaveBeenCalled();
  });

  it('should throw error when employee not found', async () => {
    const employeeId = '123';
    const journeyId = '456';
    const startDate = new Date();

    mockEmployeeRepository.findById.mockResolvedValue(null);

    await expect(useCase({ employeeId, journeyId, startDate }))
      .rejects
      .toThrow('Employee not found');
  });

  it('should throw error when journey not found', async () => {
    const employeeId = '123';
    const journeyId = '456';
    const startDate = new Date();

    const employee = { id: employeeId, name: 'John Doe' };

    mockEmployeeRepository.findById.mockResolvedValue(employee);
    mockJourneyRepository.findById.mockResolvedValue(null);

    await expect(useCase({ employeeId, journeyId, startDate }))
      .rejects
      .toThrow('Journey not found');
  });

  it('should throw error when employee journey data is invalid', async () => {
    const employeeId = '123';
    const journeyId = '456';
    const startDate = new Date();

    const employee = { id: employeeId, name: 'John Doe' };
    const journey = { id: journeyId, name: 'Onboarding' };

    mockEmployeeRepository.findById.mockResolvedValue(employee);
    mockJourneyRepository.findById.mockResolvedValue(journey);

    // Mock EmployeeJourney.isValid to return false
    jest.spyOn(EmployeeJourney, 'isValid').mockReturnValue(false);

    await expect(useCase({ employeeId, journeyId, startDate }))
      .rejects
      .toThrow('Invalid employee journey data');

    // Restore original implementation
    jest.restoreAllMocks();
  });
}); 