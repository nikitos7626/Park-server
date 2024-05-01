const ApiError = require('../error/Apierror')
const { Ticket } = require('../models/models')
const {User} = require('../models/models')
const authMiddleware = require('../middleware/authMiddleware')

class ticketController {

    async purchase(req,res,next){//покупка билетов
        try {
            const { userId, code, price } = req.body;
            const user = await User.findByPk(userId);
            if (!user) {
              return next(ApiError.badRequest('User not found'));
            }
            const ticket = await Ticket.create({code,price,userId});
            return res.json(ticket);
          } catch (e) {
            next(ApiError.badRequest(e.message));
          }
    }

    async getAll(req, res, next) {
        try {
            const tickets = await Ticket.findAll();
            return res.json(tickets);

        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getOne(req,res,next){
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await Ticket.destroy({ where: { ticket_id: id } });
            return res.json({ message: "Ticket deleted" });
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new ticketController()