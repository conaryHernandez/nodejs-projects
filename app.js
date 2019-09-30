const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const express = require('express');
const expressHbs = require('express-handlebars');
require('dotenv').config()

const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions'
});
const csrfProtection = csrf();
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
/** EJS ENGINE
 * app.set('view engine', 'ejs'); // setting global configuration, doesnt work for all template engine
 * app.set('views', 'views');
 */

/** HANDLEBARS ENGINE
 * .engine is used to specify an engine that is not build in with express
 */
const hbs = expressHbs.create({
    layoutsDir: 'views/layouts/', // only use this when you have other directory name.
    partialsDir: 'views/partials/',
    defaultLayout: 'main',
    extName: 'handlebars',
    helpers: {
        calculation(value) {
            return value * 5;
        }
    },
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars'); // setting global configuration, doesnt work for all template engine
app.set('views', 'views');

/* PUG ENGINE
	app.set('view engine', 'pug'); // setting global configuration, doesnt work for all template engine
	app.set('views', 'views');
*/

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/404');
const User = require('./models/user');
const shopController = require('./controllers/shop');
const isAuth = require('./middleware/is-auth');

/* parsing the body
 * Urlencoded in the end call next but before that it parses the body, does not parse all type of bodies
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter }).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store,
    // cookie: {}
}));
app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});

// retreiving mongoose object for individual request
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            // res.setHeader('Set-Cookie', 'isLoggedIn=true');
            next();
        })
        .catch(err => {
            throw new Error(err);
        });
});

/**	ROUTES */
app.post('/create-order', isAuth, shopController.postOrder);

app.use(csrfProtection);

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/error', errorController.get500);

/**	404 PAGE */
app.use(errorController.get404);

app.use((error, req, res, next) => {
    // res.status(error.httpStatusCode);
    // res.redirect('/error');
    console.log(error);
    res.status(500).render('500', {
        pageTitle: 'Error',
        path: '/error',
        isAuthenticated: req.session.isLoggedIn
    });
});


mongoose
    .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });