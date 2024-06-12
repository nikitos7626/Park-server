const ApiError = require('../error/Apierror');
const { Ticket, Attendance, Attraction } = require('../models/models');
const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');
const moment = require('moment'); // Import moment for date manipulation

class AttendanceController {
  async getOverallAttendance(req, res, next) {
    try {
      // Получаем количество билетов по каждому статусу
      const ticketCounts = await Ticket.findAll({
        attributes: [
          'status',
          [Sequelize.fn('COUNT', Sequelize.col('status')), 'count'],
        ],
        group: ['status'],
        raw: true,
      });

      // Преобразуем результаты в формат, подходящий для диаграммы
      const data = ticketCounts.map((count) => ({
        name: count.status,
        value: count.count,
      }));

      // Считаем общее количество билетов
      const overallAttendance = data.reduce((sum, item) => sum + item.value, 0);

      // Отправляем ответ с данными о посещаемости
      res.json({
        message: 'Overall attendance:',
        data,
        overallAttendance,
      });
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