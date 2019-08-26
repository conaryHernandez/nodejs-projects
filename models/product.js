const path = require('path');
const fs = require('fs');

const Cart = require('./cart');

const globalPath = require('../utils/path');

// helpers
const p = path.join(globalPath, 'data', 'products.json');

const getProductsFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
}

module.exports = class product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile(products => {
            // editing
            if (this.id) {
                const existingProductIndex =  products.findIndex(p => p.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts) , (err) => {
                    console.log(err);
                }); // converts to json        
            } else {
                this.id = (Math.floor(Math.random() * 100) + 1).toString();    
                products.push(this); // class context
                fs.writeFile(p, JSON.stringify(products) , (err) => {
                    console.log(err);
                }); // converts to json    
            }
        });
    }

    static deleteById(id) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);    
            const updatedProducts = products.filter(p => p.id !== id);                
            fs.writeFile(p, JSON.stringify(updatedProducts) , (err) => {
                if (!err) {
                    Cart.deleteProduct(id, product.price);
                }
            });        
        });
    }

    // static avoid that this method will be included in the prototype chain
    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product);
        });
    }
}