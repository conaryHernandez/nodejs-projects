const mongodb = require('mongodb');
const getDb = require('../utils/database').getDb; 

class User {
    constructor(username, email) {
        this.username = username;
        this.email = email;
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

    static findUserById(userId) {
        const db = getDb();

        return db
            .collection('users')
            .find({ _id: new mongodb.ObjectId(userId) })
            .then(result => {
                console.log('found!!!'. result);
            })
            .catch(err => console.log(err));
    }
}


module.exports = User;
