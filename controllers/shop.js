const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    //	res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    // class because "static" method
    Product.findAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
                hasProducts: products.length > 0,
                activeProducts: true,
            }); // express method
        })
        .catch(err => {
            console.log('err', err);
        });
};

exports.getProduct = (req, res, next) => {
    const { productId } = req.params;

    Product.findByPk(productId)
        .then(product => {
            res.render('shop/product-details', {
                product,
                pageTitle: product.title,
                path: '/products',
                activeProducts: true,
            });
        })
        .catch(err => {
            console.log('err', err);
    });
};

exports.getIndex = (req, res, next) => {
    //	res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    // class because "static" method
    Product.findAll()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
                hasProducts: products.length > 0,
                activeShop: true,
            }); // express method
        })
        .catch(err => {
            console.log('err', err);
        });
};

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for(product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id)
                if (cartProductData) {
                    cartProducts.push({productData: product, qty: cartProductData.qty});
                }
            }

            console.log('cartProducts', cartProducts);
            
            res.render('shop/cart', {
                path: '/cart', 
                pageTitle: 'Cart',
                activeCart: true,
                products: cartProducts,
                hasProducts: cartProducts.length > 0
            });
        });

    });
};

exports.postCartDeleteProduct = (req, res, next) => {
    const { productId } = req.body;

    Product.findById(productId, product => {
        Cart.deleteProduct(productId, product.price);
        res.redirect('/cart');
    });
};


exports.postCart = (req, res, next) => {
    const { productId } = req.body;

    Product.findById(productId, product => {
        Cart.addProduct(productId, product.price);
    });
    res.redirect('/cart');
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