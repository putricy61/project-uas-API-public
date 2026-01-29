const express = require('express')
const authController = require('../controllers/auth-controller')

const router = express.Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/users/report', authController.getUserReport);
router.delete('/users/:id', authController.removeUser);

module.exports = router
