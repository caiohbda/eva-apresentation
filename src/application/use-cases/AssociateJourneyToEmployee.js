const { EmployeeJourney } = require('../../domain/entities/EmployeeJourney');

const AssociateJourneyToEmployee = ({ employeeRepository, journeyRepository, employeeJourneyRepository }) => {
  return async ({ employeeId, journeyId, startDate }) => {
    try {
      // Validar funcionário
      const employee = await employeeRepository.findById(employeeId);
      if (!employee) {
        throw new Error('Employee not found');
      }

      // Validar jornada
      const journey = await journeyRepository.findById(journeyId);
      if (!journey) {
        throw new Error('Journey not found');
      }

      // Criar associação
      const employeeJourney = EmployeeJourney.create({
        employeeId,
        journeyId,
        startDate
      });

      if (!EmployeeJourney.isValid(employeeJourney)) {
        throw new Error('Invalid employee journey data');
      }

      // Salvar associação
      const saved = await employeeJourneyRepository.save(employeeJourney);
      return saved;
    } catch (error) {
      throw error;
    }
  };
};

module.exports = AssociateJourneyToEmployee; 