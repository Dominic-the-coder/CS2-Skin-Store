const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus, paymentSuccess, paymentCancel } = require('../controllers/orderController');

router.post('/', authenticate, createOrder);
router.get('/myOrder', authenticate, getMyOrders);
router.get('/allOrder', authenticate, getAllOrders);
router.put('/:id', authenticate, updateOrderStatus);
router.get('/success/:order_id', paymentSuccess);
router.get('/cancel/:order_id', paymentCancel);

module.exports = router;
