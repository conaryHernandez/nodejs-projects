const mysql = require('mysql2');

const pool =  mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'nodejsapp',
    database: 'nodejs-sandbox'
});

module.exports = pool.promise();