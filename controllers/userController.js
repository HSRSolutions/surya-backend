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
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
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
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Allow update if user is admin or updating own data
        if (!req.user.isAdmin && req.user.id !== user.id) {
            return res.status(403).json({ message: 'Unauthorized: Admin privileges required' });
        }

        if (req.body.name != null) {
            user.name = req.body.name;
        }
        if (req.body.email != null) {
            user.email = req.body.email;
        }

        const updatedUser = await user.save();
        res.json(updatedUser);
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


// Middleware to authenticate user
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;

        // Allow access if user is admin or accessing own data
        if (!user.isAdmin && user.id !== req.params.id) {
            return res.status(403).json({ message: 'Unauthorized: Admin privileges required' });
        }

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
    adminLogin
};
