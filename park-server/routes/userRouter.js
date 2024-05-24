const Router = require('express')
const router = new Router()
const userController = require('../controller/userController')
const authMiddleware = require('../middleware/authMiddleware')


router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth',authMiddleware, userController.check)
router.post('/addmoney',authMiddleware,userController.balance)
router.get('/getBalance',authMiddleware,userController.getBalance)
router.get('/getAllUsers',userController.getAllUsers)
router.get('/getUser',authMiddleware,userController.getUser)
module.exports = router