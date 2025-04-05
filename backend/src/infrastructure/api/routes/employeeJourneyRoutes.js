const express = require('express');
const { validateRequest, validateParams } = require('../middlewares/validateRequest');
const { associateJourneySchema, employeeIdParamSchema } = require('../validation/schemas');

const createEmployeeJourneyRoutes = (employeeJourneyController) => {
  const router = express.Router();

  router.post(
    '/',
    validateRequest(associateJourneySchema),
    employeeJourneyController.associateJourney
  );

  router.get(
    '/:employeeId',
    validateParams(employeeIdParamSchema),
    employeeJourneyController.getEmployeeJourneys
  );

  return router;
};

module.exports = createEmployeeJourneyRoutes; 