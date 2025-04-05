const Either = require('fp-ts/Either');
const { pipe } = require('fp-ts/function');

const EmployeeJourneyController = ({ 
  associateJourneyToEmployee,
  employeeJourneyRepository,
  journeyActionQueue
}) => {
  const associateJourney = async (req, res) => {
    const { employeeId, journeyId, startDate } = req.body;

    const result = await associateJourneyToEmployee({
      employeeId,
      journeyId,
      startDate: new Date(startDate)
    });

    return pipe(
      result,
      Either.fold(
        error => {
          console.error('Error associating journey:', error);
          return res.status(400).json({ error: error.message });
        },
        async (employeeJourney) => {
          try {
            // Agenda as ações da jornada
            const journey = await employeeJourneyRepository.findById(employeeJourney.journeyId);
            if (journey && journey.actions) {
              journey.actions.forEach(action => {
                journeyActionQueue.add({
                  employeeJourneyId: employeeJourney.id,
                  actionId: action.id
                }, {
                  delay: action.delay || 0
                });
              });
            }

            return res.status(201).json({
              id: employeeJourney.id,
              employeeId: employeeJourney.employeeId,
              journeyId: employeeJourney.journeyId,
              startDate: employeeJourney.startDate,
              status: employeeJourney.status,
              currentActionIndex: employeeJourney.currentActionIndex,
              completedActions: employeeJourney.completedActions
            });
          } catch (error) {
            console.error('Error scheduling actions:', error);
            return res.status(500).json({ error: 'Error scheduling journey actions' });
          }
        }
      )
    );
  };

  const getEmployeeJourneys = async (req, res) => {
    const { employeeId } = req.params;

    try {
      const journeys = await employeeJourneyRepository.findByEmployeeId(employeeId);
      return res.status(200).json(journeys);
    } catch (error) {
      console.error('Error fetching employee journeys:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  return {
    associateJourney,
    getEmployeeJourneys
  };
};

module.exports = EmployeeJourneyController; 