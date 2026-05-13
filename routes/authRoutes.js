const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware');

router.post('/login', authController.login);
router.post('/logout', verifyToken, authController.logout);

module.exports = router;