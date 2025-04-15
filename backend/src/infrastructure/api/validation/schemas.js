const Joi = require("joi");

// Schemas de parâmetros
const idParamSchema = Joi.object({
  id: Joi.string().required().hex().length(24).messages({
    "string.empty": "ID é obrigatório",
    "string.hex": "ID inválido",
    "string.length": "ID inválido",
  }),
});

const employeeIdParamSchema = Joi.object({
  employeeId: Joi.string().required().hex().length(24).messages({
    "string.empty": "ID do funcionário é obrigatório",
    "string.hex": "ID do funcionário inválido",
    "string.length": "ID do funcionário inválido",
  }),
});

// Schemas de corpo
const createEmployeeSchema = Joi.object({
  name: Joi.string().required().min(3).max(100).messages({
    "string.empty": "Nome é obrigatório",
    "string.min": "Nome deve ter no mínimo 3 caracteres",
    "string.max": "Nome deve ter no máximo 100 caracteres",
  }),
  email: Joi.string().required().email().messages({
    "string.empty": "E-mail é obrigatório",
    "string.email": "E-mail inválido",
  }),
  phone: Joi.string()
    .required()
    .pattern(/^\+[1-9]\d{1,14}$/)
    .messages({
      "string.empty": "Telefone é obrigatório",
      "string.pattern.base":
        "Telefone deve estar no formato internacional (ex: +5511999999999)",
    }),
  department: Joi.string().required().min(2).max(100).messages({
    "string.empty": "Departamento é obrigatório",
    "string.min": "Departamento deve ter no mínimo 2 caracteres",
    "string.max": "Departamento deve ter no máximo 100 caracteres",
  }),
  position: Joi.string().required().min(2).max(100).messages({
    "string.empty": "Cargo é obrigatório",
    "string.min": "Cargo deve ter no mínimo 2 caracteres",
    "string.max": "Cargo deve ter no máximo 100 caracteres",
  }),
});

const createJourneySchema = Joi.object({
  name: Joi.string().required().min(3).max(100).messages({
    "string.empty": "Nome é obrigatório",
    "string.min": "Nome deve ter no mínimo 3 caracteres",
    "string.max": "Nome deve ter no máximo 100 caracteres",
  }),
  description: Joi.string().required().min(10).max(500).messages({
    "string.empty": "Descrição é obrigatória",
    "string.min": "Descrição deve ter no mínimo 10 caracteres",
    "string.max": "Descrição deve ter no máximo 500 caracteres",
  }),
  actions: Joi.array()
    .required()
    .min(1)
    .items(
      Joi.object({
        type: Joi.string()
          .required()
          .valid("email", "whatsapp", "api")
          .messages({
            "string.empty": "Tipo da ação é obrigatório",
            "any.only": "Tipo da ação deve ser email, whatsapp ou api",
          }),
        description: Joi.string().required().min(5).max(200).messages({
          "string.empty": "Descrição da ação é obrigatória",
          "string.min": "Descrição da ação deve ter no mínimo 5 caracteres",
          "string.max": "Descrição da ação deve ter no máximo 200 caracteres",
        }),
        config: Joi.object()
          .required()
          .when("type", {
            is: "email",
            then: Joi.object({
              to: Joi.string().required().email().messages({
                "string.empty": "Destinatário é obrigatório",
                "string.email": "E-mail inválido",
              }),
              subject: Joi.string().required().min(3).max(100).messages({
                "string.empty": "Assunto é obrigatório",
                "string.min": "Assunto deve ter no mínimo 3 caracteres",
                "string.max": "Assunto deve ter no máximo 100 caracteres",
              }),
              body: Joi.string().required().min(10).messages({
                "string.empty": "Conteúdo é obrigatório",
                "string.min": "Conteúdo deve ter no mínimo 10 caracteres",
              }),
            }),
            is: "whatsapp",
            then: Joi.object({
              to: Joi.string()
                .required()
                .pattern(/^\+[1-9]\d{1,14}$/)
                .messages({
                  "string.empty": "Número é obrigatório",
                  "string.pattern.base":
                    "Número deve estar no formato internacional (ex: +5511999999999)",
                }),
              message: Joi.string().required().min(5).messages({
                "string.empty": "Mensagem é obrigatória",
                "string.min": "Mensagem deve ter no mínimo 5 caracteres",
              }),
            }),
            is: "api",
            then: Joi.object({
              url: Joi.string().required().uri().messages({
                "string.empty": "URL é obrigatória",
                "string.uri": "URL inválida",
              }),
              method: Joi.string()
                .required()
                .valid("GET", "POST", "PUT", "DELETE", "PATCH")
                .messages({
                  "string.empty": "Método é obrigatório",
                  "any.only": "Método deve ser GET, POST, PUT, DELETE ou PATCH",
                }),
              headers: Joi.object().optional().messages({
                "object.base": "Headers deve ser um objeto JSON",
              }),
              body: Joi.object().optional().messages({
                "object.base": "Body deve ser um objeto JSON",
              }),
            }),
          }),
      })
    )
    .messages({
      "array.base": "Ações é obrigatório",
      "array.min": "Deve haver pelo menos uma ação",
    }),
});

const associateJourneySchema = Joi.object({
  employeeId: Joi.string().required().hex().length(24).messages({
    "string.empty": "ID do funcionário é obrigatório",
    "string.hex": "ID do funcionário inválido",
    "string.length": "ID do funcionário inválido",
  }),
  journeyId: Joi.string().required().hex().length(24).messages({
    "string.empty": "ID da jornada é obrigatório",
    "string.hex": "ID da jornada inválido",
    "string.length": "ID da jornada inválido",
  }),
  startDate: Joi.date().iso().required().messages({
    "date.base": "Data de início inválida",
    "date.format": "Data de início deve estar no formato ISO",
    "any.required": "Data de início é obrigatória",
  }),
});

const createEmployeeJourneySchema = Joi.object({
  employeeId: Joi.string().required().hex().length(24).messages({
    "string.empty": "ID do funcionário é obrigatório",
    "string.hex": "ID do funcionário inválido",
    "string.length": "ID do funcionário inválido",
  }),
  journeyId: Joi.string().required().hex().length(24).messages({
    "string.empty": "ID da jornada é obrigatório",
    "string.hex": "ID da jornada inválido",
    "string.length": "ID da jornada inválido",
  }),
  startDate: Joi.date().iso().required().messages({
    "date.base": "Data de início inválida",
    "date.format": "Data de início deve estar no formato ISO",
    "any.required": "Data de início é obrigatória",
  }),
  status: Joi.string()
    .valid("pending", "in_progress", "completed")
    .default("pending")
    .messages({
      "any.only": "Status deve ser pending, in_progress ou completed",
    }),
  actionSchedules: Joi.array()
    .items(
      Joi.object({
        actionId: Joi.string().required().messages({
          "string.empty": "ID da ação é obrigatório",
        }),
        scheduledTime: Joi.string()
          .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
          .messages({
            "string.pattern.base": "Horário deve estar no formato HH:mm",
          }),
      })
    )
    .default([]),
});

module.exports = {
  idParamSchema,
  employeeIdParamSchema,
  createEmployeeSchema,
  createJourneySchema,
  associateJourneySchema,
  createEmployeeJourneySchema,
};
