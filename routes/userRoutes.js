const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, authorizeRole('admin'), userController.getAll);
router.post('/', verifyToken, authorizeRole('admin'), userController.create);
router.get('/:id', verifyToken, authorizeRole('admin'), userController.getById);
router.put('/:id', verifyToken, authorizeRole('admin'), userController.update);
router.delete('/:id', verifyToken, authorizeRole('admin'), userController.delete);

module.exports = router;