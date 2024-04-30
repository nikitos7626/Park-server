const Router = require('express')
const router = new Router()
const ticketRouter = require('./ticketRouter')
const userRouter = require('./userRouter')
const reportRouter = require('./ReportRouter')

router.use('/user', userRouter)
router.use('/ticket', ticketRouter)
router.use('/report',reportRouter)

module.exports = router