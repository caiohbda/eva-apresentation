const journeyService = require('../services/journeyService');

const journeyController = {
  async createJourney(req, res) {
    try {
      const { name, description, actions } = req.body;

      // Validar campos obrigatórios
      if (!name || !description || !actions || !Array.isArray(actions)) {
        return res.status(400).json({ error: 'Dados inválidos' });
      }

      // Validar ações
      for (const action of actions) {
        const { type, config } = action;

        if (!type || !config) {
          return res.status(400).json({ error: 'Configuração de ação inválida' });
        }

        // Validar campos específicos por tipo
        switch (type) {
          case 'email':
            if (!config.to || !config.subject || !config.body) {
              return res.status(400).json({ error: 'Campos obrigatórios faltando para ação de e-mail' });
            }
            break;
          case 'whatsapp':
            if (!config.to || !config.message) {
              return res.status(400).json({ error: 'Campos obrigatórios faltando para ação de WhatsApp' });
            }
            break;
          case 'api':
            if (!config.url || !config.method) {
              return res.status(400).json({ error: 'Campos obrigatórios faltando para ação de API' });
            }
            break;
          default:
            return res.status(400).json({ error: 'Tipo de ação inválido' });
        }
      }

      const journey = await journeyService.createJourney(req.body);
      res.status(201).json(journey);
    } catch (error) {
      console.error('Erro ao criar jornada:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async startEmployeeJourney(req, res) {
    try {
      const { employeeId, journeyId } = req.body;

      if (!employeeId || !journeyId) {
        return res.status(400).json({ error: 'employeeId e journeyId são obrigatórios' });
      }

      const employeeJourney = await journeyService.startEmployeeJourney(employeeId, journeyId);
      res.status(201).json(employeeJourney);
    } catch (error) {
      console.error('Erro ao iniciar jornada do funcionário:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async getJourneyById(req, res) {
    try {
      const { id } = req.params;
      const journey = await journeyService.getJourneyById(id);
      res.json(journey);
    } catch (error) {
      console.error('Erro ao buscar jornada:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async getEmployeeJourneyById(req, res) {
    try {
      const { id } = req.params;
      const employeeJourney = await journeyService.getEmployeeJourneyById(id);
      res.json(employeeJourney);
    } catch (error) {
      console.error('Erro ao buscar jornada do funcionário:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async listJourneys(req, res) {
    try {
      const journeys = await journeyService.listJourneys();
      res.json(journeys);
    } catch (error) {
      console.error('Erro ao listar jornadas:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async listEmployeeJourneys(req, res) {
    try {
      const { employeeId } = req.params;
      const employeeJourneys = await journeyService.listEmployeeJourneys(employeeId);
      res.json(employeeJourneys);
    } catch (error) {
      console.error('Erro ao listar jornadas do funcionário:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = journeyController; 