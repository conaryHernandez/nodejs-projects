const path = require('path');
const fs = require('fs');

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
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile(products => {
            products.push(this); // class context
            fs.writeFile(p, JSON.stringify(products) , (err) => {
                console.log(err);
            }); // converts to json    
        });
    }

    // static avoid that this method will be included in the prototype chain
    static fetchAll(cb) {
        getProductsFromFile(cb);
    }
}