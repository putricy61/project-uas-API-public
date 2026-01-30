// const express = require('express')
// const authController = require('../controllers/auth-controller')

// const router = express.Router()

// router.post('/register', authController.register)
// router.post('/login', authController.login)
// router.get('/users/report', authController.getUserReport);
// router.delete('/users/:id', authController.removeUser);

// module.exports = router
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authMiddleware, authController.getProfile);     
router.put('/profile', authMiddleware, authController.updateProfile); 
router.get('/stats', authMiddleware, authController.getStats);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
