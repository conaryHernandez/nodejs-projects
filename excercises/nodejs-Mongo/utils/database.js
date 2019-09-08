const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
// const uri = 'mongodb+srv://conaryh:k9X9MpdWnfHYcqMC@cluster0-nvbxl.mongodb.net/nodejs-sandbox?retryWrites=true&w=majority';
const uri = "mongodb://conaryh:k9X9MpdWnfHYcqMC@cluster0-shard-00-00-nvbxl.mongodb.net:27017,cluster0-shard-00-01-nvbxl.mongodb.net:27017,cluster0-shard-00-02-nvbxl.mongodb.net:27017/nodejs-sandbox?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority";

let _db = null;

const mongoConnect = callback => {
    MongoClient.connect(uri,  {useNewUrlParser: true })
    .then(client => {
        console.log('connected!!!');
        _db = client.db('nodejs-sandbox'); // you can override db name here
        callback();
    })
    .catch(err => {
        console.log('database connection err', err)
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
