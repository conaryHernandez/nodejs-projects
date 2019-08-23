const path = require('path');

const express = require('express');

const router = express.Router();

const rootDir = require('../utils/path');
const adminData = require('./admin');

router.get('/', (req, res, next) => {
	console.log('shop js', adminData.products);
	const products = adminData.products;
	//	res.sendFile(path.join(rootDir, 'views', 'shop.html'));
	res.render('shop', {
		prods: products,
		pageTitle: 'Shop',
		path: '/',
		hasProducts: products.length > 0,
		activeShop: true,
	}); // express method
});

module.exports = router;