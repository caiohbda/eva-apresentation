const express = require("express");
const { validateParams } = require("../middlewares/validateRequest");
const { idParamSchema } = require("../validation/schemas");

const createJobRoutes = (jobController) => {
  const router = express.Router();

  router.get("/", jobController.getJobs);

  router.get("/:id", validateParams(idParamSchema), jobController.getJob);

  router.delete("/:id", validateParams(idParamSchema), jobController.removeJob);

  router.delete("/", jobController.clearJobs);

  return router;
};

module.exports = createJobRoutes;
