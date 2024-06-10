const Router = require('express')
const router = new Router()
const ticketRouter = require('./ticketRouter')
const userRouter = require('./userRouter')
const reportRouter = require('./ReportRouter')
const attractionRouter = require('./AttractionRouter')
const attendanceRouter = require('./AttendanceRouter')


router.use('/user', userRouter)
router.use('/ticket', ticketRouter)
router.use('/report',reportRouter)
router.use('/attraction',attractionRouter)
router.use('/attendance',attendanceRouter)

module.exports = router