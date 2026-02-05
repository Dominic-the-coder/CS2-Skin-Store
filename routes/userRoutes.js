const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUsers } = require('../controllers/userController');
const authenticate = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/allUser', authenticate, getAllUsers);

module.exports = router;
