const InMemoryQueue = () => {
  let jobs = [];
  let jobIdCounter = 1;

  const addJob = (data) => {
    const job = {
      id: `job_${jobIdCounter++}`,
      data,
      status: "waiting",
      createdAt: new Date(),
      updatedAt: new Date(),
      attempts: 0,
      maxAttempts: 3,
      delay: data.delay || 0,
    };
    jobs.push(job);
    return job;
  };

  const getJobs = (status) => {
    if (status) {
      return jobs.filter((job) => job.status === status);
    }
    return jobs;
  };

  const getJobById = (id) => {
    return jobs.find((job) => job.id === id);
  };

  const removeJob = (id) => {
    jobs = jobs.filter((job) => job.id !== id);
  };

  const clearJobs = () => {
    jobs = [];
  };

  // Simula o processamento de jobs
  const simulateProcessing = () => {
    setInterval(() => {
      jobs.forEach((job) => {
        if (job.status === "waiting") {
          job.status = "active";
          job.updatedAt = new Date();

          // Simula o processamento
          setTimeout(() => {
            if (Math.random() > 0.2) {
              // 80% de chance de sucesso
              job.status = "completed";
            } else {
              job.status = "failed";
              job.attempts++;
            }
            job.updatedAt = new Date();
          }, 1000);
        }
      });
    }, 30000); // Verifica a cada 30 segundos
  };

  // Inicia a simulação
  simulateProcessing();

  return {
    addJob,
    getJobs,
    getJobById,
    removeJob,
    clearJobs,
  };
};

module.exports = InMemoryQueue;
