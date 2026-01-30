// const express = require('express')
// const controller = require('../controllers/location-controller')
// const authMiddleware = require('../middlewares/auth-middleware')
// const router = express.Router()

// router.get('/location/search', controller.getLocation)
// router.post('/locations', authMiddleware, controller.saveLocation)
// router.get('/location/user', authMiddleware, controller.getUserLocation)
// router.get('/location/detail/:city', authMiddleware, controller.getLocationDetail)
// router.delete('/location/:city', authMiddleware, controller.deleteUserLocation)

// module.exports = router

const express = require('express');
const router = express.Router();
const articleController = require('../controllers/article-controller');
const authMiddleware = require('../middlewares/auth-middleware');

// Tampilan Default (API)
router.get('/all', authMiddleware, articleController.getAllArticles);
router.post('/search', authMiddleware, articleController.searchByQuery);
router.post('/favorite', authMiddleware, articleController.saveToFavorite);
router.get('/favorites', authMiddleware, articleController.getDbFavorites);
router.delete('/favorite/:id', authMiddleware, articleController.remove);
router.get('/favorites/:id', authMiddleware, articleController.getDetail);

module.exports = router;
