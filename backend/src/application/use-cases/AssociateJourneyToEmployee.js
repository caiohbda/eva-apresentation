const { EmployeeJourney } = require("../../domain/entities/EmployeeJourney");

const AssociateJourneyToEmployee = ({
  employeeRepository,
  journeyRepository,
  employeeJourneyRepository,
}) => {
  return async ({ employeeId, journeyId, startDate, actionSchedules }) => {
    try {
      console.log("Buscando funcionário...", employeeId);
      const employee = await employeeRepository.findById(employeeId);
      if (!employee) {
        console.log("Funcionário não encontrado:", employeeId);
        throw new Error("Employee not found");
      }
      console.log("Funcionário encontrado:", employee);

      console.log("Buscando jornada...", journeyId);
      const journey = await journeyRepository.findById(journeyId);
      if (!journey) {
        console.log("Jornada não encontrada:", journeyId);
        throw new Error("Journey not found");
      }
      console.log("Jornada encontrada:", journey);

      console.log("Criando employeeJourney...", {
        employeeId,
        journeyId,
        startDate,
        actionSchedules,
      });
      const employeeJourney = EmployeeJourney.create({
        employeeId,
        journeyId,
        startDate,
        actionSchedules: actionSchedules || [],
      });

      console.log("Validando employeeJourney...");
      if (!EmployeeJourney.isValid(employeeJourney)) {
        console.log("Dados inválidos:", employeeJourney);
        throw new Error("Invalid employee journey data");
      }
      console.log("EmployeeJourney válido");

      console.log("Salvando employeeJourney...");
      const saved = await employeeJourneyRepository.save(employeeJourney);
      console.log("EmployeeJourney salvo:", saved);
      return saved;
    } catch (error) {
      console.error("Erro no caso de uso:", error);
      throw error;
    }
  };
};

module.exports = AssociateJourneyToEmployee;
