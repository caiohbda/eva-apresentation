const express = require('express');
const { body, param } = require('express-validator');
const { validateRequest } = require('../middlewares/validateRequest');

const createEmployeeJourneyRoutes = (controller) => {
  const router = express.Router();

  router.post(
    '/associate',
    [
      body('employeeId').isMongoId().withMessage('Invalid employee ID'),
      body('journeyId').isMongoId().withMessage('Invalid journey ID'),
      body('startDate').isISO8601().withMessage('Invalid start date'),
      validateRequest
    ],
    controller.associateJourney
  );

  router.get(
    '/employee/:employeeId',
    [
      param('employeeId').isMongoId().withMessage('Invalid employee ID'),
      validateRequest
    ],
    controller.getEmployeeJourneys
  );

  return router;
};

module.exports = createEmployeeJourneyRoutes; 