const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
// const expressHbs = require('express-handlebars');

const app = express();

app.set('view engine', 'ejs'); // setting global configuration, doesnt work for all template engine
app.set('views', 'views');

/**
	// .engine is used to specify an engine that is not build in with express
	app.engine('handlebars', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main', extName: 'handlebars'})); // only use this we you have other directory name.
	app.set('view engine', 'handlebars'); // setting global configuration, doesnt work for all template engine
	app.set('views', 'views');
* 
 */

/*
	app.set('view engine', 'pug'); // setting global configuration, doesnt work for all template engine
	app.set('views', 'views');
*/
const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// parsing the body
// Urlencoded in the end call next but before that it parses the body
// does not parse all type of bodies
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);

app.use(shopRoutes);

app.use((req, res, next) => {
	// res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
	res.status(404).render('404', {pageTitle: '404'});
});

app.listen(3000);
