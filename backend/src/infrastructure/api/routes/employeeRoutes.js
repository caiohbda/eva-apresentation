const express = require('express');
const router = express.Router();

const createEmployeeRoutes = (employeeController) => {
  router.post('/', employeeController.createEmployee);
  router.get('/', employeeController.getEmployees);
  router.get('/:id', employeeController.getEmployee);

  return router;
};

module.exports = createEmployeeRoutes; 