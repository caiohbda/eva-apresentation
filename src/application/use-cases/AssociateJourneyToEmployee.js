const { EmployeeJourney } = require('../../domain/entities/EmployeeJourney');
const Either = require('fp-ts/Either');
const { pipe } = require('fp-ts/function');

const AssociateJourneyToEmployee = ({ employeeRepository, journeyRepository, employeeJourneyRepository }) => {
  const validateEmployee = async (employeeId) => {
    const employee = await employeeRepository.findById(employeeId);
    return employee ? Either.right(employee) : Either.left(new Error('Employee not found'));
  };

  const validateJourney = async (journeyId) => {
    const journey = await journeyRepository.findById(journeyId);
    return journey ? Either.right(journey) : Either.left(new Error('Journey not found'));
  };

  const createEmployeeJourney = (employeeId, journeyId, startDate) => {
    const employeeJourney = EmployeeJourney.create({
      employeeId,
      journeyId,
      startDate
    });

    return EmployeeJourney.isValid(employeeJourney)
      ? Either.right(employeeJourney)
      : Either.left(new Error('Invalid employee journey data'));
  };

  const saveEmployeeJourney = async (employeeJourney) => {
    try {
      const saved = await employeeJourneyRepository.save(employeeJourney);
      return Either.right(saved);
    } catch (error) {
      return Either.left(error);
    }
  };

  return async ({ employeeId, journeyId, startDate }) => {
    try {
      // Validar funcionário
      const employee = await employeeRepository.findById(employeeId);
      if (!employee) {
        return Either.left(new Error('Employee not found'));
      }

      // Validar jornada
      const journey = await journeyRepository.findById(journeyId);
      if (!journey) {
        return Either.left(new Error('Journey not found'));
      }

      // Criar associação
      const employeeJourney = EmployeeJourney.create({
        employeeId,
        journeyId,
        startDate
      });

      if (!EmployeeJourney.isValid(employeeJourney)) {
        return Either.left(new Error('Invalid employee journey data'));
      }

      // Salvar associação
      const saved = await employeeJourneyRepository.save(employeeJourney);
      return Either.right(saved);
    } catch (error) {
      return Either.left(error);
    }
  };
};

module.exports = AssociateJourneyToEmployee; 