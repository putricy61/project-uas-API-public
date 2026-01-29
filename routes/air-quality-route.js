const express = require('express')
const controller = require('../controllers/air-quality-controller')
const authMiddleware = require('../middlewares/auth-middleware')
const router = express.Router()

router.get('/air-quality', controller.getAirQuality);

router.post('/air-quality', authMiddleware, controller.saveAirQuality)
router.get('/air-quality/location', authMiddleware, controller.getAirQualityByLocation)

router.delete('/air-quality/:id', authMiddleware, controller.deleteAirQuality)



module.exports = router
