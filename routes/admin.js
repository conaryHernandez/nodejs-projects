const path = require('path');

const express = require('express');

const productsController = require('../controllers/admin');

const router = express.Router();

router.get('/add-product', productsController.getAddProduct);

// similir in shop
router.get('/products', productsController.getProducts);

router.post('/add-product', productsController.postAddProducts);

module.exports = router;
