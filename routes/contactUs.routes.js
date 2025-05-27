// routes/contactUs.routes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../middlewares/upload')('contact-us', 'contact');
const contactUsController = require('../controllers/contactUs.controller');


// POST /api/contact-us
router.post('/', upload.single('photo'),contactUsController.createContactUs);

router.put('/:id',  upload.single('photo'),contactUsController.updateContactMessage);

// GET /api/contact-us
router.get('/', contactUsController.getAllContactUs);

// GET /api/contact-us/:id
router.get('/:id', contactUsController.getContactUsById);

// PUT /api/contact-us/:id/status
router.put('/:id/status', upload.single('photo'),contactUsController.updateContactUsStatus);

// DELETE /api/contact-us/:id
router.delete('/:id', contactUsController.deleteContactUs);

module.exports = router;
