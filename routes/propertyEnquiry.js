const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/propertyEnquiryControllers');
const userController = require('../controllers/userController');


router.post('/', enquiryController.createEnquiry);
router.get('/user',userController.authenticateToken, enquiryController.getUserEnquiries);
router.get('/all',  enquiryController.getAll);
router.get('/owner', userController.authenticateToken, enquiryController.receievEnquiry);
// Route to delete an enquiry
router.delete('/:id', enquiryController.deleteEnquiry);

module.exports = router;
