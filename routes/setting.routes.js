const express = require('express');
const router = express.Router();
const settingController = require('../controllers/setting.controller');
const upload = require('../middlewares/upload')('settings', 'setting');

// For internal use (you only)
router.post('/create', upload.single('value'), settingController.createSetting);
router.delete('/:id', settingController.deleteSetting);

// For admin panel frontend
router.get('/', settingController.getAllSettings);
// router.put('/update-values', upload.single('value'),settingController.updateSettingsByIds);
router.put('/update-values', upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'bank_logo', maxCount: 1 }
]), settingController.updateSettingsByNames);
module.exports = router;
