const express = require('express');
const Ticket = require('../models/Ticket');
const router = express.Router();

router.post('/new', async (req, res) => {
    console.log('Ticket request received:', req.body);  // Log the incoming request
    try {
        const { movieName, hallName, showtime, duration, language, seat, userEmail } = req.body;
        
        // Create a new ticket
        const newTicket = new Ticket({
            movieName,
            hallName,
            showtime,
            duration,
            language,
            seat,
            userEmail
        });

        // Save ticket to the database
        const savedTicket = await newTicket.save();
        console.log('Ticket successfully saved:', savedTicket);  // Log success
        res.status(201).json(savedTicket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Unable to create ticket.' });
    }
});

module.exports = router;
