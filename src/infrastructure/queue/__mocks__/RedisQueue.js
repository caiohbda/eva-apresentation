const RedisQueue = () => {
  const jobs = new Map();
  const processors = new Map();

  const add = async (data, opts = {}) => {
    const jobId = Date.now().toString();
    const job = {
      id: jobId,
      data,
      opts,
      timestamp: Date.now()
    };
    jobs.set(jobId, job);
    return job;
  };

  const process = (processor) => {
    processors.set('default', processor);
  };

  const getJob = async (jobId) => {
    return jobs.get(jobId);
  };

  const getJobs = async (states = ['waiting', 'active', 'completed', 'failed', 'delayed']) => {
    return Array.from(jobs.values());
  };

  const removeJob = async (jobId) => {
    return jobs.delete(jobId);
  };

  const clear = async () => {
    jobs.clear();
  };

  // Simula o processamento de jobs
  const processJobs = async () => {
    const processor = processors.get('default');
    if (!processor) return;

    for (const [jobId, job] of jobs) {
      if (!job.processed) {
        try {
          await processor(job);
          job.processed = true;
          job.status = 'completed';
        } catch (error) {
          job.status = 'failed';
          job.error = error.message;
        }
      }
    }
  };

  // Inicia o processamento periódico
  setInterval(processJobs, 1000);

  return {
    add,
    process,
    getJob,
    getJobs,
    removeJob,
    clear
  };
};

module.exports = RedisQueue; 