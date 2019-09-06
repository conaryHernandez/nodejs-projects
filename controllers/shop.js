const Product = require('../models/product');
const Order = require('../models/Order');

exports.getProducts = (req, res, next) => {
    //	res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    // class because "static" method
    Product.fetchAll()
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
            console.log('err', err);
    });
};

exports.getIndex = (req, res, next) => {
    //	res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    // class because "static" method
    Product.fetchAll()
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
    console.log('req.user.cart', req.user.cart);

    req.user
        .getCart()
        .then(cart => {
            console.log('cart', cart);
            return cart.getProducts()
                .then(products => {
                    res.render('shop/cart', {
                        path: '/cart', 
                        pageTitle: 'Cart',
                        activeCart: true,
                        products,
                        hasProducts: products.length > 0
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postCartDeleteProduct = (req, res, next) => {
    const { productId } = req.body;

    req.user.getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: productId } });
        })
        .then(products => {
            const product = products[0];

            return product.cartItem.destroy();
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};


exports.postCart = (req, res, next) => {
    const { productId } = req.body;

    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            console.log('add to cart result', result);
        });
};

exports.getOrders = (req, res, next) => {
    req.user.getOrders({include: ['products']})
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders', 
                pageTitle: 'Orders',
                activeOrders: true,
                orders,
                hasOrders: orders.length > 0
            });
        })
        .catch(err => console.log(err)
    );
};

exports.postOrder = (req, res, next) => {
    let fetchedCart = null;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;

            return cart.getProducts();
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                    return order.addProducts(
                        products.map(product => {
                            product.orderItem = { quantity: product.cartItem.quantity };

                            return product;
                        })
                    );
                })
                .catch(err => console.log(err));
        })
        .then(result => {
            return fetchedCart.setProducts(null);
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
};
