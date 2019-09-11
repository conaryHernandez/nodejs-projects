const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isLogin: true,
        pageStyles: ['forms', 'auth'],
        isAuthenticated: req.session.isLoggedIn,
    });
};

exports.postLogin = (req, res, next) => {
    User.findById('5d7534583129a25e94ac3ddb')
        .then(user => {
            req.session.user = user;
            req.session.isLoggedIn = true;
            // res.setHeader('Set-Cookie', 'isLoggedIn=true');
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        });
};