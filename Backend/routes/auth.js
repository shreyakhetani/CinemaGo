const express = require('express');
const User = require('../models/User'); // Adjust the path if necessary
const bcrypt = require('bcrypt'); // If you want to hash passwords
const router = express.Router();

// GET all users
router.get('/', async (req, res) => {
    try {
        // Find all users and exclude the password from the returned data
        const users = await User.find({}, '-password'); // Exclude password field
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found.' });
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

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

        // If everything is good, send success response with user details
        res.status(200).json({ 
            message: 'Login successful', 
            userId: user._id, 
            firstName: user.firstName,  // Add firstName to response
            lastName: user.lastName      // Add lastName to response
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST Signup
router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !phoneNumber || !password) {
        return res.status(400).json({ message: 'Please fill in all fields.' });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Hash the password 
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            firstName,
            lastName,
            email,
            phoneNumber,
            password: hashedPassword, // Store hashed password
        });

        await user.save();
        res.status(201).json({ message: 'Signup successful!' });
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Server error', error: error.message }); // Return the error message
    }
});

// get the user by its email
router.get('/user', async (req, res) => {
    try {
        const { email } = req.query;  // Get email from query parameters

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Find the user by their email
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user data
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// PUT update user information by email
router.put('/update', async (req, res) => {
    const { email, firstName, lastName, phoneNumber, password } = req.body;

    // Basic validation
    if (!email || (!firstName && !lastName && !phoneNumber && !password)) {
        return res.status(400).json({ message: 'Please provide email and at least one field to update.' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update only the fields that are provided
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        // Save updated user
        await user.save();
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


// DELETE user by email
router.delete('/delete', async (req, res) => {
    const { email } = req.body;

    // Basic validation
    if (!email) {
        return res.status(400).json({ message: 'Please provide an email to delete the user.' });
    }

    try {
        // Find and delete user by email
        const user = await User.findOneAndDelete({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
