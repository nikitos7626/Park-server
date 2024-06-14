const ApiError = require('../error/Apierror');
const { Ticket, Attendance, Attraction } = require('../models/models');
const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');
const moment = require('moment');

class AttendanceController {
  async getOverallAttendance(req, res, next) {
    try {

      const ticketCounts = await Ticket.findAll({
        attributes: [
          'status',
          [Sequelize.fn('COUNT', Sequelize.col('status')), 'count'],
        ],
        group: ['status'],
        raw: true,
      });

 
      const data = ticketCounts.map((count) => ({
        name: count.status,
        value: count.count,
      }));


      const overallAttendance = data.reduce((sum, item) => sum + item.value, 0);


      res.json({  
        message: 'Overall attendance:',
        data, 
        overallAttendance:overallAttendance,
      });
    } catch (error) {
      next(ApiError.badRequest(error));
    }
  }
  

  async getWeeklyAttendanceByDay(req, res, next) {
    try {
      const currentDate = new Date();
      const startOfWeek = moment(currentDate).startOf('isoWeek').toDate();
      const endOfWeek = moment(currentDate).endOf('isoWeek').toDate();
  
      const weeklyAttendanceByDay = await Attendance.findAll({
        attributes: [
          [Sequelize.fn('DATE', Sequelize.col('visit_time')), 'day'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
        ],
        where: {
          visit_time: {
            [Op.between]: [startOfWeek, endOfWeek],
          },
        },
        group: ['day'],
        order: [['day', 'ASC']],
        raw: true,
      });
  
      const formattedData = Array.from({ length: 7 }, (_, index) => {
        const dayDate = moment(startOfWeek).add(index, 'days').toDate();
        const dayAttendance = weeklyAttendanceByDay.find(
          (item) => moment(item.day).isSame(dayDate, 'day')
        );
        return {
          day: moment(dayDate).format('DD.MM'),
          count: dayAttendance ? dayAttendance.count : 0,
        };
      });
  
      res.json({ message: 'Weekly attendance by day:', data: formattedData });
    } catch (error) {
      next(ApiError.badRequest(error));
    }
  }
  
}

module.exports = new AttendanceController();