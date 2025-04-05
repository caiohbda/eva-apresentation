const Either = require('fp-ts/Either');
const { pipe } = require('fp-ts/function');

const EmployeeJourneyController = ({ 
  associateJourneyToEmployee,
  employeeJourneyRepository,
  journeyRepository,
  journeyActionQueue
}) => {
  const associateJourney = async (req, res) => {
    const { employeeId, journeyId, startDate } = req.body;

    try {
      const employeeJourney = await associateJourneyToEmployee({
        employeeId,
        journeyId,
        startDate: new Date(startDate)
      });

      // Busca a jornada para agendar as ações
      const journey = await journeyRepository.findById(journeyId);
      if (!journey) {
        throw new Error('Journey not found');
      }

      // Agenda as ações da jornada
      if (journey.actions && journey.actions.length > 0) {
        for (const action of journey.actions) {
          await journeyActionQueue.addAction(action, employeeJourney.id);
        }
      }

      return res.status(201).json({
        success: true,
        data: {
          id: employeeJourney.id,
          employeeId: employeeJourney.employeeId,
          journeyId: employeeJourney.journeyId,
          startDate: employeeJourney.startDate,
          status: employeeJourney.status,
          currentActionIndex: employeeJourney.currentActionIndex,
          completedActions: employeeJourney.completedActions
        }
      });
    } catch (error) {
      console.error('Error associating journey:', error);
      return res.status(500).json({ 
        success: false,
        error: error.message || 'Error associating journey'
      });
    }
  };

  const getEmployeeJourneys = async (req, res) => {
    const { employeeId } = req.params;

    try {
      const journeys = await employeeJourneyRepository.findByEmployeeId(employeeId);
      return res.status(200).json({
        success: true,
        data: journeys
      });
    } catch (error) {
      console.error('Error fetching employee journeys:', error);
      return res.status(500).json({ 
        success: false,
        error: error.message || 'Error fetching employee journeys'
      });
    }
  };

  return {
    associateJourney,
    getEmployeeJourneys
  };
};

module.exports = EmployeeJourneyController; 