const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const employeeJourneyRoutes = require('./routes/employeeJourneyRoutes');

const app = express();
app.use(express.json());

// Carrega a documentação OpenAPI
const swaggerDocument = YAML.load(path.join(__dirname, '../../../api-docs.yaml'));

// Configura o Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas da API
app.use('/api', employeeJourneyRoutes);

module.exports = app; 