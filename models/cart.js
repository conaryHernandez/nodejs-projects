const path = require('path');
const fs = require('fs');

const globalPath = require('../utils/path');

// helpers
const p = path.join(globalPath, 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(id, productPrice) {
        // fetch previous cart
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0};

            if (!err) {
                cart = JSON.parse(fileContent);
            }
            // analyze the cart => find existing product
            const existingProductIndex = cart.products.findIndex(p => p.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct = null;
            // add new product, increase the quantity
            if (existingProduct) {
                updatedProduct = {...existingProduct};
                updatedProduct.qty  =updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = {id, qty: 1};
                cart.products = [...cart.products, updatedProduct];
            }

            cart.totalPrice = cart.totalPrice + Number(productPrice);

            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            });
        });
    }


}