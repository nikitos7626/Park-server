const { Sequelize } = require('sequelize');


module.exports = new Sequelize(
    "online_park",
    "root",
    "1234",
    {
        dialect: "mysql",
        host: "localhost",
        port: 3306
    }
)