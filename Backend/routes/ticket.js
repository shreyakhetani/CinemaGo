const express = require('express');
const Ticket = require('../models/Ticket');
const router = express.Router();

router.post('/new', async (req, res) => {
    // console.log('Ticket request received:', req.body);  // Log the incoming request
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
        // console.log('Ticket successfully saved:', savedTicket);  // Log success
        res.status(201).json(savedTicket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Unable to create ticket.' });
    }
});
// GET /tickets - Get all tickets by email
router.get('/tickets', async (req, res) => {
    try {
        const { email } = req.query; // Retrieve the email from the query string

        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        // Fetch all tickets associated with the email
        const tickets = await Ticket.find({ userEmail: email });

        if (tickets.length === 0) {
            return res.status(404).json({ message: 'No tickets found for this email.' });
        }

        // Send back the tickets
        res.status(200).json(tickets);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ message: 'An error occurred while fetching tickets.' });
    }
});

module.exports = router;
