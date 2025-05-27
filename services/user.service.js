const User = require('../models/User');

const getAllUsers = async () => {
    return await User.find().select('-password');
};

const createUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
};

const getUserById = async (userId) => {
    return await User.findById(userId).select('-password');
};

const updateUserById = async (userId, updateData) => {
    return await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
    }).select('-password');
};

module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    updateUserById,
};
