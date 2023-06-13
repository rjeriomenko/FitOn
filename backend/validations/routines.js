const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

const validateRoutineInput = [
    check('name')
      .exists({ checkFalsy: true })
      .isLength({ min: 1, max: 140 })
      .withMessage('Routine name must be between 1 and 140 characters'),
    handleValidationErrors
];

module.exports = validateRoutineInput;