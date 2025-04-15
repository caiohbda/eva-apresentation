const createJobController = ({ journeyActionQueue }) => {
  const getJobs = async (req, res) => {
    try {
      const { status } = req.query;
      const jobs = await journeyActionQueue.getJobs(status);

      res.json({
        success: true,
        data: jobs,
      });
    } catch (error) {
      console.error("Error getting jobs:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Error getting jobs",
      });
    }
  };

  const getJob = async (req, res) => {
    try {
      const { id } = req.params;
      const job = await journeyActionQueue.getJobById(id);

      if (!job) {
        return res.status(404).json({
          success: false,
          error: "Job not found",
        });
      }

      res.json({
        success: true,
        data: job,
      });
    } catch (error) {
      console.error("Error getting job:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Error getting job",
      });
    }
  };

  const removeJob = async (req, res) => {
    try {
      const { id } = req.params;
      await journeyActionQueue.removeJob(id);

      res.json({
        success: true,
        message: "Job removed successfully",
      });
    } catch (error) {
      console.error("Error removing job:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Error removing job",
      });
    }
  };

  const clearJobs = async (req, res) => {
    try {
      await journeyActionQueue.clearJobs();

      res.json({
        success: true,
        message: "All jobs cleared successfully",
      });
    } catch (error) {
      console.error("Error clearing jobs:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Error clearing jobs",
      });
    }
  };

  return {
    getJobs,
    getJob,
    removeJob,
    clearJobs,
  };
};

module.exports = createJobController;
