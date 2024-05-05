const Router = require('express')
const router = new Router()
const ticketController = require('../controller/ticketController')
const authMiddleware =require('../middleware/authMiddleware')


router.post('/buy',authMiddleware,ticketController.buyTicket)
router.post('/useTicket',authMiddleware,ticketController.useTicket)
module.exports = router