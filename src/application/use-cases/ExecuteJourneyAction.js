const { Either } = require('fp-ts/Either');
const { pipe } = require('fp-ts/function');
const { JourneyAction } = require('../../domain/entities/JourneyAction');
const { EmployeeJourney } = require('../../domain/entities/EmployeeJourney');

const ExecuteJourneyAction = ({ employeeJourneyRepository, journeyRepository, actionService }) => {
  const validateEmployeeJourney = async (employeeJourneyId) => {
    const employeeJourney = await employeeJourneyRepository.findById(employeeJourneyId);
    return employeeJourney ? Either.right(employeeJourney) : Either.left(new Error('Employee journey not found'));
  };

  const validateJourney = async (journeyId) => {
    const journey = await journeyRepository.findById(journeyId);
    return journey ? Either.right(journey) : Either.left(new Error('Journey not found'));
  };

  const executeAction = async (action, employee) => {
    try {
      if (JourneyAction.isEmail(action)) {
        await actionService.sendEmail({
          to: employee.email,
          ...action.config
        });
      } else if (JourneyAction.isWhatsApp(action)) {
        await actionService.sendWhatsApp({
          to: employee.phone,
          ...action.config
        });
      } else if (JourneyAction.isApi(action)) {
        await actionService.callApi(action.config);
      }
      return Either.right(action);
    } catch (error) {
      return Either.left(error);
    }
  };

  const updateEmployeeJourney = async (employeeJourney, actionId) => {
    try {
      const updated = EmployeeJourney.markActionAsCompleted(employeeJourney, actionId);
      const saved = await employeeJourneyRepository.update(employeeJourney.id, updated);
      return Either.right(saved);
    } catch (error) {
      return Either.left(error);
    }
  };

  return async ({ employeeJourneyId, actionId }) => {
    return pipe(
      await validateEmployeeJourney(employeeJourneyId),
      Either.chain(async (employeeJourney) => {
        const journey = await validateJourney(employeeJourney.journeyId);
        return journey.map(j => ({ employeeJourney, journey: j }));
      }),
      Either.chain(({ employeeJourney, journey }) => {
        const action = journey.actions.find(a => a.id === actionId);
        return action 
          ? Either.right({ employeeJourney, action })
          : Either.left(new Error('Action not found'));
      }),
      Either.chain(async ({ employeeJourney, action }) => {
        const executed = await executeAction(action, employeeJourney);
        return executed.map(() => ({ employeeJourney, action }));
      }),
      Either.chain(({ employeeJourney, action }) => 
        updateEmployeeJourney(employeeJourney, action.id)
      )
    );
  };
};

module.exports = ExecuteJourneyAction; 