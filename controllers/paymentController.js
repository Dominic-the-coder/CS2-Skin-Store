const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Skin = require('../models/Skin');

exports.createSkinPayment = async (req, res) => {
    try {
        const skin = await Skin.findByPk(req.body.skinId);
        if (!skin) return res.status(404).json({ message: 'Skin not found' });

        const price = await stripe.prices.create({
            currency: 'myr',
            unit_amount: skin.price * 100,
            product_data: {
                name: skin.name,
            },
        });

        const paymentLink = await stripe.paymentLinks.create({
            line_items: [
                {
                price: price.id,
                quantity: 1
                }
            ]
            });

        res.json({ url: paymentLink.url });
    } catch (err) {
        res.status(500).json({ message: 'Stripe error', error: err.message });
    }
};  