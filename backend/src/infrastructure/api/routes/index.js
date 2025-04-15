const express = require("express");
const router = express.Router();
const journeyRoutes = require("./journeyRoutes");
const employeeRoutes = require("./employeeRoutes");
const employeeJourneyRoutes = require("./employeeJourneyRoutes");
const queueRoutes = require("./queueRoutes");

router.use("/journeys", journeyRoutes);
router.use("/employees", employeeRoutes);
router.use("/employee-journeys", employeeJourneyRoutes);
router.use("/api", queueRoutes);

module.exports = router;
