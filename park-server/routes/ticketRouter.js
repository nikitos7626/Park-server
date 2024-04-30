const Router = require('express')
const router = new Router()
const ticketController = require('../controller/ticketController')

router.get('/getTickets', ticketController.getAll)
router.post('/')
router.get('/')

module.exports = router