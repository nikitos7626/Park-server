const Router = require('express')
const router = new Router()
const AttractionController = require('../controller/attractionController')
const checkRole = require('../middleware/checkRoleMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/create',authMiddleware,checkRole('ADMIN'),AttractionController.createAttractions)

module.exports = router 
