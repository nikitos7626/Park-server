const Router = require('express')
const router = new Router()
const ticketController = require('../controller/ticketController')
const authMiddleware =require('../middleware/authMiddleware')


router.post('/buy',authMiddleware,ticketController.buyTicket)
router.post('/useTicket',authMiddleware,ticketController.useTicket)
router.get('/getTickets',authMiddleware,ticketController.getUserTicket)
router.post('/cancelTicket',authMiddleware,ticketController.cancelTicket)
module.exports = router