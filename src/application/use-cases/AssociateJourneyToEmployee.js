const { EmployeeJourney } = require('../../domain/entities/EmployeeJourney');

const AssociateJourneyToEmployee = ({ employeeRepository, journeyRepository, employeeJourneyRepository }) => {
  return async ({ employeeId, journeyId, startDate }) => {
    try {
      const employee = await employeeRepository.findById(employeeId);
      if (!employee) {
        throw new Error('Employee not found');
      }

      const journey = await journeyRepository.findById(journeyId);
      if (!journey) {
        throw new Error('Journey not found');
      }

      const employeeJourney = EmployeeJourney.create({
        employeeId,
        journeyId,
        startDate
      });

      if (!EmployeeJourney.isValid(employeeJourney)) {
        throw new Error('Invalid employee journey data');
      }

      const saved = await employeeJourneyRepository.save(employeeJourney);
      return saved;
    } catch (error) {
      throw error;
    }
  };
};

module.exports = AssociateJourneyToEmployee; 