const path = require('path');

const express = require('express');

const rootDir = require('../utils/path');

const router = express.Router();

const products = [];

router.get('/add-product', (req, res, next) => {
	console.log('im a middleware 2');
	// res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
	res.render('add-product', {docTitle: 'Add Product'});
});

router.post('/add-product', (req, res, next) => {
	console.log(req.body); // request do not parse body
	products.push({ title: req.body.title });
	res.redirect('/');
});

exports.routes = router;
exports.products = products;
