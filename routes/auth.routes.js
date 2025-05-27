const express = require('express');
const router = express.Router();
const { register, login, logoutAdmin } = require('../controllers/auth.controller');
const upload = require('../config/multerConfig'); // multer for file handling

// Register route (handling form-data with file upload)
router.post('/registers', upload.single('profileImage'), register);

// Login route (no file upload needed)
router.post('/login', login);
router.post('/logout', logoutAdmin);

module.exports = router;
