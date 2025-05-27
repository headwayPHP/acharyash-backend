const Video = require('../models/Video');
const Setting = require('../models/Setting');

exports.createVideo = async (data) => {
    return await Video.create(data);
};

exports.getAllVideos = async () => {
    return await Video.find().sort({createdAt: -1});
};

exports.getVideoById = async (id) => {
    return await Video.findById(id);
};

exports.updateVideo = async (id, data) => {
    return await Video.findByIdAndUpdate(id, data, {new: true});
};

exports.deleteVideo = async (id) => {
    return await Video.findByIdAndDelete(id);
};

// exports.getPaginatedVideos = async (skip, limit) => {
//     return await Video.find({status: 'active'})
//         .sort({createdAt: -1})
//         .skip(skip)
//         .limit(limit);
// };

exports.getPaginatedVideos = async (skip, limit) => {
    const videos = await Video.find({ status: 'active' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(); // Use .lean() to get plain JS objects

    return videos.map(video => {
        if (video.image) {
            video.image = `${process.env.URL}/uploads/videos/${video.image}`;
        }
        return video;
    });
};

exports.countActiveVideos = async () => {
    return await Video.countDocuments({status: 'active'});
};

exports.getLiveDarshan = async () => {
    return await Setting.findOne({name: 'live_darshan'});
};
exports.getYtLink = async () => {
    return await Setting.findOne({name:'youtube'});
}