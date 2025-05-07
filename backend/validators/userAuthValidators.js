// middlewares/validators.js
const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

const validateRegister = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone')
    .isMobilePhone().withMessage('Valid phone number is required'),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin
};
