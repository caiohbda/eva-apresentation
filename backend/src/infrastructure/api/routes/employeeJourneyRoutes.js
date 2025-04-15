const express = require("express");
const {
  validateRequest,
  validateParams,
} = require("../middlewares/validateRequest");
const {
  createEmployeeJourneySchema,
  idParamSchema,
} = require("../validation/schemas");

const createEmployeeJourneyRoutes = (employeeJourneyController) => {
  const router = express.Router();

  router.post(
    "/",
    validateRequest(createEmployeeJourneySchema),
    employeeJourneyController.createEmployeeJourney
  );

  router.get("/", employeeJourneyController.getEmployeeJourneys);

  router.get(
    "/:id",
    validateParams(idParamSchema),
    employeeJourneyController.getEmployeeJourney
  );

  return router;
};

module.exports = createEmployeeJourneyRoutes;
