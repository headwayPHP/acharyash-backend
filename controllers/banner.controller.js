const bannerService = require('../services/banner.service');

// POST /api/banners
const createBanner = async (req, res) => {
    // Destructure the name and status from req.body and handle file upload with req.file
    const { name } = req.body;
    const photo = req.file ? req.file.path : null; // Handle the file upload path from multer

    // Validate the input
    if (!name || !photo ) {
        return res.status(400).json({
            status: false,
            message: 'Name, photo, and status are required',
        });
    }

    try {
        const bannerData = { name, photo };
        const banner = await bannerService.createBanner(bannerData);
        res.status(201).json({
            status: true,
            message: 'Banner created successfully',
            data: banner,
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
        });
    }
};

// GET /api/banners
const getAllBanners = async (req, res) => {
    try {
        const banners = await bannerService.getAllBanners();

        // Convert relative photo path to full URL
        const host = req.protocol + '://' + req.get('host');
        const updatedBanners = banners.map(banner => {
            return {
                ...banner.toObject(), // convert Mongoose doc to plain object
                photo: banner.photo ? `${host}/${banner.photo.replace(/\\/g, '/')}` : null
            };
        });

        res.status(200).json({
            status: true,
            message: 'Banners fetched successfully',
            data: updatedBanners,
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
        });
    }
};

// GET /api/banners/:id
const getBannerById = async (req, res) => {
    const { id } = req.params;

    try {
        const banner = await bannerService.getBannerById(id);

        if (!banner) {
            return res.status(404).json({
                status: false,
                message: 'Banner not found',
            });
        }

        // Convert local path to full URL
        const hostUrl = `${req.protocol}://${req.get('host')}`;
        const fullPhotoPath = banner.photo
            ? `${hostUrl}/${banner.photo.replace(/\\/g, '/')}`
            : null;

        const responseData = {
            ...banner.toObject(),
            photo: fullPhotoPath,
        };

        res.status(200).json({
            status: true,
            message: 'Banner fetched successfully',
            data: responseData,
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
        });
    }
};

// PUT /api/banners/:id
const updateBanner = async (req, res) => {
    const { id } = req.params;
    const { name, status } = req.body;
    const photo = req.file ? req.file.path : null;

    try {
        const updatedBanner = await bannerService.updateBanner(id, {
            name,
            ...(photo && { photo }), // Only include photo if a new one is uploaded
            status,
        });

        if (!updatedBanner) {
            return res.status(404).json({
                status: false,
                message: 'Banner not found',
            });
        }

        const hostUrl = `${req.protocol}://${req.get('host')}`;
        const fullPhotoPath = updatedBanner.photo
            ? `${hostUrl}/${updatedBanner.photo.replace(/\\/g, '/')}`
            : null;

        const responseData = {
            ...updatedBanner.toObject(),
            photo: fullPhotoPath,
        };

        res.status(200).json({
            status: true,
            message: 'Banner updated successfully',
            data: responseData,
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
        });
    }
};

// DELETE /api/banners/:id
const deleteBanner = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await bannerService.deleteBanner(id);
        res.status(200).json({
            status: true,
            message: result.message,
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
        });
    }
};

module.exports = {
    createBanner,
    getAllBanners,
    getBannerById,
    updateBanner,
    deleteBanner,
};
