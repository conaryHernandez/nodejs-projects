const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const expressHbs = require('express-handlebars');

const app = express();
const mongoConnect = require('./utils/database').mongoConnect;

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
const errorController = require('./controllers/404');
const User = require('./models/user');


/* parsing the body
* Urlencoded in the end call next but before that it parses the body, does not parse all type of bodies
*/
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// first to run
app.use((req, res, next) => {
	User.findUserById('5d71c6d71c9d44000074d620')
		.then(user => {
			req.user = user; // storing sequelize object
			next();
		})
		.catch(err => {
			console.log(err);
		});
	next()
});


/**	ROUTES */
app.use('/admin', adminRoutes);
app.use(shopRoutes);

/**	404 PAGE */
app.use(errorController.get404);


mongoConnect(() => {
	app.listen(3000);
});
