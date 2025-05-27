const kathaService = require('../services/katha.service');
const Katha = require('../models/Katha');
const moment = require('moment');

exports.createKatha = async (req, res) => {
    try {
        const image = req.file ? req.file.filename : undefined;
        const kathaData = {...req.body};
        if (image) kathaData.image = image;

        const katha = await kathaService.createKatha(kathaData);
        res.status(201).json({status: true, message: 'Katha created successfully', data: katha});
    } catch (err) {
        res.status(500).json({status: false, message: err.message});
    }
};

function determineStatus(startDateStr, endDateStr) {
    const today = moment().startOf('day');
    const start = moment(startDateStr, 'YYYY-MM-DD').startOf('day');
    const end = moment(endDateStr, 'YYYY-MM-DD').startOf('day');

    if (today.isBefore(start)) return 'Pending';
    if (today.isAfter(end)) return 'Done';
    return 'In Process';
}

exports.getAllKathas = async (req, res) => {
    try {
        const kathas = await Katha.find();

        const fullUrl = `${req.protocol}://${req.get('host')}`;

        // Update status dynamically
        const updatedKathas = await Promise.all(kathas.map(async k => {
            const actualStatus = determineStatus(k.start_date, k.end_date);
            if (k.status !== actualStatus) {
                k.status = actualStatus;
                await k.save(); // Update DB if status is out of sync
            }

            const doc = k._doc;
            return {
                ...doc,
                start_date: doc.start_date ? doc.start_date.replace(/[:\-]/g, '/') : null,
                end_date: doc.end_date ? doc.end_date.replace(/[:\-]/g, '/') : null,
                image: doc.image ? `${fullUrl}/uploads/kathas/${doc.image}` : null,
            };
        }));

        res.status(200).json({ status: true, data: updatedKathas });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.getKathaById = async (req, res) => {
    try {
        const katha = await kathaService.getKathaById(req.params.id);
        if (!katha) return res.status(404).json({status: false, message: 'Katha not found'});

        const fullUrl = `${req.protocol}://${req.get('host')}`;
        const imageUrl = katha.image ? `${fullUrl}/uploads/kathas/${katha.image}` : null;

        res.status(200).json({
            status: true, data: {
                ...katha._doc, start_date: katha.start_date ? katha.start_date.replace(/[:\-]/g, '/') : null,
                end_date: katha.end_date ? katha.end_date.replace(/[:\-]/g, '/') : null, image: imageUrl
            }
        });
    } catch (err) {
        res.status(500).json({status: false, message: err.message});
    }
};

exports.updateKatha = async (req, res) => {
    try {
        const image = req.file ? req.file.filename : undefined;
        const updateData = {...req.body};
        if (image) updateData.image = image;

        const updated = await kathaService.updateKatha(req.params.id, updateData);
        if (!updated) return res.status(404).json({status: false, message: 'Katha not found'});

        res.status(200).json({status: true, message: 'Katha updated', data: updated});
    } catch (err) {
        res.status(500).json({status: false, message: err.message});
    }
};

exports.deleteKatha = async (req, res) => {
    try {
        const deleted = await kathaService.deleteKatha(req.params.id);
        if (!deleted) return res.status(404).json({status: false, message: 'Katha not found'});

        res.status(200).json({status: true, message: 'Katha deleted successfully'});
    } catch (err) {
        res.status(500).json({status: false, message: err.message});
    }
};
