const bodyParse = require('body-parser');
const express = require('express');

const app = express();
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// parsing the body
// Urlencoded in the end call next but before that it parses the body
// does not parse all type of bodies
app.use(bodyParse.urlencoded({extended: false}));

app.use(adminRoutes);

app.use(shopRoutes);

app.use((req, res, next) => {
	res.status(404).send('<h1>Page not found</h1>');
});

app.listen(3000);
