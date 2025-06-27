const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    aemail: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    organization: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true },
    country: { type: String, required: true },
    password: { type: String, required: true }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
