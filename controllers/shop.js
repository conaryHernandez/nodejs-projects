const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const stripe = require('stripe')(process.env.STRIPE_KEY);

const Product = require('../models/product');
const Order = require('../models/orders');

const ITEMS_PER_PAGE = 2;

exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems = null;

    Product.find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts;

            return Product
                .find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
        })
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'Shop',
                path: '/products',
                hasProducts: products.length > 0,
                activeProducts: true,
                totalProducts: totalItems,
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
                isNotFirst: page !== 1,
                previousIsNotFirst: (page - 1) !== 1,
                isNotLastPage: (Math.ceil(totalItems / ITEMS_PER_PAGE)) !== page,
                nextIsNotLast: (page + 1) !== (Math.ceil(totalItems / ITEMS_PER_PAGE)),
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
    const page = +req.query.page || 1;
    let totalItems = null;

    Product.find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts;

            return Product
                .find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
        })
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
                hasProducts: products.length > 0,
                activeShop: true,
                totalProducts: totalItems,
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
                isNotFirst: page !== 1,
                previousIsNotFirst: (page - 1) !== 1,
                isNotLastPage: (Math.ceil(totalItems / ITEMS_PER_PAGE)) !== page,
                nextIsNotLast: (page + 1) !== (Math.ceil(totalItems / ITEMS_PER_PAGE)),
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

    return Product.findById(productId)
        .then(product => {
            if (!product) {
                const error = new Error('No product found!');

                error.statusCode = 404;

                throw error;
            }

            return req.user.addToCart(product);
        })
        .then(result => {
            console.log('add to cart result', result);
            res.redirect('/cart');
        })
        .catch(err => {
            const error = new Error(err);

            error.httpStatusCode = 500;

            return next(error);
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

exports.getCheckout = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items || [];
            let total = 0;

            products.forEach(p => {
                total += p.quantity * p.productId.price;
            });

            res.render('shop/checkout', {
                path: '/checkout',
                pageTitle: 'Checkout',
                products,
                hasProducts: products.length > 0,
                pageStyles: ['cart'],
                totalSum: total,
                totalSumStripe: total * 100,
            });
        })
        .catch(err => {
            const error = new Error(err);

            error.httpStatusCode = 500;

            return next(error);
        });
};

exports.getCheckoutSuccess = (req, res, next) => {
    let totalSum = 0;
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            user.cart.items.forEach(p => {
                totalSum += p.quantity * p.productId.price;
            });

            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: {...i.productId._doc } };
            });
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user
                },
                products: products
            });
            return order.save();
        })
        .then(() => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => {
            const error = new Error(err);
            console.log(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

// new stripe method
/* exports.getCheckout = (req, res, next) => {
    let products; // THIS WAS MOVED - had to put it here, to make it accessible by all then() blocks.
    let total = 0; // THIS WAS MOVED - had to put it here, to make it accessible by all then() blocks.
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            products = user.cart.items;
            products.forEach(p => {
                total += p.quantity * p.productId.price;
            });
            return stripe.checkout.sessions.create({ // THIS WAS ADDED - configures a Stripe session
                payment_method_types: ['card'],
                line_items: products.map(p => {
                    return {
                        name: p.productId.title,
                        description: p.productId.description,
                        amount: p.productId.price * 100,
                        currency: 'usd',
                        quantity: p.quantity
                    };
                }),
                success_url: 'http://localhost:3000/checkout/success', // THIS WAS ADDED
                cancel_url: 'http://localhost:3000/checkout/cancel' // THIS WAS ADDED
            });
        })
        .then(session => {
            console.log(session);
            res.render('shop/checkout', {
                path: '/checkout',
                pageTitle: 'Checkout',
                products: products,
                totalSum: total,
                sessionId: session.id // THIS WAS ADDED - we need that in the checkout.ejs file (see above)
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}; */

exports.postOrder = (req, res, next) => {
    const token = req.body.stripeToken;
    let total = 0;

    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
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
            const charge = stripe.charges.create({
                amount: total * 100,
                currency: 'usd',
                description: 'Demo Order',
                source: token,
                metadata: {
                    order_id: result._id.toString(),
                },
            });
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

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;

    Order.findById(orderId)
        .then(order => {
            if (!order) {
                return next(new Error('No order found.'));
            }
            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error('Unauthorized'));
            }

            const invoiceName = 'invoice-' + orderId + '.pdf';
            const invoicePath = path.join('data', 'invoices', invoiceName);

            const pdfDoc = new PDFDocument();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader(
                'Content-Disposition',
                'inline; filename="' + invoiceName + '"'
            );
            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);


            pdfDoc.fontSize(26).text('Invoice', {
                underline: true
            });
            pdfDoc.text('-----------------------');
            let totalPrice = 0;
            order.products.forEach(prod => {
                totalPrice += prod.quantity * prod.product.price;
                pdfDoc
                    .fontSize(14)
                    .text(
                        prod.product.title +
                        ' - ' +
                        prod.quantity +
                        ' x ' +
                        '$' +
                        prod.product.price
                    );
            });
            pdfDoc.text('---');
            pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);
            pdfDoc.end();
        })
        .catch(err => {
            next(err);
        });
};