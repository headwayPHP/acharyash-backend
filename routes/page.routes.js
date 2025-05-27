const express = require('express');
const router = express.Router();
const pageController = require('../controllers/page.controller');
const upload = require('../middlewares/upload')('pages', 'page');

// Admin Panel Routes
router.post('/', upload.single('image'), pageController.createPage);
router.get('/', pageController.getAllPages);
router.get('/:id', pageController.getPageById);
router.put('/:id', upload.single('image'), pageController.updatePage);
router.delete('/:id', pageController.deletePage);

module.exports = router;
