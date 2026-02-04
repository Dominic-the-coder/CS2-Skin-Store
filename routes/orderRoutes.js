const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus, paymentSuccess } = require('../controllers/orderController');

router.post('/', authenticate, createOrder);
router.get('/myOrder', authenticate, getMyOrders);
router.get('/', authenticate, getAllOrders);
router.put('/:id', authenticate, updateOrderStatus);
router.get('/success/:order_id', paymentSuccess);

module.exports = router;
