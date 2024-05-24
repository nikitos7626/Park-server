const Router = require('express')
const router = new Router()
const ReportController = require('../controller/ReportController');
const { check } = require('../controller/userController');
const checkRole = require('../middleware/checkRoleMiddleware')

router.get('/getReport',checkRole('ADMIN'),ReportController.generateReport);

module.exports = router;