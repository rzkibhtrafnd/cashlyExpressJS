const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, authorizeRole('admin', 'kasir'), transactionController.index);
router.get('/report', verifyToken, authorizeRole('admin'), transactionController.report);
router.post('/', verifyToken, authorizeRole('admin', 'kasir'), transactionController.store);
router.get('/:id', verifyToken, authorizeRole('admin', 'kasir'), transactionController.show);

module.exports = router;