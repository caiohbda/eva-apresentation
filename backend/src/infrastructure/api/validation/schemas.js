const Joi = require('joi');

const associateJourneySchema = Joi.object({
  employeeId: Joi.string().required().hex().length(24).messages({
    'string.empty': 'ID do funcionário é obrigatório',
    'string.hex': 'ID do funcionário inválido',
    'string.length': 'ID do funcionário inválido'
  }),
  journeyId: Joi.string().required().hex().length(24).messages({
    'string.empty': 'ID da jornada é obrigatório',
    'string.hex': 'ID da jornada inválido',
    'string.length': 'ID da jornada inválido'
  }),
  startDate: Joi.date().iso().required().messages({
    'date.base': 'Data de início inválida',
    'date.format': 'Data de início deve estar no formato ISO',
    'any.required': 'Data de início é obrigatória'
  })
});

const employeeIdParamSchema = Joi.object({
  employeeId: Joi.string().required().hex().length(24).messages({
    'string.empty': 'ID do funcionário é obrigatório',
    'string.hex': 'ID do funcionário inválido',
    'string.length': 'ID do funcionário inválido'
  })
});

module.exports = {
  associateJourneySchema,
  employeeIdParamSchema
}; 