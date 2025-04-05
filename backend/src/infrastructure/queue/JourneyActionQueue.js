const InMemoryQueue = require('./InMemoryQueue');

const JourneyActionQueue = () => {
  const queue = InMemoryQueue();

  const addAction = async (action, employeeJourneyId) => {
    const job = await queue.addJob({
      type: action.type,
      config: action.config,
      delay: action.delay,
      order: action.order,
      employeeJourneyId
    });

    return job;
  };

  const getJobs = async (status) => {
    return queue.getJobs(status);
  };

  const getJobById = async (id) => {
    return queue.getJobById(id);
  };

  const removeJob = async (id) => {
    return queue.removeJob(id);
  };

  const clearJobs = async () => {
    return queue.clearJobs();
  };

  return {
    addAction,
    getJobs,
    getJobById,
    removeJob,
    clearJobs
  };
};

module.exports = JourneyActionQueue; 