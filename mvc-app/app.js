// CORE MODULES
const path = require('path');
const fs = require('fs');
const https = require('https');

// UTILS
const bodyParser = require('body-parser');
const multer = require('multer');
const flash = require('connect-flash');

// EXPRESS
const express = require('express');
const expressHbs = require('express-handlebars');
const app = express();

// VARS
require('dotenv').config()

// DATABASE
const mongoose = require('mongoose');
const MONGODB_URI = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-shard-00-00-nvbxl.mongodb.net:27017,cluster0-shard-00-01-nvbxl.mongodb.net:27017,cluster0-shard-00-02-nvbxl.mongodb.net:27017/${process.env.MONGO_DEFAULT_DATABASE}?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&w=majority`;

// SESSIONS
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');

// PROD Dependencies
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

// STORING SESSIONS
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});
const csrfProtection = csrf();

// SSL
// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');

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

// HANDLEBARS ENGINE
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

// IMPORTING ROUTES
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

// Logging
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

// Prod setup
app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}));

// CONTROLLERS
const errorController = require('./controllers/404');
const shopController = require('./controllers/shop');
const isAuth = require('./middleware/is-auth');

// MODELS
const User = require('./models/user');

// UTILS middleware
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

// USER AUTH
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user; // retreiving mongoose object for individual request
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

/**	ERRORS */
app.use(errorController.get404);

app.use((error, req, res, next) => {
    console.log(error);
    res.status(500).render('500', {
        pageTitle: 'Error',
        path: '/error',
        isAuthenticated: req.session.isLoggedIn
    });
});

// DATABASE CONNECTION
mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true })
    .then(result => {
        app.listen(process.env.PORT || 3000);
        // https.createServer({key: privateKey, cert: certificate}, app).listen(process.env.PORT || 3000);
    })
    .catch(err => {
        console.log(err);
    });