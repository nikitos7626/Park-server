const { Sequelize } = require('sequelize');


module.exports = new Sequelize(
    "online_park",
    "nikitos7626",
    "nikita777",
    {
        dialect: "mysql",
        host: "rc1d-zc9k9qff57phhvkb.mdb.yandexcloud.net",
        port: 3306
    }
)