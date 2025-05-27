const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload')('users', 'user');
const adminDashboardController = require('../controllers/adminDashboardController');

router.get('/', authMiddleware, userController.getUsers);
router.post('/', userController.createUser);
router.get('/dashboard', adminDashboardController.getDashboardData);
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile',upload.single('image'), authMiddleware, userController.updateProfile);


module.exports = router;
