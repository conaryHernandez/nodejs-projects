const path = require('path');

const express = require('express');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/add-product', isAuth, adminController.getAddProduct);

// similir in shop
router.get('/products', isAuth, adminController.getProducts);

router.post('/add-product', [
        body('title', 'Please enter a valid title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
        body('imageUrl', 'Please enter a valid Image url')
        .isURL(),
        body('price', 'Please enter a valid Price')
        .isFloat(),
        body('description', 'Please enter a valid description')
        .isLength({ min: 5, max: 200 })
        .trim()
    ],
    isAuth,
    adminController.postAddProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', [
    body('title', 'Please enter a valid title')
    .isString()
    .isLength({ min: 3 })
    .trim(),
    body('imageUrl', 'Please enter a valid Image url')
    .isURL(),
    body('price', 'Please enter a valid Price')
    .isFloat(),
    body('description', 'Please enter a valid description')
    .isLength({ min: 5, max: 200 })
    .trim()
], isAuth, adminController.postEditProducts);

router.post('/delete-product', isAuth, adminController.postDeleteProducts);

module.exports = router;