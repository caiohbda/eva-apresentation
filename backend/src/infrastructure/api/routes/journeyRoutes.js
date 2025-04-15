const express = require("express");
const {
  validateRequest,
  validateParams,
} = require("../middlewares/validateRequest");
const { createJourneySchema, idParamSchema } = require("../validation/schemas");

const createJourneyRoutes = (journeyController) => {
  const router = express.Router();

  router.post(
    "/",
    validateRequest(createJourneySchema),
    journeyController.createJourney
  );

  router.get("/", journeyController.getJourneys);

  router.get(
    "/:id",
    validateParams(idParamSchema),
    journeyController.getJourney
  );

  return router;
};

module.exports = createJourneyRoutes;
