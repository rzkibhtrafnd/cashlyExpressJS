const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productController = require('../controllers/productController');
const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', verifyToken, authorizeRole('admin', 'kasir'), productController.getAll);
router.post('/', verifyToken, authorizeRole('admin', 'kasir'), upload.single('image'), productController.create);
router.get('/:id', verifyToken, authorizeRole('admin', 'kasir'), productController.getById);
router.put('/:id', verifyToken, authorizeRole('admin', 'kasir'), upload.single('image'), productController.update);
router.delete('/:id', verifyToken, authorizeRole('admin', 'kasir'), productController.delete);

module.exports = router;