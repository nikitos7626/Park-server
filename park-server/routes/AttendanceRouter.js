const Router = require('express')
const router = new Router()
const AttendanceController = require ('../controller/AttendanceController')

router.get('/overall', AttendanceController.getOverallAttendance);
router.get('/weekly-attendance-by-day', AttendanceController.getWeeklyAttendanceByDay); 

module.exports = router