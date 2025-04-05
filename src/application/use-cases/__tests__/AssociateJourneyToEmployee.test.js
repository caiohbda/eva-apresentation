const { Either } = require('fp-ts/lib/Either');
const createAssociateJourneyToEmployee = require('../AssociateJourneyToEmployee');

describe('AssociateJourneyToEmployee', () => {
  const mockEmployeeRepository = {
    findById: jest.fn()
  };

  const mockJourneyRepository = {
    findById: jest.fn()
  };

  const mockEmployeeJourneyRepository = {
    save: jest.fn()
  };

  const useCase = createAssociateJourneyToEmployee({
    employeeRepository: mockEmployeeRepository,
    journeyRepository: mockJourneyRepository,
    employeeJourneyRepository: mockEmployeeJourneyRepository
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully associate a journey to an employee', async () => {
    const employee = { id: 'employee1', name: 'John Doe' };
    const journey = { id: 'journey1', name: 'Onboarding' };
    const startDate = new Date();

    mockEmployeeRepository.findById.mockResolvedValue(employee);
    mockJourneyRepository.findById.mockResolvedValue(journey);
    mockEmployeeJourneyRepository.save.mockResolvedValue({
      id: 'ej1',
      employeeId: employee.id,
      journeyId: journey.id,
      startDate
    });

    const result = await useCase({
      employeeId: employee.id,
      journeyId: journey.id,
      startDate
    });

    expect(Either.isRight(result)).toBe(true);
    expect(mockEmployeeRepository.findById).toHaveBeenCalledWith(employee.id);
    expect(mockJourneyRepository.findById).toHaveBeenCalledWith(journey.id);
    expect(mockEmployeeJourneyRepository.save).toHaveBeenCalled();
  });

  it('should return error when employee is not found', async () => {
    mockEmployeeRepository.findById.mockResolvedValue(null);

    const result = await useCase({
      employeeId: 'nonexistent',
      journeyId: 'journey1',
      startDate: new Date()
    });

    expect(Either.isLeft(result)).toBe(true);
    expect(mockJourneyRepository.findById).not.toHaveBeenCalled();
    expect(mockEmployeeJourneyRepository.save).not.toHaveBeenCalled();
  });

  it('should return error when journey is not found', async () => {
    const employee = { id: 'employee1', name: 'John Doe' };
    mockEmployeeRepository.findById.mockResolvedValue(employee);
    mockJourneyRepository.findById.mockResolvedValue(null);

    const result = await useCase({
      employeeId: employee.id,
      journeyId: 'nonexistent',
      startDate: new Date()
    });

    expect(Either.isLeft(result)).toBe(true);
    expect(mockEmployeeJourneyRepository.save).not.toHaveBeenCalled();
  });

  it('should return error when save fails', async () => {
    const employee = { id: 'employee1', name: 'John Doe' };
    const journey = { id: 'journey1', name: 'Onboarding' };
    const startDate = new Date();

    mockEmployeeRepository.findById.mockResolvedValue(employee);
    mockJourneyRepository.findById.mockResolvedValue(journey);
    mockEmployeeJourneyRepository.save.mockRejectedValue(new Error('Save failed'));

    const result = await useCase({
      employeeId: employee.id,
      journeyId: journey.id,
      startDate
    });

    expect(Either.isLeft(result)).toBe(true);
  });
}); 