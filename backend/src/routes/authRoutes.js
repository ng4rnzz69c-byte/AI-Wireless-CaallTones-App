const express = require('express');
const { body } = require('express-validator');
const { signup, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { authLimiter, apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Validation rules
const signupValidation = [
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Routes
router.post('/signup', authLimiter, signupValidation, validate, signup);
router.post('/login', authLimiter, loginValidation, validate, login);
router.get('/me', apiLimiter, protect, getMe);

module.exports = router;
