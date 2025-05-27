const pageService = require('../services/page.service');

exports.createPage = async (req, res) => {
    try {
        const page = await pageService.createPage(req.body);
        res.status(201).json({ status: true, message: 'Page created', data: page });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.getAllPages = async (req, res) => {
    try {
        const pages = await pageService.getAllPages();
        res.status(200).json({ status: true, data: pages });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.getPageById = async (req, res) => {
    try {
        const page = await pageService.getPageById(req.params.id);
        if (!page) return res.status(404).json({ status: false, message: 'Page not found' });
        res.status(200).json({ status: true, data: page });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.updatePage = async (req, res) => {
    try {
        const page = await pageService.updatePage(req.params.id, req.body);
        if (!page) return res.status(404).json({ status: false, message: 'Page not found' });
        res.status(200).json({ status: true, message: 'Page updated', data: page });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.deletePage = async (req, res) => {
    try {
        const deleted = await pageService.deletePage(req.params.id);
        if (!deleted) return res.status(404).json({ status: false, message: 'Page not found' });
        res.status(200).json({ status: true, message: 'Page deleted' });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};
