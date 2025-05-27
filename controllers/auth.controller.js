const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const jwt = require('jsonwebtoken');
const Admin = require('../models/User');
const secret = require('../config/multerConfig'); // or wherever your token secret is

// POST /api/auth/register
const register = async (req, res) => {
    const {name, email, password} = req.body;
    const profileImage = req.file ? req.file.path : null; // If file is uploaded, use its path

    try {
        const userExists = await User.findOne({email});
        if (userExists) return res.status(400).json({message: 'Email already exists'});

        // Save user to DB with or without profile image
        const user = await User.create({name, email, password, profileImage});
        res.status(201).json({
            _id: user._id, name: user.name, email: user.email, token: generateToken(user._id)
        });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

// POST /api/auth/login
const login = async (req, res) => {
    const {email, password} = req.body;
    let aemail = email;
    try {
        const user = await User.findOne({aemail});
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id, name: user.name, email: user.aemail, token: generateToken(user._id)
            });
        } else {
            res.status(401).json({message: 'Invalid email or password'});
        }
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

const logoutAdmin = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find admin
        // const admin = await Admin.findById(decoded._id);
        // if (!admin) {
        //     return res.status(404).json({ message: 'Admin not found' });
        // }

        // OPTIONAL: remove token from admin.tokens array if you're tracking them
        // admin.tokens = admin.tokens.filter(t => t !== token);
        // await admin.save();

        // Just a dummy placeholder to represent "invalidateToken"
        // You can skip if you’re not tracking tokens in DB
        // console.log(`Token invalidated for admin ${admin.email}`);
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error('Logout error:', err);
        res.status(500).json({ message: err.message || 'Logout failed' });
    }
};

module.exports = {register, login, logoutAdmin};
