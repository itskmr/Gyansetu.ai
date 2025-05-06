const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const router = express.Router();

// Validation middleware
const signupValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email'),
  body('phone')
    .matches(/^\+[1-9]\d{1,14}$/)
    .withMessage('Please enter a valid phone number with country code (e.g., +1234567890)'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .isIn(['student', 'teacher', 'institute', 'parent'])
    .withMessage('Invalid role selected'),
  body('firstName')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('First name cannot be empty'),
  body('lastName')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Last name cannot be empty')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  body('role')
    .isIn(['student', 'teacher', 'institute', 'parent'])
    .withMessage('Invalid role selected')
];

// Routes
router.post('/signup', signupValidation, authController.signup);
router.post('/login', loginValidation, authController.login);

module.exports = router; 