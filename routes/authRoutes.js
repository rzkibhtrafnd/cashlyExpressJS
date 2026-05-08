const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware');

// Rute Publik
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;