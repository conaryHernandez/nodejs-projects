const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	// res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
	res.render('admin/add-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		pageStyles: ['forms', 'product'],
		activeAddProduct: true
	});
};

exports.getEditProduct = (req, res, next) => {
    const { edit } = req.query;

    if (!edit) {
        return res.redirect('/');
    }
    const { productId } = req.params;
    // req.user.getProducts()
    Product.findByPk(productId)
        .then(product => {
            // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                pageStyles: ['forms', 'product'],
                activeAddProduct: true,
                editing: true,
                product
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postAddProducts = (req, res, next) => {
    const {title, imageUrl, description, price} = req.body;

    req.user.createProduct({
        title,
        imageUrl,
        description,
        price,
    })
    .then(result => {
        console.log('result', result);
        res.redirect('/admin/products');
    })
    .catch(err => {
        console.log('err', err);
    });
};

exports.postEditProducts = (req, res, next) => {
    const { productId, description, imageUrl, price, title } = req.body;

    Product.findByPk(productId)
        .then(product => {
            product.title = title;
            product.description = description;
            product.imageUrl = imageUrl;
            product.price = price;
            return product.save();
        })
        .then(result => {
            console.log('updated product!!');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postDeleteProducts = (req, res, next) => {
    const { productId } =  req.body;

    Product.findByPk(productId)
        .then(product => {
            return product.destroy();
        })
        .then(result => {
            console.log('Product detroyed');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getProducts = (req, res, next) => {
    //	res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    // class because "static" method
    // req.user.getProducts()
    Product.findAll()
        .then(products => {
            res.render('admin/products-list', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
                hasProducts: products.length > 0,
                activeAdminProduct: true,
            }); // express method
        })
        .catch(err => {
            console.log(err);
        });
};