const express = require('express');
const router = express.Router();
const controller = require('../controllers/weather-controller');
const authMiddleware = require('../middlewares/auth-middleware'); // Pastikan path foldernya benar

router.get('/weather', controller.getWeatherByCity);
router.post('/weather/sync', authMiddleware, controller.syncWeather);
router.get('/history', authMiddleware, controller.getAllWeather);
router.get('/latest/:city', authMiddleware, controller.getLatestWeather);
router.delete('/weather/city/:city', authMiddleware, controller.removeWeatherByCity);



module.exports = router;