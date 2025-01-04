const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post('/create-order', async (req, res) => {
    const options = {
        amount: req.body.amount, // amount in the smallest currency unit
        currency: "INR",
        receipt: "receipt#1",
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;