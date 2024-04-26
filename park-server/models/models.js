const {DataTypes} = require('sequelize');
const Sequelize = require('../db');

    const User = Sequelize.define('user',{
    user_id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    name:{type:DataTypes.STRING},
    surname:{type:DataTypes.STRING},
    email:{type:DataTypes.STRING, unique:true},
    role:{type:DataTypes.STRING,defaultValue:"USER"},
    password_hash:{type:DataTypes.STRING}
    })

    const Ticket = Sequelize.define('tickets',{
    ticket_id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    code:{type:DataTypes.STRING},
    price:{type:DataTypes.INTEGER}
    })

    const Basket = Sequelize.define('basket',{
        id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},

    })

    User.hasOne(Basket);
    Basket.belongsTo(User);

    User.hasMany(Ticket);
    Ticket.belongsTo(User);


    module.exports ={
        User,Basket,Ticket
    }