// routes/enquiryRoutes.js
const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');
// const adminAuth = require('../middleware/adminAuth');
const userController = require('../controllers/userController');

// Public route for creating a new enquiry
router.post('/', enquiryController.createEnquiry);

// Admin protected routes
router.get('/', userController.authenticateAdminToken, enquiryController.getAllEnquiries);
router.put('/:id', userController.authenticateAdminToken, enquiryController.updateEnquiry);
router.delete('/:id', userController.authenticateAdminToken, enquiryController.deleteEnquiry);

module.exports = router;
