const ApiError = require('../error/Apierror');
const {Ticket,Attendance} = require('../models/models')


class ReportController {
    async generateReport(req, res, next) {
      try {
        const ticketSales = await Ticket.findAll({
          attributes: ['code', 'price', 'status', 'used_at', 'userId'],
          order: [['used_at', 'DESC']],
        });
  
        const attractionAttendance = await Attendance.findAll({
          attributes: ['id', 'ticketId', 'userId', 'visit_time'],
          order: [['visit_time', 'DESC']],
          include: [
            {
              model: Ticket,
              attributes: ['code', 'price'],
            },
          ],
        });
  
        // Формирование отчета
        const report = {
          ticketSales: ticketSales.map((ticket) => ({
            code: ticket.code,
            price: ticket.price,
            status: ticket.status,
            usedAt: ticket.used_at,
            userId: ticket.userId,
          })),
          attractionAttendance: attractionAttendance.map((attendance) => ({
            id: attendance.id,
            ticketCode: attendance.Ticket.code,
            ticketPrice: attendance.Ticket.price,
            userId: attendance.userId,
            visitTime: attendance.visit_time,
          })),
        };
  
        // Возврат отчета
        return res.json(report);
      } catch (e) {
        next(ApiError.internal(e.message));
      }
    }
  }
  
  module.exports = new ReportController();