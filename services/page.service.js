const Page = require('../models/Page');

exports.createPage = async (data) => {
    return await Page.create(data);
};

exports.getAllPages = async () => {
    return await Page.find().sort({ createdAt: -1 });
};

exports.getPageById = async (id) => {
    return await Page.findById(id);
};

exports.updatePage = async (id, data) => {
    return await Page.findByIdAndUpdate(id, data, { new: true });
};

exports.deletePage = async (id) => {
    return await Page.findByIdAndDelete(id);
};
