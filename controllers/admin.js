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

exports.getEditProduct = (req, res, next) => {
    const {edit} = req.query;

    console.log('edit', edit);

    if (!edit) {
        return res.redirect('/');
    }
    const { productId } = req.params;
    Product.findById(productId, product => {
        // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
        if (!product) {
            return res.redirect('/');
        }
        console.log('product', product);
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            pageStyles: ['forms', 'product'],
            activeAddProduct: true,
            editing: true,
            product
        });
    });
};

exports.postAddProducts = (req, res, next) => {
    const {title, imageUrl, description, price} = req.body;
    const product = new Product(null, title, imageUrl, description, price);

    console.log(req.body); // request do not parse body

    product.save();
	res.redirect('/');
};

exports.postEditProducts = (req, res, next) => {
    const { productId, description, imageUrl, price, title } = req.body;
    const updatedProduct = new Product(productId, title, imageUrl, description, price);

    updatedProduct.save();

    res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
    //	res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    // class because "static" method
    Product.fetchAll(products => {
        console.log('products', products);
        res.render('admin/products-list', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
            hasProducts: products.length > 0,
            activeAdminProduct: true,
        }); // express method
    });
};