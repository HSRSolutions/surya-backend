const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: 'rzp_test_hZ9xIYoRbY1L33',
    key_secret: 'izxsC9g0Ki0nv0JTDrc3HUxJ',
});

router.post('/create', propertyController.createProperty);
router.get('/', propertyController.getProperties);
router.get('/:id', propertyController.getPropertyById);
router.put('/:id', propertyController.updateProperty);
router.delete('/:id', propertyController.deleteProperty);

router.post('/razorpay/create-order', async (req, res) => {
    const { amount } = req.body;
    try {
        // Create an order using Razorpay's API
        const response = await razorpay.orders.create({
            amount: amount * 100, // amount in smallest currency unit (e.g., paise for INR)
            currency: 'INR',
            receipt: 'receipt#1',
            payment_capture: 1 // auto capture
        });

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

module.exports = router;
