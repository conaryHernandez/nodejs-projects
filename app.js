const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const expressHbs = require('express-handlebars');
const MONGODB_URI = 'mongodb://conaryh:k9X9MpdWnfHYcqMC@cluster0-shard-00-00-nvbxl.mongodb.net:27017,cluster0-shard-00-01-nvbxl.mongodb.net:27017,cluster0-shard-00-02-nvbxl.mongodb.net:27017/nodejs-sandbox?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&w=majority';

const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});
const csrfProtection = csrf();

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


/* parsing the body
 * Urlencoded in the end call next but before that it parses the body, does not parse all type of bodies
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store,
    // cookie: {}
}));
app.use(csrfProtection);
app.use(flash());

// retreiving mongoose object for individual request
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            // res.setHeader('Set-Cookie', 'isLoggedIn=true');
            next();
        })
        .catch(err => {
            console.log(err);
        });
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

/**	ROUTES */
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

/**	404 PAGE */
app.use(errorController.get404);


mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true })
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });