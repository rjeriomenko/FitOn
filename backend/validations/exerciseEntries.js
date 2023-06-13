const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

const validateExerciseEntryInput = [
    check('note')
      .isLength({ min: 1, max: 140 })
      .withMessage('Note must be between 1 and 140 characters'),
    handleValidationErrors
];

module.exports = validateExerciseEntryInput;