const Router = require('express')
const router = new Router()
const AttractionController = require('../controller/attractionController')
const checkRole = require('../middleware/checkRoleMiddleware')
const authMiddleware = require('../middleware/authMiddleware')
const attractionController = require('../controller/attractionController')

router.post('/create',authMiddleware,checkRole('ADMIN'),AttractionController.createAttractions)
router.get('/getAllAttractions',attractionController.getAllAttractions)
module.exports = router
