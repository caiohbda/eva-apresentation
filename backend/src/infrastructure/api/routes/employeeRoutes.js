const express = require("express");
const {
  validateRequest,
  validateParams,
} = require("../middlewares/validateRequest");
const {
  createEmployeeSchema,
  idParamSchema,
} = require("../validation/schemas");

const createEmployeeRoutes = (employeeController) => {
  const router = express.Router();

  router.post(
    "/",
    validateRequest(createEmployeeSchema),
    employeeController.createEmployee
  );

  router.get("/", employeeController.getEmployees);

  router.get(
    "/:id",
    validateParams(idParamSchema),
    employeeController.getEmployee
  );

  return router;
};

module.exports = createEmployeeRoutes;
