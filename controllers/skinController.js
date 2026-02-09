const Skin = require('../models/Skin');

// Create a new skin
exports.createSkin = async (req, res) => {
    try {
        // Extract skin data from request body
        const { name, type, rarity, category, exterior, price } = req.body;

        // Owner is the authenticated user
        const ownerId = req.user.id;

        // Create skin record
        await Skin.create({
            name,
            type,
            rarity,
            category,
            exterior,
            price,
            ownerId
        });

        res.json({ message: "Skins added successfully" });
    } catch (err) {
        res.status(500).json({
            message: 'Server error',
            error: err.message
        });
    }
};

// Get all skins with optional filters
exports.getAllSkins = async (req, res) => {
    try {
        // Extract query parameters
        const { type, rarity, category, exterior } = req.query;

        // Build dynamic WHERE clause
        const where = {};
        if (type) where.type = type;
        if (rarity) where.rarity = rarity;
        if (category) where.category = category;
        if (exterior) where.exterior = exterior;

        // Fetch skins
        const skins = await Skin.findAll({ where });

        res.json(skins);
    } catch (err) {
        res.status(500).json({
            message: 'Server error',
            error: err.message
        });
    }
};

// Get a single skin by ID
exports.getSkinById = async (req, res) => {
    try {
        const skin = await Skin.findByPk(req.params.id);

        if (!skin) {
            return res.status(404).json({ message: 'Skin not found' });
        }

        res.json(skin);
    } catch (err) {
        res.status(500).json({
            message: 'Server error',
            error: err.message
        });
    }
};

// Update a skin (owner only)
exports.updateSkin = async (req, res) => {
    try {
        const skin = await Skin.findByPk(req.params.id);

        if (!skin) {
            return res.status(404).json({ message: 'Skin not found' });
        }

        // Ownership check
        if (skin.ownerId !== req.user.id) {
            return res.status(403).json({
                message: 'You are not allowed to update this skin'
            });
        }

        // Update skin fields
        await skin.update(req.body);

        res.json({
            message: "Skin updated successfully",
            skin
        });
    } catch (err) {
        res.status(500).json({
            message: 'Server error',
            error: err.message
        });
    }
};

// Delete a skin (owner or admin)
exports.deleteSkin = async (req, res) => {
    try {
        const skin = await Skin.findByPk(req.params.id);

        if (!skin) {
            return res.status(404).json({ message: 'Skin not found' });
        }

        // Authorization check
        if (skin.ownerId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // Delete record
        await skin.destroy();

        res.json({ message: 'Skin deleted successfully' });
    } catch (err) {
        res.status(500).json({
            message: 'Server error',
            error: err.message
        });
    }
};
