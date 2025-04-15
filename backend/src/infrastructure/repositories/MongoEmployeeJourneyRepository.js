const mongoose = require("mongoose");
const { EmployeeJourney } = require("../../domain/entities/EmployeeJourney");

// Schema do MongoDB
const EmployeeJourneySchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Employee",
    },
    journeyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Journey",
    },
    startDate: { type: Date, required: true },
    status: {
      type: String,
      required: true,
      enum: ["pending", "in_progress", "completed"],
    },
    currentActionIndex: { type: Number, required: true, default: 0 },
    completedActions: [{ type: mongoose.Schema.Types.ObjectId }],
    actionSchedules: [
      {
        actionId: { type: mongoose.Schema.Types.ObjectId, required: true },
        scheduledTime: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

// Modelo do MongoDB
const EmployeeJourneyModel = mongoose.model(
  "EmployeeJourney",
  EmployeeJourneySchema
);

const MongoEmployeeJourneyRepository = () => {
  const save = async (employeeJourney) => {
    const employeeJourneyData = {
      employeeId: employeeJourney.employeeId,
      journeyId: employeeJourney.journeyId,
      startDate: employeeJourney.startDate,
      status: employeeJourney.status,
      currentActionIndex: employeeJourney.currentActionIndex,
      completedActions: employeeJourney.completedActions,
      actionSchedules: employeeJourney.actionSchedules,
    };

    const savedEmployeeJourney = await EmployeeJourneyModel.create(
      employeeJourneyData
    );
    return EmployeeJourney.withId(
      employeeJourney,
      savedEmployeeJourney._id.toString()
    );
  };

  const findById = async (id) => {
    const employeeJourney = await EmployeeJourneyModel.findById(id);
    if (!employeeJourney) return null;

    return EmployeeJourney.withId(
      {
        employeeId: employeeJourney.employeeId.toString(),
        journeyId: employeeJourney.journeyId.toString(),
        startDate: employeeJourney.startDate,
        status: employeeJourney.status,
        currentActionIndex: employeeJourney.currentActionIndex,
        completedActions: employeeJourney.completedActions.map((id) =>
          id.toString()
        ),
        actionSchedules: employeeJourney.actionSchedules.map((schedule) => ({
          actionId: schedule.actionId.toString(),
          scheduledTime: schedule.scheduledTime,
        })),
      },
      employeeJourney._id.toString()
    );
  };

  const findByEmployeeId = async (employeeId) => {
    const employeeJourneys = await EmployeeJourneyModel.find({ employeeId });
    return employeeJourneys.map((employeeJourney) =>
      EmployeeJourney.withId(
        {
          employeeId: employeeJourney.employeeId.toString(),
          journeyId: employeeJourney.journeyId.toString(),
          startDate: employeeJourney.startDate,
          status: employeeJourney.status,
          currentActionIndex: employeeJourney.currentActionIndex,
          completedActions: employeeJourney.completedActions.map((id) =>
            id.toString()
          ),
          actionSchedules: employeeJourney.actionSchedules.map((schedule) => ({
            actionId: schedule.actionId.toString(),
            scheduledTime: schedule.scheduledTime,
          })),
        },
        employeeJourney._id.toString()
      )
    );
  };

  const findByJourneyId = async (journeyId) => {
    const employeeJourneys = await EmployeeJourneyModel.find({ journeyId });
    return employeeJourneys.map((employeeJourney) =>
      EmployeeJourney.withId(
        {
          employeeId: employeeJourney.employeeId.toString(),
          journeyId: employeeJourney.journeyId.toString(),
          startDate: employeeJourney.startDate,
          status: employeeJourney.status,
          currentActionIndex: employeeJourney.currentActionIndex,
          completedActions: employeeJourney.completedActions.map((id) =>
            id.toString()
          ),
          actionSchedules: employeeJourney.actionSchedules.map((schedule) => ({
            actionId: schedule.actionId.toString(),
            scheduledTime: schedule.scheduledTime,
          })),
        },
        employeeJourney._id.toString()
      )
    );
  };

  const update = async (id, employeeJourney) => {
    const employeeJourneyData = {
      employeeId: employeeJourney.employeeId,
      journeyId: employeeJourney.journeyId,
      startDate: employeeJourney.startDate,
      status: employeeJourney.status,
      currentActionIndex: employeeJourney.currentActionIndex,
      completedActions: employeeJourney.completedActions,
      actionSchedules: employeeJourney.actionSchedules,
    };

    const updatedEmployeeJourney = await EmployeeJourneyModel.findByIdAndUpdate(
      id,
      employeeJourneyData,
      { new: true }
    );

    if (!updatedEmployeeJourney) return null;

    return EmployeeJourney.withId(
      employeeJourney,
      updatedEmployeeJourney._id.toString()
    );
  };

  const findPendingActions = async () => {
    const employeeJourneys = await EmployeeJourneyModel.find({
      status: { $in: ["pending", "in_progress"] },
    }).populate("journeyId");

    return employeeJourneys.map((employeeJourney) => ({
      id: employeeJourney._id.toString(),
      employeeId: employeeJourney.employeeId.toString(),
      journeyId: employeeJourney.journeyId.toString(),
      startDate: employeeJourney.startDate,
      status: employeeJourney.status,
      currentActionIndex: employeeJourney.currentActionIndex,
      completedActions: employeeJourney.completedActions.map((id) =>
        id.toString()
      ),
      actionSchedules: employeeJourney.actionSchedules.map((schedule) => ({
        actionId: schedule.actionId.toString(),
        scheduledTime: schedule.scheduledTime,
      })),
      journey: employeeJourney.journeyId,
    }));
  };

  return {
    save,
    findById,
    findByEmployeeId,
    findByJourneyId,
    update,
    findPendingActions,
  };
};

module.exports = MongoEmployeeJourneyRepository;
