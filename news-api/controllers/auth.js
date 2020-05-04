// const fs = require('fs');
// const path = require('path');
const bcrypt = require('bcryptjs');

const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
// const User = mongoose.model('User');

exports.signup = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed, entered data is incorrect');

        error.statusCode = 422;

        throw error;
    }
    const { email, name, password } = req.body;

    bcrypt.hash(password, 12)
        .then(hashedPw => {
            const user = new User({
                email,
                password: hashedPw,
                name,
            });
            return user.save();
        })
        .then(result => {
            res
                .status(201)
                .json({
                    message: 'User created',
                    userId: result._id,
                });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }

            next(err);
        });
};

exports.login = async(req, res, next) => {
    const { email, password } = req.body;
    let loggedUser = null;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            const error = new Error('User with this email not found.');
    
            error.statusCode = 401;
    
            throw error;
        }
    
        loggedUser = user;
    
        const isEqual = await bcrypt.compare(password, user.password);
    
        if (!isEqual) {
            const error = new Error('Wrong Password or email.');
    
            error.statusCode = 401;
    
            throw error;
        }
    
        const token = jwt.sign({
            email: loggedUser.email,
            userId: loggedUser._id.toString(),
        }, process.env.SECRET, { expiresIn: '1h' });
    
        res.status(200).json({
            token,
            userId: loggedUser._id.toString()
        })
    
    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }

        next(err);
        return err;
    }

};