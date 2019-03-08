const express = require('express');
const {
    body
} = require('express-validator/check');

const User = require('../models/user');

const router = express.Router();

const authController = require('../controllers/auth');

router.put('/signup', [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, {
        req
    }) => {
        return User
            .findOne({
                email: value
            })
            .then(userDoc => {
                if (userDoc) {
                    return Promise.reject('E-mail address already exists!');
                }
            })
    })
    .normalizeEmail(),
    body('password')
    .trim()
    .isLength({
        min: 5
    }),
    body('first_name')
    .trim()
    .not()
    .isEmpty(),
    body('last_name')
    .trim()
    .not()
    .isEmpty(),
    body('bio')
    .trim()
    .not()
    .isEmpty()
], authController.signup);

router.put('/counselor/signup', [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, {
        req
    }) => {
        return User
            .findOne({
                email: value
            })
            .then(userDoc => {
                if (userDoc) {
                    return Promise.reject('E-mail address already exists!');
                }
            })
    })
    .normalizeEmail(),
    body('password')
    .trim()
    .isLength({
        min: 5
    }),
    body('first_name')
    .trim()
    .not()
    .isEmpty(),
    body('last_name')
    .trim()
    .not()
    .isEmpty(),
    body('bio')
    .trim()
    .not()
    .isEmpty()
], authController.counselorSignup);

router.post('/counselor/login', authController.counselorLogin)
router.post('/login', authController.login)

module.exports = router