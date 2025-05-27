const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photo.controller');
const upload = require('../middlewares/upload')('photos', 'photo'); // Reuse your multer setup

router.post('/', upload.single('image'), photoController.createPhoto);
router.get('/', photoController.getAllPhotos);
router.get('/:id', photoController.getPhotoById);
router.put('/:id', upload.single('image'), photoController.updatePhoto);
router.delete('/:id', photoController.deletePhoto);

router.post('/upload-multiple', upload.array('image', 99), photoController.addMultiplePhotos);

module.exports = router;
