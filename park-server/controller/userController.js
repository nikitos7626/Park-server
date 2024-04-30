const ApiError = require('../error/Apierror')
const {User} = require('../models/models')
const bcrypt = require('bcrypt')
const jwt =require('jsonwebtoken')
const config = require('../config')
const { where } = require('sequelize')


const generateJwt= (id,email,role)=>{
    return jwt.sign(
        {id,email,role},
        config.jwtSecret,  
        {expiresIn:'24h'})
}

class userController {
    async registration(req, res,next) {
        const {email,password,role} = req.body
        if(!email || !password){
            return next(ApiError.badRequest('Неккоректная почта или пароль'))

        }
        const candidate = await User.findOne({where:{email}})
        if(candidate){
            return next(ApiError.badRequest('Пользователь с такой почтой уже существует'))
        }
        const hashPassword = await bcrypt.hash(password,5)
        const user = await User.create({email,role,password:hashPassword})
        const token = generateJwt(user.id,user.email,user.role);
        return res.json({token});
    }

    async login(req, res,next) {
        const {email,password} =req.body;
        const user = await User.findOne({where:{email}})
        if(!user){
            return next(ApiError.badRequest('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password,user.password)
        if(!comparePassword)
        {
            return next(ApiError.badRequest('Пароль не верный'));
        }
        const token = generateJwt(user.id,user.email,user.role)
        return res.json({token});
    }

    async check(req, res, next) {
    }
}

module.exports = new userController()