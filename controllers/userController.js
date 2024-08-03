const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Register a new user
const registerUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword,
            isAdmin: req.body.isAdmin || false
        });

        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Login a user
const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user == null) {
            return res.status(400).json({ message: 'Cannot find user' });
        }

        if (await bcrypt.compare(req.body.password, user.password)) {
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.status(200).json({ token, userId: user._id }); // Include user ID in the response
        } else {
            res.status(400).json({ message: 'Incorrect password' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Get user details
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Update Subscription
const updateSubscription = async(req, res) =>{
    const { userId } = req.params;
  const { plan, status, startDate, endDate, renewalDate, transactionId,
    transactionDate, } = req.body;

  try {
    // Find user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update subscription details
    user.subscription.plan = plan || user.subscription.plan;
    user.subscription.status = status || user.subscription.status;
    user.subscription.startDate = startDate ? new Date(startDate) : user.subscription.startDate;
    user.subscription.endDate = endDate ? new Date(endDate) : user.subscription.endDate;
    user.subscription.renewalDate = renewalDate ? new Date(renewalDate) : user.subscription.renewalDate;
    user.subscription.transactionId = transactionId || user.subscription.transactionId;
    user.subscription.transactionDate = transactionDate ? new Date(transactionDate) : user.subscription.transactionDate;

    // Save the updated user
    const updatedUser = await user.save();

    res.status(200).json({
      message: 'Subscription updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Update User
const updateUser = async (req, res) => {
    // console.log('I have been called')
    try {
        const user = await User.findById(req.params.id);
        // const profilePicture = req.file ? req.file.location : null;

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // console.log(req.body)
        // Allow update if user is admin or updating own data
        if (!req.user.isAdmin && req.user.id !== user.id) {
            return res.status(403).json({ message: 'Unauthorized: Admin privileges required' });
        }

        if (req.body.name != null) {
            user.name = req.body.name;
        }
        if (req.body.phone != null) {
            user.phone = req.body.phone;
        }

        // if (profilePicture) {
        //     user.profilePicture = profilePicture;
        // }

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
        // console.log(updatedUser)
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Allow delete if user is admin or deleting own data
        if (!req.user.isAdmin && req.user.id !== user.id) {
            return res.status(403).json({ message: 'Unauthorized: Admin privileges required' });
        }

        await user.remove();
        res.json({ message: 'Deleted User' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Fetch all users
const getAllUsers = async (req, res) => {
    try {
        // if (!req.user.isAdmin) {
        //     return res.status(403).json({ message: 'Unauthorized: Admin privileges required' });
        // }

        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Admin Login
const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user is an admin
        const adminUser = await User.findOne({ email, isAdmin: true });
        if (!adminUser) {
            return res.status(401).json({ message: 'Unauthorized: Admin credentials required' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, adminUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Unauthorized: Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: adminUser._id, isAdmin: adminUser.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Change Password

const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {

        const user = await User.findById(req.user.id);

        if (!currentPassword) {
            return res.status(400).json({ message: 'Current password is required' });
        }

        // Check if the new password is provided
        if (!newPassword) {
            return res.status(400).json({ message: 'New password is required' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if the old password is correct
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        user.password = hashedNewPassword;
        await user.save();

        return res.status(200).json({ message: 'Password changed successfully' });

    } catch (err) {
        res.status(500).json({ message: err.message });
        // console.log(err)
    }
}


// Middleware to authenticate user
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;

        // Allow access if user is admin or accessing own data
        // if (!user.isAdmin && user.id !== req.params.id) {
        //     return res.status(403).json({ message: 'Unauthorized: Admin privileges required' });
        // }

        next();
    });
};

// Middleware to authenticate admin
const authenticateAdminToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;

        // Allow access if user is admin
        if (!user.isAdmin) {
            return res.status(403).json({ message: 'Unauthorized: Admin privileges required' });
        }

        next();
    });
};

module.exports = {
    registerUser,
    loginUser,
    getUser,
    updateUser,
    deleteUser,
    authenticateToken,
    getAllUsers,
    authenticateAdminToken,
    adminLogin,
    changePassword,
    updateSubscription
};
