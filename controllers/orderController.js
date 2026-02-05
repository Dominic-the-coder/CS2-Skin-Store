const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Skin = require('../models/Skin');

exports.createOrder = async (req, res) => {
    try {
        const { skinIds } = req.body;

        if (!skinIds || !skinIds.length) {
            return res.status(400).json({ message: "No skins selected" });
        }

        const skins = await Skin.findAll({ where: { id: skinIds } });

        if (skins.length !== skinIds.length) {
            return res.status(400).json({ message: "Some skins not found" });
        }

        const totalPrice = skins.reduce((sum, skin) => sum + skin.price, 0);

        const order = await Order.create({
            userId: req.user.id,
            totalPrice,
            status: 'pending'
        });

        const lineItems = [];

        for (const skin of skins) {
            const price = await stripe.prices.create({
                currency: 'myr',
                unit_amount: skin.price * 100,
                product_data: {
                    name: skin.name
                }
            });

            lineItems.push({
                price: price.id,
                quantity: 1
            });
        }

        const session = await stripe.checkout.sessions.create({
            success_url: `http://localhost:3000/orders/success/${order.id}`,
            cancel_url: `http://localhost:3000/orders/cancel/${order.id}`,
            line_items: lineItems,
            mode: 'payment',
            metadata: {
                orderId: order.id,
                userId: req.user.id
            }
        });

        res.json({
            message: "Order created, payment required",
            orderId: order.id,
            paymentUrl: session.url
        });

    } catch (err) {
        res.status(500).json({
            message: "Stripe error",
            error: err.message
        });
    }
};

exports.paymentSuccess = async (req, res) => {
    const orderId = req.params.order_id;

    // await Order.update(
    //     { status: 'paid' },
    //     { where: { id: orderId } }
    // );

    const order = await Order.findOne({
        where: {
            id: orderId
        }
    })

    await order.update({ status: "paid" })

    res.json(order);
};

exports.paymentCancel = async (req, res) => {
    const orderId = req.params.order_id;

    const order = await Order.findOne({
        where: {
            id: orderId
        }
    })

    await order.update({status: "cancelled"})

    res.json(order)
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.user.id }
        });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const orders = await Order.findAll();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        await order.update({ status: req.body.status });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};