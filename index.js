require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Razorpay = require('razorpay');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const razorpay = new Razorpay({
    key_id: 'rzp_live_VpdlfbVgfwjlPy',
    key_secret: 'xIJ2ECnq7G89ieQMQxVb8RWu',
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

// const propertiesRouter = require('./routes/properties');
const userRouter = require('./routes/user');
const propertyRouter = require('./routes/property');
// app.use('/properties', propertiesRouter);
app.use('/api/v1/user/', userRouter);
app.use('/api/v1/property', propertyRouter);
app.use('/', function (req, res) {
    res.send('Welcome')
})

app.post('/api/v1/razorpay/create-order', async (req, res) => {
    const { amount, currency, receipt, payment_capture, notes } = req.body;

    try {
        // Create order using Razorpay API
        const order = await razorpay.orders.create({
            amount,
            currency,
            receipt,
            payment_capture, // 1 for automatic capture, 0 for manual capture
            notes,
        });

        // Send the order ID back to the client
        res.json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ error: 'Failed to create Razorpay order' });
    }
});

app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`));
