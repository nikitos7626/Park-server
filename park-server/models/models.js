const { DataTypes } = require('sequelize');
const Sequelize = require('../db');

const User = Sequelize.define('user', {
    user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    surname: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, unique: true },
    role: { type: DataTypes.STRING, defaultValue: 'USER' },
    password: { type: DataTypes.STRING }
}); 

const Ticket = Sequelize.define('ticket', {
    ticket_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING },
    price: { type: DataTypes.INTEGER },
    status: { type: DataTypes.STRING, defaultValue: 'ACTIVE' }, 
    used_at: { type: DataTypes.DATE }
});

const Attraction = Sequelize.define('attraction', {
    attraction_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, unique: true },
    name: { type: DataTypes.STRING },
    price: { type: DataTypes.FLOAT },
});


const Attendance = Sequelize.define('attendance', {//Содержит информацию о времени посещения
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    visit_time: { type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
});



User.hasMany(Ticket);
Ticket.belongsTo(User);

User.hasMany(Attendance);
Attendance.belongsTo(User);

Ticket.hasMany(Attendance);
Attendance.belongsTo(Ticket);
Attraction.hasMany(Ticket);
Ticket.belongsTo(Attraction);



module.exports = {
    User,
    Ticket,
    Attendance,
    Attraction
};
