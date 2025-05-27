const Seva = require('../models/Seva');

exports.createSeva = async (data) => {
    return await Seva.create(data);
};

exports.getAllSevas = async () => {
    return await Seva.find().sort({ createdAt: -1 });
};

exports.getSevaById = async (id) => {
    return await Seva.findById(id);
};

exports.updateSeva = async (id, data) => {
    return await Seva.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteSeva = async (id) => {
    return await Seva.findByIdAndDelete(id);
};
