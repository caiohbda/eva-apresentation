const mongoose = require('mongoose');
const { Journey } = require('../../domain/entities/Journey');
const { JourneyAction } = require('../../domain/entities/JourneyAction');

// Schema do MongoDB para ações
const JourneyActionSchema = new mongoose.Schema({
  type: { type: String, required: true },
  config: { type: mongoose.Schema.Types.Mixed, required: true },
  delay: { type: Number, required: true },
  order: { type: Number, required: true }
});

// Schema do MongoDB para jornadas
const JourneySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  actions: [JourneyActionSchema]
}, { timestamps: true });

// Modelo do MongoDB
const JourneyModel = mongoose.model('Journey', JourneySchema);

const MongoJourneyRepository = () => {
  const save = async (journey) => {
    const journeyData = {
      name: journey.name,
      description: journey.description,
      actions: journey.actions.map(action => ({
        type: action.type,
        config: action.config,
        delay: action.delay,
        order: action.order
      }))
    };

    const savedJourney = await JourneyModel.create(journeyData);
    return Journey.withId(journey, savedJourney._id.toString());
  };

  const findById = async (id) => {
    const journey = await JourneyModel.findById(id);
    if (!journey) return null;
    
    return Journey.withId({
      name: journey.name,
      description: journey.description,
      actions: journey.actions.map(action => 
        JourneyAction.withId({
          type: action.type,
          config: action.config,
          delay: action.delay,
          order: action.order
        }, action._id.toString())
      )
    }, journey._id.toString());
  };

  const findAll = async () => {
    const journeys = await JourneyModel.find();
    return journeys.map(journey => 
      Journey.withId({
        name: journey.name,
        description: journey.description,
        actions: journey.actions.map(action => 
          JourneyAction.withId({
            type: action.type,
            config: action.config,
            delay: action.delay,
            order: action.order
          }, action._id.toString())
        )
      }, journey._id.toString())
    );
  };

  const update = async (id, journey) => {
    const journeyData = {
      name: journey.name,
      description: journey.description,
      actions: journey.actions.map(action => ({
        type: action.type,
        config: action.config,
        delay: action.delay,
        order: action.order
      }))
    };

    const updatedJourney = await JourneyModel.findByIdAndUpdate(
      id, 
      journeyData, 
      { new: true }
    );
    
    if (!updatedJourney) return null;
    
    return Journey.withId(journey, updatedJourney._id.toString());
  };

  const delete_ = async (id) => {
    const result = await JourneyModel.findByIdAndDelete(id);
    return !!result;
  };

  return {
    save,
    findById,
    findAll,
    update,
    delete: delete_
  };
};

module.exports = MongoJourneyRepository; 