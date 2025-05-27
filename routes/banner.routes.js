const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload')('banners', 'banner');
const bannerController = require('../controllers/banner.controller');

// POST /api/banners
router.post('/', upload.single('photo'),bannerController.createBanner);

// GET /api/banners
router.get('/', bannerController.getAllBanners);

// GET /api/banners/:id
router.get('/:id', bannerController.getBannerById);

// PUT /api/banners/:id
router.put('/:id', upload.single('photo'),bannerController.updateBanner);

// DELETE /api/banners/:id
router.delete('/:id', bannerController.deleteBanner);

module.exports = router;
