const ApiError = require('../error/Apierror')
const {Attendance } = require('../models/models')

class AttendanceController {

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
            const { code } = req.params;
            const attendance = await Attendance.findAll({ where: { code } });
            return res.json(attendance);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new AttendanceController();