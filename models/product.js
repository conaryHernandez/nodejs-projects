const products = [];

module.exports = class product {
    constructor(t) {
        this.title = t;
    }

    save() {
        products.push(this);
    }

    // static avoid that this method will be included in the prototype chain
    static fetchAll() {
        return products;
    }
}