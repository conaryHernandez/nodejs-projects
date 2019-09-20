const mongodb = require('mongodb');
const Product = require('../models/product');
const fileHelper = require('../utils/file');
const { validationResult } = require('express-validator');

exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        pageStyles: ['forms', 'product'],
        activeAddProduct: true,
        oldInput: {
            title: '',
            imageUrl: '',
            price: '',
            description: '',
        },
        validationErrors: [],
        errorMessage: null,
    });
};

exports.getEditProduct = (req, res, next) => {
    const { edit } = req.query;

    if (!edit) {
        return res.redirect('/');
    }
    const { productId } = req.params;
    // req.session.user.getProducts()
    Product.findById(productId)
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
                product,
                validationErrors: []
            });
        })
        .catch(err => {
            const error = new Error(err);

            error.httpStatusCode = 500;

            return next(error);
        });
};

exports.postAddProducts = (req, res, next) => {
    const { title, description, price } = req.body;
    const image = req.file;
    const validationErrors = {};
    const errors = validationResult(req);

    if (!image) {
        return res.status(422).render('admin/add-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            pageStyles: ['forms', 'product'],
            activeAddProduct: true,
            editing: true,
            oldInput: {
                title,
                price,
                description,
            },
            errorMessage: 'Attached File is not and Image',
            validationErrors: [],
        });
    }

    const imageUrl = image.path;

    const product = new Product({
        title,
        price,
        description,
        imageUrl,
        userId: req.session.user._id
    });

    if (!errors.isEmpty()) {
        for (let x = 0; x < errors.array().length; x++) {
            validationErrors[errors.array()[x].param] = errors.array()[x].param;
        }

        return res.status(422).render('admin/add-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            pageStyles: ['forms', 'product'],
            activeAddProduct: true,
            editing: true,
            oldInput: {
                title,
                price,
                description,
            },
            errorMessage: errors.array()[0].msg,
            validationErrors,
        });
    }


    product
        .save()
        .then(result => {
            console.log('result', result);
            res.redirect('/admin/products');
        })
        .catch(err => {
            // res.redirect('/500');
            const error = new Error(err);

            error.httpStatusCode = 500;

            return next(error);
        });
};

exports.postEditProducts = (req, res, next) => {
    const { productId, description, price, title } = req.body;
    const image = req.file;
    const validationErrors = {};
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        for (let x = 0; x < errors.array().length; x++) {
            validationErrors[errors.array()[x].param] = errors.array()[x].param;
        }

        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            pageStyles: ['forms', 'product'],
            activeAddProduct: true,
            editing: true,
            product: {
                title,
                price,
                description,
                _id: productId,
            },
            errorMessage: errors.array()[0].msg,
            validationErrors,
        });
    }

    Product
        .findById(productId)
        .then(product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/');
            }
            product.title = title;
            product.description = description;
            if (image) {
                fileHelper.deleteFile(product.imageUrl);
                product.imageUrl = image.path;
            }
            product.price = price;

            return product.save().then(result => {
                console.log('updated product!!');
                res.redirect('/admin/products');
            });
        })
        .catch(err => {
            const error = new Error(err);

            error.httpStatusCode = 500;

            return next(error);
        });
};

exports.postDeleteProducts = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return next(new Error('Product not found.'));
            }
            fileHelper.deleteFile(product.imageUrl);
            return Product.deleteOne({ _id: prodId, userId: req.user._id });
        })
        .then(result => {
            console.log('Product detroyed');
            res.redirect('/admin/products');
        })
        .catch(err => {
            const error = new Error(err);

            error.httpStatusCode = 500;

            return next(error);
        });
};

exports.getProducts = (req, res, next) => {
    //	res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    // class because "static" method
    // req.session.user.getProducts()
    Product
        .find({ userId: req.user._id })
        // .select('title price -_id')
        // .populate('UserId', 'name')
        .then(products => {
            let listOfProducts = products;

            if (!products) {
                listOfProducts = 0
            }
            res.render('admin/products-list', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
                hasProducts: listOfProducts.length > 0,
                activeAdminProduct: true,

            }); // express method
        })
        .catch(err => {
            const error = new Error(err);

            error.httpStatusCode = 500;

            return next(error);
        });
};