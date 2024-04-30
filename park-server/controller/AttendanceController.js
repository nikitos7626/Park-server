const ApiError = require('../error/Apierror')
const { Ticket, Attendance } = require('../models/models')

class AttendanceController {
    async use(req, res, next) {
        try {
            const { ticketId, userId } = req.body;
            const ticket = await Ticket.findOne({ where: { ticket_id: ticketId, userId } });//Позволяет пользователю использовать (посетить) определенный аттракцион.
            if (!ticket || ticket.status !== 'ACTIVE') {
                return next(ApiError.badRequest('Invalid ticket'));
            }
            await ticket.update({ status: 'USED', used_at: new Date() });
            const attendance = await Attendance.create({ ticketId, userId });
            return res.json(attendance);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getHistoryByUser(req, res, next) { //Возвращает историю посещений определенного пользователя.
        try {
            const { userId } = req.params;
            const attendance = await Attendance.findAll({ where: { userId } });
            return res.json(attendance);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getHistoryByAttraction(req, res, next) {//Возвращает историю посещений определенного аттракциона.
        try {
            const { ticketId } = req.params;
            const attendance = await Attendance.findAll({ where: { ticketId } });
            return res.json(attendance);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new AttendanceController();