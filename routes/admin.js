const express = require('express');

const router = express.Router();

router.get('/add-product', (req, res, next) => {
	console.log('im a middleware 2');
	res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add</button></form>')
});

// limiting just to post request
// use works with all https method
// post, get and put are a few of them
router.post('/product', (req, res, next) => {
	console.log(req.body); // request do not parse body
	res.redirect('/');
});

module.exports = router;
