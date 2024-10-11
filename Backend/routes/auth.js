const express = require('express');
const User = require('../models/User'); // Adjust the path if necessary
const bcrypt = require('bcrypt'); // If you want to hash passwords
const router = express.Router();

// POST login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // If everything is good, send success response
        res.status(200).json({ message: 'Login successful', userId: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST Signup
router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, username, phoneNumber, password } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !username || !phoneNumber || !password) {
        return res.status(400).json({ message: 'Please fill in all fields.' });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Hash the password (optional)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            firstName,
            lastName,
            email,
            username,
            phoneNumber,
            password: hashedPassword, // Store hashed password
        });

        await user.save();
        res.status(201).json({ message: 'Signup successful!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
