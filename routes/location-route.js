const express = require('express')
const controller = require('../controllers/location-controller')
const authMiddleware = require('../middlewares/auth-middleware')
const router = express.Router()

router.get('/location/search', controller.getLocation)
router.post('/locations', authMiddleware, controller.saveLocation)
router.get('/location/user', authMiddleware, controller.getUserLocation)
router.get('/location/detail/:city', authMiddleware, controller.getLocationDetail)
router.delete('/location/:city', authMiddleware, controller.deleteUserLocation)

module.exports = router
