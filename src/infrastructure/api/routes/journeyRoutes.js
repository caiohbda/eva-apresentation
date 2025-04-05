const express = require('express');
const router = express.Router();

const createJourneyRoutes = (journeyController) => {
  router.post('/', journeyController.createJourney);
  router.get('/', journeyController.getJourneys);
  router.get('/:id', journeyController.getJourney);

  return router;
};

module.exports = createJourneyRoutes; 