const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    //	res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    // class because "static" method
    Product.fetchAll(products => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
            hasProducts: products.length > 0,
            activeProducts: true,
        }); // express method
    });
};

exports.getProduct = (req, res, next) => {
    const { productId } = req.params;

    Product.findById(productId, product => {
        res.render('shop/product-details',{
            ...product,
            pageTitle: product.title,
            path: '/products',
            activeProducts: true,
        });
    });    
};

exports.getIndex = (req, res, next) => {
    //	res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    // class because "static" method
    Product.fetchAll(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
            hasProducts: products.length > 0,
            activeShop: true,
        }); // express method
    });
};

exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        path: '/cart', 
        pageTitle: 'Cart',
        activeCart: true,
    });
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders', 
        pageTitle: 'Orders',
        activeOrders: true,
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout', 
        pageTitle: 'Checkout',
    });
};