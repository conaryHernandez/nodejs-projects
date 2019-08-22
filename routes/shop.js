const path = require('path');

const express = require('express');

const router = express.Router();

const rootDir = require('../utils/path');
const adminData = require('./admin');

router.get('/', (req, res, next) => {
	console.log('shop js', adminData.products);
	//	res.sendFile(path.join(rootDir, 'views', 'shop.html'));
	res.render('shop'); // express method
});

module.exports = router;