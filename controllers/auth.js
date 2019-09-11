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

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false,
        pageStyles: ['forms', 'auth'],
        isSignup: true,
    });
};

exports.postLogin = (req, res, next) => {
    User.findById('5d7534583129a25e94ac3ddb')
        .then(user => {
            req.session.user = user;
            req.session.isLoggedIn = true;
            // res.setHeader('Set-Cookie', 'isLoggedIn=true');
            req.session.save(err => {
                console.log(err);
                res.redirect('/');
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

                return res.redirect('/signup');
            }

            const user = new User({
                email,
                password,
                cart: { items: [] }
            });

            return user.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};