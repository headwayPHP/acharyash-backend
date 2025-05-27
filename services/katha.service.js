const Katha = require('../models/Katha');

exports.createKatha = async (data) => {
    return await Katha.create(data);
};

exports.getAllKathas = async () => {
    return await Katha.find().sort({ createdAt: -1 });
};

exports.getKathaById = async (id) => {
    return await Katha.findById(id);
};

exports.updateKatha = async (id, data) => {
    return await Katha.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteKatha = async (id) => {
    return await Katha.findByIdAndDelete(id);
};


exports.countAllKathas = async () => Katha.countDocuments();
exports.getLatestKathas = async (limit = 10) => {
    const kathas = await Katha.find().sort({ createdAt: -1 }).limit(limit);

    return kathas.map(katha => {
        return {
            ...katha._doc,
            image: `${process.env.URL}/uploads/kathas/${katha.image}` // Adjust the path if needed
        };
    });
};