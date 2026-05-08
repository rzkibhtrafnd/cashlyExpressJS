const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, authorizeRole('admin'), categoryController.getAll);
router.post('/', verifyToken, authorizeRole('admin'), categoryController.create);
router.put('/:id', verifyToken, authorizeRole('admin'), categoryController.update);
router.delete('/:id', verifyToken, authorizeRole('admin'), categoryController.delete);

module.exports = router;