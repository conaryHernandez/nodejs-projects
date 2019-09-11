const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/add-product', isAuth, adminController.getAddProduct);

// similir in shop
router.get('/products', isAuth, adminController.getProducts);

router.post('/add-product', isAuth, adminController.postAddProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, adminController.postEditProducts);

router.post('/delete-product', isAuth, adminController.postDeleteProducts);

module.exports = router;