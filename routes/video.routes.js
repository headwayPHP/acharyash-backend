const express = require('express');
const router = express.Router();
const videoController = require('../controllers/video.controller');
const upload = require('../middlewares/upload')('videos', 'video');

router.post('/',upload.single('image'), videoController.createVideo);
router.get('/', videoController.getAllVideos);
router.get('/:id', videoController.getVideoById);
router.put('/:id', upload.single('image'), videoController.updateVideo);
router.delete('/:id', videoController.deleteVideo);

module.exports = router;
