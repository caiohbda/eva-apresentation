require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

const { journeyActionQueue } = require("./infrastructure/queue");
const MongoEmployeeRepository = require("./infrastructure/repositories/MongoEmployeeRepository");
const MongoJourneyRepository = require("./infrastructure/repositories/MongoJourneyRepository");
const MongoEmployeeJourneyRepository = require("./infrastructure/repositories/MongoEmployeeJourneyRepository");
const AssociateJourneyToEmployee = require("./application/use-cases/AssociateJourneyToEmployee");
const EmployeeController = require("./infrastructure/api/controllers/EmployeeController");
const JourneyController = require("./infrastructure/api/controllers/JourneyController");
const EmployeeJourneyController = require("./infrastructure/api/controllers/EmployeeJourneyController");
const JobController = require("./infrastructure/api/controllers/JobController");
const createEmployeeRoutes = require("./infrastructure/api/routes/employeeRoutes");
const createJourneyRoutes = require("./infrastructure/api/routes/journeyRoutes");
const createEmployeeJourneyRoutes = require("./infrastructure/api/routes/employeeJourneyRoutes");
const createJobRoutes = require("./infrastructure/api/routes/jobRoutes");
const routes = require("./infrastructure/api/routes");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const swaggerDocument = YAML.load(path.join(__dirname, "../api-docs.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const employeeRepository = MongoEmployeeRepository();
const journeyRepository = MongoJourneyRepository();
const employeeJourneyRepository = MongoEmployeeJourneyRepository();

const associateJourneyToEmployee = AssociateJourneyToEmployee({
  employeeRepository,
  journeyRepository,
  employeeJourneyRepository,
});
const employeeController = EmployeeController({
  employeeRepository,
});

const journeyController = JourneyController({
  journeyRepository,
});

const employeeJourneyController = EmployeeJourneyController({
  associateJourneyToEmployee,
  employeeJourneyRepository,
  journeyRepository,
  journeyActionQueue,
});

const jobController = JobController({
  journeyActionQueue,
});

app.use("/api/employees", createEmployeeRoutes(employeeController));
app.use("/api/journeys", createJourneyRoutes(journeyController));
app.use(
  "/api/employee-journeys",
  createEmployeeJourneyRoutes(employeeJourneyController)
);
app.use("/api/jobs", createJobRoutes(jobController));
app.use(routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(
    `Documentação da API disponível em: http://localhost:${port}/api-docs`
  );
});
