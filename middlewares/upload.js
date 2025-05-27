const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createUploadMiddleware = (folderName, prefix = 'file') => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadDir = path.join('uploads', folderName);

            // Ensure the upload directory exists
            fs.mkdirSync(uploadDir, { recursive: true });

            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            cb(null, `${prefix}-${uniqueSuffix}${ext}`);
        }
    });

    const fileFilter = (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP are allowed.'));
        }
    };

    return multer({
        storage,
        fileFilter,
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    });
};

module.exports = createUploadMiddleware;
