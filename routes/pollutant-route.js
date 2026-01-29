const express = require('express')
const controller = require('../controllers/pollutant-controller')
const authMiddleware = require('../middlewares/auth-middleware')
const { getPollutantByCity } = require('../controllers/pollutant-controller');
const router = express.Router()

router.get('/', getPollutantByCity);
router.post('/sync', authMiddleware, controller.syncPollutant);
router.get('/pollutant/latest/:city', authMiddleware,controller.getLatestPollutant)
router.delete('/pollutant/city/:city', authMiddleware,controller.removePollutantHistory)
module.exports = router
