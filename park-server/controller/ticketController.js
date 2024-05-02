const ApiError = require('../error/Apierror')
const { Ticket } = require('../models/models')
const {User,Attraction} = require('../models/models')
const authMiddleware = require('../middleware/authMiddleware')
const jwt = require('jsonwebtoken')
const config = require('../config')

const generateJwt = (user_id,name_attraction,price)=>{
    return jwt.sign(
        {user_id,name_attraction,price},
        config.jwtSecret,
        {expiresIn:'24h'})
}


class ticketController {

    async purchase(req,res,next){//покупка билетов
        try {
                const {name_attraction,price} = req.body;
                const attraction = await Attraction.findOne({where:{name:name_attraction}})
                if(!attraction){
                    next(ApiError.badRequest('Такого аттракциона не существует'))
                }
                
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