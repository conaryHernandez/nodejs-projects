const bodyParse = require('body-parser');

const express = require('express');

const app = express();

// parsing the body
// Urlencoded in the end call next but before that it parses the body
// does not parse all type of bodies
app.use(bodyParse.urlencoded({extended: false}));

app.use('/', (req, res, next) => {
	console.log('always runs');
	next();
});

app.use('/add-product', (req, res, next) => {
	console.log('im a middleware 2');
	res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add</button></form>')
});

app.use('/product', (req, res, next) => {
	console.log(req.body); // request do not parse body
	res.redirect('/');
});

app.use('/', (req, res, next) => {
	console.log('im a middleware 2');
	res.send('<h1>Hello from express</h1>')
});

app.listen(3000);
