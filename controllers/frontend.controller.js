const settingService = require('../services/setting.service');
const Page = require('../models/Page');
const photoService = require('../services/photo.service');
const videoService = require('../services/video.service');
const homepageService = require('../services/homepageService');

exports.getHomepage = async (req, res) => {
    try {
        const data = await homepageService.getHomepageData();

        return res.status(200).json({
            status: true, message: "Homepage data fetched successfully", data
        });

    } catch (error) {
        console.error("Error fetching homepage data:", error);
        return res.status(500).json({
            status: false, message: "Something went wrong",
        });
    }
};
exports.getDonatePage = async (req, res) => {
    try {
        const data = await homepageService.getDonateData();

        return res.status(200).json({
            status: true, message: "Homepage data fetched successfully", data
        });

    } catch (error) {
        console.error("Error fetching homepage data:", error);
        return res.status(500).json({
            status: false, message: "Something went wrong",
        });
    }
};

// function getGoogleMapUrl(name, address, pinCode, city, state, country) {
//     const fullAddress = encodeURIComponent(`${name}, ${address}, ${pinCode}, ${city}, ${state}, ${country}`);
//     const mapUrl = `https://www.google.com/maps?q=${fullAddress}&output=embed`;
//     return mapUrl;
// }
function getGoogleMapUrl(fullAddress) {
    const encodedAddress = encodeURIComponent(fullAddress);
    return `https://www.google.com/maps?q=${encodedAddress}&output=embed`;
}

exports.getFooterInfo = async (req, res) => {
    try {
        const footerSettingNames = ['address', 'email', 'mobile', 'facebook', 'instagram', 'youtube'];

        const [footerSettings, liveDarshanSetting] = await Promise.all([
            settingService.getSettingsByNames(footerSettingNames),
            videoService.getLiveDarshan()
        ]);

        // Convert settings array to object
        const settings = {};
        footerSettings.forEach(setting => {
            settings[setting.name] = setting.value;
        });

        // Build map URL using the full address value directly
        const mapUrl = getGoogleMapUrl(`Vallabhdham Haveli, ${settings.address}`);

        res.status(200).json({
            status: true,
            data: {
                footerSettings,
                live_darshan: liveDarshanSetting?.value || null,
                map_url: mapUrl
            }
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
};
exports.getPrivacyPage = async (req, res) => {
    try {
        const privacy = await Page.findOne({ _id: '6826e0ca4445ce4f96d85343' });

        if (!privacy) {
            return res.status(404).json({ status: false, message: "Privacy setting not found" });
        }

        res.status(200).json({ status: true, data: privacy });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};
exports.getTermsPage = async (req, res) => {
    try {
        const privacy = await Page.findOne({ _id: '6826f95dd346f36dcd6322ee' });

        if (!privacy) {
            return res.status(404).json({ status: false, message: "Privacy setting not found" });
        }

        res.status(200).json({ status: true, data: privacy });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.getPhotos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 1;
        const skip = (page - 1) * limit;

        const photos = await photoService.getPaginatedPhotos(skip, limit);
        const total = await photoService.countActivePhotos();
        const updatedPhotos = photos.map(photo => {
            return {
                ...photo.toObject(), // convert Mongoose doc to plain object
                image: photo.image ? `${req.protocol}://${req.get('host')}/uploads/photos/${photo.image.replace(/\\/g, '/')}` : null,
            };
        });
        res.status(200).json({
            status: true, data: updatedPhotos, pagination: {
                total, page, pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        res.status(500).json({status: false, message: err.message});
    }
};

exports.getVideos = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;

        const [videos, total, liveDarshan, youtube] = await Promise.all([videoService.getPaginatedVideos(skip, limit), videoService.countActiveVideos(), videoService.getLiveDarshan(), videoService.getYtLink()]);
        return res.status(200).json({
            status: true, message: "Videos fetched successfully", data: {
                videos, total, page, limit, live_darshan: liveDarshan?.value || null, youtube: youtube?.value || null
            }
        });

    } catch (error) {
        console.error("Error fetching videos:", error);
        return res.status(500).json({
            status: false, message: "Something went wrong",
        });
    }
};
