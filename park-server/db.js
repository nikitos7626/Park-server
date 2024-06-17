const { Sequelize } = require('sequelize');

module.exports = new Sequelize(
    "online_park",
    "nikitos",
    "123",
    {
        dialect: "mysql",
        host: "158.160.134.113",
        port: 3306,
    }
);
