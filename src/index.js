require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Repositories
const MongoEmployeeRepository = require('./infrastructure/repositories/MongoEmployeeRepository');
const MongoJourneyRepository = require('./infrastructure/repositories/MongoJourneyRepository');
const MongoEmployeeJourneyRepository = require('./infrastructure/repositories/MongoEmployeeJourneyRepository');

// Services
const JourneyActionQueue = require('./infrastructure/queue/JourneyActionQueue');

// Use Cases
const AssociateJourneyToEmployee = require('./application/use-cases/AssociateJourneyToEmployee');

// Controllers
const EmployeeController = require('./infrastructure/api/controllers/EmployeeController');
const JourneyController = require('./infrastructure/api/controllers/JourneyController');
const EmployeeJourneyController = require('./infrastructure/api/controllers/EmployeeJourneyController');
const JobController = require('./infrastructure/api/controllers/JobController');

// Routes
const createEmployeeRoutes = require('./infrastructure/api/routes/employeeRoutes');
const createJourneyRoutes = require('./infrastructure/api/routes/journeyRoutes');
const createEmployeeJourneyRoutes = require('./infrastructure/api/routes/employeeJourneyRoutes');
const createJobRoutes = require('./infrastructure/api/routes/jobRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Repositories
const employeeRepository = MongoEmployeeRepository();
const journeyRepository = MongoJourneyRepository();
const employeeJourneyRepository = MongoEmployeeJourneyRepository();

// Services
const journeyActionQueue = JourneyActionQueue();

// Use Cases
const associateJourneyToEmployee = AssociateJourneyToEmployee({
  employeeRepository,
  journeyRepository,
  employeeJourneyRepository
});

// Controllers
const employeeController = EmployeeController({
  employeeRepository
});

const journeyController = JourneyController({
  journeyRepository
});

const employeeJourneyController = EmployeeJourneyController({
  associateJourneyToEmployee,
  employeeJourneyRepository,
  journeyActionQueue
});

const jobController = JobController({
  journeyActionQueue
});

// Routes
app.use('/api/employees', createEmployeeRoutes(employeeController));
app.use('/api/journeys', createJourneyRoutes(journeyController));
app.use('/api/employee-journeys', createEmployeeJourneyRoutes(employeeJourneyController));
app.use('/api/jobs', createJobRoutes(jobController));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});