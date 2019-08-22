const path = require('path');

const express = require('express');

const rootDir = require('../utils/path');

const router = express.Router();

router.get('/add-product', (req, res, next) => {
	console.log('im a middleware 2');
	res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

// limiting just to post request
// use works with all https method
// post, get and put are a few of them
router.post('/add-product', (req, res, next) => {
	console.log(req.body); // request do not parse body
	res.redirect('/');
});

module.exports = router;
