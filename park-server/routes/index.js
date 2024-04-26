const Router = require('express')
const router = new Router()
const ticketRouter = require('./ticketRouter')
const userRouter = require('./userRouter')


router.use('/user',userRouter)
router.use('/ticket',ticketRouter)


module.exports = router