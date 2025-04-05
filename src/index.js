require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Repositories
const MongoEmployeeRepository = require('./infrastructure/repositories/MongoEmployeeRepository');
const MongoJourneyRepository = require('./infrastructure/repositories/MongoJourneyRepository');
const MongoEmployeeJourneyRepository = require('./infrastructure/repositories/MongoEmployeeJourneyRepository');

// Use Cases
const AssociateJourneyToEmployee = require('./application/use-cases/AssociateJourneyToEmployee');

// Controllers
const EmployeeController = require('./infrastructure/api/controllers/EmployeeController');
const JourneyController = require('./infrastructure/api/controllers/JourneyController');
const EmployeeJourneyController = require('./infrastructure/api/controllers/EmployeeJourneyController');

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
  employeeJourneyRepository
});

// Routes
// Employee routes
app.post('/api/employees', employeeController.createEmployee);
app.get('/api/employees', employeeController.getEmployees);
app.get('/api/employees/:id', employeeController.getEmployee);

// Journey routes
app.post('/api/journeys', journeyController.createJourney);
app.get('/api/journeys', journeyController.getJourneys);
app.get('/api/journeys/:id', journeyController.getJourney);

// Employee Journey routes
app.post('/api/employee-journeys', employeeJourneyController.associateJourney);
app.get('/api/employee-journeys/:employeeId', employeeJourneyController.getEmployeeJourneys);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});