const express = require('express');
const router = express.Router();
const { createSkin, getAllSkins, getSkinById, updateSkin, deleteSkin } = require('../controllers/skinController');
const authenticate = require('../middleware/auth');

router.post('/', authenticate, createSkin);
router.get('/', getAllSkins);
router.get('/:id', getSkinById);
router.put('/:id', authenticate, updateSkin);
router.delete('/:id', authenticate, deleteSkin);

module.exports = router;
