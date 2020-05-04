const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');

const app = express();

// setup template engine
app.engine('handlebars', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main', extName: 'handlebars'})); // only use this we you have other directory name.
app.set('view engine', 'handlebars');
app.set('views', 'views');

// importing routes
const loginRoutes = require('./routes/login');
const userRoutes = require('./routes/users');

// used midleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use(userRoutes.routes);
app.use(loginRoutes);

app.use((req, res, next) => {
    res.status(404).render('404');
});

app.listen(3001);
