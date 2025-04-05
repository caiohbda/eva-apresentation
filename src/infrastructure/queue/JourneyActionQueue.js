const Queue = require('bull');
const { Either } = require('fp-ts/lib/Either');
const { pipe } = require('fp-ts/lib/function');

const createJourneyActionQueue = ({ 
  employeeJourneyRepository, 
  journeyRepository, 
  actionService,
  redisConfig 
}) => {
  const queue = new Queue('journey-actions', redisConfig);

  const processAction = async (job) => {
    const { employeeJourneyId, actionId } = job.data;

    const executeJourneyAction = require('../../application/use-cases/ExecuteJourneyAction');
    const useCase = executeJourneyAction({
      employeeJourneyRepository,
      journeyRepository,
      actionService
    });

    const result = await useCase({ employeeJourneyId, actionId });

    return pipe(
      result,
      Either.fold(
        error => {
          console.error(`Error executing action ${actionId}:`, error);
          throw error;
        },
        success => {
          console.log(`Action ${actionId} executed successfully`);
          return success;
        }
      )
    );
  };

  const scheduleAction = async (employeeJourneyId, actionId, delay) => {
    const job = await queue.add(
      { employeeJourneyId, actionId },
      { delay: delay * 60 * 1000 } // converte minutos para milissegundos
    );
    return job;
  };

  // Processa os jobs
  queue.process(processAction);

  return {
    scheduleAction,
    queue
  };
};

module.exports = createJourneyActionQueue; 