const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db = null;

const mongoConnect = callback => {
    MongoClient.connect('mongodb+srv://conaryh:k9X9MpdWnfHYcqMC@cluster0-nvbxl.mongodb.net/nodejs-sandbox?retryWrites=true&w=majority')
    .then(client => {
        console.log('connected!!!');
        _db = client.db('nodejs-sandbox'); // you can override db name here
        callback();
    })
    .catch(err => {
        console.log(err)
        throw err;
    });
};

const getDb = () => {
    if (_db) {
        return _db;
    }

    throw 'No database';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
