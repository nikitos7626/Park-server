const Router = require('express')
const router = new Router()
const ReportController = require('../controller/ReportController')

router.get('/getReport', ReportController.generateReport);

module.exports = router;