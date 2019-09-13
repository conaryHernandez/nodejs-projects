const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');
const User = require('../models/user');

const transporter = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key: ''
    }
}));


exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isLogin: true,
        pageStyles: ['forms', 'auth'],
        errorMessage: req.flash('error')
    });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        pageStyles: ['forms', 'auth'],
        isSignup: true,
        errorMessage: req.flash('error'),
        validationErrors: []
    });
};

exports.getReset = (req, res, next) => {
    res.render('auth/reset-password', {
        path: '/reset',
        pageTitle: 'Reset Password',
        pageStyles: ['forms', 'auth'],
        errorMessage: req.flash('error')
    });
};

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;

    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                pageStyles: ['forms', 'auth'],
                errorMessage: req.flash('error'),
                userId: user._id.toString(),
                passwordToken: token,
            });
        })
        .catch(err => console.log(err));
};

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            isLogin: true,
            pageStyles: ['forms', 'auth'],
            errorMessage: errors.array()[0].msg,
            oldInput: { email, password },
        });
    }

    User.findOne({ email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password.');

                return res.redirect('/login');
            }

            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.user = user;
                        req.session.isLoggedIn = true;
                        // res.setHeader('Set-Cookie', 'isLoggedIn=true');
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/');
                        });
                    }
                    req.flash('error', 'Invalid email or password.');

                    res.redirect('/login');
                })
                .catch(err => {
                    console.log(err);

                    res.redirect('/login');
                });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postSignup = (req, res, next) => {
    const { email, password, confirmPassword } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const validationErrors = {};
        for (let x = 0; x < errors.array().length; x++) {
            validationErrors[errors.array()[x].param] = errors.array()[x].param;
        }

        console.log('validationErrors', validationErrors);
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            pageStyles: ['forms', 'auth'],
            isSignup: true,
            errorMessage: errors.array()[0].msg,
            oldInput: { email, password, confirmPassword },
            validationErrors
        });
    }


    bcrypt.hash(password, 12)
        .then(hashPassword => {
            const user = new User({
                email,
                password: hashPassword,
                cart: { items: [] }
            });

            return user.save();
        })
        .then(result => {
            res.redirect('/login');
            transporter.sendMail({
                to: email,
                from: 'shop@nodejssandbox.com',
                subject: 'Signup succeeded!',
                html: '<h1>You are a part of our family!</h1>'
            });
        })
        .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }

        const token = buffer.toString('hex');

        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with this email was found!');

                    return res.redirect('/reset');
                }

                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;

                return user.save();
            })
            .then(result => {
                res.redirect('/');
                transporter.sendMail({
                    to: req.body.email,
                    from: 'shop@nodejssandbox.com',
                    subject: 'Password Reset',
                    html: `
                        <p>You requested a password reset</p>
                        <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
                    `
                });
            })
            .catch(err => console.log(err));
    })
};

exports.postNewPassword = (req, res, next) => {
    const { newPassword, userId, passwordToken } = req.body;
    let resetUser = null;

    User.findOne({
            resetToken: passwordToken,
            resetTokenExpiration: { $gt: Data.now() },
            _id: userId,
        })
        .then(user => {
            resetUser = user;

            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = null;
            resetUser.resetTokenExpiration = undefined;

            return resetUser.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => console.log(err));
};