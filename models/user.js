const mongodb = require('mongodb');
const getDb = require('../utils/database').getDb; 

class User {
    constructor(username, email, cart, id) {
        this.username = username;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

    save() {
        const db = getDb();

        return db
            .collection('users')
            .insertOne(this)
            .then(result => {
                console.log('user added');
            })
            .catch(err => console.log(err));
        
    }

    addToCart(product) {
        const updatedCart = {items : [{productId: new mongodb.ObjectId(product._id), quantity: 1}]};

        const db = getDb();

        return db
            .collection('users')
            .updateOne({ _id: new mongodb.ObjectId(this._id) },
                {$set: {cart: updatedCart}}
            );
    }

    static findUserById(userId) {
        const db = getDb();

        return db
            .collection('users')
            .findOne({ _id: new mongodb.ObjectId(userId) })
            .then(user => {
                console.log('found!!!', user);
                return user;
            })
            .catch(err => console.log(err));
    }
}


module.exports = User;
