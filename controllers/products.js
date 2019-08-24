const products = [];

exports.getAddProduct = (req, res, next) => {
	console.log('im a middleware 2');
	// res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
	res.render('add-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		pageStyles: ['forms', 'product'],
		activeAddProduct: true
	});
};

exports.postAddProducts = (req, res, next) => {
	console.log(req.body); // request do not parse body
	products.push({ title: req.body.title });
	res.redirect('/');
};

exports.getProducts = (req, res, next) => {
	//	res.sendFile(path.join(rootDir, 'views', 'shop.html'));
	res.render('shop', {
		prods: products,
		pageTitle: 'Shop',
		path: '/',
		hasProducts: products.length > 0,
		activeShop: true,
	}); // express method
};
