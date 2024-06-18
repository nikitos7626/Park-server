const { Sequelize } = require('sequelize');


module.exports = new Sequelize(
    "online_park",
    "nikitos",
    "123",
    {
        dialect: "mysql",
        host: "localhost"
    }
)