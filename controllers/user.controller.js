const userService = require('../services/user.service');

// GET /api/users
const getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/users
const createUser = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// GET /api/users/profile
const getProfile = async (req, res) => {
    try {
        const user = await userService.getUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }

        const imageUrl = user.image
            ? `${process.env.URL}/${user.image.replace(/\\/g, '/')}`
            : null;

        res.status(200).json({
            status: true,
            message: 'Profile fetched successfully',
            data: {
                ...user.toObject(),
                image: imageUrl,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Server error' });
    }
};

// PUT /api/users/profile
const updateProfile = async (req, res) => {
    const {
        first_name,
        last_name,
        organization,
        mobile,
        address,
        state,
        zipcode,
        country,
        email
    } = req.body;

    const image = req.file ? req.file.path : null;

    try {
        const updateData = {
            first_name,
            last_name,
            organization,
            mobile,
            address,
            state,
            zipcode,
            country,
            email
        };

        if (image) {
            updateData.image = image;
        }

        const updatedUser = await userService.updateUserById(req.user.id, updateData);

        if (!updatedUser) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }

        res.status(200).json({
            status: true,
            message: 'Profile updated successfully',
            data: updatedUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Server error' });
    }
};

module.exports = {
    getUsers,
    createUser,
    getProfile,
    updateProfile,
};
