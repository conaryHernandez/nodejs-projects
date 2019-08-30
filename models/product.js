const db = require('../utils/database');
const Cart = require('./cart');

module.exports = class product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        return db.execute('INSERT INTO products(title, price, imageUrl, description) VALUES(?, ?, ?, ?)',
        [this.title, this.price, this.imageUrl, this.description]
        );
    }

    static deleteById(id) {
    }

    // static avoid that this method will be included in the prototype chain
    static fetchAll(cb) {
        return db.execute('SELECT * FROM products');
    }

    static findById(id) {
        return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
    }
}