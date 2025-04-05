const { body, validationResult } = require('express-validator');

/**
 * Middleware para validar a requisição de associação de jornada a funcionário
 */
const validateAssociateJourney = [
  // Validação do ID do funcionário
  body('employeeId')
    .notEmpty()
    .withMessage('O ID do funcionário é obrigatório')
    .isMongoId()
    .withMessage('O ID do funcionário deve ser um ID MongoDB válido'),
  
  // Validação do ID da jornada
  body('journeyId')
    .notEmpty()
    .withMessage('O ID da jornada é obrigatório')
    .isMongoId()
    .withMessage('O ID da jornada deve ser um ID MongoDB válido'),
  
  // Middleware para verificar os resultados da validação
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateAssociateJourney
}; 