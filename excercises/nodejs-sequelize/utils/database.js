const Sequelize = require('sequelize');

const sequelize = new Sequelize('nodejs-sandbox', 'root', 'nodejsapp', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;