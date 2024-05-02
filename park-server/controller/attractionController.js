const ApiError = require('../error/Apierror')
const { Attraction } = require('../models/models')

class AttractionController{
    

    async createAttractions(req,res,next){
        try{    
            const{name,price} = req.body
            const attraction = await Attraction.create({name,price})
            res.json({attraction})


        }catch(e){
            next(ApiError.badRequest('Неправильно введены значения аттракиона'))
        }
    }
}

module.exports = new(AttractionController)
