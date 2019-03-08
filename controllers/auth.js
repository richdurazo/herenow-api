const User = require('../models/user');
const Counselor = require('../models/counselor');
const {
    validationResult
} = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const password = req.body.password;
    const bio = req.body.bio;
    bcrypt
        .hash(password, 12)
        .then(hashedPw => {
            const user = new User({
                email: email,
                password: hashedPw,
                first_name: first_name,
                last_name: last_name,
                bio: bio
            });
            return user.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'User Created!',
                userId: result._id
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        })

};

exports.counselorSignup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const password = req.body.password;
    const bio = req.body.bio;
    const imageUrl = req.body.imageUrl;
    const gender = req.body.gender;
    const skills = req.body.skills;
    const certifications = req.body.certifications;
    bcrypt
        .hash(password, 12)
        .then(hashedPw => {
            const counselor = new Counselor({
                email: email,
                password: hashedPw,
                first_name: first_name,
                last_name: last_name,
                bio: bio,
                imageUrl: imageUrl,
                gender: gender,
                skills: skills,
                certifications: certifications
            });
            return counselor.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'Counselor Created!',
                counselorId: result._id
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        })

};

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User
        .findOne({
            email: email
        })
        .then(user => {
            if (!user) {
                const error = new Error('A user with this email could not be found.');
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Incorrect password!')
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            }, `${process.env.SECRET}`, {
                expiresIn: '1h'
            }) //change this and put it in .env
            res.status(200).json({
                token: token,
                userId: loadedUser._id.toString()
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        })
}

exports.counselorLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedCounselor;
    Counselor
        .findOne({
            email: email
        })
        .then(counselor => {
            if (!counselor) {
                const error = new Error('A counselor with this email could not be found.');
                error.statusCode = 401;
                throw error;
            }
            loadedCounselor = counselor;
            return bcrypt.compare(password, counselor.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Incorrect password!')
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign({
                email: loadedCounselor.email,
                counselorId: loadedCounselor._id.toString()
            }, `${process.env.SECRET}`, {
                expiresIn: '1h'
            }) //change this and put it in .env
            res.status(200).json({
                token: token,
                counselorId: loadedCounselor._id.toString()
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        })
}