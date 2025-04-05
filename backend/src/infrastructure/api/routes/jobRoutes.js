const express = require('express');
const router = express.Router();

const createJobRoutes = (jobController) => {
  router.get('/', jobController.getJobs);
  router.get('/:id', jobController.getJob);
  router.delete('/:id', jobController.removeJob);
  router.delete('/', jobController.clearJobs);

  return router;
};

module.exports = createJobRoutes; 