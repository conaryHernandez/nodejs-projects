const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');

// SETUP MODELS AND SERVICES
require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // how long the cookie can exist
    keys: [keys.cookieKey]
  })
);

// MIDDLEWARES
app.use(passport.initialize()); // Passport will now use cookies for session
app.use(passport.session());

// ROUTES
require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
