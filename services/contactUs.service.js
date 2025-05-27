// services/contactUs.service.js

const ContactUs = require('../models/ContactUs');

// Create a new contact us message
const createContactUs = async (data) => {
    try {
        const contactMessage = await ContactUs.create(data);
        return contactMessage;
    } catch (err) {
        throw new Error(`Error creating contact message: ${err.message}`);
    }
};

// Get all contact us messages
const getAllContactUs = async () => {
    try {
        return await ContactUs.find().sort({ createdAt: -1 }); // Sort by most recent
    } catch (err) {
        throw new Error(`Error fetching contact messages: ${err.message}`);
    }
};

// Get a contact us message by ID
const getContactUsById = async (id) => {
    try {
        return await ContactUs.findById(id);
    } catch (err) {
        throw new Error(`Error fetching contact message by ID: ${err.message}`);
    }
};

// Update a contact us message status (resolved or pending)
const updateContactUsStatus = async (id, status) => {
    try {
        return await ContactUs.findByIdAndUpdate(id, { status, updatedAt: Date.now() }, { new: true });
    } catch (err) {
        throw new Error(`Error updating contact message status: ${err.message}`);
    }
};
const toggleContactUsStatus = async (id) => {
    try {
        const contact = await ContactUs.findById(id);
        if (!contact) return null;

        const newStatus = contact.status === 'pending' ? 'resolved' : 'pending';

        contact.status = newStatus;
        contact.updatedAt = Date.now();

        await contact.save();
        return contact;
    } catch (err) {
        throw new Error(`Error toggling contact message status: ${err.message}`);
    }
};


// Delete a contact us message
const deleteContactUs = async (id) => {
    try {
        await ContactUs.findByIdAndDelete(id);
        return { message: 'Contact message deleted successfully' };
    } catch (err) {
        throw new Error(`Error deleting contact message: ${err.message}`);
    }
};

const updateContactMessage = async (id, updateFields) => {
    updateFields.updatedAt = new Date();

    const updated = await ContactUs.findByIdAndUpdate(id, updateFields, { new: true });
    return updated;
};

const countTodayRequests = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return ContactUs.countDocuments({ createdAt: { $gte: today } });
};
const countAllRequests = async () => ContactUs.countDocuments();
const getLatestRequests = async (limit = 10) =>
    ContactUs.find().sort({ createdAt: -1 }).limit(limit);

module.exports = {
    createContactUs,
    getAllContactUs,
    getContactUsById,
    updateContactUsStatus,
    deleteContactUs,
    toggleContactUsStatus,
    updateContactMessage,
    countTodayRequests,
    countAllRequests,
    getLatestRequests,
};
