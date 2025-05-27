const sevaService = require('../services/seva.service');

exports.createSeva = async (req, res) => {
    try {
        const image = req.file ? req.file.filename : undefined;
        const sevaData = { ...req.body };
        if (image) sevaData.image = image;

        const seva = await sevaService.createSeva(sevaData);
        res.status(201).json({ status: true, message: 'Seva created successfully', data: seva });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.getAllSevas = async (req, res) => {
    try {
        const sevas = await sevaService.getAllSevas();
        const fullUrl = `${req.protocol}://${req.get('host')}`;
        const formatted = sevas.map(s => ({
            ...s._doc,
            image: s.image ? `${fullUrl}/uploads/sevas/${s.image}` : null
        }));
        res.status(200).json({ status: true, data: formatted });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.getSevaById = async (req, res) => {
    try {
        const seva = await sevaService.getSevaById(req.params.id);
        if (!seva) return res.status(404).json({ status: false, message: 'Seva not found' });

        const fullUrl = `${req.protocol}://${req.get('host')}`;
        const formatted = {
            ...seva._doc,
            image: seva.image ? `${fullUrl}/uploads/sevas/${seva.image}` : null
        };
        res.status(200).json({ status: true, data: formatted });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.updateSeva = async (req, res) => {
    try {
        const image = req.file ? req.file.filename : undefined;
        const updateData = { ...req.body };
        if (image) updateData.image = image;

        const updated = await sevaService.updateSeva(req.params.id, updateData);
        if (!updated) return res.status(404).json({ status: false, message: 'Seva not found' });

        res.status(200).json({ status: true, message: 'Seva updated', data: updated });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.deleteSeva = async (req, res) => {
    try {
        const deleted = await sevaService.deleteSeva(req.params.id);
        if (!deleted) return res.status(404).json({ status: false, message: 'Seva not found' });

        res.status(200).json({ status: true, message: 'Seva deleted successfully' });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};
