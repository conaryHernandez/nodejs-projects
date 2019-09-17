const Product = require('../models/product');
const Order = require('../models/orders');

exports.getProducts = (req, res, next) => {
    //	res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    // class because "static" method
    Product.find()
        .then(products => {
            console.log('req.session.isLoggedIn', req.session.isLoggedIn);

            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
                hasProducts: products.length > 0,
                activeProducts: true,
            }); // express method
        })
        .catch(err => {
            const error = new Error(err);

            error.httpStatusCode = 500;

            return next(error);
        });
};

exports.getProduct = (req, res, next) => {
    const { productId } = req.params;

    Product.findById(productId)
        .then(product => {
            res.render('shop/product-details', {
                product,
                pageTitle: product.title,
                path: '/products',
                activeProducts: true,
            });
        })
        .catch(err => {
            const error = new Error(err);

            error.httpStatusCode = 500;

            return next(error);
        });
};

exports.getIndex = (req, res, next) => {
    //	res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    // class because "static" method
    Product.find()
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
            const error = new Error(err);

            error.httpStatusCode = 500;

            return next(error);
        });
};

exports.getCart = (req, res, next) => {
    console.log('req.user.cart', req.user.cart);

    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items || [];

            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Cart',
                activeCart: true,
                products,
                hasProducts: products.length > 0,
                pageStyles: ['cart'],
            });
        })
        .catch(err => {
            const error = new Error(err);

            error.httpStatusCode = 500;

            return next(error);
        });
};

exports.postCartDeleteProduct = (req, res, next) => {
    const { productId } = req.body;

    req.user
        .deleteItemFromCart(productId)
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            const error = new Error(err);

            error.httpStatusCode = 500;

            return next(error);
        });
};


exports.postCart = (req, res, next) => {
    const { productId } = req.body;

    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            console.log('add to cart result', result);
            res.redirect('/cart');
        });
};

exports.getOrders = (req, res, next) => {
    Order
        .find({ 'user.userId': req.user._id })
        .then(orders => {
            console.log('orders', orders);
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Orders',
                activeOrders: true,
                orders,
                hasOrders: orders.length > 0,
                pageStyles: ['orders'],
            });
        })
        .catch(err => {
            const error = new Error(err);

            error.httpStatusCode = 500;

            return next(error);
        });
};

exports.postOrder = (req, res, next) => {

    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            let total = 0;
            const products = user.cart.items.map(i => {
                console.log('i', i);

                total += Number(i.quantity * i.productId.price)

                return {
                    quantity: i.quantity,
                    product: {...i.productId._doc }
                };
            });

            console.log('total', total);
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user,
                },
                products,
                total
            });
            return order.save()
        })
        .then(result => {
            req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => {
            const error = new Error(err);

            error.httpStatusCode = 500;

            return next(error);
        });
};