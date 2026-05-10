const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware'); 

router.get('/', verifyToken, settingController.get);

router.post('/', 
    verifyToken, 
    authorizeRole('admin'),
    upload.fields([
        { name: 'imgLogo', maxCount: 1 }, 
        { name: 'imgQris', maxCount: 1 }
    ]), 
    settingController.update
);

module.exports = router;