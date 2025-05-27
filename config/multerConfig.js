const multer = require('multer');

// Set up the storage location and filename for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Upload folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Timestamp to avoid filename conflicts
    },
});

// Initialize multer with storage configuration
const upload = multer({ storage });

module.exports = upload;
