const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = callback => {
    MongoClient.connect('mongodb+srv://conaryh:k9X9MpdWnfHYcqMC@cluster0-nvbxl.mongodb.net/test?retryWrites=true&w=majority')
    .then(client => {
        console.log('connected!!!');
        callback(client);
    })
    .catch(err => console.log(err));
};

module.exports = mongoConnect;
