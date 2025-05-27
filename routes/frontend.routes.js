const express = require('express');
const router = express.Router();
const frontendController = require('../controllers/frontend.controller');

// Footer info API
router.get('/footer-info', frontendController.getFooterInfo);
router.get('/gallery', frontendController.getPhotos);
router.get('/videos', frontendController.getVideos);
router.get('/homepage', frontendController.getHomepage);
router.get('/donate', frontendController.getDonatePage);
router.get('/privacy-policy', frontendController.getPrivacyPage);
router.get('/terms', frontendController.getTermsPage);



module.exports = router;