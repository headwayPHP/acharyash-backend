const photoService = require('../services/photo.service');

exports.createPhoto = async (req, res) => {
    try {
        const { title, altText, is_featured } = req.body;
        const image = req.file ? req.file.filename : null;

        const photo = await photoService.createPhoto({ title, image, altText, is_featured });

        res.status(201).json({ status: true, message: 'Photo created', data: photo });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.addMultiplePhotos = async (req, res) => {
    try {
        const { is_featured } = req.body; // This will be an array of strings (like 'true', 'false')
        const savedPhotos = await photoService.addMultiplePhotos(req.files, req.body);

        res.status(200).json({
            status: true,
            message: 'Photos uploaded successfully',
            data: savedPhotos
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
};
;

exports.getAllPhotos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const { photos, total } = await photoService.getAllPhotos(page, limit);

        const updatedPhotos = photos.map(photo => ({
            ...photo.toObject(),
            image: photo.image
                ? `${req.protocol}://${req.get('host')}/uploads/photos/${photo.image.replace(/\\/g, '/')}`
                : null,
        }));

        res.status(200).json({
            status: true,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalPhotos: total,
            data: updatedPhotos
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

//TODO: what was the problem?

exports.getPhotoById = async (req, res) => {
    try {
        const photo = await photoService.getPhotoById(req.params.id);
        if (!photo) {
            return res.status(404).json({ status: false, message: 'Photo not found' });
        }

        // Convert to plain object and add full image URL if image exists
        const photoObj = photo.toObject();
        if (photoObj.image) {
            photoObj.image = `${req.protocol}://${req.get('host')}/uploads/photos/${photoObj.image}`;
        }

        res.status(200).json({ status: true, data: photoObj });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};


exports.updatePhoto = async (req, res) => {
    try {
        const { title, altText, is_featured, status } = req.body;
        const image = req.file ? req.file.filename : undefined;

        const updateData = { title, altText, is_featured, status };
        if (image) updateData.image = image;

        const updated = await photoService.updatePhoto(req.params.id, updateData);
        if (!updated) {
            return res.status(404).json({ status: false, message: 'Photo not found' });
        }

        // Add full URL to image if it exists
        const updatedObj = updated.toObject();
        if (updatedObj.image) {
            updatedObj.image = `${req.protocol}://${req.get('host')}/uploads/photos/${updatedObj.image}`;
        }

        res.status(200).json({
            status: true, message: 'Photo updated', data: updatedObj,
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};


exports.deletePhoto = async (req, res) => {
    try {
        const deleted = await photoService.deletePhoto(req.params.id);
        if (!deleted) return res.status(404).json({ status: false, message: 'Photo not found' });

        res.status(200).json({ status: true, message: 'Photo deleted' });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};
