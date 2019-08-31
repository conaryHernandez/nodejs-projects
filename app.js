const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const expressHbs = require('express-handlebars');

const app = express();
const sequelize = require('./utils/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

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

// first to run
app.use((req, res, next) => {
	User.findByPk(1)
		.then(user => {
			req.user = user; // storing sequelize object
			next();
		})
		.catch(err => {
			console.log(err);
		});
});

/**	ROUTES */
app.use('/admin', adminRoutes);
app.use(shopRoutes);

/**	404 PAGE */
app.use(errorController.get404);

/* setting relations */
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem });
Product.belongsToMany(Cart, {through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through:  OrderItem });

/* sync with database and creates tables, acording to models, if doesnt exists */
sequelize
	// .sync({ force: true })
	.sync()
	.then(result => {
		return User.findByPk(1);		
	})
	.then(user => {
		if (!user) {
			return User.create({ name: 'Conary', email: 'test@test.com' });
		}

		return user;
	})
	.then(user => {
		return user.createCart();
	})
	.then(() => {
		app.listen(3000);
	})
	.catch(err => {
		console.log('err', err);
	});

