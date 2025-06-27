// controllers/contactUs.controller.js

const contactUsService = require('../services/contactUs.service');

// POST /api/contact-us
const createContactUs = async (req, res) => {
    const { name, phone, email, message } = req.body;

    try {
        const contactMessage = await contactUsService.createContactUs({ name, phone, email, message });
        res.status(201).json({
            status: true,
            message: 'Contact message created successfully',
            data: contactMessage,
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
        });
    }
};

const updateContactMessage = async (req, res) => {
    try {
        const id = req.params.id;
        const { ...updateFields } = req.body;

        if (!id) {
            return res.status(400).json({ status: false, message: 'ID is required to update the message' });
        }

        const updatedContact = await contactUsService.updateContactMessage(id, updateFields);

        if (!updatedContact) {
            return res.status(404).json({ status: false, message: 'Contact message not found' });
        }

        res.status(200).json({
            status: true,
            message: 'Contact message updated successfully',
            data: updatedContact
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

// GET /api/contact-us
const getAllContactUs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const { contactMessages, total } = await contactUsService.getAllContactUs(page, limit);

        res.status(200).json({
            status: true,
            message: 'Contact messages fetched successfully',
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalMessages: total,
            data: contactMessages,
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
        });
    }
};


// GET /api/contact-us/:id
const getContactUsById = async (req, res) => {
    const { id } = req.params;

    try {
        const contactMessage = await contactUsService.getContactUsById(id);
        if (!contactMessage) {
            return res.status(404).json({
                status: false,
                message: 'Contact message not found',
            });
        }
        res.status(200).json({
            status: true,
            message: 'Contact message fetched successfully',
            data: contactMessage,
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
        });
    }
};

// PUT /api/contact-us/:id/status
const updateContactUsStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedContactMessage = await contactUsService.toggleContactUsStatus(id);

        if (!updatedContactMessage) {
            return res.status(404).json({
                status: false,
                message: 'Contact message not found',
            });
        }

        res.status(200).json({
            status: true,
            message: `Contact message status toggled to '${updatedContactMessage.status}'`,
            data: updatedContactMessage,
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
        });
    }
};

// DELETE /api/contact-us/:id
const deleteContactUs = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await contactUsService.deleteContactUs(id);
        res.status(200).json({
            status: true,
            message: result.message,
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
        });
    }
};

module.exports = {
    createContactUs,
    getAllContactUs,
    getContactUsById,
    updateContactUsStatus,
    deleteContactUs,
    updateContactMessage,
};
