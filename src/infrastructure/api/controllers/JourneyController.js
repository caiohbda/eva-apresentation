const { Either } = require('fp-ts/Either');
const { pipe } = require('fp-ts/function');
const { Journey } = require('../../../domain/entities/Journey');
const { JourneyAction } = require('../../../domain/entities/JourneyAction');

const JourneyController = ({ journeyRepository }) => {
  const createJourney = async (req, res) => {
    const { name, description, actions } = req.body;

    // Cria as ações da jornada
    const journeyActions = actions.map((action, index) => 
      JourneyAction.withId(
        JourneyAction.create({
          type: action.type,
          config: action.config,
          delay: action.delay || 0,
          order: action.order || index + 1
        }),
        `action_${Date.now()}_${index}`
      )
    );

    // Cria a jornada com as ações
    const journey = Journey.create({
      name,
      description,
      actions: journeyActions
    });

    if (!Journey.isValid(journey)) {
      return res.status(400).json({ error: 'Dados da jornada inválidos' });
    }

    try {
      const savedJourney = await journeyRepository.save(journey);
      return res.status(201).json(savedJourney);
    } catch (error) {
      console.error('Error creating journey:', error);
      return res.status(500).json({ error: 'Erro ao criar jornada' });
    }
  };

  const getJourneys = async (req, res) => {
    try {
      const journeys = await journeyRepository.findAll();
      return res.status(200).json(journeys);
    } catch (error) {
      console.error('Error fetching journeys:', error);
      return res.status(500).json({ error: 'Erro ao buscar jornadas' });
    }
  };

  const getJourney = async (req, res) => {
    const { id } = req.params;

    try {
      const journey = await journeyRepository.findById(id);
      if (!journey) {
        return res.status(404).json({ error: 'Jornada não encontrada' });
      }
      return res.status(200).json(journey);
    } catch (error) {
      console.error('Error fetching journey:', error);
      return res.status(500).json({ error: 'Erro ao buscar jornada' });
    }
  };

  return {
    createJourney,
    getJourneys,
    getJourney
  };
};

module.exports = JourneyController; 