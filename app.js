const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const expressHbs = require('express-handlebars');

const app = express();
const db = require('./utils/database');

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


/* parsing the body
* Urlencoded in the end call next but before that it parses the body, does not parse all type of bodies
*/
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

/**	ROUTES */
app.use('/admin', adminRoutes);
app.use(shopRoutes);

/**	404 PAGE */
app.use(errorController.get404);

app.listen(3000);
