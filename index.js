require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Razorpay = require('razorpay');
var morgan = require('morgan')
var path = require('path')
var rfs = require('rotating-file-stream')

const app = express();
app.use(bodyParser.json());
app.use(cors());

// create a rotating write stream
var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
})

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

// const propertiesRouter = require('./routes/properties');
const userRouter = require('./routes/user');
const propertyRouter = require('./routes/property');
const enquiryRouter = require('./routes/enquiry');
const uploadRouter = require('./routes/upload');
const propertyEnquiryRouter = require('./routes/propertyEnquiry');
const favouriteRouter = require('./routes/favourite');
// app.use('/properties', propertiesRouter);
app.use('/api/v1/user/', userRouter);
app.use('/api/v1/property/', propertyRouter);
app.use('/api/v1/enquiry/', enquiryRouter);
app.use('/api/v1/upload/', uploadRouter);
app.use('/api/v1/property-enquiry/', propertyEnquiryRouter);
app.use('/api/v1/favourite/', favouriteRouter);

app.use('/', function (req, res) {
    res.send('Welcome')
});

app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`));
