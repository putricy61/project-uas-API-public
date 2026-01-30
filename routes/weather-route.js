// const express = require('express');
// const router = express.Router();
// const controller = require('../controllers/weather-controller');
// const authMiddleware = require('../middlewares/auth-middleware'); // Pastikan path foldernya benar

// router.get('/weather', controller.getWeatherByCity);
// router.post('/weather/sync', authMiddleware, controller.syncWeather);
// router.get('/history', authMiddleware, controller.getAllWeather);
// router.get('/latest/:city', authMiddleware, controller.getLatestWeather);
// router.delete('/weather/city/:city', authMiddleware, controller.removeWeatherByCity);



// module.exports = router;
const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weather-controller');
const authMiddleware = require('../middlewares/auth-middleware');

router.get('/search', authMiddleware, weatherController.searchAndShow);
router.post('/favorite', authMiddleware, weatherController.saveToFavorite);
router.get('/favorites', authMiddleware, weatherController.getHistory);
router.delete('/favorite/:id', authMiddleware, weatherController.remove);
router.get('/stats', authMiddleware, weatherController.getStats);

module.exports = router;
