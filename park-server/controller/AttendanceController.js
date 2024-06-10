const ApiError = require('../error/Apierror');
const { Ticket, Attendance, Attraction } = require('../models/models');
const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');
const moment = require('moment'); // Import moment for date manipulation

class AttendanceController {
  async getOverallAttendance(req, res, next) {//количество посещений за всё время
    try {
      const totalAttendance = await Attendance.count();
      res.json({ message: 'Overall attendance:', data: totalAttendance }); // Corrected message
    } catch (error) {
      next(ApiError.badRequest(error));
    }
  }

  async getWeeklyAttendanceByDay(req, res, next) {//количество посещений в день
    try {
      const currentDate = new Date();
      const startOfWeek = moment(currentDate).startOf('week').toDate();
      const endOfWeek = moment(currentDate).endOf('week').toDate();

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
        raw: true,
      });

      res.json({ message: 'Weekly attendance by day:', data: weeklyAttendanceByDay });
    } catch (error) {
      next(ApiError.badRequest(error));
    }
  }
}

module.exports = new AttendanceController();