const Photo = require('../models/Photo');

const createPhoto = async (data) => await Photo.create(data);
const getAllPhotos = async () => await Photo.find().sort({ _id: -1 });
//TODO: content request and booking request sorting latest



const getPaginatedPhotos = async (skip, limit) => {
    return await Photo.find({status: 'active'})
        .sort({createdAt: -1}) // Latest first
        .skip(skip)
        .limit(limit);
};

const addMultiplePhotos = async (files, body) => {
    if (!files || files.length === 0) {
        throw new Error('No photos uploaded');
    }
    const isFeaturedArray = Array.isArray(body.is_featured)
        ? body.is_featured
        : [body.is_featured]; // handle single or multiple

    const photoDocs = files.map((file, index) => ({
        image: file.filename,
        is_featured: isFeaturedArray[index] === '1',
        status: 'active'
    }));

    return await Photo.insertMany(photoDocs);
};

const countActivePhotos = async () => {
    return await Photo.countDocuments({status: 'active'});
};

const getPhotoById = async (id) => await Photo.findById(id);
const updatePhoto = async (id, data) => await Photo.findByIdAndUpdate(id, data, {new: true});
const deletePhoto = async (id) => await Photo.findByIdAndDelete(id);

module.exports = {
    createPhoto,
    getAllPhotos,
    getPhotoById,
    updatePhoto,
    deletePhoto,
    getPaginatedPhotos,
    countActivePhotos,
    addMultiplePhotos
};
