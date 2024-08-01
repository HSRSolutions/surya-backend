const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/propertyEnquiryControllers');


router.post('/', enquiryController.createEnquiry);
router.get('/user/:userId', enquiryController.getUserEnquiries);


module.exports = router;
