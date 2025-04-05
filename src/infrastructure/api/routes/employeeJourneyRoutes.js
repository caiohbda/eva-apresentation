const express = require('express');
const { body, param } = require('express-validator');
const { validateRequest } = require('../middlewares/validateRequest');

const createEmployeeJourneyRoutes = (employeeJourneyController) => {
  const router = express.Router();

  router.post(
    '/',
    [
      body('employeeId').isMongoId().withMessage('Invalid employee ID'),
      body('journeyId').isMongoId().withMessage('Invalid journey ID'),
      body('startDate').isISO8601().withMessage('Invalid start date'),
      validateRequest
    ],
    employeeJourneyController.associateJourney
  );

  router.get(
    '/:employeeId',
    [
      param('employeeId').isMongoId().withMessage('Invalid employee ID'),
      validateRequest
    ],
    employeeJourneyController.getEmployeeJourneys
  );

  return router;
};

module.exports = createEmployeeJourneyRoutes; 