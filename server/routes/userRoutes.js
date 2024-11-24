const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/user', verifyToken, userController.getUser);
router.patch('/user/change-password', verifyToken, userController.changePassword);
router.patch('/user/update', verifyToken, userController.updateUser);

module.exports = router;
