const ApiError = require('../error/Apierror')
const { User } = require('../models/models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config')
const { where } = require('sequelize')


const generateJwt = (id, email, role) => {
    return jwt.sign(
        { id, email, role },
        config.jwtSecret,
        { expiresIn: '24h' })
}

class userController {
    async registration(req, res, next) {
        const { email, password, role } = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('Неккоректная почта или пароль'))
        }
        const candidate = await User.findOne({ where: { email } })
        if (candidate) {    
            return next(ApiError.badRequest('Пользователь с такой почтой уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({ email, role, password: hashPassword })
        const token = generateJwt(user.id, user.email, user.role);
        return res.json({ token });
    }
    
    async blockUser(req, res, next) {
        const { email } = req.body; // Получаем email пользователя для блокировки

        if (!email) {
            return next(ApiError.badRequest('Не указан email пользователя'));
        }

        try {
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'));
            }

            // Блокировка пользователя (например, изменение роли)
            user.role = 'Banned'; // Предполагаем, что 'Banned' - это роль заблокированного пользователя
            await user.save();

            return res.json({ message: 'Пользователь успешно заблокирован' });
        } catch (error) {
            next(ApiError.badRequest('Ошибка при блокировке пользователя'));
        }
    }
    
    async getBalance(req, res, next) {
        const email = req.user.email;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return next(ApiError.badRequest('Пользователь не найден'));
        }

        return res.json({ balance: user.balance }); 
    }

    async balance(req, res, next) {
        const { balance } = req.body;    
        const email = req.user.email;
        const user = await User.findOne({ where: { email } });
        if (!user) {
          return next(ApiError.badRequest('Пользователь не найден'));
        }
      
        const currentBalance = user.balance !== undefined ? user.balance : 0;
        const newBalance = currentBalance + Number(balance);
      
        user.balance = newBalance;
        await user.save();
      
        return res.json({ message: 'Ваш баланс успешно пополнен', balance: user.balance });
      }

    async login(req, res, next) {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return next(ApiError.badRequest('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.badRequest('Пароль неверный'));
        }
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({ token });
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({ token })
    }

    async getAllUsers(req, res, next) {
        try {
          const users = await User.findAll();
          res.json(users);
        } catch (error) {
          next(ApiError.badRequest);
        }
      }

      async getUser(req, res, next) {
        const email = req.user.email; 
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return next(ApiError.badRequest('Пользователь не найден'));
        }

        return res.json({user});
    }
}

module.exports = new userController()