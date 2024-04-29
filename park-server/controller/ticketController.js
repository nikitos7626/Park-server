const ApiError = require('../error/Apierror')
const {Ticket} = require('../models/models')


class ticketController{

    async create(req,res,next){
        try{
            const {code,price} = req.body
            const ticket = await Ticket.create({code,price})
            return res.json(ticket)
        }
        catch(e){
        next(ApiError.badRequest(e.message));
        }
}

    async getAll (req,res,next){
        try{
            const tickets = await Ticket.findAll();
            return res.json(tickets);
            
        }catch(e){
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req,res,next){
        try{
        const {id} = req.params;
        await Ticket.destroy({where:{ticket_id:id}});
        return res.json({message:"Ticket deleted"});
        }
        catch(e){
            next(ApiError.badRequest(e.message));
        }
    } 
}

module.exports = new ticketController()