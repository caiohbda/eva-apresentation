const AssociateJourneyToEmployee = require('../AssociateJourneyToEmployee');

describe('AssociateJourneyToEmployee Use Case', () => {
  let mockEmployeeRepository;
  let mockJourneyRepository;
  let mockEmployeeJourneyRepository;
  let useCase;

  beforeEach(() => {
    mockEmployeeRepository = {
      findById: jest.fn()
    };

    mockJourneyRepository = {
      findById: jest.fn()
    };

    mockEmployeeJourneyRepository = {
      save: jest.fn()
    };

    useCase = AssociateJourneyToEmployee({
      employeeRepository: mockEmployeeRepository,
      journeyRepository: mockJourneyRepository,
      employeeJourneyRepository: mockEmployeeJourneyRepository
    });
  });

  it('should successfully associate a journey to an employee', async () => {
    const employeeId = '123';
    const journeyId = '456';
    const startDate = new Date('2024-03-20');

    mockEmployeeRepository.findById.mockResolvedValue({ id: employeeId });
    mockJourneyRepository.findById.mockResolvedValue({ id: journeyId });
    mockEmployeeJourneyRepository.save.mockResolvedValue({
      id: '789',
      employeeId,
      journeyId,
      startDate,
      status: 'pending'
    });

    const result = await useCase({ employeeId, journeyId, startDate });

    expect(result).toBeDefined();
    expect(result.employeeId).toBe(employeeId);
    expect(result.journeyId).toBe(journeyId);
    expect(result.startDate).toEqual(startDate);
    expect(result.status).toBe('pending');

    expect(mockEmployeeRepository.findById).toHaveBeenCalledWith(employeeId);
    expect(mockJourneyRepository.findById).toHaveBeenCalledWith(journeyId);
    expect(mockEmployeeJourneyRepository.save).toHaveBeenCalled();
  });

  it('should throw error when employee not found', async () => {
    const employeeId = '123';
    const journeyId = '456';
    const startDate = new Date('2024-03-20');

    mockEmployeeRepository.findById.mockResolvedValue(null);
    mockJourneyRepository.findById.mockResolvedValue({ id: journeyId });

    await expect(useCase({ employeeId, journeyId, startDate }))
      .rejects
      .toThrow('Employee not found');
  });

  it('should throw error when journey not found', async () => {
    const employeeId = '123';
    const journeyId = '456';
    const startDate = new Date('2024-03-20');

    mockEmployeeRepository.findById.mockResolvedValue({ id: employeeId });
    mockJourneyRepository.findById.mockResolvedValue(null);

    await expect(useCase({ employeeId, journeyId, startDate }))
      .rejects
      .toThrow('Journey not found');
  });
}); 