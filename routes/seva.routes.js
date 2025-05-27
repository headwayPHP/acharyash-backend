const express = require('express');
const router = express.Router();
const sevaController = require('../controllers/seva.controller');
const upload = require('../middlewares/upload')('sevas', 'seva');

router.post('/', upload.single('image'), sevaController.createSeva);
router.get('/', sevaController.getAllSevas);
router.get('/:id', sevaController.getSevaById);
router.put('/:id', upload.single('image'), sevaController.updateSeva);
router.delete('/:id', sevaController.deleteSeva);

module.exports = router;
