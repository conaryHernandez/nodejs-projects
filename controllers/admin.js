const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	console.log('im a middleware 2');
	// res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
	res.render('admin/add-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		pageStyles: ['forms', 'product'],
		activeAddProduct: true
	});
};

exports.postAddProducts = (req, res, next) => {
    const {title, imageUrl, description, price} = req.body;
    const product = new Product(title, imageUrl, description, price);

    console.log(req.body); // request do not parse body

    product.save();
	res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    //	res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    // class because "static" method
    Product.fetchAll(products => {
        res.render('admin/products-list', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
            hasProducts: products.length > 0,
            activeAdminProduct: true,
        }); // express method
    });
};