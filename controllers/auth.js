const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const User = require('../models/user');

const transporter = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key: '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'
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
        errorMessage: req.flash('error')
    });
};

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body

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

    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                console.log('user already exists');
                req.flash('error', 'Email already Exists.');

                return res.redirect('/signup');
            }
            return bcrypt.hash(password, 12)
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
        })
        .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};