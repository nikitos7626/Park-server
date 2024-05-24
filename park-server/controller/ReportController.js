const ApiError = require('../error/Apierror');
const { Ticket, Attendance, Attraction } = require('../models/models');


class ReportController {
    async generateReport(req, res, next) {
      const ticketSales = await Ticket.findAll({
        attributes: ['name', 'status', 'used_at', 'username'],
        order: [['used_at', 'DESC']],
      });
      
      const attractionAttendance = await Attendance.findAll({
        attributes: ['id', 'ticketId', 'email', 'visit_time'],
        order: [['visit_time', 'DESC']],
        include: [
          {
            model: Ticket,
            attributes: ['ticket_id'],
            include: [
              {
                model: Attraction,
                attributes: ['name', 'price'],
              },
            ],
          },
        ],
      });
      
      // Формирование отчета
      const report = {
        ticketSales: ticketSales.map((ticket) => ({
          ticketId: ticket.name,
          status: ticket.status,
          usedAt: ticket.used_at,
          userId: ticket.userId,
        })),
        attractionAttendance: attractionAttendance.map((attendance) => ({
          id: attendance.id,
          ticketId: attendance.username,
          attractionName: attendance.Ticket.attraction.name,
          attractionPrice: attendance.Ticket.attraction.price,
          visitTime: attendance.visit_time,
        })),
      };
      
      // Возврат отчета
      return res.json(report);
    }
  }
  module.exports =  new ReportController();