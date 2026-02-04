const Skin = require('../models/Skin');

exports.createSkin = async (req, res) => {
    try {
        const { name, type, rarity, category, exterior, price } = req.body;
        const ownerId = req.user.id;

        await Skin.create({ name, type, rarity, category, exterior, price, ownerId });

        res.json({ message: "Skins added successfully" });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getAllSkins = async (req, res) => {
    try {
        const { type, rarity, category, exterior } = req.query;

        const where = {};
        if (type) where.type = type;
        if (rarity) where.rarity = rarity;
        if (category) where.category = category;
        if (exterior) where.exterior = exterior;

        const skins = await Skin.findAll({
            where
        });

        res.json(skins);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};



exports.getSkinById = async (req, res) => {
    try {
        const skin = await Skin.findByPk(req.params.id);
        if (!skin) return res.status(404).json({ message: 'Skin not found' });

        res.json(skin);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.updateSkin = async (req, res) => {
    try {
        const skin = await Skin.findByPk(req.params.id);
        if (!skin) return res.status(404).json({ message: 'Skin not found' });

        if (skin.ownerId !== req.user.id) {
            return res.status(403).json({ message: 'You are not allowed to update this skin' });
        }

        await skin.update(req.body);
        res.json({ message: "Skin updated successfully", skin });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


exports.deleteSkin = async (req, res) => {
    try {
        const skin = await Skin.findByPk(req.params.id);
        if (!skin) return res.status(404).json({ message: 'Skin not found' });

        if (skin.ownerId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        await skin.destroy();
        res.json({ message: 'Skin deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};