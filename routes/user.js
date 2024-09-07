const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register a new user
router.post('/register', userController.registerUser);

// Login a user
router.post('/login', userController.loginUser);

// Get user details (authenticated route)
router.get('/me', userController.authenticateToken, userController.getUser);

// Get user details by ID
router.get('/details/:id', userController.getUserDetails);

// Update user details (protected route)
router.put('/:id', userController.authenticateToken, userController.updateUser);

router.put('/details/:id', userController.updateUserDetails);


// Delete a user (protected route)
router.delete('/:id',  userController.deleteUser);

// Fetch all users (protected route)
router.get('/all-users', userController.getAllUsers);

// Admin Login
router.post('/admin/login', userController.adminLogin);

// Change Password
router.post('/change-password', userController.authenticateToken, userController.changePassword);

// Update Subscription
router.put('/update-subscription/:userId', userController.authenticateToken, userController.updateSubscription);
router.get('/listing-limit/:userId', userController.getRemainingListingLimit);
module.exports = router;
