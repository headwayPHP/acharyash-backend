const Banner = require('../models/Banner');
const path = require('path');
const fs = require('fs');

// Create a new banner
const createBanner = async (bannerData) => {
    try {
        const banner = new Banner(bannerData);
        await banner.save();
        return banner;
    } catch (err) {
        throw new Error(`Create Banner Error: ${err.message}`);
    }
};

// Get all banners
const getAllBanners = async () => {
    try {
        return await Banner.find().sort({ createdAt: -1 }); // Optional: most recent first
    } catch (err) {
        throw new Error(`Get All Banners Error: ${err.message}`);
    }
};

// Get a banner by ID
const getBannerById = async (id) => {
    try {
        return await Banner.findById(id);
    } catch (err) {
        throw new Error(`Get Banner By ID Error: ${err.message}`);
    }
};

// Update a banner
const updateBanner = async (id, updatedData) => {
    try {
        return await Banner.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
    } catch (err) {
        throw new Error(`Update Banner Error: ${err.message}`);
    }
};

// Delete a banner
const deleteBanner = async (id) => {
    try {
        const banner = await Banner.findById(id);
        if (!banner) {
            throw new Error('Banner not found');
        }

        // Remove the photo file if it exists
        if (banner.photo) {
            const filePath = path.join(__dirname, '..', banner.photo.replace(/\\/g, '/')); // Normalize slashes
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await Banner.findByIdAndDelete(id);

        return { message: 'Banner deleted successfully' };
    } catch (err) {
        throw new Error(`Delete Banner Error: ${err.message}`);
    }
};
module.exports = {
    createBanner,
    getAllBanners,
    getBannerById,
    updateBanner,
    deleteBanner,
};
