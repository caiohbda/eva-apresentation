const InMemoryQueue = require("./InMemoryQueue");

const JourneyActionQueue = () => {
  const queue = InMemoryQueue();

  const addAction = async (action, employeeJourneyId) => {
    const job = await queue.addJob({
      type: action.type,
      config: action.config,
      delay: action.delay,
      order: action.order,
      employeeJourneyId,
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

  const getQueues = async () => {
    const jobs = await queue.getJobs();
    return jobs.map((job) => ({
      id: job.id,
      journeyId: job.data.employeeJourneyId,
      action: {
        type: job.data.type,
        config: job.data.config,
      },
      status: job.status,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    }));
  };

  return {
    addAction,
    getJobs,
    getJobById,
    removeJob,
    clearJobs,
    getQueues,
  };
};

module.exports = JourneyActionQueue;
