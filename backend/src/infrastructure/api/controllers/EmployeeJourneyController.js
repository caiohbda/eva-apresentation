const { Either } = require("fp-ts/Either");
const { pipe } = require("fp-ts/function");
const { EmployeeJourney } = require("../../../domain/entities/EmployeeJourney");

const EmployeeJourneyController = ({
  associateJourneyToEmployee,
  employeeJourneyRepository,
  journeyRepository,
  journeyActionQueue,
}) => {
  const createEmployeeJourney = async (req, res) => {
    try {
      const { employeeId, journeyId, startDate, actionSchedules } = req.body;
      const employeeJourney = await associateJourneyToEmployee({
        employeeId,
        journeyId,
        startDate,
        actionSchedules,
      });

      const journey = await journeyRepository.findById(journeyId);
      if (!journey) {
        return res.status(404).json({ error: "Jornada não encontrada" });
      }

      if (journey.actions && journey.actions.length > 0) {
        await journeyActionQueue.addAction(
          journey.actions[0],
          employeeJourney.id
        );
      }

      res.status(201).json(employeeJourney);
    } catch (error) {
      console.error("Error creating employee journey:", error);
      res.status(500).json({ error: "Erro ao criar jornada do funcionário" });
    }
  };

  const getEmployeeJourneys = async (req, res) => {
    try {
      const { employeeId } = req.params;
      const journeys = await employeeJourneyRepository.findByEmployeeId(
        employeeId
      );
      res.status(200).json(journeys);
    } catch (error) {
      console.error("Error fetching employee journeys:", error);
      res
        .status(500)
        .json({ error: "Erro ao buscar jornadas dos funcionários" });
    }
  };

  const getEmployeeJourney = async (req, res) => {
    try {
      const { employeeId, journeyId } = req.params;
      const journey =
        await employeeJourneyRepository.findByEmployeeIdAndJourneyId(
          employeeId,
          journeyId
        );
      if (!journey) {
        return res
          .status(404)
          .json({ error: "Jornada do funcionário não encontrada" });
      }
      res.status(200).json(journey);
    } catch (error) {
      console.error("Error fetching employee journey:", error);
      res.status(500).json({ error: "Erro ao buscar jornada do funcionário" });
    }
  };

  return {
    createEmployeeJourney,
    getEmployeeJourneys,
    getEmployeeJourney,
  };
};

module.exports = EmployeeJourneyController;
