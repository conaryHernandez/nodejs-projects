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
            .findOne({ _id: new mongodb.ObjectId(userId) })
            .then(user => {
                console.log('found!!!', user);
                return user;
            })
            .catch(err => console.log(err));
    }
}


module.exports = User;
