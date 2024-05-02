const Router = require('express')
const router = new Router()
const ticketController = require('../controller/ticketController')
const authMiddleware =require('../middleware/authMiddleware')


router.get('/getTickets',ticketController.getAll)
router.post('/buy',authMiddleware,ticketController.purchase)
router.get('/')

module.exports = router