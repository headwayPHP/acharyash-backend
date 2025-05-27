const videoService = require('../services/video.service');

exports.createVideo = async (req, res) => {
    try {
        const image = req.file ? req.file.filename : undefined;
        const videoData = {...req.body};
        if (image) videoData.image = image;

        const video = await videoService.createVideo(videoData);
        res.status(201).json({status: true, message: 'Video created successfully', data: video});
    } catch (err) {
        res.status(500).json({status: false, message: err.message});
    }
};

exports.getAllVideos = async (req, res) => {
    try {
        const videos = await videoService.getAllVideos();
        const fullUrl = `${req.protocol}://${req.get('host')}`;
        const formatted = videos.map(v => ({
            ...v._doc, image: v.image ? `${fullUrl}/uploads/videos/${v.image}` : null
        }));
        res.status(200).json({status: true, data: formatted});
    } catch (err) {
        res.status(500).json({status: false, message: err.message});
    }
};

exports.getVideoById = async (req, res) => {
    try {
        const video = await videoService.getVideoById(req.params.id);
        if (!video) return res.status(404).json({status: false, message: 'Video not found'});

        const fullUrl = `${req.protocol}://${req.get('host')}`;
        const formatted = {
            ...video._doc, image: video.image ? `${fullUrl}/uploads/videos/${video.image}` : null
        };
        res.status(200).json({status: true, data: formatted});
    } catch (err) {
        res.status(500).json({status: false, message: err.message});
    }
};

exports.updateVideo = async (req, res) => {
    try {
        const image = req.file ? req.file.filename : undefined;
        const updateData = {...req.body};
        if (image) updateData.image = image;

        const updated = await videoService.updateVideo(req.params.id, updateData);
        if (!updated) return res.status(404).json({status: false, message: 'Video not found'});

        res.status(200).json({status: true, message: 'Video updated', data: updated});
    } catch (err) {
        res.status(500).json({status: false, message: err.message});
    }
};

exports.deleteVideo = async (req, res) => {
    try {
        const deleted = await videoService.deleteVideo(req.params.id);
        if (!deleted) return res.status(404).json({status: false, message: 'Video not found'});

        res.status(200).json({status: true, message: 'Video deleted successfully'});
    } catch (err) {
        res.status(500).json({status: false, message: err.message});
    }
};
