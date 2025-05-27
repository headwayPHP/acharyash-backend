const express = require('express');
const router = express.Router();
const kathaController = require('../controllers/katha.controller');
const upload = require('../middlewares/upload')('kathas', 'katha');
// const multer = require('../middlewares/kathaUpload'); // customized multer for katha images

router.post('/', upload.single('image'), kathaController.createKatha);
router.get('/', kathaController.getAllKathas);
router.get('/:id', kathaController.getKathaById);
router.put('/:id', upload.single('image'), kathaController.updateKatha);
router.delete('/:id', kathaController.deleteKatha);

module.exports = router;
