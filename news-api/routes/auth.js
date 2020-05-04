const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const authController = require('../controllers/auth');
// const User = require('../models/User');

router.put('/signup', [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
            if (userDoc) {
                return Promise.reject('Email address alreay exists');
            }
        })
    })
    .normalizeEmail(),
    body('email')
    .trim()
    .isLength({ min: 5 }),
    body('name')
    .trim()
    .not()
    .isEmpty()
], authController.signup);

router.post('/login', authController.login);

module.exports = router;